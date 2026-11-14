// Preview-only presentation adapters. Original component state and handlers remain intact.
function replaceOnce(code, from, to) {
  if (!code.includes(from))
    throw new Error(
      `Sungold prototype adapter no longer matches: ${from.slice(0, 90)}`,
    );
  return code.replace(from, to);
}
export function adaptReader(code, root) {
  code =
    `import { ReaderToolbar, ReaderControls, ReaderPanelToggle, PrototypeAppearance } from ${JSON.stringify(root + "reader.tsx")};\n` +
    code;
  const start = code.indexOf(
    '        <div className="reader-top drag" data-tauri-drag-region>',
  );
  const end = code.indexOf("\n\n        {isVideo && (", start);
  if (start < 0 || end < 0) throw new Error("Reader toolbar boundary changed");
  let bar = code.slice(start, end);
  bar = replaceOnce(
    bar,
    '<div className="reader-top drag" data-tauri-drag-region>',
    "<ReaderToolbar>",
  );
  bar = bar.slice(0, bar.lastIndexOf("</div>")) + "</ReaderToolbar>";
  const lookStart = bar.indexOf(
    '          {!cinema && (\n            <div className="look-anchor',
  );
  const lookEnd = bar.indexOf('          <button type="button"', lookStart);
  if (lookStart < 0 || lookEnd < 0)
    throw new Error("Appearance boundary changed");
  bar =
    bar.slice(0, lookStart) +
    "          <ReaderControls onAppearance={() => setLookOpen(v => !v)}/><PrototypeAppearance open={lookOpen} onOpenChange={setLookOpen}/>\n" +
    bar.slice(lookEnd);
  const panelStart = bar.indexOf(
    '          {!cinema && (\n            <button\n              className="icon-btn no-drag panel-btn"',
  );
  if (panelStart < 0) throw new Error("Panel boundary changed");
  bar =
    bar.slice(0, panelStart) +
    "          <ReaderPanelToggle/>\n        </ReaderToolbar>";
  bar = replaceOnce(bar, "{floating && (", "{true && (");
  code = code.slice(0, start) + bar + code.slice(end);
  return code;
}
export function adaptTraining(code) {
  code = replaceOnce(
    code,
    '          <div className="training-toolbar">\n            <button className="btn soft" disabled={!!busy || !unsorted.length}',
    '          <div className="dojo-setup"><div className="training-toolbar">\n            <button className="btn soft" disabled={!!busy || !unsorted.length}',
  );
  code = replaceOnce(
    code,
    '          <div className="training-list">\n            {[...tiers',
    '          </div><div className="training-list dojo-collection">\n            {[...tiers',
  );
  return code;
}
export function adaptProgress(code) {
  code = replaceOnce(
    code,
    '      <div className="titlebar drag" data-tauri-drag-region />',
    "",
  );
  code = replaceOnce(
    code,
    "          <StreakHero st={st} onGoal={load} />",
    "",
  );
  code = replaceOnce(
    code,
    "          <ActivityChart st={st} period={period} metric={metric} setMetric={setMetric} />",
    '          <div className="progress-workbench"><ActivityChart st={st} period={period} metric={metric} setMetric={setMetric} /><StreakHero st={st} onGoal={load} /></div>',
  );
  return code;
}
