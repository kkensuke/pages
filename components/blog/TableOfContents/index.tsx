'use client';

import { useEffect, useRef, useState } from 'react';
import tocbot from 'tocbot';
import { ChevronDown, List } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';

export default function TOC({ language = 'en' }: { language?: BlogLanguage }) {
  const [hasHeadings, setHasHeadings] = useState(true);
  const [currentHeading, setCurrentHeading] = useState('');
  const panel = useRef<HTMLDetailsElement>(null);
  const label = language === 'ja' ? '目次' : 'On this page';

  useEffect(() => {
    const available = !!document.querySelector('.post h2');
    setHasHeadings(available);
    if (!available) return;
    const wide = window.matchMedia('(min-width: 1100px)');
    const updateOpen = () => { if (panel.current) panel.current.open = wide.matches; };
    const updateCurrent = () => {
      const active = panel.current?.querySelector('.is-active-link');
      setCurrentHeading(active?.textContent || '');
      panel.current?.querySelectorAll('.toc-link').forEach(link => {
        if (link === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    updateOpen();
    wide.addEventListener('change', updateOpen);
    tocbot.init({
      tocSelector: '.toc', contentSelector: '.post', headingSelector: 'h2', hasInnerContainers: true,
      linkClass: 'toc-link', activeLinkClass: 'is-active-link', listClass: 'toc-list', listItemClass: 'toc-list-item',
      collapseDepth: 6, scrollSmooth: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollSmoothDuration: 420, headingsOffset: 80, scrollSmoothOffset: -80,
      scrollEndCallback: updateCurrent,
      onClick: () => {
        if (!wide.matches && panel.current) {
          panel.current.open = false;
          panel.current.querySelector('summary')?.focus({ preventScroll: true });
        }
      },
    });
    updateCurrent();
    return () => { tocbot.destroy(); wide.removeEventListener('change', updateOpen); };
  }, []);

  return (
    <details ref={panel} className="reading-column article-toc group" hidden={!hasHeadings}>
      <summary className="contents-summary" aria-label={currentHeading ? `${label}: ${currentHeading}` : label}>
        <List size={17} className="shrink-0 text-primary" aria-hidden="true" /><span className="min-w-0 flex-1 truncate">{currentHeading || label}</span><ChevronDown size={16} className="shrink-0 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <nav className="toc" aria-label={language === 'ja' ? '目次' : 'Table of contents'} />
    </details>
  );
}
