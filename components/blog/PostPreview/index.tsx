import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LIMITS } from '@/config/constants';
import type { PostMetadata } from '@/lib/blog/types';
import type { BlogLanguage } from '@/lib/blog/localization';

type PostPreviewProps = PostMetadata & { language?: BlogLanguage; headingLevel?: 2 | 3 };

export default function PostPreview({ language = 'ja', headingLevel = 2, ...post }: PostPreviewProps) {
  const date = new Date(post.date).toISOString().slice(0, 10);
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const excerpt = post.subtitle.slice(0, LIMITS.POST_EXCERPT_LENGTH) + (post.subtitle.length > LIMITS.POST_EXCERPT_LENGTH ? '…' : '');

  return (
    <article className="post-preview">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
        <time dateTime={date} className="tabular-nums">{date.replace(/-/g, '.')}</time>
        {(post.tags || []).map(tag => (
          <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}${language === 'en' ? '?lang=en' : ''}`} className="post-tag inline-flex min-h-[44px] min-w-[44px] items-center hover:text-primary">{tag}</Link>
        ))}
      </div>
      <Link href={`/blog/posts/${post.slug}`} className="post-link">
        <div className="min-w-0">
          <Heading>{post.title}</Heading>
          {post.subtitle && post.subtitle !== post.title && <p className="mt-2 text-sm leading-7 text-muted-foreground">{excerpt}</p>}
        </div>
        <span className="post-preview-media" aria-hidden="true">
          {post.previewImage ? <img src={post.previewImage} alt="" loading="lazy" className="post-thumbnail" /> : <ArrowRight size={17} className="text-primary" />}
        </span>
      </Link>
    </article>
  );
}
