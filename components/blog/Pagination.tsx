import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';

type PaginationProps = { currentPage: number; totalPages: number; basePath?: string; language?: BlogLanguage; query?: string };

export default function Pagination({ currentPage, totalPages, basePath = '/blog', language = 'ja', query = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getHref = (page: number) => {
    const params = new URLSearchParams();
    if (language === 'en') params.set('lang', 'en');
    if (query) params.set('q', query);
    if (page > 1) params.set('page', String(page));
    return basePath + (params.toString() ? '?' + params.toString() : '');
  };
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);
  const linkClass = 'flex h-11 min-w-[44px] items-center justify-center rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground';
  const previousLabel = language === 'ja' ? '前のページ' : 'Previous page';
  const nextLabel = language === 'ja' ? '次のページ' : 'Next page';

  return (
    <nav aria-label={language === 'ja' ? 'ページ切り替え' : 'Pagination'} className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {currentPage > 1 ? <Link href={getHref(currentPage - 1)} className={linkClass} aria-label={previousLabel}><ChevronLeft size={17} aria-hidden="true" /></Link> : <span className={linkClass + ' opacity-40'} aria-disabled="true" aria-label={previousLabel}><ChevronLeft size={17} aria-hidden="true" /></span>}
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-1">
          {index > 0 && page - pages[index - 1] > 1 && <span className="px-2 text-muted-foreground" aria-hidden="true">…</span>}
          <Link href={getHref(page)} aria-label={language === 'ja' ? `${page} ページ目` : `Page ${page}`} aria-current={page === currentPage ? 'page' : undefined} className={linkClass + (page === currentPage ? ' bg-accent text-primary' : '')}>{page}</Link>
        </span>
      ))}
      {currentPage < totalPages ? <Link href={getHref(currentPage + 1)} className={linkClass} aria-label={nextLabel}><ChevronRight size={17} aria-hidden="true" /></Link> : <span className={linkClass + ' opacity-40'} aria-disabled="true" aria-label={nextLabel}><ChevronRight size={17} aria-hidden="true" /></span>}
    </nav>
  );
}
