import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <p>© {new Date().getFullYear()} kkensuke</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6">
          <a href={`mailto:${SITE_CONFIG.links.email}`} className="text-link" aria-label="Contact Kensuke by email">Contact <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href={SITE_CONFIG.links.github} target="_blank" rel="noopener noreferrer" className="text-link">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
          <Link href="/policy" className="text-link">Privacy & Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
