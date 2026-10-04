import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import getAllTags from '@/lib/blog/getAllTags';
import { getBlogLanguage } from '@/lib/blog/localization';
import { getPaginatedPosts } from '@/lib/blog/getPaginatedPosts';
import PostPreview from './PostPreview';
import TagSection from './TagSection';
import Pagination from './Pagination';
import SearchForm from './SearchForm';

type BlogIndexProps = { tag?: string; searchParams: { page?: string; lang?: string; q?: string } };

export default function BlogIndex({ tag, searchParams }: BlogIndexProps) {
  const language = getBlogLanguage(searchParams.lang);
  const isJapanese = language === 'ja';
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPosts(Number(searchParams.page) || 1, language, { tag, query });
  const basePath = tag ? `/blog/tags/${encodeURIComponent(tag)}` : '/blog';
  const blogHref = language === 'en' ? '/blog?lang=en' : '/blog';

  return (
    <div className="site-container blog-index page-section" lang={language}>
      <header className="page-heading blog-heading">
        <h1 className="page-title"><Link href={blogHref}>Blog</Link></h1>
        <SearchForm key={`${basePath}:${language}:${query}`} basePath={basePath} language={language} query={query} />
      </header>
      <TagSection tags={getAllTags(language)} activeTag={tag} language={language} query={query} />
      <p className="mt-4 border-b border-border pb-2 text-xs text-muted-foreground">{isJapanese ? `${totalPosts} 件の記事` : `${totalPosts} ${totalPosts === 1 ? 'article' : 'articles'}`}</p>
      {posts.length ? (
        <div className="post-list">{posts.map(post => <PostPreview key={post.slug} {...post} language={language} />)}</div>
      ) : (
        <div className="py-12 text-center"><h2 className="text-lg">{isJapanese ? '記事が見つかりませんでした' : 'No articles found'}</h2><p className="mt-2 text-sm text-muted-foreground">{isJapanese ? '別のキーワードを試すか、絞り込みを解除してください。' : 'Try another keyword or clear the filters.'}</p><Link href={blogHref} className="text-link mt-4">{isJapanese ? '条件を解除' : 'Clear filters'} <ArrowRight size={15} aria-hidden="true" /></Link></div>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} language={language} query={query} />
    </div>
  );
}
