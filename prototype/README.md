# Sungold design preview

The preview uses a new desktop sidebar, language menu, quick actions dialog, and Library. The dark workspace takes its compact navigation from Linear and its dense list and contextual details from Readwise Reader. The light version uses the same workflow with roomier rows.

```sh
npm ci --ignore-scripts
npm --prefix prototype ci --ignore-scripts
npx vite --config prototype/vite.config.mjs
```

Open [dark](http://127.0.0.1:4176/) or [light](http://127.0.0.1:4176/?design=light). Press Command-K or Control-K for quick actions. Use the top-left language switcher to change the active Library, Reader, Vocabulary, and Training workspace. Select a Library row to see its details and double-click it to open the reader. **Manage library** opens the existing collection tools for covers, bulk editing, and book organization.

The shell uses [Radix Primitives](https://github.com/radix-ui/primitives) (MIT) and [Lucide](https://github.com/lucide-icons/lucide) (ISC). Existing GPL terms apply to Sungold. The production files, package manifest, and lockfile stay intact. The Reader, Training, Vocabulary, Import, Settings, and other original views are connected to the new shell. The Reader keeps the original playback, word-selection, and Chunk controls, with preview styles for the document, toolbar, and inspector.

The preview binds to localhost and uses an in-memory backend, bundled narration, and sample lessons. Refreshing resets the workspace. ChatGPT sign-in, downloads, remote imports, and backups are mock workflows where supported. Native behavior and migration require separate verification.
