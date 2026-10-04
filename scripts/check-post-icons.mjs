// Run with Node.js 24 after pnpm install: node scripts/check-post-icons.mjs
import assert from 'node:assert/strict';
import { mock } from 'node:test';
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
console.log(`Checked ${Object.keys(POST_ICONS).length} SVG icons and metadata fallbacks.`);
