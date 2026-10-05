import Link from 'next/link';
import type { BlogLanguage } from '@/lib/blog/localization';

type TagSectionProps = { tags: string[]; activeTag?: string; language?: BlogLanguage; query?: string; page?: number };

export default function TagSection({ tags, activeTag, language = 'ja', query = '', page = 1 }: TagSectionProps) {
  if (!tags?.length) return null;
  const params = new URLSearchParams();
  if (language === 'en') params.set('lang', 'en');
  if (query) params.set('q', query);
  if (page > 1) params.set('page', String(page));
  const suffix = params.toString() ? '?' + params.toString() : '';

  return (
    <nav className="tag-list" aria-label={language === 'ja' ? '記事のタグ' : 'Post tags'}>
      {tags.map(tag => {
        const isActive = tag.toLowerCase() === activeTag?.toLowerCase();
        return <Link key={tag} href={`${isActive ? '/blog' : `/blog/tags/${encodeURIComponent(tag)}`}${suffix}`} className="tag-link" aria-current={isActive ? 'page' : undefined}>{tag}</Link>;
      })}
    </nav>
  );
}
