import Link from 'next/link';
import type { BlogLanguage } from '@/lib/blog/localization';

type TagSectionProps = { tags: string[]; activeTag?: string; language?: BlogLanguage; query?: string; showAll?: boolean };

export default function TagSection({ tags, activeTag, language = 'ja', query = '', showAll = false }: TagSectionProps) {
  const params = new URLSearchParams();
  if (language === 'en') params.set('lang', 'en');
  if (query) params.set('q', query);
  const suffix = params.toString() ? '?' + params.toString() : '';

  return (
    <nav className="flex flex-wrap gap-1" aria-label={language === 'ja' ? '記事のタグ' : 'Post tags'}>
      {showAll && <Link href={'/blog' + suffix} className="tag-link" aria-current={!activeTag ? 'page' : undefined}>{language === 'ja' ? 'すべて' : 'All'}</Link>}
      {tags.map(tag => (
        <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}${suffix}`} className="tag-link" aria-current={tag === activeTag ? 'page' : undefined}>{tag}</Link>
      ))}
    </nav>
  );
}
