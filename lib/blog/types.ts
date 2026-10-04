import type { PostIconName } from './icons';

export interface PostMetadata {
  title: string;
  date: string;
  subtitle: string;
  icon?: PostIconName;
  tags?: string[];
  slug: string;
}
