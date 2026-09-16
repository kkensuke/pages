import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostMetadata } from "./types";

const getPostMetadata = (): PostMetadata[] => {
  const folder = path.join(process.cwd(), "posts");
  
  // Safely return empty array if directory doesn't exist
  if (!fs.existsSync(folder)) {
    return [];
  }

  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));

  // Only publish posts with usable metadata. Empty files can be draft placeholders.
  const posts: PostMetadata[] = markdownPosts.flatMap((fileName) => {
    const fileContents = fs.readFileSync(path.join(folder, fileName), "utf8");
    if (!fileContents.trim()) return [];

    const { data } = matter(fileContents);
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const date = data.date instanceof Date
      ? data.date
      : typeof data.date === "string" && data.date.trim()
        ? new Date(data.date)
        : null;

    if (!title || !date || Number.isNaN(date.getTime())) {
      console.warn(`Skipping ${fileName}: posts require a title and a valid date.`);
      return [];
    }

    return [{
      title,
      // YAML parses unquoted dates as Date objects; consumers expect a string.
      date: data.date instanceof Date ? date.toISOString() : data.date.trim(),
      subtitle: typeof data.subtitle === "string" ? data.subtitle : "",
      previewImage: typeof data.previewImage === "string" ? data.previewImage : undefined,
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag: unknown): tag is string => typeof tag === "string")
        : [],
      slug: fileName.slice(0, -3),
    }];
  });
  
  // Sort post metadata by date in descending order
  posts.sort((a, b) => {
    // First, compare dates
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    // If dates are the same, compare titles
    if (dateComparison === 0) {
      return a.title.localeCompare(b.title);
    }
    return dateComparison;
  });
  
  return posts;
};

export default getPostMetadata;
