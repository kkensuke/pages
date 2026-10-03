import { PostMetadata } from './types';
import { BlogLanguage, getLocalizedPosts } from './localization';
import { BLOG_CONFIG } from '@/config/site';

export const POSTS_PER_PAGE = BLOG_CONFIG.postsPerPage;

export function getPaginatedPosts(page: number, language: BlogLanguage): {
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
} {
  const allPosts = getLocalizedPosts(language);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  
  return {
    posts: allPosts.slice(start, start + POSTS_PER_PAGE),
    totalPages,
    currentPage,
    totalPosts: allPosts.length,
  };
}
