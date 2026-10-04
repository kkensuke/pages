// Run with Node.js 24 after pnpm install: node scripts/check-post-icons.mjs
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { mock } from 'node:test';
import matter from 'gray-matter';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { POST_ICONS, parsePostIcon } from '../lib/blog/icons.ts';

const warning = mock.method(console, 'warn', () => {});
try {
  assert.equal(parsePostIcon(undefined, 'example.md'), 'file-text');
  assert.equal(parsePostIcon(' link ', 'example.md'), 'link');
  for (const [name, Icon] of Object.entries(POST_ICONS)) {
    assert.equal(parsePostIcon(name, 'example.md'), name);
    assert.match(renderToStaticMarkup(createElement(Icon)), /^<svg\b/);
  }
  assert.equal(warning.mock.callCount(), 0);
  for (const value of [null, 42, {}, '', 'missing-icon', 'constructor', '__proto__']) {
    assert.equal(parsePostIcon(value, 'example.md'), 'file-text');
  }
  assert.equal(warning.mock.callCount(), 7);
} finally {
  mock.restoreAll();
}

const directory = new URL('../posts/', import.meta.url);
const icons = new Map();
for (const file of readdirSync(directory).filter(file => file.endsWith('.md'))) {
  const source = readFileSync(new URL(file, directory), 'utf8');
  if (!source.trim()) continue;
  const { data } = matter(source);
  assert.ok(Object.hasOwn(POST_ICONS, data.icon), `${file}: choose a registered icon`);
  icons.set(file, data.icon);
}
for (const [file, icon] of icons) {
  if (!file.endsWith('.en.md')) continue;
  const japanese = file.replace(/\.en\.md$/, '.md');
  if (icons.has(japanese)) assert.equal(icon, icons.get(japanese), `${file}: language pair icons must match`);
}
console.log(`PASS: ${icons.size} articles, language pairs, ${Object.keys(POST_ICONS).length} SVG icons, and metadata fallbacks.`);
