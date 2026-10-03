import BlogIndex from '@/components/blog/BlogIndex';

export default function BlogPage({ searchParams }: { searchParams: { page?: string; lang?: string; q?: string } }) {
  return <BlogIndex searchParams={searchParams} />;
}
