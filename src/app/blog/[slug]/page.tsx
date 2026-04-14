import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  const title = post.title;
  const description = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://watchpedia.org/blog/${post.slug}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author || 'Watchpedia'],
      tags: post.tags,
      images: post.cover_image ? [{ url: post.cover_image, width: 1920, height: 1080 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: `https://watchpedia.org/blog/${post.slug}`,
    },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readTime = Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160),
    image: post.cover_image || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Watchpedia',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Watchpedia',
      url: 'https://watchpedia.org',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://watchpedia.org/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://watchpedia.org' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://watchpedia.org/blog' },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gray-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-10">
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                {(post.author || 'W')[0]}
              </div>
              <span className="font-medium text-gray-700">{post.author || 'Watchpedia'}</span>
            </div>
            <span>&middot;</span>
            <time dateTime={post.published_at || post.created_at}>
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
            <span>&middot;</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-10 bg-gray-100">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-amber-300 prose-blockquote:bg-amber-50/30 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="flex items-center justify-between">
            <Link href="/blog" className="text-sm text-amber-700 hover:underline font-medium">
              &larr; Back to Blog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
