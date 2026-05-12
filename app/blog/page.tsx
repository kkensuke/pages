import React from 'react';
import Link from 'next/link';
import { Bookmark, Pencil } from 'lucide-react';
import getPostMetadata from "@/lib/blog/getPostMetadata";
import getAllTags from "@/lib/blog/getAllTags";
import PostPreview from "@/components/blog/PostPreview";
import Pagination from '@/components/blog/Pagination';
import { getPaginatedPosts } from '@/lib/blog/getPaginatedPosts';


const TagSection = ({ tags, activeTag }: { tags: string[]; activeTag?: string }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {tags.map((tag: string) => (
      
      <a
        key={tag}
        href={`/blog/tags/${tag}`}
        className={`group flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 hover:shadow-md ${
          tag === activeTag ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' : ''
        }`}
      >
        <Bookmark size={14} className="opacity-60 group-hover:opacity-100" />
        {tag}
      </a>
    ))}
  </div>
);


const BlogPage = ({ searchParams }: { searchParams: { page?: string } }) => {
  const page = Number(searchParams.page) || 1;
  const { posts, totalPages, currentPage } = getPaginatedPosts(page);
  const allTags = getAllTags();

  return (
    <div className="mx-auto mb-20 mt-12 max-w-screen-md">
      <div className="mb-8 flex items-center gap-3">
        <Pencil className="text-slate-600" size={32} />
        <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
          <Link href="/blog"> Blog </Link>
        </h1>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      {allTags.length > 0 && <TagSection tags={allTags} />}

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </div>
      
      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default BlogPage;