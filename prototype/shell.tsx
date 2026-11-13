import { useEffect, useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDownToLine, ArrowRight, AudioLines, BookOpen, ChartNoAxesColumnIncreasing,
  Check, ChevronsUpDown, Compass, Layers, LibraryBig, ListMusic, MessageSquare,
  Search, Settings, Sparkles, Sun, X,
} from "lucide-react";
import { useApp, type View } from "../src/lib/store";
import { LANGS, langInfo } from "../src/lib/langs";
import type { LangCode } from "../src/lib/types";
import { api } from "./preview-api";

const destinations = [
  { view: "library", label: "Library", icon: LibraryBig },
  { view: "discover", label: "Discover", icon: Compass },
  { view: "playlists", label: "Playlists", icon: ListMusic },
  { view: "reader", label: "Now reading", icon: BookOpen },
  { view: "chat", label: "Chat", icon: MessageSquare },
  { view: "training", label: "Training", icon: Layers },
  { view: "vocab", label: "Vocabulary", icon: AudioLines },
  { view: "progress", label: "Progress", icon: ChartNoAxesColumnIncreasing },
  { view: "settings", label: "Settings", icon: Settings },
] as const;

function WorkspaceMenu() {
  const lang = useApp(state => state.lang());
  const langs = useApp(state => state.langs)();
  const info = langInfo(lang);
  async function switchLanguage(code: LangCode) {
    const state = useApp.getState();
    if (code === state.lang()) return;
    state.go(state.view === "discover" ? "discover" : "library");
    await state.setSetting("lang", code);
    await state.refreshKnown();
  }
  return <Menu.Root>
    <Menu.Trigger className="sg-workspace" aria-label={`Study language: ${info.name}`}>
      <span className="sg-language-mark">{info.badge}</span><span><strong>{info.name}</strong><small>Study workspace</small></span>
      <ChevronsUpDown size={14} />
    </Menu.Trigger>
    <Menu.Portal><Menu.Content className="sg-menu" align="start" sideOffset={7}>
      <Menu.Label className="sg-menu-label">Study language</Menu.Label>
      <Menu.RadioGroup value={lang}>
        {LANGS.filter(item => langs.includes(item.code) || item.code === lang).map(item =>
          <Menu.RadioItem key={item.code} value={item.code} className="sg-menu-item" onSelect={() => void switchLanguage(item.code)}>
            <span className="sg-language-mark">{item.badge}</span><span>{item.name}</span>
            <Menu.ItemIndicator className="sg-indicator"><Check size={14}/></Menu.ItemIndicator>
          </Menu.RadioItem>)}
      </Menu.RadioGroup>
      <Menu.Separator className="sg-menu-divider"/>
      <Menu.Item className="sg-menu-item" onSelect={() => useApp.getState().openSettings("langs")}><Settings size={15}/> Manage languages</Menu.Item>
    </Menu.Content></Menu.Portal>
  </Menu.Root>;
}

export function Sidebar() {
  const view = useApp(state => state.view);
  const lesson = useApp(state => state.lessonId);
  const lang = useApp(state => state.lang());
  const known = useApp(state => state.knownCount);
  const revision = useApp(state => state.libraryVersion);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<{ id: number; title: string; lang: LangCode }[]>([]);

  useEffect(() => {
    let stale = false;
    void api().lessonsList(lang).then(rows => {
      if (!stale) setRecent(rows.filter(row => row.opened_at).slice(0, 3));
    });
    return () => { stale = true; };
  }, [lang, revision, lesson]);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuery("");
        setPalette(value => !value);
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function navigate(target: View) {
    const state = useApp.getState();
    if (target === "reader") {
      if (state.lessonId) state.openLesson(state.lessonId);
    } else if (target === "playlists") state.openPlaylist(null);
    else state.go(target);
  }

  function renderLinks(group: typeof destinations[number]["view"][]) {
    return destinations.filter(item => group.includes(item.view)).map(({ view: target, label, icon: Icon }) =>
      <button className="sg-nav-link" key={target} aria-current={view === target ? "page" : undefined}
        disabled={target === "reader" && !lesson} onClick={() => navigate(target)}>
        <Icon size={16}/>{label}
      </button>);
  }

  const actions = [
    ...destinations.filter(item => item.view !== "reader" || lesson).map(item => ({ label: item.label, run: () => navigate(item.view) })),
    { label: "Import", run: () => useApp.getState().openImport() },
    { label: "AI settings", run: () => useApp.getState().openSettings("ai") },
  ].filter(action => action.label.toLowerCase().includes(query.trim().toLowerCase()));

  return <aside className="sidebar sg-sidebar" aria-label="Navigation">
    <div className="sg-brand"><span><Sun size={16}/></span><strong>Sungold</strong></div>
    <WorkspaceMenu />
    <Dialog.Root open={palette} onOpenChange={open => { setQuery(""); setPalette(open); }}>
      <Dialog.Trigger className="sg-command-trigger"><Search size={15}/> Quick actions <kbd>⌘ K</kbd></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sg-dialog-overlay"/>
        <Dialog.Content className="sg-dialog">
          <div className="sg-dialog-head"><Dialog.Title>Quick actions</Dialog.Title><Dialog.Close aria-label="Close"><X size={16}/></Dialog.Close></div>
          <Dialog.Description className="sr-only">Find a workspace action.</Dialog.Description>
          <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an action…" aria-label="Find an action"
            onKeyDown={event => {
              if (event.key === "Enter" && actions[0]) { setPalette(false); actions[0].run(); }
              if (event.key === "ArrowDown") event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(".sg-command-action")?.focus();
            }} />
          <div className="sg-command-list">{actions.map(action => <button className="sg-command-action" key={action.label}
            onClick={() => { setPalette(false); action.run(); }}>{action.label}<ArrowRight size={14}/></button>)}
            {!actions.length && <p>No matching actions.</p>}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <nav className="sg-nav" aria-label="Workspace">
      <span className="sg-nav-label">Collection</span>
      {renderLinks(["library", "discover", "playlists", "reader"])}
      <span className="sg-nav-label">Study</span>
      {renderLinks(["chat", "training", "vocab", "progress"])}
      {recent.some(row => row.lang === lang) && <>
        <span className="sg-nav-label">Recent</span>
        {recent.filter(row => row.lang === lang).map(row => <button className="sg-nav-link sg-recent" key={row.id}
          onClick={() => useApp.getState().openLesson(row.id)}><BookOpen size={14}/>{row.title}</button>)}
      </>}
    </nav>
    <div className="sg-sidebar-foot">
      <button className="sg-nav-link" onClick={() => useApp.getState().openSettings("ai")}><Sparkles size={16}/> AI settings</button>
      {renderLinks(["settings"])}
      <button className="sg-nav-link sg-import" onClick={() => useApp.getState().openImport()}><ArrowDownToLine size={16}/>Import</button>
      <div className="sg-preview-note"><span/><span>Sample workspace</span><span>{known} known</span></div>
    </div>
  </aside>;
}
