import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Run after `pnpm build`, against `pnpm start`: node scripts/check-site.mjs [origin] [postsPerPage]
const origin = process.argv[2] || 'http://localhost:3000';
const pageSize = Number(process.argv[3] || 10);
async function read(path) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
}
const count = html => (html.match(/class="post-preview"/g) || []).length;
const [home, blog, second, math, search, english, taggedSearch, empty, photos, article, middleArticle, japaneseArticle] = await Promise.all([
  '/', '/blog', '/blog?page=2', '/blog/tags/Math', '/blog?q=%EF%BC%B3%EF%BC%AC%EF%BC%A9%EF%BC%AE%EF%BC%AB',
  '/blog?lang=en&q=slink', '/blog/tags/CLI?lang=en&q=slink', '/blog?q=there-is-no-such-post', '/photos', '/blog/posts/slink.en', '/blog/posts/yttext.en', '/blog/posts/slink',
].map(read));
assert.equal(count(home), 0);
assert.doesNotMatch(home, /<br\b|Recent writing|Explore my research/);
assert.match(home, /Research &amp; notes/);
assert.doesNotMatch(home, /[ぁ-んァ-ン一-龯]/);
assert.match(home, /href="mailto:/);
assert.equal(count(blog), pageSize);
assert.doesNotMatch(blog.slice(blog.indexOf('<body')), /Notes on mathematics, code, and everyday learning|数学、コード、日々の学び/);
const blogHeading = blog.match(/<header\b[^>]*class="page-heading blog-heading[^>]*>[\s\S]*?<\/header>/)?.[0] || '';
assert.match(blogHeading, /role="search"/);
assert.match(blogHeading, /href="\/blog"/);
assert.match(blogHeading, /aria-label="Blog language"/);
assert.match(blogHeading, /aria-expanded="false" aria-controls="blog-search-form"/);
assert.match(blogHeading, /<form\b[^>]*id="blog-search-form"[^>]*hidden=""/);
assert.ok(blogHeading.indexOf('class="blog-search-toggle"') < blogHeading.indexOf('aria-label="Blog language"'), 'Search toggle must precede language selection');
assert.doesNotMatch(blog, /新しい順|Newest first/);
for (const preview of blog.matchAll(/<article class="post-preview">[\s\S]*?<\/article>/g)) {
  assert.doesNotMatch(preview[0], /<img\b/);
  assert.doesNotMatch(preview[0], /lucide-arrow-right/);
}
assert.equal(count(second), pageSize);
const postLinks = html => [...html.matchAll(/href="(\/blog\/posts\/[^\"]+)"/g)].map(match => match[1]);
assert.ok(postLinks(blog).every(href => !postLinks(second).includes(href)), 'Adjacent pages must contain different articles');
assert.equal(count(math), Math.min(pageSize, 2));
if (pageSize >= 2) assert.doesNotMatch(math, /aria-label="ページ切り替え"/);
assert.match(math.match(/<a\b[^>]*aria-current="page"[^>]*>Math<\/a>/)?.[0] || '', /href="\/blog"/, 'Selected tag must link back to the unfiltered listing');
for (const path of ['/', '/blog', '/photos']) assert.ok(home.slice(home.indexOf('<footer')).includes(`href="${path}"`), `Footer must link to ${path}`);
const footer = home.slice(home.indexOf('<footer'));
assert.ok(footer.indexOf('href="/policy"') < footer.indexOf('<nav'), 'Privacy link must sit with the copyright');
assert.ok(footer.indexOf('GitHub') < footer.indexOf('Contact'), 'GitHub must precede Contact');
assert.equal(count(search), 1);
assert.match(search, /href="\/blog\/posts\/slink"/);
assert.equal(count(english), 1);
assert.match(english, /href="\/blog\/posts\/slink.en"/);
assert.match(english, /aria-label="Clear search text"/);
assert.match(english, /aria-expanded="true" aria-controls="blog-search-form"/);
assert.doesNotMatch(english.match(/<form\b[^>]*id="blog-search-form"[^>]*>/)?.[0] || '', /hidden=/, 'Existing searches must remain visible');
assert.equal(count(taggedSearch), 1);
assert.match(taggedSearch.match(/<a\b[^>]*aria-current="page"[^>]*>CLI<\/a>/)?.[0] || '', /href="\/blog\?lang=en&amp;q=slink"/, 'Tag reset must preserve language and search');
assert.equal(count(empty), 0);
assert.match(empty, /記事が見つかりませんでした/);
const photoFiles = (await readdir(new URL('../public/photos/', import.meta.url), { withFileTypes: true }))
  .filter(entry => entry.isFile() && /\.(jpe?g|png|webp|gif)$/i.test(entry.name));
assert.equal((photos.match(/<figcaption/g) || []).length, photoFiles.length);
assert.equal((article.match(/class="article-title"/g) || []).length, 1);
assert.match(article, /aria-label="Copy code"/);
assert.match(article, /aria-label="Read Markdown on GitHub"/);
assert.match(article, /Read in Japanese/);
for (const [html, slug] of [[article, 'slink.en'], [japaneseArticle, 'slink']]) {
  const markdownLink = html.match(/<a\b[^>]*title="Markdown in GitHub"[^>]*>[\s\S]*?<\/a>/)?.[0] || '';
  assert.ok(markdownLink.includes(`href="https://github.com/kkensuke/pages/blob/main/posts/${slug}.md?plain=1"`), 'Markdown link must match the displayed article language');
  assert.match(markdownLink, /lucide-github/, 'Markdown link must keep its GitHub icon');
  assert.match(html, /<nav class="tag-list"/, 'Listing and article headers must share tag styling');
}
assert.match(article, /<aside class="article-toc">/);
assert.match(article, /aria-label="Table of contents"/);
const contents = article.match(/<aside class="article-toc">[\s\S]*?<\/aside>/)?.[0] || '';
assert.match(contents, /<details\b[^>]*class="[^"]*\btoc-disclosure\b/);
assert.doesNotMatch(contents, /<details\b[^>]*\bopen(?:[\s=>])/);
assert.match(contents, /<summary\b[^>]*class="[^"]*\btoc-summary\b/);
const adjacent = article.match(/<nav\b[^>]*aria-label="Article navigation"[\s\S]*?<\/nav>/)?.[0] || '';
assert.match(adjacent, /Older article/);
assert.doesNotMatch(adjacent, /Newer article/, 'The newest article must only offer an older article');
const middleNavigation = middleArticle.match(/<nav\b[^>]*aria-label="Article navigation"[\s\S]*?<\/nav>/)?.[0] || '';
assert.deepEqual(postLinks(middleNavigation), ['/blog/posts/slink.en', '/blog/posts/brew_CLI.en'], 'Navigation must put the newer article before the older article');
const manifest = JSON.parse(await readFile(new URL('../.next/prerender-manifest.json', import.meta.url), 'utf8'));
const articles = Object.keys(manifest.routes).filter(path => path.startsWith('/blog/posts/'));
let codeBlocks = 0;
for (const path of articles) {
  const html = await read(path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one article title`);
  assert.ok(html.includes('reading-column post prose article-content'), `${path}: Markdown rendered`);
  assert.ok(html.includes('aria-label="Table of contents"'), `${path}: original contents rendered`);
  for (const sourceLink of html.matchAll(/<a\b[^>]*title="Source on GitHub"[^>]*>Source on GitHub<\/a>/g)) {
    assert.match(sourceLink[0], /href="https:\/\/github\.com\//, `${path}: code source must link to GitHub`);
    assert.ok(html.includes(`<p>${sourceLink[0]}</p>`), `${path}: code source must have its own caption paragraph`);
  }
  if (path === '/blog/posts/code.en') assert.match(html, /title="Source on GitHub"/, 'GitHub code example must retain its source caption');
  for (const [, attributes, content] of html.matchAll(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/g)) {
    const preFont = attributes.match(/font-family:([^;\"]+)/)?.[1];
    const codeFont = content.match(/<code\b[^>]*font-family:([^;\"]+)/)?.[1];
    assert.ok(preFont, `${path}: explicit code font`);
    assert.equal(preFont, codeFont, `${path}: pre and code must use the same font`);
    codeBlocks++;
  }
}
assert.ok(codeBlocks > 0);
console.log(`PASS: Home, footer, pagination, tags, search, photos, navigation, ${articles.length} articles, and ${codeBlocks} code blocks.`);
