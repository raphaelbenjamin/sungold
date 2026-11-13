export type Language = "Italian" | "Hebrew" | "Chinese";
export type Status = "Learning" | "Known";
export type Word = { text: string; gloss: string; pronunciation?: string; status?: Status };
export type Lesson = {
  id: string; title: string; subtitle: string; language: Language; kind: string;
  cover: string; pages: Word[][]; translation: string[]; initial: number; playlist: string;
};

const word = (text: string, gloss: string, pronunciation?: string, status?: Status): Word =>
  ({ text, gloss, pronunciation, status });

export const garden: Lesson = {
  id: "garden", title: "A garden in the city", subtitle: "Slow Italian · Chapter 4",
  language: "Italian", kind: "Audio", cover: "garden", initial: 1, playlist: "Slow mornings",
  pages: [
    [word("Ogni", "every"), word("mattina", "morning", undefined, "Learning"),
      word("attraverso", "I cross"), word("la", "the", undefined, "Known"),
      word("città.", "city", undefined, "Known"), word("Dietro", "behind"),
      word("la", "the"), word("stazione", "station"), word("c’è", "there is"),
      word("un", "a"), word("piccolo", "small"), word("giardino.", "garden", undefined, "Learning")],
    [word("Qui", "here"), word("il", "the"), word("tempo", "time"), word("sembra", "seems"),
      word("più", "more"), word("lento.", "slow"), word("Mi", "myself"), word("siedo", "I sit"),
      word("e", "and"), word("ascolto", "I listen"), word("gli", "the"), word("uccelli.", "birds")],
    [word("Prima", "before"), word("di", "to"), word("andare", "go"), word("via,", "away"),
      word("saluto", "I greet"), word("il", "the"), word("giardiniere.", "gardener")],
  ],
  translation: [
    "Every morning I cross the city. Behind the station there is a small garden.",
    "Time seems slower here. I sit down and listen to the birds.",
    "Before leaving, I say hello to the gardener.",
  ],
};

export const lessons: Lesson[] = [garden, {
  id: "street", title: "A street in Haifa", subtitle: "City stories · Chapter 2", language: "Hebrew",
  kind: "Text", cover: "street", initial: 0, playlist: "City stories",
  pages: [[word("בבוקר", "in the morning", "baboker", "Learning"),
    word("אני", "I", "ani"), word("הולך", "walk", "holekh"),
    word("ברחוב", "in the street", "barekhov"), word("השקט.", "the quiet", "hasheket")]],
  translation: ["In the morning I walk down the quiet street."],
}, {
  id: "tea", title: "Tea by the window", subtitle: "Small rituals · Chapter 1", language: "Chinese",
  kind: "Text", cover: "tea", initial: 0, playlist: "Slow mornings",
  pages: [[word("我", "I", "wǒ"), word("在", "at", "zài"), word("窗边", "by the window", "chuāngbiān"),
    word("喝", "to drink", "hē"), word("一杯", "one cup", "yì bēi"), word("茶。", "tea", "chá", "Learning")]],
  translation: ["I drink a cup of tea by the window."],
}, {
  id: "market", title: "At the market", subtitle: "Slow Italian · Chapter 5", language: "Italian",
  kind: "Text", cover: "market", initial: 0, playlist: "City stories",
  pages: [[word("Al", "at the"), word("mercato", "market", undefined, "Learning"),
    word("compro", "I buy"), word("pane", "bread"), word("e", "and"), word("frutta.", "fruit")]],
  translation: ["At the market I buy bread and fruit."],
}];

export const languageCodes = { Italian: "it", Hebrew: "he", Chinese: "zh" } as const;
export const cleanWord = (text: string) => text.replace(/[\p{P}]+$/u, "").toLocaleLowerCase();
