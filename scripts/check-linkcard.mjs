// node scripts/check-linkcard.mjs — no external requests or new dependencies.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const source = await readFile(new URL('../components/blog/Admonition/LinkCard.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
}).outputText;
let response = { ok: true, json: async () => ({ status: 'success', data: { title: 'Preview title', description: 'Preview description', image: { url: 'https://example.com/preview.jpg' } } }) };
let calls = 0;
const context = {
  exports: {}, require, URL, AbortSignal, console: { warn() {} },
  fetch: async (url, options) => {
    calls++;
    assert.equal(new URL(url).searchParams.get('url'), 'https://example.com/?a=1&b=2');
    assert.equal(options.next.revalidate, 86400);
    assert.ok(options.signal instanceof AbortSignal);
    if (response instanceof Error) throw response;
    return response;
  },
};
vm.runInNewContext(compiled, context);
const card = context.exports.default;
const render = async children => renderToStaticMarkup(await card({ children }));
const url = 'https://example.com/?a=1&b=2';
const html = await render(React.createElement('p', null, url));
assert.match(html, /Preview title/);
assert.match(html, /Preview description/);
assert.match(html, /https:\/\/example.com\/preview.jpg/);
assert.match(html, /target="_blank"/);
for (response of [new Error('Timeout'), { ok: false }, { ok: true, json: async () => ({ status: 'fail' }) }]) {
  const fallback = await render(url);
  assert.match(fallback, />example.com<\/p>/);
  assert.match(fallback, /domain=example.com/);
}
const beforeInvalid = calls;
assert.match(await render('javascript:alert(1)'), /Invalid URL format/);
assert.match(await render('https://'), /Invalid URL format/);
assert.equal(calls, beforeInvalid);
console.log('PASS: server-rendered metadata, cache policy, encoded URL, failure fallback, and URL validation.');
