"use client";

import React, { useEffect, useRef } from 'react';
import tocbot from 'tocbot';
import { ChevronDown, ListOrdered } from 'lucide-react';

const TOC = () => {
  const disclosure = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const viewport = window.matchMedia('(min-width: 1280px)');
    const syncDisclosure = () => {
      if (!disclosure.current) return;
      disclosure.current.open = viewport.matches;
      const summary = disclosure.current.querySelector('summary');
      if (summary) {
        summary.tabIndex = viewport.matches ? -1 : 0;
        summary.setAttribute('aria-disabled', String(viewport.matches));
      }
    };
    syncDisclosure();
    viewport.addEventListener('change', syncDisclosure);

    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.post',
      headingSelector: 'h2',
      hasInnerContainers: true,
      linkClass: 'toc-link',
      activeLinkClass: 'is-active-link',
      listClass: 'toc-list',
      listItemClass: 'toc-list-item',
      collapseDepth: 6,
      scrollSmooth: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollSmoothDuration: 420,
      headingsOffset: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    });

    return () => {
      viewport.removeEventListener('change', syncDisclosure);
      tocbot.destroy();
    };
  }, []);

  return (
    <div>
      <details ref={disclosure} className="toc-disclosure rounded-lg border border-border bg-card">
        <summary className="toc-summary flex min-h-[44px] items-center gap-2 px-4 py-3" onClick={event => {
          if (event.currentTarget.getAttribute('aria-disabled') === 'true') event.preventDefault();
        }}>
          <ListOrdered className="text-muted-foreground" size={16} aria-hidden="true" />
          <h2 className="text-xs font-medium text-muted-foreground">
            Table of Contents
          </h2>
          <ChevronDown className="toc-toggle ml-auto text-muted-foreground" size={16} aria-hidden="true" />
        </summary>

        <nav className="toc p-3" aria-label="Table of contents" />
      </details>

      <style jsx global>{`
        .toc-summary {
          cursor: pointer;
          list-style: none;
        }

        .toc-summary::-webkit-details-marker {
          display: none;
        }

        .toc-disclosure[open] > .toc-summary {
          border-bottom: 1px solid hsl(var(--border));
        }

        .toc-disclosure[open] .toc-toggle {
          transform: rotate(180deg);
        }

        .toc-summary[aria-disabled='true'] {
          cursor: default;
        }

        .toc-summary[aria-disabled='true'] .toc-toggle {
          display: none;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.8125rem;
        }

        .toc-list .toc-list {
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .toc-list-item {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }

        .toc-link {
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          transition: color 0.2s ease;
          display: block;
          position: relative;
          padding-left: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .toc-link:hover {
          color: hsl(var(--foreground));
        }

        .is-active-link {
          color: hsl(var(--primary));
          font-weight: 500;
        }

        .is-active-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.35rem;
          bottom: 0.35rem;
          width: 2px;
          background: hsl(var(--primary));
          border-radius: 1px;
        }

        .is-active-link + .toc-list .toc-link {
          color: hsl(var(--muted-foreground));
        }

        .toc-list {
          transition: height 0.3s ease;
        }

      `}</style>
    </div>
  );
};

export default TOC;
