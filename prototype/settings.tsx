import { PageHeading } from "./ui";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Settings as OriginalSettings } from "../src/views/Settings";
import { useApp, type SettingsTab } from "../src/lib/store";
import { AppearanceControls } from "./appearance";
const groups: { name: string; items: [SettingsTab, string, string][] }[] = [
  {
    name: "Your workspace",
    items: [
      ["general", "General", "Theme, interface and library"],
      ["profile", "Profile", "Your name and preferences"],
      ["langs", "Languages", "Study languages and dictionaries"],
    ],
  },
  {
    name: "Reading & learning",
    items: [
      ["reading", "Reading", "Typography, page and interactions"],
      ["voice", "Voice & audio", "Pronunciation and read aloud"],
      ["discover", "Discovery", "Sources and learning level"],
      ["podcasts", "Podcasts", "Personal listening lessons"],
    ],
  },
  {
    name: "Intelligence",
    items: [
      ["ai", "AI & models", "Connections, task providers and downloads"],
      ["videos", "Video tools", "Online video and captions"],
    ],
  },
  {
    name: "Data & application",
    items: [
      ["backup", "Backups", "Save and restore your collection"],
      ["storage", "Storage", "Manage local files"],
      ["lingq", "LingQ", "Import and integration"],
      ["about", "About & credits", "Version, source and licences"],
    ],
  },
];
export function Settings() {
  const tab = useApp((s) => s.settingsTab);
  const [query, setQuery] = useState("");
  const current = groups.flatMap((g) => g.items).find((i) => i[0] === tab)!;
  return (
    <div className="preferences">
      <PageHeading
        title="Settings"
        description="Your workspace, your preferences."
      >
        <label className="preferences-search">
          <Search size={16} />
          <input
            aria-label="Find a setting"
            placeholder="Find a setting…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </PageHeading>
      <div className="preferences-layout">
        <nav aria-label="Settings categories">
          {groups.map((g) => (
            <section key={g.name}>
              <h2>{g.name}</h2>
              {g.items
                .filter((i) =>
                  i.join(" ").toLowerCase().includes(query.toLowerCase()),
                )
                .map(([id, label]) => (
                  <button
                    key={id}
                    aria-current={tab === id ? "page" : undefined}
                    onClick={() => useApp.getState().openSettings(id)}
                  >
                    {label}
                    {tab === id && <ArrowUpRight size={14} />}
                  </button>
                ))}
            </section>
          ))}
          {!groups
            .flatMap((g) => g.items)
            .some((i) =>
              i.join(" ").toLowerCase().includes(query.toLowerCase()),
            ) && <p>No matching settings.</p>}
        </nav>
        <main className="preferences-detail" key={tab}>
          <header>
            <h2>{current?.[1]}</h2>
            <p>{current?.[2]}</p>
          </header>
          {tab === "reading" && <AppearanceControls />}
          {tab === "general" ? (
            <GeneralPreferences />
          ) : (
            <div
              className={`preserved-settings ${tab === "reading" ? "reading-settings" : ""}`}
            >
              <OriginalSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function GeneralPreferences() {
  const s = useApp((s) => s.settings),
    set = useApp((s) => s.setSetting);
  return (
    <div className="general-preferences">
      <section className="preference-section">
        <h3>Interface</h3>
        <label className="general-row">
          <span>
            Display language
            <small>
              Also used for translations and dictionary explanations.
            </small>
          </span>
          <select
            aria-label="Display language"
            value={s.ui_lang || "en"}
            onChange={(e) => void set("ui_lang", e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </section>
      <section className="preference-section">
        <h3>Application theme</h3>
        <div className="theme-choices">
          {["system", "light", "dark"].map((theme) => (
            <button
              key={theme}
              aria-pressed={s.theme === theme}
              onClick={() => void set("theme", theme)}
            >
              <span className={"theme-sample " + theme}>
                <i />
                <b />
                <b />
              </span>
              <span>
                {theme === "system"
                  ? "Match system"
                  : theme === "light"
                    ? "Light"
                    : "Dark"}
              </span>
            </button>
          ))}
        </div>
        <p className="preference-note">
          The exploration shell currently previews the dark palette. Your theme
          choice is retained for the underlying application.
        </p>
      </section>
      <section className="preference-section">
        <h3>Library</h3>
        <label className="general-row">
          <span>
            Collection density
            <small>
              Keep more covers in view, or switch to a compact list.
            </small>
          </span>
          <select
            aria-label="Collection density"
            value={s.library_view || "large"}
            onChange={(e) => void set("library_view", e.target.value)}
          >
            <option value="large">Comfortable covers</option>
            <option value="small">Compact covers</option>
            <option value="list">List</option>
          </select>
        </label>
      </section>
    </div>
  );
}
