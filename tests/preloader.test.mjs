import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const begin = html.indexOf("class Preloader {");
const end = html.indexOf("\n/* ---------- Cursor ---------- */", begin);
assert.ok(begin >= 0 && end > begin, "Original Michelle preloader must exist");
const source = html.slice(begin, end);

function fixture(reduced = false) {
  const callbacks = new Map(), timers = new Map();
  let current = 0, removed = 0, done = 0, loaderDone = 0;
  const element = {
    addEventListener(name, fn) { callbacks.set(name, fn); },
    removeEventListener(name) { callbacks.delete(name); },
    remove() { removed++; },
  };
  const document = {
    getElementById(id) {
      if (id === "preloader") return element;
      if (id === "pl-count") return { textContent: "" };
      if (id === "pl-bar-fill") return { style: {} };
      return null;
    },
    body: { classList: { add(key) { if (key === "loader-done") loaderDone++; } } },
  };
  const vm = {
    document, Motion: { reduced }, performance: { now: () => 0 },
    requestAnimationFrame(callback) { callbacks.set("frame", callback); },
    setTimeout(callback) { const key = ++current; timers.set(key, callback); return key; },
    clearTimeout(key) { timers.delete(key); },
  };
  runInNewContext(source + "\nglobalThis.ExportPreloader=Preloader", vm);
  const loader = new vm.ExportPreloader(() => done++);
  return {
    loader,
    events: callbacks,
    get stats() { return { done, removed, loaderDone }; },
    runTimers() { for (const [id, callback] of [...timers]) { timers.delete(id); callback(); } },
    fireTransition(event) { callbacks.get("transitionend")?.(event); },
    element,
  };
}

test("normal transition closes the overlay exactly once", () => {
  const f = fixture();
  f.loader.finish(false);
  assert.equal(f.stats.loaderDone, 1);
  f.fireTransition({ target: f.element, propertyName: "opacity" });
  assert.equal(f.stats.done, 0, "unrelated property cannot close the scene");
  f.fireTransition({ target: f.element, propertyName: "transform" });
  assert.equal(f.stats.done, 1);
  f.runTimers();
  f.loader.finish(false);
  assert.deepEqual(f.stats, { done: 1, removed: 1, loaderDone: 1 });
});
test("missing transitionend still releases visitor via bounded fallback", () => {
  const f = fixture();
  f.loader.finish(false);
  f.runTimers();
  assert.equal(f.stats.done, 1);
  assert.equal(f.stats.removed, 1);
});
test("reduced motion directly removes the loader and does not start animation", () => {
  const f = fixture(true);
  f.loader.start();
  assert.equal(f.stats.done, 1);
  assert.equal(f.stats.removed, 1);
  assert.equal(f.events.has("frame"), false);
});
test("preloader starts before optional visual modules and does not mix Belentani brand", () => {
  const app = html.slice(html.indexOf("class App {"));
  assert.ok(app.indexOf("new Preloader(") < app.indexOf("new ImageGuard()") || app.includes("for (const Module of [ImageGuard"));
  assert.match(app, /catch \(error\)/);
  assert.match(html, /Michelle Relayze/);
});
