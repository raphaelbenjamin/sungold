import { Sheet, Switch } from "./ui";
import { X, RotateCcw } from "lucide-react";
import { useApp } from "../src/lib/store";
import {
  readFonts,
  readFont,
  PAPERS,
  readerFontSize,
  fontSizeKey,
  SIZE_MIN,
  SIZE_MAX,
  LOOK_DEFAULTS,
  panelOptions,
} from "../src/lib/reading";
import { ChineseStudyOptions } from "../src/views/reader/ChineseStudy";
import { ChunkModeOptions } from "../src/views/reader/Display";
export function AppearanceControls() {
  const s = useApp((s) => s.settings),
    set = useApp((s) => s.setSetting),
    lang = useApp((s) => s.lang)();
  const select = (
    label: string,
    key: string,
    options: { value: string; label: string }[],
    fallback: string,
  ) => (
    <label className="preference-field">
      <span>{label}</span>
      <select
        aria-label={label}
        value={s[key] || fallback}
        onChange={(e) => void set(key, e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
  const choices = (values: string[]) =>
    values.map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
    }));
  const paper = PAPERS.find((p) => p.id === s.read_paper);
  return (
    <div className="appearance-controls">
      <div
        className="type-preview"
        style={{
          fontFamily: readFont(s.read_font).stack,
          background: paper?.swatch[0] || "#1d1e22",
          color: paper?.swatch[1] || "#eeedf0",
        }}
      >
        <span>YOUR READING SPACE</span>
        <p
          lang={lang}
          dir={lang === "he" ? "rtl" : "auto"}
          style={{ fontSize: readerFontSize(s, lang) }}
        >
          {lang === "he"
            ? "כל מילה פותחת דלת חדשה."
            : lang === "zh"
              ? "每一个词，都打开一扇新的门。"
              : "Every word opens a new door."}
        </p>
        <small>Changes apply to your reading page immediately.</small>
      </div>
      <section className="preference-section">
        <h3>Typography</h3>
        <div className="preference-grid">
          {select(
            "Typeface",
            "read_font",
            readFonts().map((f) => ({ value: f.id, label: f.label })),
            readFont(s.read_font).id,
          )}
          <label className="preference-field">
            <span>
              Text size <b>{readerFontSize(s, lang)}px</b>
            </span>
            <input
              aria-label="Text size"
              type="range"
              min={SIZE_MIN}
              max={SIZE_MAX}
              value={readerFontSize(s, lang)}
              onChange={(e) => void set(fontSizeKey(lang), e.target.value)}
            />
          </label>
          {select(
            "Line spacing",
            "line_height",
            [
              { value: "1.55", label: "Tight" },
              { value: "1.75", label: "Balanced" },
              { value: "1.95", label: "Spacious" },
            ],
            "1.75",
          )}
          {select(
            "Column width",
            "read_width",
            choices(["narrow", "normal", "wide"]),
            "normal",
          )}
        </div>
      </section>
      <section className="preference-section">
        <h3>Page & colour</h3>
        <div className="paper-options">
          {PAPERS.map((p) => (
            <button
              key={p.id}
              aria-pressed={(s.read_paper || "auto") === p.id}
              onClick={() => void set("read_paper", p.id)}
            >
              <i
                style={{
                  background:
                    p.swatch[0] ||
                    "linear-gradient(120deg,#eee 50%,#202320 50%)",
                }}
              />
              {p.label}
            </button>
          ))}
        </div>
        <div className="preference-grid">
          {select(
            "Page movement",
            "reader_layout",
            [
              { value: "pages", label: "Turn pages" },
              { value: "scroll", label: "Continuous scroll" },
            ],
            "pages",
          )}
          {select(
            "Word highlights",
            "word_style",
            [
              { value: "tint", label: "Soft background" },
              { value: "line", label: "Underline" },
            ],
            "tint",
          )}
        </div>
      </section>
      <section className="preference-section">
        <h3>Study aids</h3>
        <div className="preference-grid">
          {select("Dictionary placement", "word_panel", panelOptions(), "auto")}
          <label className="preference-toggle">
            <span>
              Blur known words<small>Reveal them as you read</small>
            </span>
            <Switch
              label="Blur known words"
              on={s.blur_known_words === "1"}
              onChange={(v) => void set("blur_known_words", v ? "1" : "0")}
            />
          </label>
        </div>
        {lang === "zh" && <ChineseStudyOptions compact />}
        <ChunkModeOptions compact />
      </section>
      <button
        className="preference-reset"
        onClick={() => {
          for (const [key, value] of Object.entries(LOOK_DEFAULTS))
            void set(key === "font_size" ? fontSizeKey(lang) : key, value);
        }}
      >
        <RotateCcw size={13} />
        Reset reading appearance
      </button>
    </div>
  );
}
export function Appearance({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange(v: boolean): void;
}) {
  return (
    <Sheet
      open={open}
      onClose={() => onOpenChange(false)}
      title="Reading appearance"
      width={460}
    >
      <AppearanceControls />
    </Sheet>
  );
}
