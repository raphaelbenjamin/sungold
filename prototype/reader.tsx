import { createContext, useContext, useState, type ReactNode } from "react";
import { BookOpen, Blocks, SlidersHorizontal, PanelRight } from "lucide-react";
import { Reader as OriginalReader } from "../src/views/reader/Reader";
export { Appearance as PrototypeAppearance } from "./appearance";
import { IconButton } from "./ui";
import { useApp } from "../src/lib/store";
const ReaderChrome = createContext({ panel: false, togglePanel: () => {} });
export function ReaderToolbar({ children }: { children: ReactNode }) {
  return (
    <div
      className="reader-top unified-reader-toolbar"
      role="toolbar"
      aria-label="Reading tools"
    >
      {children}
    </div>
  );
}
export function ReaderControls({ onAppearance }: { onAppearance(): void }) {
  const chunk = useApp((s) => s.settings.chunk_mode === "1");
  return (
    <>
      <span className="toolbar-divider" />
      <IconButton
        label="Read mode"
        aria-pressed={!chunk}
        onClick={() => void useApp.getState().setSetting("chunk_mode", "0")}
      >
        <BookOpen size={17} />
      </IconButton>
      <IconButton
        label="Chunk mode"
        aria-pressed={chunk}
        onClick={() => void useApp.getState().setSetting("chunk_mode", "1")}
      >
        <Blocks size={17} />
      </IconButton>
      <span className="toolbar-divider" />
      <IconButton label="Appearance" onClick={onAppearance}>
        <SlidersHorizontal size={17} />
      </IconButton>
    </>
  );
}
export function ReaderPanelToggle() {
  const ctx = useContext(ReaderChrome);
  return (
    <IconButton
      label="Dictionary panel"
      aria-pressed={ctx.panel}
      onClick={ctx.togglePanel}
    >
      <PanelRight size={17} />
    </IconButton>
  );
}
export function Reader() {
  const [panel, setPanel] = useState(false);
  return (
    <ReaderChrome.Provider
      value={{ panel, togglePanel: () => setPanel((v) => !v) }}
    >
      <div
        className={`reading-workspace ${panel ? "inspector-open" : ""}`}
        onClick={(e) => {
          if (!(e.target instanceof Element)) return;
          if (e.target.closest("[data-i],.chat-float-btn")) setPanel(true);
          if (e.target.closest('.word-panel button[aria-label="Close"]'))
            setPanel(false);
        }}
        onKeyDownCapture={(e) => {
          if (
            e.target instanceof Element &&
            e.target.closest("input,textarea,[contenteditable]")
          )
            return;
          if (
            !e.metaKey &&
            !e.ctrlKey &&
            (e.key.toLowerCase() === "c" ||
              e.key === "ArrowLeft" ||
              e.key === "ArrowRight")
          )
            setPanel(true);
        }}
      >
        <OriginalReader />
      </div>
    </ReaderChrome.Provider>
  );
}
