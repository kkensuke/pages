import fs from "fs";
import matter from "gray-matter";
import rehypeSlug from 'rehype-slug'; // rehype plugin to add id attributes to headings so that they can be linked to
import Markdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import React from "react";
import path from "path";

import { FEATURES } from '@/config/constants';
import Comment from "@/components/blog/Comment/Comment";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import getPostMetadata from "@/lib/blog/getPostMetadata";
import embedGitHubCode from "@/lib/blog/embedGitHubCode";
import TagSection from '@/components/blog/TagSection';
import TOC from "@/components/blog/TableOfContents/index";
import Pre from "@/components/blog/CodeBlock";
import CustomImage from "@/components/blog/Image";
import AdmonitionComponents from "@/components/blog/Admonition/admonitionColor1";
// import AdmonitionComponents from "@/components/blog/Admonition/admonitionColor2"; // Alternative Admonition style
import { remarkTextDirectives, TextDirectiveComponents } from '@/components/blog/Admonition/directive';

import { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

const getPostContent = (slug: string) => {  
  const file = path.join(process.cwd(), "posts", `${slug}.md`);
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = getPostContent(params.slug);
  const postUrl = `${SITE_CONFIG.url}/blog/posts/${params.slug}`;
  
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
    },
  };
}


const PostContent = async (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  const content = await embedGitHubCode(post.content);
  const markdownUrl = `${SITE_CONFIG.links.github}/blob/main/posts/${slug}.md`;
  
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
  
  const titleSection = (
    <>
      <p className="mt-2 text-right text-slate-600">{post.data.date}</p>
      <h1 className="text-2xl text-slate-600">{post.data.title}</h1>
      <p className="mt-2 text-slate-600">{post.data.subtitle}</p>
      <a
        className="mt-3 inline-block text-sm text-slate-500 underline hover:text-slate-700"
        href={markdownUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Markdown on GitHub
      </a>
      {/* if post.data.tags exist, return list of tags below */}
      {post.data.tags && (
        <div className="mt-4">
          <TagSection tags={post.data.tags} />
        </div>
      )}
    </>
  )
  
  return (
    <div className="mb-20 flex flex-col lg:flex-row lg:items-start">
      
      <div className="lg:order-1 lg:w-96 lg:min-w-[10px] lg:shrink">
      </div>
      
      <div className="mx-auto my-12 max-w-screen-sm text-center lg:order-2 lg:hidden">
        {titleSection}
      </div>
      
      <div className="mb-2 lg:sticky lg:top-10 lg:order-3 lg:ml-8 lg:mr-0 lg:w-80 lg:shrink-0">
          <div className="mx-auto max-w-[400px] lg:mt-10">
            <TOC />
          </div>
      </div>
      
      <div className="lg:order-2 lg:mx-auto lg:shrink-0">
        <div className="mx-auto my-12 hidden max-w-screen-sm text-center lg:block"> {/* hidden lg:block  <-> lg:hidden */}
          {titleSection}
        </div>
        
        <ErrorBoundary fallback={
          <div className="prose mx-auto p-6 text-center">
            <h3>Failed to render post content</h3>
            <p>We encountered an error while rendering this post's content.</p>
          </div>
        }>
          <article className="post prose mx-auto">
            <Markdown
              children={content}
              remarkPlugins={[
                remarkGfm,
                // remarkBreaks,
                remarkDirective,
                remarkDirectiveRehype,
                remarkTextDirectives,
                remarkMath
              ]}
              rehypePlugins={[
                rehypeSlug,
                rehypeKatex
              ]}
              components={components}
            />
          </article>
        </ErrorBoundary>
      </div>
      
    </div>
  );
};

export default async function PostPage(props: any) {
  const postContent = await PostContent(props);

  return (
    <>
      {postContent}
      
      <div className="mb-28">
        {FEATURES.ENABLE_COMMENTS && <Comment />}
      </div>
    </>
  );
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
};
