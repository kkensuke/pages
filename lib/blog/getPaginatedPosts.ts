import getPostMetadata from './getPostMetadata';
import { PostMetadata } from './types';

export const POSTS_PER_PAGE = 20;

export function getPaginatedPosts(page: number): {
  posts: PostMetadata[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
} {
  const allPosts = getPostMetadata();
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