import assert from 'node:assert/strict';

// Run against `pnpm dev` or `pnpm start`: node scripts/check-site.mjs [origin] [postsPerPage]
const origin = process.argv[2] || 'http://localhost:3000';
const pageSize = Number(process.argv[3] || 10);
async function read(path) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
}
const count = html => (html.match(/class="post-preview"/g) || []).length;
const [home, blog, second, math, search, english, empty, photos, article] = await Promise.all([
  '/', '/blog', '/blog?page=2', '/blog/tags/Math', '/blog?q=%EF%BC%B3%EF%BC%AC%EF%BC%A9%EF%BC%AE%EF%BC%AB',
  '/blog?lang=en&q=slink', '/blog?q=there-is-no-such-post', '/photos', '/blog/posts/slink.en',
].map(read));
assert.equal(count(home), 3);
assert.match(home, /Research &amp; notes/);
assert.doesNotMatch(home, /[ぁ-んァ-ン一-龯]/);
assert.match(home, /href="mailto:/);
assert.equal(count(blog), pageSize);
assert.equal(count(second), pageSize);
assert.equal(count(math), 2);
assert.doesNotMatch(math, /aria-label="ページ切り替え"/);
assert.equal(count(search), 1);
assert.match(search, /href="\/blog\/posts\/slink"/);
assert.equal(count(english), 1);
assert.match(english, /href="\/blog\/posts\/slink.en"/);
assert.equal(count(empty), 0);
assert.match(empty, /記事が見つかりませんでした/);
assert.equal((photos.match(/<figcaption/g) || []).length, 4);
assert.equal((article.match(/class="article-title /g) || []).length, 1);
assert.match(article, /aria-label="Copy code"/);
console.log('PASS: English Home, contact, pagination, tags, search, language, empty results, photos, and article rendering.');
