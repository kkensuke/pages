import Link from 'next/link';
import type { BlogLanguage } from '@/lib/blog/localization';

type LanguageToggleProps = { language: BlogLanguage; basePath?: string; query?: string };
const languages: { value: BlogLanguage; label: string }[] = [{ value: 'ja', label: '日本語' }, { value: 'en', label: 'English' }];

export default function LanguageToggle({ language, basePath = '/blog', query = '' }: LanguageToggleProps) {
  return (
    <nav aria-label="Blog language" className="flex items-center gap-1">
      {languages.map(({ value, label }) => {
        const params = new URLSearchParams();
        if (value === 'en') params.set('lang', 'en');
        if (query) params.set('q', query);
        return <Link key={value} aria-current={language === value ? 'page' : undefined} className="language-link" href={basePath + (params.toString() ? '?' + params.toString() : '')}>{label}</Link>;
      })}
    </nav>
  );
}
