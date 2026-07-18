import getPostMetadata from "./getPostMetadata";
import { BlogLanguage, getLocalizedPosts } from "./localization";

const getAllTags = (language?: BlogLanguage): string[] => {
  const allPosts = language ? getLocalizedPosts(language) : getPostMetadata();
  const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || [])));
  return allTags
};

export default getAllTags;
