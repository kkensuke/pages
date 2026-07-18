import Link from 'next/link';
import type { BlogLanguage } from '@/lib/blog/localization';

type LanguageToggleProps = {
  language: BlogLanguage;
  basePath?: string;
};

const languages: { value: BlogLanguage; label: string }[] = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export default function LanguageToggle({
  language,
  basePath = '/blog',
}: LanguageToggleProps) {
  return (
    <nav aria-label="Blog language" className="flex justify-end">
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {languages.map(({ value, label }) => (
          <Link
            key={value}
            aria-current={language === value ? 'page' : undefined}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              language === value
                ? 'bg-slate-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            href={value === 'en' ? `${basePath}?lang=en` : basePath}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
