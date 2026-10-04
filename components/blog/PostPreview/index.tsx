import Link from 'next/link';
import { LIMITS } from '@/config/constants';
import { POST_ICONS } from '@/lib/blog/icons';
import type { PostMetadata } from '@/lib/blog/types';
import type { BlogLanguage } from '@/lib/blog/localization';

type PostPreviewProps = PostMetadata & { language?: BlogLanguage; headingLevel?: 2 | 3 };

export default function PostPreview({ language = 'ja', headingLevel = 2, ...post }: PostPreviewProps) {
  const date = new Date(post.date).toISOString().slice(0, 10);
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const Icon = POST_ICONS[post.icon ?? 'file-text'];
  const excerpt = post.subtitle.slice(0, LIMITS.POST_EXCERPT_LENGTH) + (post.subtitle.length > LIMITS.POST_EXCERPT_LENGTH ? '…' : '');

  return (
    <article className="post-preview">
      <div className="flex items-center gap-[22px] max-sm:gap-[18px]">
        <span aria-hidden="true" className="post-icon pointer-events-none flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-primary/[0.13] bg-primary/[0.065] text-primary max-sm:h-11 max-sm:w-11 max-sm:rounded-[11px]">
          <Icon className="h-7 w-7 max-sm:h-6 max-sm:w-6" strokeWidth={1.7} focusable="false" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <time dateTime={date} className="tabular-nums">{date.replace(/-/g, '.')}</time>
            {(post.tags || []).map(tag => (
              <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}${language === 'en' ? '?lang=en' : ''}`} className="post-tag tag-link">{tag}</Link>
            ))}
          </div>
          <Link href={`/blog/posts/${post.slug}`} className="post-link">
            <div className="min-w-0">
              <Heading>{post.title}</Heading>
              {post.subtitle && post.subtitle !== post.title && <p className="mt-2 text-sm leading-7 text-muted-foreground">{excerpt}</p>}
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
