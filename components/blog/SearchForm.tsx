'use client';

import { useRef, useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';

export default function SearchForm({ basePath, language, query }: { basePath: string; language: BlogLanguage; query: string }) {
  const [value, setValue] = useState(query);
  const input = useRef<HTMLInputElement>(null);
  const isJapanese = language === 'ja';

  return (
    <form action={basePath} method="get" role="search" className="blog-search">
      {language === 'en' && <input type="hidden" name="lang" value="en" />}
      <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      <input ref={input} name="q" type="search" value={value} onChange={event => setValue(event.target.value)} aria-label={isJapanese ? '記事を検索' : 'Search articles'} placeholder={isJapanese ? '記事を検索' : 'Search articles'} className="blog-search-input" />
      {value && <button type="button" className="icon-button" aria-label={isJapanese ? '検索文字を削除' : 'Clear search text'} onClick={() => { setValue(''); input.current?.focus(); }}><X size={16} aria-hidden="true" /></button>}
      <button type="submit" className="icon-button" aria-label={isJapanese ? '検索する' : 'Search'}><ArrowRight size={18} aria-hidden="true" /></button>
    </form>
  );
}
