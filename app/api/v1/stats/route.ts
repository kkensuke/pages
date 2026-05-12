import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    // Read posts directory
    const postsDir = path.join(process.cwd(), 'posts');
    
    if (!fs.existsSync(postsDir)) {
      return NextResponse.json({ totalPosts: 0, totalTags: 0, totalViews: 0, totalUsers: 0 });
    }
    
    const files = fs.readdirSync(postsDir);
    const markdownPosts = files.filter(file => file.endsWith('.md'));

    // Get all unique tags
    const allTags = new Set<string>();
    markdownPosts.forEach(fileName => {
      const fileContents = fs.readFileSync(path.join(postsDir, fileName), 'utf8');
      const { data } = matter(fileContents);
      if (data.tags) {
        data.tags.forEach((tag: string) => allTags.add(tag));
      }
    });

    const stats = {
      totalPosts: markdownPosts.length,
      totalTags: allTags.size,
      // These would need a proper analytics implementation
      totalViews: 0,
      totalUsers: 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { message: 'Error getting stats' },
      { status: 500 }
    );
  }
}