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
const [home, blog, second, math, search, english, taggedSearch, empty, photos, article, middleArticle] = await Promise.all([
  '/', '/blog', '/blog?page=2', '/blog/tags/Math', '/blog?q=%EF%BC%B3%EF%BC%AC%EF%BC%A9%EF%BC%AE%EF%BC%AB',
  '/blog?lang=en&q=slink', '/blog/tags/CLI?lang=en&q=slink', '/blog?q=there-is-no-such-post', '/photos', '/blog/posts/slink.en', '/blog/posts/yttext.en',
].map(read));
assert.equal(count(home), 0);
assert.doesNotMatch(home, /<br\b|Recent writing|Explore my research/);
assert.match(home, /Research &amp; notes/);
assert.doesNotMatch(home, /[ぁ-んァ-ン一-龯]/);
assert.match(home, /href="mailto:/);
assert.equal(count(blog), pageSize);
assert.doesNotMatch(blog, /Notes on mathematics, code, and everyday learning|数学、コード、日々の学び/);
assert.equal(count(second), pageSize);
const postLinks = html => [...html.matchAll(/href="(\/blog\/posts\/[^\"]+)"/g)].map(match => match[1]);
assert.ok(postLinks(blog).every(href => !postLinks(second).includes(href)), 'Adjacent pages must contain different articles');
assert.equal(count(math), 2);
assert.doesNotMatch(math, /aria-label="ページ切り替え"/);
assert.match(math.match(/<a\b[^>]*aria-current="page"[^>]*>Math<\/a>/)?.[0] || '', /href="\/blog"/, 'Selected tag must link back to the unfiltered listing');
for (const path of ['/', '/blog', '/photos']) assert.ok(home.slice(home.indexOf('<footer')).includes(`href="${path}"`), `Footer must link to ${path}`);
assert.equal(count(search), 1);
assert.match(search, /href="\/blog\/posts\/slink"/);
assert.equal(count(english), 1);
assert.match(english, /href="\/blog\/posts\/slink.en"/);
assert.match(english, /aria-label="Clear search text"/);
assert.equal(count(taggedSearch), 1);
assert.match(taggedSearch.match(/<a\b[^>]*aria-current="page"[^>]*>CLI<\/a>/)?.[0] || '', /href="\/blog\?lang=en&amp;q=slink"/, 'Tag reset must preserve language and search');
assert.equal(count(empty), 0);
assert.match(empty, /記事が見つかりませんでした/);
assert.equal((photos.match(/<figcaption/g) || []).length, 4);
assert.equal((article.match(/class="article-title"/g) || []).length, 1);
assert.match(article, /aria-label="Copy code"/);
assert.match(article, /aria-label="Read Markdown on GitHub"/);
assert.match(article, /Read in Japanese/);
assert.match(article, /class="reading-column article-toc group"/);
const adjacent = article.match(/<nav\b[^>]*aria-label="Article navigation"[\s\S]*?<\/nav>/)?.[0] || '';
assert.match(adjacent, /Older article/);
assert.doesNotMatch(adjacent, /Newer article/, 'The newest article must only offer an older article');
const middleNavigation = middleArticle.match(/<nav\b[^>]*aria-label="Article navigation"[\s\S]*?<\/nav>/)?.[0] || '';
assert.deepEqual(postLinks(middleNavigation), ['/blog/posts/slink.en', '/blog/posts/brew_CLI.en'], 'Navigation must put the newer article before the older article');
console.log('PASS: Home, footer links, pagination, tag reset, search, language, photos, and article navigation.');
