import React from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import getAllTags from "@/lib/blog/getAllTags";
import PostPreview from "@/components/blog/PostPreview";
import Pagination from '@/components/blog/Pagination';
import { getPaginatedPosts } from '@/lib/blog/getPaginatedPosts';
import TagSection from '@/components/blog/TagSection';
import LanguageToggle from '@/components/blog/LanguageToggle';
import { getBlogLanguage } from '@/lib/blog/localization';


const BlogPage = ({ searchParams }: {
  searchParams: { page?: string; lang?: string };
}) => {
  const page = Number(searchParams.page) || 1;
  const language = getBlogLanguage(searchParams.lang);
  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPosts(page, language);
  const allTags = getAllTags(language);
  const blogHref = language === 'en' ? '/blog?lang=en' : '/blog';

  return (
    <div className="mx-auto mb-20 mt-12 max-w-screen-md">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Pencil className="text-slate-600" size={32} />
        <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
          <Link href={blogHref}> Blog </Link>
        </h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
          {language === 'ja'
            ? `${totalPosts} 記事`
            : `${totalPosts} ${totalPosts === 1 ? 'post' : 'posts'}`}
        </span>
        <div className="hidden h-px flex-1 bg-slate-200 sm:block"></div>
        <div className="ml-auto">
          <LanguageToggle language={language} />
        </div>
      </div>

      <div className="mt-6">
        <TagSection tags={allTags} language={language} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostPreview key={post.slug} {...post} language={language} />
        ))}
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        language={language}
      />
    </div>
  );
};

export default BlogPage;
