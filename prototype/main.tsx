import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/inter";
import "@fontsource-variable/inter/wght-italic.css";
import "@fontsource-variable/literata";
import "@fontsource-variable/literata/wght-italic.css";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "../src/styles/app.css";
import "../src/styles/views.css";
import "../src/styles/reader.css";
import "../src/styles/onboarding.css";
import "../src/styles/chat.css";
import "../src/styles/guide.css";
import "../src/styles/discover.css";
import "../src/styles/preview.css";
import "../src/styles/news.css";
import "../src/styles/tour.css";
import "../src/styles/mobile.css";
import "./style.css";
import { App } from "../src/App";
import { seedPreview } from "./preview-api";

const design = new URLSearchParams(location.search).get("design") === "light" ? "folio" : "studio";
document.documentElement.dataset.design = design;
document.documentElement.dataset.theme = design === "studio" ? "dark" : "light";

// The demo can show external actions, but never opens a real account, service, or URL.
window.open = () => null;
document.addEventListener("click", event => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (link instanceof HTMLAnchorElement && /^(https?:|mailto:)/.test(link.protocol)
    && link.origin !== location.origin) event.preventDefault();
}, true);

const root = createRoot(document.getElementById("root")!);
seedPreview(design).then(() => root.render(<App />)).catch(error => {
  console.error(error);
  root.render(<p>The sample workspace could not load. Refresh to try again.</p>);
});
