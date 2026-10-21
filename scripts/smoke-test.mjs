import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const assetPaths = [...html.matchAll(/<(?:img|script|link)\b[^>]*?\b(?:src|href)=["']([^"'#]+)["']/gi)]
  .map(m => m[1])
  .filter(p => p && !/^(?:https?:|data:|\/\/)/i.test(p));

for (const asset of assetPaths) {
  assert.ok(!asset.includes('..'), 'unsafe relative asset: ' + asset);
  assert.ok(existsSync(resolve(root, decodeURIComponent(asset))), 'missing asset: ' + asset);
}

const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m => m[1]));
const anchors = [...html.matchAll(/<a\b[^>]*?\bhref=["']#([^"']+)["']/gi)].map(m => m[1]);
for (const id of anchors) {
  assert.ok(ids.has(id), 'anchor target missing: #' + id);
}
for (const m of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
  assert.match(m[0], /rel=["'][^"']*noopener/i, 'external tab missing noopener');
}
const socialImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];
assert.equal(socialImage, 'https://michelle-relayze-web.vercel.app/images/hero.jpg', 'social image must use canonical Vercel asset');
assert.ok(existsSync(resolve(root, 'images/hero.jpg')), 'social image must exist in the repository');
assert.match(html, /<section\s+id="musica"/, 'music chapter must be present');
assert.match(html, /id="burger"[^>]*aria-controls="mnav"/, 'mobile navigation needs aria-controls');
assert.doesNotMatch(html, /<section\s+id="github"/, 'developer tutorial must not be in the artist site');
assert.doesNotMatch(html, /new GitHubExporter\(\)/, 'deleted UI must not be initialized');
assert.match(html, /prefers-reduced-motion\s*:\s*reduce/, 'reduced motion must be supported');
const site = 'https://michelle-relayze-web.vercel.app/';
assert.match(html, /<link rel="canonical" href="https:\/\/michelle-relayze-web\.vercel\.app\/"/, 'missing canonical URL');
assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large"/, 'missing crawl directive');
assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, 'social preview card must be configured');
assert.ok(existsSync(resolve(root, 'favicon.svg')), 'missing brand favicon');
const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
assert.ok(robots.includes('Sitemap: ' + site + 'sitemap.xml'), 'robots sitemap does not match canonical domain');
assert.ok(sitemap.includes('<loc>' + site + '</loc>'), 'sitemap and canonical must match');
console.log('Michelle smoke OK:', assetPaths.length, 'local assets and', anchors.length, 'section links checked');
