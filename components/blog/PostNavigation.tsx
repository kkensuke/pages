import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';
import type { PostLinks } from '@/lib/blog/getPostLinks';

export default function PostNavigation({ previous, next, related, language }: PostLinks & { language: BlogLanguage }) {
  const isJapanese = language === 'ja';
  if (!previous && !next && related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-6">
      {(previous || next) && <nav aria-label="Post navigation" className="post-list">
        {previous && <Link href={`/blog/posts/${previous.slug}`} className="research-link"><div><p className="mb-2 text-xs text-muted-foreground">{isJapanese ? '前の記事' : 'Previous article'}</p><h3>{previous.title}</h3></div><ArrowLeft size={17} className="shrink-0 text-primary" aria-hidden="true" /></Link>}
        {next && <Link href={`/blog/posts/${next.slug}`} className="research-link"><div><p className="mb-2 text-xs text-muted-foreground">{isJapanese ? '次の記事' : 'Next article'}</p><h3>{next.title}</h3></div><ArrowRight size={17} className="shrink-0 text-primary" aria-hidden="true" /></Link>}
      </nav>}
      {related.length > 0 && <section className="mt-8" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-2 text-xl font-medium">{isJapanese ? '関連記事' : 'Related articles'}</h2>
        <div className="post-list">{related.map(post => <Link key={post.slug} href={`/blog/posts/${post.slug}`} className="research-link"><h3>{post.title}</h3><ArrowRight size={17} className="shrink-0 text-primary" aria-hidden="true" /></Link>)}</div>
      </section>}
    </div>
  );
}
