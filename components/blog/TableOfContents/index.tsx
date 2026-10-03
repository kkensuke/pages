"use client";

import React, { useEffect } from 'react';
import tocbot from 'tocbot';
import { ListOrdered } from 'lucide-react';

const TOC = () => {
  useEffect(() => {
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

    return () => tocbot.destroy();
  }, []);

  return (
    <div>
      <div className="rounded-xl border border-slate-700 bg-[#0f0f0f] shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-700 p-4">
          <ListOrdered className="text-slate-500" size={20} aria-hidden="true" />
          <h2 className="font-semibold text-slate-300">
            Table of Contents
          </h2>
        </div>

        <nav className="toc p-4" aria-label="Table of contents" />
      </div>

      <style jsx global>{`
        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.95rem;
        }

        .toc-list .toc-list {
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .toc-list-item {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .toc-link {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
          position: relative;
          padding-left: 0.25rem;
        }

        .toc-link:hover {
          color: #cbd5e1;
        }

        .is-active-link {
          color: #7dd3fc;
          font-weight: 500;
        }

        .is-active-link::before {
          content: '';
          position: absolute;
          left: -0.25rem;
          top: 0.2rem;
          bottom: 0.2rem;
          width: 2px;
          background: #38bdf8;
          border-radius: 1px;
        }

        .is-active-link + .toc-list .toc-link {
          color: #94a3b8;
        }

        .toc-list {
          transition: height 0.3s ease;
        }

        .is-active-li > .toc-link {
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default TOC;
