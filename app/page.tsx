import React from 'react';
import Link from 'next/link';
import { Mail, FileText, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { SITE_CONFIG } from '@/config/site';

export default function HomePage() {
  return (
    <div className="container mx-auto mt-8 max-w-screen-lg px-4 pb-16">      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-20 text-center text-white shadow-2xl md:px-16 md:py-28">
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium">Welcome</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Hi, I'm Kensuke! 👋
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Welcome to my corner of the web where I share my journey in development, design, and creative exploration.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a 
              href={SITE_CONFIG.links.github}
              target="_blank"
              className="group flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
            >
              {SiGithub({ size: 20 })}
              <span>GitHub</span>
            </a>
            <Link 
              href="/blog"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-medium text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              <span>Read Blog</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
      </section>

      {/* About Section */}
      <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">About Me</h2>
        </div>

        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-slate-600">
            I am a PhD student specializing in Quantum Computing and Machine Learning.
            I love working with the latest technologies and constantly learning new things.
          </p>
          
          {/* Keywords Tags */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {['Quantum Computing', 'Quantum Machine Learning', 'Quantum Kernel Methods', 'Variational Quantum Algorithms', 'Generalization'].map((keyword) => (
                <span 
                  key={keyword}
                  className="group rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:scale-105 hover:shadow-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          {/* Skills Tags */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Python', 'C++', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'].map((tech) => (
                <span 
                  key={tech}
                  className="group rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:scale-105 hover:shadow-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* <a 
              href="/cv.pdf" 
              download 
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-colors group-hover:bg-blue-200">
                <FileText size={20} />
              </div>
              <span className="font-medium text-slate-700">Download CV</span>
            </a> */}

            <a 
              href={SITE_CONFIG.links.github}
              target="_blank"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 transition-colors group-hover:bg-slate-200">
                {SiGithub({ size: 20 })}
              </div>
              <span className="font-medium text-slate-700">GitHub Profile</span>
            </a>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Mail size={20} />
              </div>
              <span className="text-sm text-slate-600">kensuke(at)icepp.s.u-tokyo.ac.jp</span>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
              <span className="text-2xl">📍</span>
              <span className="font-medium text-slate-700">Tokyo, Japan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      
      <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Projects</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { title: "Double Descent in Quantum Kernel Ridge Regression", desc: "", link: "https://arxiv.org/abs/2604.17202" },
            { title: "Study Notes on Statistical Learning Theory for Quantum Machine Learning", desc: "", link: "https://kkensuke.github.io/QML_generalization/main.pdf" },
            { title: "Analysis of Data-encoding Induced Barren Plateau in Quantum Machine Learning", desc: "", link: "https://kkensuke.github.io/master_thesis/main.pdf" }
          ].map((project) => (
            <Link 
              key={project.title}
              href={project.link}
              target="_blank"
              className="group block rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition-all hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                    {project.title}
                  </h3>
                  <p className="text-slate-600">{project.desc}</p>
                </div>
                <ExternalLink 
                  size={20} 
                  className="text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-500" 
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
     

      {/* Quick Links Grid */}
      {/*
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { title: "Products", href: "/products" },
          { title: "Publications", href: "/publications" },
          { title: "Photos", href: "/photos" }
        ].map((item) => (
          <Link 
            key={item.title}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:scale-105 hover:shadow-lg"
          >
            <div className="relative flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <ArrowRight 
                size={24} 
                className="text-slate-400 transition-all group-hover:translate-x-2 group-hover:text-slate-900" 
              />
            </div>
          </Link>
        ))}
      </div>
     */}
     
    </div>
  );
}