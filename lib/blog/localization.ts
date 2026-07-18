import fs from 'fs';
import path from 'path';
import getPostMetadata from './getPostMetadata';
import { PostMetadata } from './types';

export type BlogLanguage = 'ja' | 'en';

export const getBlogLanguage = (language?: string): BlogLanguage =>
  language === 'en' ? 'en' : 'ja';

export const getPostLanguage = (slug: string): BlogLanguage =>
  slug.endsWith('.en') ? 'en' : 'ja';

export const getAlternatePostSlug = (slug: string): string | null => {
  const alternateSlug = getPostLanguage(slug) === 'en'
    ? slug.slice(0, -3)
    : `${slug}.en`;
  const file = path.join(process.cwd(), 'posts', `${alternateSlug}.md`);

  return fs.existsSync(file) ? alternateSlug : null;
};

export const getLocalizedPosts = (language: BlogLanguage): PostMetadata[] => {
  const groups = new Map<string, Partial<Record<BlogLanguage, PostMetadata>>>();

  getPostMetadata().forEach((post) => {
    const postLanguage = getPostLanguage(post.slug);
    const baseSlug = postLanguage === 'en' ? post.slug.slice(0, -3) : post.slug;
    const group = groups.get(baseSlug) || {};

    group[postLanguage] = post;
    groups.set(baseSlug, group);
  });

  const posts = Array.from(groups.values())
  .map((group) => group[language])
  // .map((group) => group[language] || group.ja || group.en) // Fallback to ja or en if the requested language is not available
  .filter((post): post is PostMetadata => Boolean(post));

  return posts.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    return dateComparison || a.title.localeCompare(b.title);
  });
};
