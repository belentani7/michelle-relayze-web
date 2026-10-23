import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
assert.ok(html.includes('role="group" aria-label="Elegir frase"'));
console.log('Quote controls OK');
