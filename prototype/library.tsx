import { useEffect, useState } from "react";
import * as Menu from "@radix-ui/react-dropdown-menu";
import {
  ArrowDownToLine, ArrowUpRight, AudioLines, BookOpen, Check, ChevronDown,
  FileText, LibraryBig, ListFilter, PanelRight, Search, SlidersHorizontal,
} from "lucide-react";
import { Library as CollectionTools } from "../src/views/Library";
import { useApp } from "../src/lib/store";
import { langInfo } from "../src/lib/langs";
import type { LessonSummary, Playlist } from "../src/lib/types";
import { api } from "./preview-api";

const filters = ["All lessons", "Texts", "Audio & video", "Books", "Finished"] as const;
type Filter = typeof filters[number];
const sorts = ["Last opened", "Recently added", "Title"] as const;
type Sort = typeof sorts[number];

function LessonMark({ lesson }: { lesson: LessonSummary }) {
  const Icon = lesson.has_media ? AudioLines : lesson.kind === "book" ? BookOpen : FileText;
  return <span className={`sg-lesson-mark ${lesson.has_media ? "sg-media" : ""}`}><Icon size={19}/></span>;
}

export function Library() {
  const lang = useApp(state => state.lang());
  const revision = useApp(state => state.libraryVersion);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [books, setBooks] = useState<Playlist[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All lessons");
  const [sort, setSort] = useState<Sort>("Last opened");
  const [selection, setSelection] = useState<number>();
  const [details, setDetails] = useState(true);
  const [manage, setManage] = useState(false);

  useEffect(() => {
    let stale = false;
    void Promise.all([api().lessonsList(lang), api().playlistsList(lang)]).then(([rows, playlists]) => {
      if (!stale) { setLessons(rows); setBooks(playlists); }
    }).catch(error => { if (!stale) useApp.getState().toast(String(error), "error"); });
    return () => { stale = true; };
  }, [lang, revision]);

  const open = (lesson: LessonSummary) => {
    const book = books.find(item => item.kind === "book" && item.lessons.includes(lesson.id));
    useApp.getState().openLesson(lesson.id, book ? { playlist: book.id } : undefined);
  };
  const scoped = lessons.filter(row => row.lang === lang);
  const visible = scoped.filter(lesson => {
    if (!`${lesson.title} ${lesson.collection}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    if (filter === "Texts") return !lesson.has_media && lesson.kind !== "book";
    if (filter === "Audio & video") return lesson.has_media;
    if (filter === "Books") return lesson.kind === "book";
    if (filter === "Finished") return lesson.completed;
    return true;
  }).sort((a, b) => sort === "Title" ? a.title.localeCompare(b.title)
    : sort === "Recently added" ? b.created_at - a.created_at : (b.opened_at ?? 0) - (a.opened_at ?? 0));
  const active = visible.find(row => row.id === selection) ?? visible[0];
  const removeInspector = () => setDetails(value => !value);

  return <div className="sg-library">
    <header className="sg-titlebar">
      <span><LibraryBig size={16}/> Library <span className="sg-slash">/</span> <span className="sg-secondary">{langInfo(lang).name}</span></span>
      <div>
        <button className="sg-tool" onClick={() => setManage(!manage)} aria-pressed={manage}><SlidersHorizontal size={15}/>{manage ? "Back to collection" : "Manage library"}</button>
        <button className="sg-tool sg-tool-primary" onClick={() => useApp.getState().openImport()}><ArrowDownToLine size={15}/> Import</button>
      </div>
    </header>
    {manage ? <section className="sg-manage"><CollectionTools /></section> : <>
      <div className="sg-library-heading">
        <div><h1>Library</h1><p>{scoped.length} {scoped.length === 1 ? "lesson" : "lessons"} in {langInfo(lang).name}</p></div>
        <label className="sg-search"><Search size={16}/><input data-find aria-label="Search lessons" placeholder="Search lessons…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      </div>
      <div className="sg-filters">
        <div role="group" aria-label="Lesson type">
          {filters.map(item => <button key={item} className="sg-filter" aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        <div>
          <Menu.Root>
            <Menu.Trigger className="sg-tool"><ListFilter size={15}/>{sort}<ChevronDown size={13}/></Menu.Trigger>
            <Menu.Portal><Menu.Content className="sg-menu" align="end" sideOffset={7}>
              <Menu.RadioGroup value={sort} onValueChange={value => setSort(value as Sort)}>
                {sorts.map(item => <Menu.RadioItem className="sg-menu-item" key={item} value={item}>{item}<Menu.ItemIndicator className="sg-indicator"><Check size={14}/></Menu.ItemIndicator></Menu.RadioItem>)}
              </Menu.RadioGroup>
            </Menu.Content></Menu.Portal>
          </Menu.Root>
          <button className="sg-tool" aria-label="Lesson details" aria-pressed={details} onClick={removeInspector}><PanelRight size={16}/></button>
        </div>
      </div>
      <div className={`sg-collection ${details ? "sg-with-details" : ""}`}>
        <section aria-label="Lessons" className="sg-lessons">
          <div className="sg-list-head"><span>Title</span><span>Format</span><span>Known</span></div>
          {visible.map(lesson => <div className="sg-lesson" key={lesson.id} data-selected={lesson.id === active?.id && details}>
            <button className="sg-lesson-title" onClick={() => {
              if (details) setSelection(lesson.id);
              else open(lesson);
            }} onDoubleClick={() => open(lesson)} aria-pressed={details ? lesson.id === active?.id : undefined}>
              <LessonMark lesson={lesson}/><span><strong dir="auto">{lesson.title}</strong><small dir="auto">{lesson.collection || lesson.excerpt}</small></span>
            </button>
            <span className="sg-format">{lesson.has_media ? "Audio" : lesson.kind === "book" ? "Chapter" : "Text"}</span>
            <div className="sg-row-end"><span>{lesson.known_pct}%</span><button className="sg-row-open" onClick={() => open(lesson)} aria-label={`Open ${lesson.title}`}><ArrowUpRight size={16}/></button></div>
          </div>)}
          {!visible.length && <p className="sg-empty">No matching lessons.</p>}
        </section>
        {details && active && <aside className="sg-details" aria-label="Lesson details">
          <div className="sg-detail-bar"><span>Lesson details</span><button className="sg-tool" onClick={removeInspector} aria-label="Hide lesson details"><PanelRight size={16}/></button></div>
          <div className="sg-detail-body">
            <LessonMark lesson={active}/>
            <h2 dir="auto">{active.title}</h2>
            <p dir="auto">{active.excerpt}</p>
            <button className="sg-open" onClick={() => open(active)}><BookOpen size={16}/>{active.opened_at ? "Continue reading" : "Open reader"}<ArrowUpRight size={15}/></button>
            <dl><div><dt>Language</dt><dd>{langInfo(lang).name}</dd></div><div><dt>Words</dt><dd>{active.word_count}</dd></div><div><dt>New words</dt><dd>{active.new_words}</dd></div><div><dt>Known words</dt><dd>{active.known_pct}%</dd></div><div><dt>Status</dt><dd>{active.completed ? "Finished" : active.opened_at ? "In progress" : "Unread"}</dd></div></dl>
          </div>
        </aside>}
      </div>
    </>}
  </div>;
}
