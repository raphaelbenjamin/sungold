import { PageHeading } from "./ui";
import { useEffect, useState, type ReactNode } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { BookOpen, LibraryBig, Layers, Plus, MoreHorizontal, Settings, Sparkles, Dumbbell, ChartNoAxesColumnIncreasing, ChevronsUpDown, Check, Compass, ListMusic, MessageSquare } from "lucide-react";
import { useApp, type View } from "../src/lib/store";
import { LANGS, langInfo } from "../src/lib/langs";
import type { LangCode } from "../src/lib/types";
import { Vocabulary as OriginalVocabulary } from "../src/views/Vocabulary";
import { Training as OriginalTraining } from "../src/views/Training";

function go(view: View) {
  const state = useApp.getState();
  if (view === "reader") { if (state.lessonId) state.openLesson(state.lessonId); }
  else if (view === "playlists") state.openPlaylist(null);
  else state.go(view);
}
function RailButton({ label, children, active, onClick, disabled = false }: { label: string; children: ReactNode; active?: boolean; onClick(): void; disabled?: boolean }) {
  return <button className="rail-button" aria-label={label} aria-current={active ? "page" : undefined} disabled={disabled} onClick={onClick}>{children}<span className="rail-tip">{label}</span></button>;
}
export function Sidebar() {
  const view = useApp(s => s.view);
  return <aside className="sidebar rail" aria-label="Primary navigation">
    <div className="rail-main">
      <RailButton label="Library" active={view === "library"} onClick={() => go("library")}><LibraryBig size={21}/></RailButton>
      <RailButton label="Training Dojo" active={view === "training"} onClick={() => go("training")}><Dumbbell size={21}/></RailButton>
      <RailButton label="Import" onClick={() => useApp.getState().openImport()}><Plus size={22}/></RailButton>
    </div>
    <Menu.Root><Menu.Trigger className="rail-button" aria-label="More"><MoreHorizontal size={21}/><span className="rail-tip">More</span></Menu.Trigger>
      <Menu.Portal><Menu.Content className="sg-menu" side="right" sideOffset={10}>
        {[["vocab", "Vocabulary", Layers], ["discover", "Discover", Compass], ["playlists", "Playlists", ListMusic], ["chat", "Chat", MessageSquare]] .map(([route, label, Icon]) => {
          const Glyph = Icon as typeof Compass;
          return <Menu.Item className="sg-menu-item" key={String(route)} onSelect={() => go(route as View)}><Glyph size={16}/>{String(label)}</Menu.Item>;
        })}
      </Menu.Content></Menu.Portal>
    </Menu.Root>
    <div className="rail-bottom">
      <RailButton label="Progress" active={view === "progress"} onClick={() => go("progress")}><ChartNoAxesColumnIncreasing size={20}/></RailButton>
      <RailButton label="AI and models" onClick={() => useApp.getState().openSettings("ai")}><Sparkles size={20}/></RailButton>
      <RailButton label="Settings" active={view === "settings"} onClick={() => go("settings")}><Settings size={20}/></RailButton>
    </div>
  </aside>;
}
export function WorkspaceHeader() {
  const ready = useApp(s => s.ready);
  const lang = useApp(s => s.lang)();
  const langs = useApp(s => s.langs)();
  const known = useApp(s => s.knownCount);
  const view = useApp(s => s.view);
  async function change(code: LangCode) {
    const state = useApp.getState();
    state.go("library");
    await state.setSetting("lang", code);
    await state.refreshKnown();
  }
  if (!ready) return null;
  return <header className="workspace-header" data-tauri-drag-region>
    <span className="workspace-name">sungold</span><span className="workspace-divider"/>
    <Menu.Root><Menu.Trigger className="language-trigger" aria-label={`Study language: ${langInfo(lang).name}`}>
      <span className="language-code">{lang.toUpperCase()}</span>{langInfo(lang).name}<ChevronsUpDown size={13}/>
    </Menu.Trigger><Menu.Portal><Menu.Content className="sg-menu" sideOffset={8}>
      <Menu.Label className="sg-menu-label">Study workspace</Menu.Label>
      {LANGS.filter(item => langs.includes(item.code)).map(item => <Menu.Item key={item.code} className="sg-menu-item" onSelect={() => void change(item.code)}>
        {item.name}{lang === item.code && <Check size={14}/>}
      </Menu.Item>)}
      <Menu.Separator className="sg-menu-divider"/><Menu.Item className="sg-menu-item" onSelect={() => useApp.getState().openSettings("langs")}>Manage languages</Menu.Item>
    </Menu.Content></Menu.Portal></Menu.Root>
    <span className="known-total">{known} known words</span>
    <span className="header-context">{view === "reader" ? "Reading" : view === "training" ? "Training Dojo" : view === "settings" ? "Preferences" : view === "progress" ? "Progress" : "Your personal collection"}</span>
    {import.meta.env.MODE !== "desktop" && <span className="sample-indicator">Sample workspace</span>}
  </header>;
}
export function Vocabulary() { return <div className="words-area"><PageHeading title="Vocabulary" description="Your collected words, in one place."/><div className="words-content"><OriginalVocabulary/></div></div>; }
export function Training() { return <div className="words-area"><PageHeading title="Training Dojo" description="A little practice. A lasting vocabulary."/><div className="words-content"><OriginalTraining/></div></div>; }
