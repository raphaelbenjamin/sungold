# Sungold compact-shell milestone

Run from this worktree:

```sh
npm ci --ignore-scripts
npm --prefix prototype ci --ignore-scripts
npx vite --config prototype/vite.config.mjs
```

Open http://127.0.0.1:4176/ in a browser.

The milestone has a 60px navigation rail, a top-left language workspace switcher, a cover grid with an optional list, grouped books, and a Words area with Vocabulary and Training tabs. More contains Discover, Playlists, and standalone Chat. Progress, Settings, and AI remain accessible from the rail.

Open a lesson to see the focused reader. Selecting a word opens the dictionary panel. The panel button closes it. Read and Chunk switch the existing reading mode. Reading tools reveals the original advanced toolbar, including preloading and lesson chat. Appearance opens the original reading preferences.

The Library uses the existing Cover and BookCover components, cover_path/mediaUrl loading, and bookView/readBook grouping and navigation. Sample jacket images are original canvas illustrations stored through lessonSetCover as JPEG data. They are fixture artwork, not screenshots of a proposed interface. Screenshots in this directory come from the running React app.

Radix Dropdown Menu and Dialog primitives (MIT) provide menus, language selection, and dialogs. Lucide (ISC) provides shell icons. Existing GPL licensing and attributions continue to apply.

All production source files are untouched. Vite substitutes prototype shell, Library, Reader wrapper, and Words wrapper modules for this browser preview. Complex original reading and study logic runs against an in-memory mock. Refreshing resets the fixture data. Real authentication, downloads, imports, backups, and migration are outside this layout milestone.

The previous design is recoverable at local commit 52c0cae on design/sungold-exploration.

## Preferences direction — 14 November

The rail now contains Library, Training Dojo and Import, with Vocabulary under More.
The redundant sun and Continue Reading rail destinations are removed. Resume remains
available from the Library collection.

`settings.tsx` supplies grouped preference navigation and rebuilt General controls.
`appearance.tsx` supplies shared reading preferences in Settings and a Radix Dialog
sheet in Reader. These use the original setting keys and in-memory preview store.
Advanced settings panes retain original controls inside the new preferences layout;
this is not a claim that every advanced screen has been redesigned. The shell is a
dark-theme exploration; Light/System are retained settings, not complete new palettes.

The previous prototype is recoverable from
`checkpoints/before-settings-redesign.tar.gz` (excludes dependencies/build output).
Rendered screenshots F–I and minimum-settings/minimum-appearance document this pass.
Verified TypeScript, Vite build, navigation, appearance value retention during the
session, and viewport layouts at 1440×900 and 980×640. Refresh still resets sample data.

## Unified application system — 14 November

`system.css` is the shared graphite/gold design system, loaded after existing view
styles. `ui.tsx` provides shared Radix Sheet, Switch, ToggleGroup, Tooltip-backed
IconButton and PageHeading components. `icons.tsx` adapts the existing icon names
to Lucide while retaining a fallback for uncommon symbols. See THIRD_PARTY.md for
sources and licences. No paid templates or application code from reference apps
are included.

The Reader now has ONE action toolbar. `source-adapter.mjs` replaces only its
presentation boundary during the preview build, preserving original callbacks for
copy, preloading, simplify, chunk breakdown, chapter navigation and lesson chat.
Read/Chunk, Appearance and Dictionary visibility are in this same row. Appearance
uses the original Reader's open state, so its keyboard shortcut guard still works.
The redundant legacy sidebar/display controls are not rendered in the toolbar.
Dictionary docking/floating remains in Appearance. All adapters fail loudly if
source boundaries change; no production files are edited.

Training has a setup column and separate card collection, using the original drill
state, archive, recall and generation handlers. Progress presents period metrics
first, with activity and daily goal side by side. Settings uses shared primitives
throughout its original functional panes, including provider selection and local
models. Import uses a source-navigation side sheet. The queue uses the same Sheet
component and original jobs/retry/dismiss store, scoped to the current language.
Its optional sample queue demonstrates statuses without running imports.

Verification: TypeScript and Vite production build; live browser checks for a
single Reader toolbar, next/previous book chapters, dictionary selection/collapse,
lesson chat, chunk dialog, 13 Settings categories, flashcard reveal/grade, text
import into the in-memory collection, five import methods present, and sample queue
retry. Rendered 1440×900 and 980×640 screenshots are J–U and minimum-*-system.
These checks do not validate native services or real provider authentication.

A complete pre-change snapshot is in checkpoints/before-unified-system.tar.gz.
