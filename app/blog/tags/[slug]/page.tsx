import BlogIndex from '@/components/blog/BlogIndex';
import getAllTags from '@/lib/blog/getAllTags';

export default function TagPage({ params, searchParams }: { params: { slug: string }; searchParams: { page?: string; lang?: string; q?: string } }) {
  return <BlogIndex tag={params.slug} searchParams={searchParams} />;
}

export function generateStaticParams() {
  return getAllTags().map(tag => ({ slug: tag }));
}
