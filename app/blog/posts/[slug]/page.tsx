import rehypeSlug from 'rehype-slug'; // rehype plugin to add id attributes to headings so that they can be linked to
import Markdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import React from "react";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Github } from 'lucide-react';

import { FEATURES } from '@/config/constants';
import Comment from "@/components/blog/Comment/Comment";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import getPostMetadata, { getPostBySlug } from "@/lib/blog/getPostMetadata";
import embedGitHubCode from "@/lib/blog/embedGitHubCode";
import TagSection from '@/components/blog/TagSection';
import TOC from "@/components/blog/TableOfContents/index";
import Pre from "@/components/blog/CodeBlock";
import CustomImage from "@/components/blog/Image";
import AdmonitionComponents from "@/components/blog/Admonition/admonitionColor3";
import { remarkTextDirectives, TextDirectiveComponents } from '@/components/blog/Admonition/directive';

import { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { getAlternatePostSlug, getPostLanguage } from '@/lib/blog/localization';
import getPostLinks from '@/lib/blog/getPostLinks';
import PostNavigation from '@/components/blog/PostNavigation';

const getPostContent = (slug: string) => {
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return {
    content: post.content,
    data: post.metadata,
  };
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = getPostContent(params.slug);
  const postUrl = `${SITE_CONFIG.url}/blog/posts/${params.slug}`;
  const language = getPostLanguage(params.slug);
  const alternateSlug = getAlternatePostSlug(params.slug);
  const alternateLanguage = language === 'en' ? 'ja' : 'en';
  const alternateUrl = alternateSlug
    ? `${SITE_CONFIG.url}/blog/posts/${alternateSlug}`
    : null;

  const imageUrl = post.data.previewImage
    ? post.data.previewImage.startsWith('http')
      ? post.data.previewImage
      : `${SITE_CONFIG.url}${post.data.previewImage}`
    : SITE_CONFIG.ogImage;

  return {
    title: post.data.title,
    description: post.data.subtitle || post.data.title,
    keywords: post.data.tags || [],
    authors: [{ name: SITE_CONFIG.name }],
    openGraph: {
      title: post.data.title,
      description: post.data.subtitle || post.data.title,
      type: 'article',
      publishedTime: post.data.date,
      authors: [SITE_CONFIG.name],
      tags: post.data.tags || [],
      url: postUrl,
      images: [
        {
          url: imageUrl,
          alt: post.data.title,
        },
      ],
    },
    alternates: {
      canonical: postUrl,
      languages: alternateUrl
        ? {
            [language]: postUrl,
            [alternateLanguage]: alternateUrl,
          }
        : undefined,
    },
  };
}


const PostContent = async (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  const content = await embedGitHubCode(post.content);
  const markdownUrl = `${SITE_CONFIG.links.github}/blob/main/posts/${slug}.md?plain=1`;
  const language = getPostLanguage(slug);
  const alternateSlug = getAlternatePostSlug(slug);

  // Define your components with proper typing
  const CustomParagraph = ({ children }: { children?: React.ReactNode }) => {
    const hasBlockElement = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        (
          // All React components are treated as blocks.
          typeof child.type !== 'string' ||
          ['div', 'figure', 'img'].includes(child.type)
        )
    );
    return hasBlockElement ? <>{children}</> : <p>{children}</p>;
  };

  const components: Components = {
    p: CustomParagraph,
    img: CustomImage as Components['img'],
    pre: Pre,
    ...AdmonitionComponents,
    ...TextDirectiveComponents,
  };

  const date = new Date(post.data.date).toISOString().slice(0, 10);

  return (
    <>
      <header className="reading-column article-header">
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <div className="flex items-center gap-2">
            <time dateTime={date} className="text-sm tabular-nums text-muted-foreground">{date.replace(/-/g, '.')}</time>
            <a className="icon-button" href={markdownUrl} rel="noopener noreferrer" target="_blank" aria-label={language === 'en' ? 'Read Markdown on GitHub' : 'GitHubでMarkdownを読む'} title={language === 'en' ? 'Read Markdown on GitHub' : 'GitHubでMarkdownを読む'}><Github size={18} aria-hidden="true" /></a>
          </div>
          {alternateSlug && <Link className="text-link ml-auto" href={`/blog/posts/${alternateSlug}`}>{language === 'en' ? 'Read in Japanese' : 'Read in English'}</Link>}
        </div>
        <h1 className="article-title">{post.data.title}</h1>
        {post.data.subtitle && post.data.subtitle !== post.data.title && <p className="mt-2 text-base leading-7 text-muted-foreground">{post.data.subtitle}</p>}
        {post.data.tags && <div className="mt-2"><TagSection tags={post.data.tags} language={language} /></div>}
      </header>
      <aside className="article-toc"><TOC key={slug} /></aside>
      <ErrorBoundary fallback={<div className="reading-column py-8"><h2>Failed to render post content</h2><p>Please try reloading this article.</p></div>}>
        <article className="reading-column post prose article-content">
          <Markdown children={content} remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype, remarkTextDirectives, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]} components={components} />
        </article>
      </ErrorBoundary>
    </>
  );
};

export default async function PostPage(props: any) {
  const postContent = await PostContent(props);
  const language = getPostLanguage(props.params.slug);
  const postLinks = getPostLinks(props.params.slug);

  return (
    <div className="article-layout page-section" lang={language}>
      {postContent}
      <PostNavigation {...postLinks} language={language} />
      {FEATURES.ENABLE_COMMENTS && <section className="reading-column mt-12 border-t border-border pt-8" aria-labelledby="comments-title"><h2 id="comments-title" className="mb-6 text-xl">{language === 'en' ? 'Comments' : 'コメント'}</h2><Comment /></section>}
    </div>
  );
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata();

  return posts.map((post) => ({
    slug: post.slug,
  }));
};
