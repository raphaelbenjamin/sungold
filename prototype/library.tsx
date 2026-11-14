import { PageHeading } from "./ui";
import { useEffect, useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Grid2X2, List, Plus, MoreHorizontal, ArrowRight, BookOpen, Headphones, Video, FileText, X } from "lucide-react";
import { Cover, BookCover } from "../src/components/Cover";
import { Library as OriginalLibrary } from "../src/views/Library";
import { bookView, readBook, progressOf } from "../src/lib/playlists";
import { titleOf, idsOf, type Entry } from "../src/views/library/entries";
import { useApp } from "../src/lib/store";
import { api } from "../src/lib/api";

const filters = ["All", "Books", "Texts", "Audio", "Video", "Finished"] as const;
export function Library() {
  const lang = useApp(s => s.lang)();
  const revision = useApp(s => s.libraryVersion);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [query, setQuery] = useState("");
  const density = useApp(s => s.settings.library_view);
  const layout = density === "list" ? "list" : "grid";
  const setLayout = (value: string) => void useApp.getState().setSetting("library_view", value === "list" ? "list" : "large");
  const [manage, setManage] = useState(false);
  const [rename, setRename] = useState<Entry>();
  const [name, setName] = useState("");
  const [deleting, setDeleting] = useState<Entry>();
  const [error, setError] = useState("");
  useEffect(() => {
    let stale = false;
    setEntries([]);
    void Promise.all([api().lessonsList(lang), api().playlistsList(lang)]).then(([lessons, playlists]) => {
      const books = playlists.filter(p => p.kind === "book").map(p => bookView(p, lessons)).filter(b => b !== null);
      const chapters = new Set(books.flatMap(b => b.ls.map(l => l.id)));
      const items: Entry[] = [...books.map(b => ({ key: `book-${b.p.id}`, b })), ...lessons.filter(l => !chapters.has(l.id)).map(l => ({ key: `lesson-${l.id}`, l }))];
      if (!stale) setEntries(items);
    }).catch(cause => { if (!stale) setError(String(cause)); });
    return () => { stale = true; };
  }, [lang, revision]);
  const open = (entry: Entry) => entry.b ? readBook(entry.b) : useApp.getState().openLesson(entry.l.id);
  const lessonOf = (entry: Entry) => entry.b ? entry.b.ls[0] : entry.l;
  const done = (entry: Entry) => entry.b ? entry.b.completed : entry.l.completed;
  const progress = (entry: Entry) => entry.b ? entry.b.progress : progressOf(entry.l);
  const kind = (entry: Entry) => entry.b ? "Books" : lessonOf(entry).kind === "video" ? "Video" : lessonOf(entry).has_media ? "Audio" : "Texts";
  const visible = entries.filter(entry => titleOf(entry).toLowerCase().includes(query.toLowerCase()) && (filter === "All" || (filter === "Finished" ? done(entry) : kind(entry) === filter)));
  const resume = entries.find(entry => entry.b ? entry.b.started && !entry.b.completed : entry.l.opened_at && !entry.l.completed);
  function art(entry: Entry) {
    return entry.b ? <BookCover lesson={entry.b.ls[0]} title={entry.b.p.name} bare/> : <Cover lesson={entry.l} bare/>;
  }
  function label(entry: Entry) {
    return entry.b ? `Book · ${entry.b.ls.length} chapters` : kind(entry) === "Audio" ? "Audio lesson" : kind(entry) === "Video" ? "Video" : "Text";
  }
  async function mutation(action: () => Promise<unknown>) {
    try { await action(); useApp.getState().bumpLibrary(); setDeleting(undefined); setRename(undefined); }
    catch (cause) { setError(String(cause)); }
  }
  return <div className="collection-view">
    <PageHeading title="Library" description="Your reading and listening collection.">
      <div className="collection-heading-actions"><button className="sg-tool" onClick={() => setManage(!manage)}>{manage ? "Back to Library" : "Organize"}</button><button className="sg-tool sg-tool-primary" onClick={() => useApp.getState().openImport()}><Plus size={16}/>Import</button></div>
    </PageHeading>
    {manage ? <div className="sg-manage"><OriginalLibrary/></div> : <>
      {resume && <button className="resume-strip" onClick={() => open(resume)}>
        <span className="resume-cover">{art(resume)}</span><span><small>Continue reading</small><strong>{titleOf(resume)}</strong></span><span className="resume-progress"><progress max="1" value={progress(resume)}/><small>{Math.round(progress(resume) * 100)}% complete</small></span><ArrowRight size={19}/>
      </button>}
      <div className="collection-controls"><div className="collection-filters" role="group" aria-label="Content filters">
        {filters.map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
      </div><label className="sg-search"><Search size={15}/><input aria-label="Search collection" placeholder="Search your collection" value={query} onChange={event => setQuery(event.target.value)}/></label>
        <div className="view-toggle" role="group" aria-label="Library layout"><button aria-label="Cover grid" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}><Grid2X2 size={16}/></button><button aria-label="Compact list" aria-pressed={layout === "list"} onClick={() => setLayout("list")}><List size={17}/></button></div>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={`collection-items ${layout} ${density === "small" ? "compact" : ""}`}>
        {visible.map(entry => {
          const Icon = entry.b ? BookOpen : kind(entry) === "Audio" ? Headphones : kind(entry) === "Video" ? Video : FileText;
          return <article className="collection-item" key={entry.key}>
            <button className="item-open" onClick={() => open(entry)} aria-label={`Open ${titleOf(entry)}`}>
              <div className="item-art">{art(entry)}<span className="item-format"><Icon size={13}/>{entry.b ? "Book" : kind(entry) === "Texts" ? "Text" : kind(entry)}</span></div>
              <div className="item-copy"><strong dir="auto">{titleOf(entry)}</strong><small>{label(entry)}</small><div className="item-progress"><progress value={progress(entry)} max="1"/><span>{done(entry) ? "Finished" : `${Math.round(progress(entry) * 100)}%`}</span></div></div>
            </button>
            <Menu.Root><Menu.Trigger className="item-menu" aria-label={`Actions for ${titleOf(entry)}`}><MoreHorizontal size={18}/></Menu.Trigger>
              <Menu.Portal><Menu.Content className="sg-menu" align="end" sideOffset={5}>
                <Menu.Item className="sg-menu-item" onSelect={() => open(entry)}>Open</Menu.Item>
                {entry.b && <Menu.Item className="sg-menu-item" onSelect={() => useApp.getState().openPlaylist(entry.b!.p.id)}>View chapters</Menu.Item>}
                <Menu.Item className="sg-menu-item" onSelect={() => { setName(titleOf(entry)); setRename(entry); }}>Rename</Menu.Item>
                <Menu.Item className="sg-menu-item" onSelect={() => setManage(true)}>Organize / group</Menu.Item>
                <Menu.Item className="sg-menu-item" onSelect={() => void mutation(() => api().lessonsSetCompleted(idsOf(entry), !done(entry)))}>{done(entry) ? "Mark unread" : "Mark finished"}</Menu.Item>
                <Menu.Item className="sg-menu-item danger" onSelect={() => setDeleting(entry)}>Delete</Menu.Item>
              </Menu.Content></Menu.Portal>
            </Menu.Root>
          </article>;
        })}
      </div>
      {!visible.length && <p className="sg-empty">No items match your search.</p>}
    </>}
    <Dialog.Root open={!!rename || !!deleting} onOpenChange={open => { if (!open) { setRename(undefined); setDeleting(undefined); } }}>
      <Dialog.Portal><Dialog.Overlay className="sg-dialog-overlay"/><Dialog.Content className="sg-dialog">
        <div className="sg-dialog-head"><Dialog.Title>{rename ? "Rename" : "Delete from your library?"}</Dialog.Title><Dialog.Close aria-label="Close"><X size={17}/></Dialog.Close></div>
        <Dialog.Description>{rename ? "Choose a title for this item." : `Delete “${deleting ? titleOf(deleting) : ""}” and its chapters from the sample workspace.`}</Dialog.Description>
        {rename && <input aria-label="Title" value={name} onChange={event => setName(event.target.value)}/>}
        <button className="sg-open" disabled={!!rename && !name.trim()} onClick={() => void mutation(async () => {
          if (rename) {
            if (rename.b) await api().playlistUpdate(rename.b.p.id, { name: name.trim() });
            else await api().lessonUpdate(rename.l.id, { title: name.trim() });
          }
          if (deleting) { await api().lessonsDelete(idsOf(deleting)); if (deleting.b) await api().playlistDelete(deleting.b.p.id); }
        })}>{rename ? "Save title" : "Delete"}</button>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </div>;
}
