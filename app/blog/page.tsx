import React from 'react';
import Link from 'next/link';
import { Bookmark, Pencil } from 'lucide-react';
import getAllTags from "@/lib/blog/getAllTags";
import PostPreview from "@/components/blog/PostPreview";
import Pagination from '@/components/blog/Pagination';
import { getPaginatedPosts } from '@/lib/blog/getPaginatedPosts';
import TagSection from '@/components/blog/TagSection';


const BlogPage = ({ searchParams }: { searchParams: { page?: string } }) => {
  const page = Number(searchParams.page) || 1;
  const { posts, totalPages, currentPage, totalPosts } = getPaginatedPosts(page);
  const allTags = getAllTags();

  return (
    <div className="mx-auto mb-20 mt-12 max-w-screen-md">
      <div className="mb-8 flex items-center gap-3">
        <Pencil className="text-slate-600" size={32} />
        <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
          <Link href="/blog"> Blog </Link>
        </h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
          {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}
        </span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <TagSection tags={allTags} />

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