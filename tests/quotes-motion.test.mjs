import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('class Quotes {');
const end = html.indexOf('\n/* ---------- Lightbox ---------- */', start);
assert.ok(start > 0 && end > start, 'The real Quotes controller must be present');
const source = html.slice(start, end);

function fixture(reduced = false) {
  let nextId = 0;
  const intervals = new Map();
  const documentEvents = {};
  function element() {
    const events = {};
    const attrs = {};
    const children = [];
    return {
      events, attrs, children, hidden: false, textContent: '',
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(name, value) { attrs[name] = value; },
      addEventListener(name, fn) { events[name] = fn; },
      appendChild(child) { children.push(child); },
      contains(target) { return Boolean(target?.withinQuotes); },
    };
  }
  const nodes = Object.fromEntries(
    ['quote-text', 'quote-idx', 'quote-dots', 'quote-toggle', 'quotes'].map(id => [id, element()])
  );
  const stage = element();
  const document = {
    hidden: false,
    getElementById: id => nodes[id],
    querySelector: selector => selector === '.q-stage' ? stage : null,
    createElement: () => element(),
    addEventListener(name, fn) { documentEvents[name] = fn; },
  };
  const context = {
    document,
    Motion: { reduced },
    setInterval(fn, delay) {
      assert.equal(delay, 5200);
      const id = ++nextId;
      intervals.set(id, fn);
      return id;
    },
    clearInterval(id) { intervals.delete(id); },
    setTimeout(fn) { fn(); },
  };
  runInNewContext(source + '\nglobalThis.TestQuotes = Quotes;', context);
  const controller = new context.TestQuotes();
  return { controller, nodes, stage, document, documentEvents, intervals };
}

test('hover pauses rotation and leaving resumes with one timer', () => {
  const f = fixture();
  assert.equal(f.intervals.size, 1);
  f.nodes.quotes.events.mouseenter();
  assert.equal(f.intervals.size, 0);
  f.nodes.quotes.events.mouseleave();
  assert.equal(f.intervals.size, 1);
  f.nodes.quotes.events.mouseleave();
  assert.equal(f.intervals.size, 1);
});

test('keyboard focus and hidden tab pause rotation until safe to resume', () => {
  const f = fixture();
  f.nodes.quotes.events.focusin();
  assert.equal(f.intervals.size, 0);
  f.nodes.quotes.events.focusout({ relatedTarget: { withinQuotes: true } });
  assert.equal(f.intervals.size, 0);
  f.nodes.quotes.events.focusout({ relatedTarget: null });
  assert.equal(f.intervals.size, 1);
  f.document.hidden = true;
  f.documentEvents.visibilitychange();
  assert.equal(f.intervals.size, 0);
  f.document.hidden = false;
  f.documentEvents.visibilitychange();
  assert.equal(f.intervals.size, 1);
});

test('user pause remains active through hover and manual navigation', () => {
  const f = fixture();
  f.nodes['quote-toggle'].events.click();
  assert.equal(f.controller.paused, true);
  assert.equal(f.nodes['quote-toggle'].attrs['aria-pressed'], 'true');
  assert.equal(f.intervals.size, 0);
  f.nodes.quotes.events.mouseenter();
  f.nodes.quotes.events.mouseleave();
  assert.equal(f.intervals.size, 0);
  f.nodes['quote-dots'].children[1].events.click();
  assert.equal(f.stage.attrs['aria-live'], 'polite');
  assert.equal(f.nodes['quote-dots'].children[1].attrs['aria-current'], 'true');
  f.nodes['quote-toggle'].events.click();
  assert.equal(f.intervals.size, 1);
});

test('reduced motion never starts an interval or shows redundant toggle', () => {
  const f = fixture(true);
  assert.equal(f.intervals.size, 0);
  assert.equal(f.nodes['quote-toggle'].hidden, true);
  f.nodes['quote-dots'].children[2].events.click();
  assert.equal(f.nodes['quote-text'].textContent, f.controller.data[2]);
});

test('markup uses a labelled group, explicit pause and 44px targets', () => {
  assert.match(html, /id="quote-dots" role="group" aria-label="Seleccionar frase"/);
  assert.match(html, /id="quote-toggle"[^>]*aria-pressed="false"/);
  assert.match(html, /\.q-dots button\s*\{\s*width:44px;height:44px/);
  assert.match(html, /<div class="q-stage" aria-live="off">/);
});
