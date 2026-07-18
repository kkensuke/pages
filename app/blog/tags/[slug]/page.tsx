import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { PostMetadata } from '@/lib/blog/types';
import PostPreview from "@/components/blog/PostPreview";
import getAllTags from '@/lib/blog/getAllTags';
import { POSTS_PER_PAGE } from '@/lib/blog/getPaginatedPosts';
import Pagination from '@/components/blog/Pagination';
import TagSection from '@/components/blog/TagSection';
import LanguageToggle from '@/components/blog/LanguageToggle';
import { getBlogLanguage, getLocalizedPosts } from '@/lib/blog/localization';
import type { BlogLanguage } from '@/lib/blog/localization';


const allTagSlugs = getAllTags();

const getTagPosts = (tag: string, language: BlogLanguage): PostMetadata[] => {
  const posts: PostMetadata[] = getLocalizedPosts(language);
  return posts.filter((post) => post.tags?.includes(tag));
};

const TagPage = ({ params, searchParams }: {
  params: { slug: string };
  searchParams: { page?: string; lang?: string };
}) => {
  const { slug } = params;
  const page = Number(searchParams.page) || 1;
  const language = getBlogLanguage(searchParams.lang);
  const allTags = getAllTags(language);
  const allTagPosts = getTagPosts(slug, language);
  const basePath = `/blog/tags/${slug}`;
  const blogHref = language === 'en' ? '/blog?lang=en' : '/blog';
  
  const totalPages = Math.ceil(allTagPosts.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const posts = allTagPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const tagPostPreviews = posts.map((post) => (
    <PostPreview key={post.slug} {...post} language={language} />
  ));

  return (
    <div className="mx-auto mb-20 mt-12 max-w-screen-md">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Pencil className="text-slate-600" size={32} />
        <h1 className="bg-clip-text text-4xl font-bold text-slate-700">
          <Link href={blogHref}> Blog </Link>
        </h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
          {language === 'ja'
            ? `${allTagPosts.length} 記事`
            : `${allTagPosts.length} ${allTagPosts.length === 1 ? 'post' : 'posts'}`}
        </span>
        <div className="hidden h-px flex-1 bg-slate-200 sm:block"></div>
        <div className="ml-auto">
          <LanguageToggle language={language} basePath={basePath} />
        </div>
      </div>

      <div className="mb-10 mt-6">
        <TagSection tags={allTags} activeTag={slug} language={language} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {tagPostPreviews}
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        language={language}
      />
    </div>
  );
};

export default TagPage;

export async function generateStaticParams() {
  return allTagSlugs.map((tag) => ({
    slug: tag,
  }));
}
