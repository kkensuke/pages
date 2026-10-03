'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="site-brand" aria-label="kkensuke Home">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />kkensuke
        </Link>
        <nav className="site-navigation" aria-label="Main navigation">
          {SITE_CONFIG.navigation.map(({ title, path }) => (
            <Link key={path} href={path} className="nav-link" aria-current={pathname === path || (path !== '/' && pathname.startsWith(path + '/')) ? 'page' : undefined}>
              {title}
            </Link>
          ))}
        </nav>
        <a href={SITE_CONFIG.links.github} target="_blank" rel="noopener noreferrer" className="header-github text-link">
          <Github size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
