import Link from 'next/link';
import { Bookmark, Pencil } from 'lucide-react';
import { PostMetadata } from '@/lib/blog/types';
import PostPreview from "@/components/blog/PostPreview";
import getPostMetadata from "@/lib/blog/getPostMetadata";
import getAllTags from '@/lib/blog/getAllTags';
import { POSTS_PER_PAGE } from '@/lib/blog/getPaginatedPosts';
import Pagination from '@/components/blog/Pagination';


const allTags = getAllTags();
const TagSection = (slug: string) => (
  <>
    <div className="flex flex-wrap justify-center gap-2">
      {allTags.map((tag: string) => (
        <a
          key={tag}
          href={`/blog/tags/${tag}`}
          className={`group flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200 hover:shadow-md ${tag === slug ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' : ''}`}
        >
          <Bookmark size={14} className="opacity-60 group-hover:opacity-100" />
          {tag}
        </a>
      ))}
    </div>
  </>
);

const getTagPosts = (tag: string): PostMetadata[] => {
  const posts: PostMetadata[] = getPostMetadata();
  return posts.filter((post) => post.tags?.includes(tag));
};

type TagPageProps = {
  params: {
    slug: string;
  };
};

const TagPage = ({ params, searchParams }: {
  params: { slug: string };
  searchParams: { page?: string };
}) => {
  const { slug } = params;
  const page = Number(searchParams.page) || 1;
  const allTagPosts = getTagPosts(slug);
  
  const totalPages = Math.ceil(allTagPosts.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const posts = allTagPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const tagPostPreviews = posts.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div className="mx-auto mb-20 mt-12 max-w-screen-md">
      <div className="mb-8 flex items-center gap-3">
        <Pencil className="text-slate-600" size={32} />
        <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
          <Link href="/blog"> Blog </Link>
        </h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
          {allTagPosts.length} {allTagPosts.length === 1 ? 'post' : 'posts'}
        </span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>
      <div>
        {allTags.length > 0 && TagSection(slug)}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {tagPostPreviews}
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/tags/${slug}`}
      />
    </div>
  );
};

export default TagPage;

export async function generateStaticParams() {
  return allTags.map((tag) => ({
    slug: tag,
  }));
}
