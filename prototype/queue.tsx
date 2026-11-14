import { useState } from "react";
import {
  ListTodo,
  FileText,
  CheckCheck,
  LoaderCircle,
  CircleAlert,
  RotateCcw,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useImports, stageText, type Job } from "../src/lib/imports";
import { useApp } from "../src/lib/store";
import { Sheet, IconButton } from "./ui";
export function ImportQueueCard() {
  const all = useImports((s) => s.jobs),
    retry = useImports((s) => s.retry),
    dismiss = useImports((s) => s.dismiss);
  const lang = useApp((s) => s.lang)();
  const jobs = all.filter((j) => j.spec.lang === lang);
  const [open, setOpen] = useState(false);
  const [samples, setSamples] = useState<Job[]>([]);
  const rows = [...jobs, ...samples.filter((j) => j.spec.lang === lang)];
  const active = rows.filter(
    (j) =>
      j.status === "running" || j.status === "waiting" || j.status === "model",
  ).length;
  function demo() {
    setSamples([
      {
        spec: {
          key: "sample-a",
          lang,
          title: "A walk through Bologna",
          image: "",
        },
        status: "running",
        stage: "transcribe",
        progress: 64,
      },
      {
        spec: {
          key: "sample-b",
          lang,
          title: "Letters from Bologna.epub",
          image: "",
        },
        status: "done",
        stage: "",
        progress: 100,
      },
      {
        spec: {
          key: "sample-c",
          lang,
          title: "Weekend listening.mp3",
          image: "",
        },
        status: "error",
        stage: "",
        progress: 0,
        error: "Sample interruption. Retry to preview the waiting state.",
      },
    ]);
  }
  return (
    <>
      <button
        className="queue-launcher"
        aria-label="Import queue"
        onClick={() => setOpen(true)}
      >
        <ListTodo size={16} />
        <span>Queue</span>
        {active > 0 && <b>{active}</b>}
      </button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Import queue"
        width={420}
        footer={
          <span className="queue-note">
            {active
              ? `${active} ${active === 1 ? "item" : "items"} in preparation`
              : "No active imports"}{" "}
            · Current language
          </span>
        }
      >
        <div className="queue-summary">
          <h3>Your next reads</h3>
          <p>Keep reading while your collection takes shape.</p>
        </div>
        {!rows.length ? (
          <div className="queue-empty">
            <ListTodo size={28} />
            <h3>All caught up</h3>
            <p>Imports will appear here with their progress.</p>
            <button className="btn soft" onClick={demo} hidden={import.meta.env.MODE === "desktop"}>
              Preview sample queue
            </button>
          </div>
        ) : (
          <div className="queue-items">
            {rows.map((job) => (
              <article className="queue-item" key={job.spec.key}>
                <span className="queue-file">
                  <FileText size={20} />
                </span>
                <div>
                  <strong>{job.spec.title}</strong>
                  <p>
                    {job.status === "done"
                      ? "Ready to read"
                      : job.status === "error"
                        ? job.error
                        : job.status === "model"
                          ? "Waiting for a transcription model"
                          : stageText(job.stage)}
                  </p>
                  {job.status === "running" && (
                    <progress
                      aria-label={`${job.spec.title} progress`}
                      max={100}
                      value={job.progress ?? undefined}
                    />
                  )}
                  <div className="queue-item-actions">
                    {job.status === "done" && job.lessonId && (
                      <button
                        className="btn sm soft"
                        onClick={() => {
                          useApp.getState().openLesson(job.lessonId!);
                          setOpen(false);
                        }}
                      >
                        Read
                        <ArrowUpRight size={13} />
                      </button>
                    )}
                    {job.status === "error" && (
                      <button
                        className="btn sm soft"
                        onClick={() =>
                          job.spec.key.startsWith("sample-")
                            ? setSamples((s) =>
                                s.map((j) =>
                                  j.spec.key === job.spec.key
                                    ? {
                                        ...j,
                                        status: "waiting",
                                        error: undefined,
                                      }
                                    : j,
                                ),
                              )
                            : retry(job.spec.key)
                        }
                      >
                        <RotateCcw size={13} />
                        Retry
                      </button>
                    )}
                    {job.status !== "running" && (
                      <button
                        className="btn sm ghost"
                        onClick={() =>
                          job.spec.key.startsWith("sample-")
                            ? setSamples((s) =>
                                s.filter((j) => j.spec.key !== job.spec.key),
                              )
                            : dismiss(job.spec.key)
                        }
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
                {job.status === "done" ? (
                  <CheckCheck size={16} />
                ) : job.status === "error" ? (
                  <CircleAlert size={16} />
                ) : (
                  <LoaderCircle size={16} />
                )}
              </article>
            ))}
          </div>
        )}
      </Sheet>
    </>
  );
}
