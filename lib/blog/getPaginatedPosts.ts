import { PostMetadata } from './types';
import { BlogLanguage, getLocalizedPosts } from './localization';
import { BLOG_CONFIG } from '@/config/site';

export const POSTS_PER_PAGE = BLOG_CONFIG.postsPerPage;

export function getPaginatedPosts(page: number, language: BlogLanguage, { tag, query = '' }: { tag?: string; query?: string } = {}): {
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
} {
  const keyword = query.trim().normalize('NFKC').toLocaleLowerCase();
  const allPosts = getLocalizedPosts(language).filter(post =>
    (!tag || post.tags?.includes(tag)) &&
    [post.title, post.subtitle, ...(post.tags || [])].join(' ').normalize('NFKC').toLocaleLowerCase().includes(keyword)
  );
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.max(1, Math.min(Number.isSafeInteger(page) ? page : 1, totalPages));
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  
  return {
    posts: allPosts.slice(start, start + POSTS_PER_PAGE),
    totalPages,
    currentPage,
    totalPosts: allPosts.length,
  };
}
