import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';
import type { PostLinks } from '@/lib/blog/getPostLinks';

export default function PostNavigation({ previous, next, related, language }: PostLinks & { language: BlogLanguage }) {
  const isJapanese = language === 'ja';
  if (!previous && !next && related.length === 0) return null;

  return (
    <div className="reading-column post-navigation">
      {(previous || next) && <nav aria-label={isJapanese ? '記事の移動' : 'Article navigation'} className="adjacent-posts">
        {next && <Link href={`/blog/posts/${next.slug}`} className="post-panel"><span className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><ArrowLeft size={15} aria-hidden="true" />{isJapanese ? '新しい記事' : 'Newer article'}</span><span className="font-medium">{next.title}</span></Link>}
        {previous && <Link href={`/blog/posts/${previous.slug}`} className="post-panel post-panel-older"><span className="mb-2 flex items-center justify-end gap-2 text-xs text-muted-foreground">{isJapanese ? '古い記事' : 'Older article'}<ArrowRight size={15} aria-hidden="true" /></span><span className="font-medium">{previous.title}</span></Link>}
      </nav>}
      {related.length > 0 && <section className="related-section" aria-labelledby="related-title">
        <h2 id="related-title" className="mb-4 text-xl font-medium">{isJapanese ? '関連記事' : 'Related articles'}</h2>
        <div className="related-posts">{related.map(post => <Link key={post.slug} href={`/blog/posts/${post.slug}`} className="post-panel flex items-start justify-between gap-3"><span>{post.title}</span><ArrowRight size={17} className="mt-1 shrink-0 text-primary" aria-hidden="true" /></Link>)}</div>
      </section>}
    </div>
  );
}
