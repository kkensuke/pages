// node scripts/check-photos.mjs — check discovery without rebuilding the site.
import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const source = await readFile(new URL('../app/photos/page.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const root = await mkdtemp(path.join(tmpdir(), 'photo-gallery-'));
try {
  const directory = path.join(root, 'public', 'photos');
  await mkdir(directory, { recursive: true });
  await copyFile(new URL('../public/photos/tokyo.jpeg', import.meta.url), path.join(directory, 'b_tokyo2026.jpeg'));
  await copyFile(new URL('../public/photos/berkeley.jpeg', import.meta.url), path.join(directory, 'a garden-2.JPG'));
  await copyFile(new URL('../public/photos/berkeley.jpeg', import.meta.url), path.join(directory, 'a garden-3.JPG'));
  await writeFile(path.join(directory, 'readme.txt'), 'Not a photo');
  await mkdir(path.join(directory, 'skip.jpg'));
  const context = { exports: {}, require, process: { cwd: () => root } };
  vm.runInNewContext(compiled, context);
  const render = async () => renderToStaticMarkup(await context.exports.default());
  const html = await render();
  const figures = [...html.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)].map(match => match[0]);
  assert.equal(figures.length, 3, 'Ignore non-images and directories');
  assert.match(figures[0], /<figcaption>A garden<\/figcaption>/, 'Sort and capitalize filenames');
  assert.match(figures[1], /<figcaption>A garden<\/figcaption>/, 'Numbered photos share the same caption');
  assert.match(figures[0], /href="\/photos\/a%20garden-2\.JPG"/, 'Encode original-image URLs');
  assert.match(figures[1], /href="\/photos\/a%20garden-3\.JPG"/, 'Keep distinct numbered file links');
  assert.match(figures[0], /width="1478" height="1108"/, 'Read landscape dimensions');
  assert.match(figures[2], /<figcaption>B_tokyo2026<\/figcaption>/, 'Keep digits without a hyphen');
  assert.match(figures[2], /width="3024" height="4032"/, 'Account for EXIF rotation');
  for (const figure of figures) {
    assert.match(figure, /target="_blank" rel="noopener noreferrer"/);
    assert.equal(figure.match(/<img\b[^>]*src="([^"]+)"/)?.[1], figure.match(/<a\b[^>]*href="([^"]+)"/)?.[1], 'Display the same original file as the full-size link');
    assert.doesNotMatch(figure, /\/_next\/image|\bsrcset=/i, 'Do not use re-encoded image variants');
  }
  assert.doesNotMatch(html, />Full size\b/);
  await writeFile(path.join(directory, 'c_added.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl8N2sAAAAASUVORK5CYII=', 'base64'));
  const withAddedPhoto = await render();
  assert.equal((withAddedPhoto.match(/<figcaption/g) || []).length, 4, 'Discover newly added photos');
  assert.match(withAddedPhoto, /width="1" height="1"/, 'Read PNG dimensions');
  await rm(path.join(directory, 'a garden-2.JPG'));
  await rm(path.join(directory, 'a garden-3.JPG'));
  assert.doesNotMatch(await render(), /A garden/, 'Drop removed photos');
  await rm(path.join(directory, 'b_tokyo2026.jpeg'));
  await rm(path.join(directory, 'c_added.png'));
  assert.equal(((await render()).match(/<figcaption/g) || []).length, 0, 'Allow an empty gallery');
} finally {
  await rm(root, { recursive: true, force: true });
}
console.log('PASS: file discovery, ordering, captions, encoded links, EXIF dimensions, additions, removals, and an empty gallery.');
