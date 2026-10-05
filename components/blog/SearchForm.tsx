'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';
import LanguageToggle from './LanguageToggle';

export default function SearchForm({ basePath, language, query }: { basePath: string; language: BlogLanguage; query: string }) {
  const [value, setValue] = useState(query);
  const [open, setOpen] = useState(Boolean(query));
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const isJapanese = language === 'ja';
  useEffect(() => { if (open) input.current?.focus(); }, [open]);

  return (
    <>
      <div className="blog-controls">
        <button ref={toggle} type="button" className="blog-search-toggle" aria-expanded={open} aria-controls="blog-search-form" onClick={() => { setOpen(!open); if (open) toggle.current?.focus(); }}><Search size={16} aria-hidden="true" /><span>Search</span></button>
        <LanguageToggle language={language} basePath={basePath} query={query} />
      </div>
      <form id="blog-search-form" action={basePath} method="get" role="search" className="blog-search" hidden={!open} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); toggle.current?.focus(); } }}>
        {language === 'en' && <input type="hidden" name="lang" value="en" />}
        <input ref={input} name="q" type="search" value={value} onChange={event => setValue(event.target.value)} aria-label={isJapanese ? '記事を検索' : 'Search articles'} placeholder={isJapanese ? '記事を検索' : 'Search articles'} className="blog-search-input" />
        {value && <button type="button" className="icon-button" aria-label={isJapanese ? '検索文字を削除' : 'Clear search text'} onClick={() => { setValue(''); input.current?.focus(); }}><X size={16} aria-hidden="true" /></button>}
        <button type="submit" className="icon-button" aria-label={isJapanese ? '検索する' : 'Search'}><Search size={18} aria-hidden="true" /></button>
      </form>
    </>
  );
}
