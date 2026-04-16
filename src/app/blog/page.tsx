import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPosts } from '@/lib/blog';
import JsonLd from '@/components/seo/JsonLd';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';

export const metadata: Metadata = {
  title: 'Blog - Watch News, Guides & Reviews',
  description: 'Read the latest watch news, buying guides, brand histories, and in-depth reviews. Expert insights from the Watchpedia team.',
  openGraph: {
    title: 'Blog - Watch News, Guides & Reviews | Watchpedia',
    description: 'Read the latest watch news, buying guides, brand histories, and in-depth reviews.',
    url: 'https://watchpedia.org/blog',
  },
};

export const revalidate = 3600; // Revalidate every hour

// Maps category filter values to the tags they match
const CATEGORY_TAG_MAP: Record<string, string[]> = {
  'guide': ['guide', 'education'],
  'buying guide': ['buying guide', 'affordable', 'budget'],
  'history': ['history', 'heritage'],
  'comparison': ['comparison'],
  'event coverage': ['event coverage', 'watches and wonders', 'new releases'],
  'trends': ['trends', 'industry'],
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { category } = await searchParams;
  const activeCategory = typeof category === 'string' ? category : '';

  const allPosts = await getPublishedPosts();

  const posts = activeCategory && CATEGORY_TAG_MAP[activeCategory]
    ? allPosts.filter(post =>
        post.tags?.some(tag => CATEGORY_TAG_MAP[activeCategory].includes(tag))
      )
    : allPosts;

  const blogListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Watchpedia Blog',
    description: 'Watch news, buying guides, brand histories, and in-depth reviews.',
    url: 'https://watchpedia.org/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Watchpedia',
    },
    blogPost: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://watchpedia.org/blog/${post.slug}`,
      datePublished: post.published_at,
      author: { '@type': 'Person', name: post.author || 'Watchpedia' },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={blogListJsonLd} />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            The Watchpedia Blog
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Expert guides, brand stories, and everything you need to know about the world of watches.
          </p>
          <BlogCategoryFilter active={activeCategory} />
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium mb-2">No posts found</p>
            <p className="text-sm">Try a different category or <Link href="/blog" className="text-amber-700 underline">view all posts</Link>.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className={`group ${i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  {post.cover_image && (
                    <div className={`relative overflow-hidden rounded-xl bg-gray-100 mb-4 ${i === 0 ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes={i === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
                        unoptimized
                      />
                    </div>
                  )}
                  {!post.cover_image && (
                    <div className={`rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 mb-4 flex items-center justify-center ${i === 0 ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
                      <span className="text-white/30 text-6xl font-display">W</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className={`font-display font-bold text-gray-900 group-hover:text-amber-700 transition-colors ${i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      <span>{post.author || 'Watchpedia'}</span>
                      <span>&middot;</span>
                      <time dateTime={post.published_at || post.created_at}>
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
