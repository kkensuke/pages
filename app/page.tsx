import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const research = [
  { title: 'Double Descent in Quantum Kernel Ridge Regression', kind: 'Paper · arXiv', href: 'https://arxiv.org/abs/2604.17202' },
  { title: 'Study Notes on Statistical Learning Theory for Quantum Machine Learning', kind: 'Study notes · PDF', href: 'https://kkensuke.github.io/QML_generalization/main.pdf' },
  { title: 'Analysis of Data-encoding Induced Barren Plateau in Quantum Machine Learning', kind: 'Master’s thesis · PDF', href: 'https://kkensuke.github.io/master_thesis/main.pdf' },
];

export default function HomePage() {
  return (
    <div className="site-container page-section">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">PhD student · Tokyo, Japan</p>
        <h1 id="home-title" className="home-name">Kensuke.</h1>
        <p className="home-description">Researching quantum computing and machine learning.</p>
        <p className="mt-4 text-muted-foreground">I explore how quantum models learn. Here I share research, code, and notes along the way.</p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">Quantum kernel methods · Generalization · Variational quantum algorithms</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/blog?lang=en" className="primary-link">Read the blog <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <section id="research" className="home-section" aria-labelledby="research-title">
        <div className="section-heading"><h2 id="research-title">Research & notes</h2><span className="eyebrow">Selected work</span></div>
        <div className="research-list">
          {research.map(({ title, kind, href }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="research-link">
              <div><p className="mb-2 text-xs text-muted-foreground">{kind}</p><h3>{title}</h3></div>
              <ArrowUpRight size={18} className="shrink-0 text-primary" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
