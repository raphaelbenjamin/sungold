import { resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));
const source = resolve(root, "../src");
const api = resolve(source, "lib/api");
const mock = resolve(source, "lib/mock.ts");

export default defineConfig({
  root,
  envDir: false,
  resolve: { alias: { react: resolve(root, "../node_modules/react"), "react-dom": resolve(root, "../node_modules/react-dom") } },
  plugins: [{
    name: "sungold-preview-adapter",
    enforce: "pre",
    resolveId(id, importer) {
      if (importer === resolve(source, "App.tsx")) {
        if (id === "./components/Sidebar") return resolve(root, "shell.tsx");
        if (id === "./views/Library") return resolve(root, "library.tsx");
      }
      if (importer?.startsWith(source + sep) && resolve(dirname(importer), id) === api) {
        return resolve(root, "preview-api.ts");
      }
    },
    transform(code, id) {
      if (id === mock) {
        // Give the existing mock an empty, in-memory database on every reload.
        const read = "localStorage.getItem(KEY)";
        const write = "localStorage.setItem(KEY, JSON.stringify(db));";
        if (!code.includes(read) || !code.includes(write)) {
          throw new Error("Update the Sungold preview adapter for the browser mock's new storage implementation.");
        }
        return code.replace(read, "null").replace(write, "");
      }

    },
  }, react()],
  server: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true,
    fs: {
      allow: [root, source, resolve(root, "../node_modules"), resolve(root, "../package.json")],
      deny: [".env", ".env.*", "*.{crt,pem,key,db,sqlite}", "**/.git/**", "**/node_modules/.*/**"],
    },
    headers: {
      "Content-Security-Policy": "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; worker-src 'self' blob:; connect-src 'self' ws://127.0.0.1:4176; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
    },
  },
});
