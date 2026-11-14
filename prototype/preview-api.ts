import type { Api } from "../src/lib/api";
import { createMockApi } from "../src/lib/mock";
import { cleanWord, garden, languageCodes, lessons, type Word } from "./data";
import { tokenize } from "../src/lib/tokenize";
import { sampleCover } from "./sample-covers";
import cues from "./cues.json";

export const isTauri = false;
export const errorText = (error: unknown) => error instanceof Error ? error.message : String(error);
export const isNoModel = (error: unknown) => /^NO_(MODEL|VOICE):\s*/.test(errorText(error));

const mock = createMockApi();
const chunks = new Map<string, NonNullable<Awaited<ReturnType<Api["chunkBreakdown"]>>>>();
const lookup = new Map<string, Word>(lessons.flatMap(lesson => lesson.pages.flat().map(word => [
  `${languageCodes[lesson.language]}/${cleanWord(word.text)}`, word,
] as const)));

const browserApi: Api = {
  ...mock,
  async dictLookup(lang, word, after) {
    const fixture = lookup.get(`${lang}/${cleanWord(word)}`);
    if (fixture) return { entries: [{ word: cleanWord(word), pos: "", ipa: fixture.pronunciation || "", glosses: [fixture.gloss] }] };
    return mock.dictLookup(lang, word, after);
  },
  async trainingGenerate(lang, task, words) {
    return words.flatMap(({ term, context }, index) => {
      const gloss = lookup.get(`${lang}/${cleanWord(term)}`)?.gloss;
      const value = task === "difficulty" ? "beginner" : task === "example" ? context : gloss;
      return value ? [{ index, value, literal: "", note: "", highlight: term }] : [];
    });
  },
  async chineseAnnotations(words) {
    const annotations = await mock.chineseAnnotations(words) ?? {};
    for (const word of words) {
      const fixture = lookup.get(`zh/${word}`);
      if (fixture?.pronunciation) annotations[word] = { pinyin: fixture.pronunciation, gloss: fixture.gloss };
    }
    return annotations;
  },
  async chunkBreakdown(text, cachedOnly) {
    const previous = chunks.get(text);
    if (previous || cachedOnly) return previous ?? null;
    const catalog = lessons.flatMap(lesson => lesson.pages.map((page, index) => ({
      text: page.map(word => word.text).join(lesson.language === "Chinese" ? "" : " "),
      translation: lesson.translation[index],
    })));
    const result = catalog.flatMap(phrase => {
      const start = text.indexOf(phrase.text);
      return start < 0 ? [] : [{ ...phrase, start, end: start + phrase.text.length }];
    }).sort((a, b) => a.start - b.start);
    if (!result.length) throw new Error("Chunk fixtures are available in the bundled lessons.");
    chunks.set(text, result);
    return result;
  },
  mediaUrl(path) {
    return /^(\/media\/garden-[0-2]\.mp3$|data:|blob:)/.test(path) ? path : "";
  },
};
export const api = () => browserApi;

export async function seedPreview(design: string) {
  const set = (key: string, value: string) => mock.settingsSet(key, value);
  await set("onboarded", "1");
  await set("ui_lang", "en");
  await set("theme", design === "studio" ? "dark" : "light");
  await set("lang", "it");
  await set("langs", "it,he,zh");
  await set("word_panel", "side");
  await set("read_font", "newsreader");
  await set("backup_snooze", String(Date.now() / 1000));
  await set("guide_seen", "1");
  await set("library_view", "large");

  const gardenChapters: number[] = [];
  for (const lesson of lessons) {
    const lang = languageCodes[lesson.language];
    for (const [index, words] of lesson.pages.entries()) {
      const separator = lang === "zh" ? "" : " ";
      const paragraph = words.map(word => word.text).join(separator);
      const text = lesson === garden && index === 0
        ? paragraph + "\n\n" + garden.pages[1].map(word => word.text).join(" ") +
          "\n\nTra gli alberi, una donna legge il giornale. Un bambino segue una farfalla lungo il sentiero. Nessuno ha fretta. Anche i rumori della strada sembrano lontani." +
          "\n\nMi piace questo momento della giornata. La luce passa tra le foglie e disegna piccole ombre sulla panchina. Penso alle cose che voglio fare, poi chiudo il quaderno e resto ancora un po’." +
          "\n\n" + garden.pages[2].map(word => word.text).join(" ")
        : paragraph;
      const audio = lesson === garden;
      let offset = 0;
      const timings = audio ? JSON.stringify(words.map(({ text: word }, position) => {
        const start = offset;
        offset += word.length + separator.length;
        const cue = cues[index][position];
        return [start, word.length, cue, cues[index][position + 1] ?? cue + .8];
      })) : null;
      const id = await mock.lessonCreate({
        lang, text, title: index ? `${lesson.title} · Part ${index + 1}` : lesson.title,
        kind: audio ? "audio" : "text", timings,
        media_path: audio ? `/media/garden-${index}.mp3` : null,
      });
      if (audio) gardenChapters.push(id);
      if (index === 0 && lesson.id !== "market") await set(`last_lesson_${lang}`, String(id));
      for (const word of words) {
        if (word.status) await mock.termSet({
          lang, term: cleanWord(word.text), status: word.status === "Known" ? 4 : 1,
          translation: word.gloss, context: text,
        });
      }
    }
  }
  await mock.playlistCreate("it", "Slow mornings", gardenChapters);
  await mock.bookCreate({
    lang: "it", title: "Small journeys", kind: "book", source: "",
    chapters: [
      { title: "A train to the coast", text: "Prendo il primo treno. Dal finestrino vedo il mare e le barche dei pescatori." },
      { title: "The harbour at dusk", text: "Al tramonto le barche tornano al porto. Le luci delle case si accendono una dopo l'altra." },
    ],
  }, null);
  for (const [title, text] of [
    ["The neighbourhood bakery", "Il forno apre presto. Il profumo del pane arriva fino alla piazza."],
    ["A letter from Bologna", "Cara Anna, oggi ho visitato il mercato e ho comprato delle pesche."],
    ["An afternoon at the station", "Il treno è in ritardo. Leggo qualche pagina mentre aspetto sul binario."],
  ]) await mock.lessonCreate({ lang: "it", title, text, kind: "text" });
  await mock.bookCreate({
    lang: "it", title: "Letters from Bologna", kind: "book", source: "",
    chapters: [{ title: "The first letter", text: "Cara Anna, la città è tranquilla questa mattina. Cammino sotto i portici e guardo le vetrine." }, { title: "Sunday", text: "Domenica andiamo al parco. Porto un libro e qualcosa da mangiare." }],
  }, sampleCover("Letters from Bologna", 4));
  await mock.lessonCreate({ lang: "it", title: "A walk through Florence", text: garden.pages[0].map(word => word.text).join(" "), kind: "video", media_path: "/media/garden-0.mp3" });
  await mock.lessonCreate({ lang: "it", title: "Slow Italian · Morning rituals", collection: "Slow Italian podcast", kind: "audio", text: garden.pages[0].map(word => word.text).join(" "), media_path: "/media/garden-0.mp3" });
  const sampleLessons = await mock.lessonsList("it");
  for (const [index, lesson] of sampleLessons.entries()) {
    await mock.lessonSetCover(lesson.id, sampleCover(lesson.collection || lesson.title, index), "jpg");
  }
  const reading = await mock.lessonOpen(gardenChapters[0]);
  const known = tokenize(reading.lesson.text, "it").filter(token => token.w && !["mattina", "giardino", "panchina", "farfalla", "quaderno"].includes(token.k)).map(token => token.k);
  await mock.termsMarkKnown("it", [...new Set(known)], 0);
  await mock.lessonUpdate(gardenChapters[0], { position: 3 });
  await mock.lessonOpen(gardenChapters[0]);
}
