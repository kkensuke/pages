import { getLocalizedPosts, getPostLanguage } from './localization';
import type { PostMetadata } from './types';

export type PostLinks = {
  previous: PostMetadata | null;
  next: PostMetadata | null;
  related: PostMetadata[];
};

export default function getPostLinks(slug: string): PostLinks {
  const posts = getLocalizedPosts(getPostLanguage(slug));
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null, related: [] };
  }

  const previous = posts[currentIndex + 1] || null;
  const next = posts[currentIndex - 1] || null;
  const currentTags = new Set(posts[currentIndex].tags || []);
  const excludedSlugs = new Set([slug, previous?.slug, next?.slug]);
  const related = posts
    .filter((post) => !excludedSlugs.has(post.slug))
    .map((post, index) => ({
      post,
      index,
      score: (post.tags || []).filter((tag) => currentTags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ post }) => post);

  return {
    previous,
    next,
    related,
  };
}
