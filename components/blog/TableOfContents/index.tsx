'use client';

import { useEffect, useState } from 'react';
import tocbot from 'tocbot';
import { ChevronDown, List } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';

export default function TOC({ language = 'en' }: { language?: BlogLanguage }) {
  const [hasHeadings, setHasHeadings] = useState(false);

  useEffect(() => {
    const available = !!document.querySelector('.post h2');
    setHasHeadings(available);
    if (!available) return;
    tocbot.init({
      tocSelector: '.toc', contentSelector: '.post', headingSelector: 'h2', hasInnerContainers: true,
      linkClass: 'toc-link', activeLinkClass: 'is-active-link', listClass: 'toc-list', listItemClass: 'toc-list-item',
      collapseDepth: 6, scrollSmooth: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollSmoothDuration: 420, headingsOffset: 32,
    });
    return () => tocbot.destroy();
  }, []);

  return (
    <details className="article-contents group" hidden={!hasHeadings}>
      <summary className="flex min-h-[44px] cursor-pointer items-center gap-3 p-4 text-sm">
        <List size={17} className="text-primary" aria-hidden="true" /><span className="flex-1">{language === 'ja' ? '目次' : 'On this page'}</span><ChevronDown size={16} className="group-open:rotate-180" aria-hidden="true" />
      </summary>
      <nav className="toc" aria-label={language === 'ja' ? '目次' : 'Table of contents'} />
    </details>
  );
}
