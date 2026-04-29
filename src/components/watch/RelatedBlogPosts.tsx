import Link from 'next/link';
import Image from 'next/image';
import type { BlogPostSummary } from '@/lib/blog';

export default function RelatedBlogPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (!posts.length) return null;

  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-bold text-wp-dark mb-4">From the Blog</h2>
      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex gap-4 items-start p-4 rounded-xl border border-wp-border/40 hover:border-wp-gold/40 hover:bg-wp-cream/40 transition-colors group"
          >
            {post.cover_image ? (
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-wp-cream">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 shrink-0 rounded-lg bg-wp-dark flex items-center justify-center">
                <span className="text-white/30 text-xl font-display font-bold">W</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-wp-gold mb-1 uppercase tracking-wide">
                {post.tags?.[0] ?? 'Article'}
              </p>
              <p className="text-sm font-semibold text-wp-dark group-hover:text-wp-charcoal leading-snug line-clamp-2">
                {post.title}
              </p>
              {post.excerpt && (
                <p className="text-xs text-wp-muted mt-1 line-clamp-1">{post.excerpt}</p>
              )}
            </div>
            <svg className="w-4 h-4 text-wp-muted shrink-0 mt-1 group-hover:text-wp-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
