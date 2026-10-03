import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import getAllTags from '@/lib/blog/getAllTags';
import { getBlogLanguage } from '@/lib/blog/localization';
import { getPaginatedPosts } from '@/lib/blog/getPaginatedPosts';
import PostPreview from './PostPreview';
import TagSection from './TagSection';
import LanguageToggle from './LanguageToggle';
import Pagination from './Pagination';

type BlogIndexProps = { tag?: string; searchParams: { page?: string; lang?: string; q?: string } };

export default function BlogIndex({ tag, searchParams }: BlogIndexProps) {
  const language = getBlogLanguage(searchParams.lang);
  const isJapanese = language === 'ja';
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPosts(Number(searchParams.page) || 1, language, { tag, query });
  const basePath = tag ? `/blog/tags/${encodeURIComponent(tag)}` : '/blog';
  const blogHref = language === 'en' ? '/blog?lang=en' : '/blog';

  return (
    <div className="site-container page-section" lang={language}>
      <header className="page-heading flex flex-wrap items-center justify-between gap-5">
        <div><h1 className="page-title">Blog</h1><p className="page-description">{isJapanese ? '数学、コード、日々の学び。' : 'Notes on mathematics, code, and everyday learning.'}</p></div>
        <LanguageToggle language={language} basePath={basePath} query={query} />
      </header>
      <form action={basePath} method="get" role="search" className="mb-4 flex items-center gap-3 rounded-md border border-input bg-card px-4 py-1">
        {language === 'en' && <input type="hidden" name="lang" value="en" />}
        <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <input name="q" type="search" defaultValue={query} aria-label={isJapanese ? '記事を検索' : 'Search articles'} placeholder={isJapanese ? '記事名・キーワードで検索' : 'Search titles, topics, or keywords'} className="min-h-[44px] min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground" />
        <button type="submit" aria-label={isJapanese ? '検索する' : 'Search'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-primary hover:bg-secondary"><ArrowRight size={18} aria-hidden="true" /></button>
      </form>
      <TagSection tags={getAllTags(language)} activeTag={tag} language={language} query={query} showAll />
      <div className="mb-1 mt-6 flex items-center justify-between gap-4 border-b border-border pb-3 text-xs text-muted-foreground">
        <p>{isJapanese ? `${totalPosts} 件の記事` : `${totalPosts} ${totalPosts === 1 ? 'article' : 'articles'}`}{tag && <span className="ml-2 text-primary">/ {tag}</span>}</p>
        <span>{isJapanese ? '新しい順' : 'Newest first'}</span>
      </div>
      {posts.length ? (
        <div className="post-list">{posts.map(post => <PostPreview key={post.slug} {...post} language={language} />)}</div>
      ) : (
        <div className="py-12 text-center"><h2 className="text-lg">{isJapanese ? '記事が見つかりませんでした' : 'No articles found'}</h2><p className="mt-2 text-sm text-muted-foreground">{isJapanese ? '別のキーワードを試すか、絞り込みを解除してください。' : 'Try another keyword or clear the filters.'}</p><Link href={blogHref} className="text-link mt-4">{isJapanese ? '条件を解除' : 'Clear filters'} <ArrowRight size={15} aria-hidden="true" /></Link></div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} language={language} query={query} />
    </div>
  );
}
