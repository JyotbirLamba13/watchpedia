import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWatches, getWatchByBrandAndRef, getBrandBySlug, getWatchesByBrand } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import WatchInfobox from '@/components/watch/WatchInfobox';
import WatchSpecs from '@/components/watch/WatchSpecs';
import WatchCard from '@/components/watch/WatchCard';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ brand: string; reference: string }>;
}

export async function generateStaticParams() {
  return getAllWatches().map((w) => ({
    brand: w.brandSlug,
    reference: w.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, reference } = await params;
  const watch = getWatchByBrandAndRef(brandSlug, reference);
  const brand = getBrandBySlug(brandSlug);
  if (!watch || !brand) return {};
  return {
    title: `${brand.name} ${watch.name} - Ref. ${watch.reference}`,
    description: `${brand.name} ${watch.name} (Ref. ${watch.reference}) specifications, features, and details. ${watch.specs.movementType} movement, ${watch.specs.caseDiameter} case, ${watch.specs.caseMaterial}.`,
    openGraph: {
      title: `${brand.name} ${watch.name} | Watchpedia`,
      description: `Complete specifications for the ${brand.name} ${watch.name}. Ref. ${watch.reference}.`,
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const { brand: brandSlug, reference } = await params;
  const watch = getWatchByBrandAndRef(brandSlug, reference);
  const brand = getBrandBySlug(brandSlug);
  if (!watch || !brand) notFound();

  const relatedWatches = getWatchesByBrand(brand.slug).filter((w) => w.slug !== watch.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brand.name} ${watch.name}`,
    description: watch.description,
    brand: { '@type': 'Brand', name: brand.name },
    model: watch.reference,
    category: 'Watches',
    ...(watch.specs.price && {
      offers: {
        '@type': 'Offer',
        price: watch.specs.price.replace(/[^0-9.]/g, ''),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: 'Brands', href: '/brands' },
          { label: brand.name, href: `/brands/${brand.slug}` },
          { label: watch.name },
        ]}
      />

      <div className="clearfix">
        <WatchInfobox watch={watch} brand={brand} />

        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
          {brand.name} {watch.name}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Reference {watch.reference} &middot; {watch.collection} collection
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">{watch.description}</p>
      </div>

      {/* Full Specifications */}
      <section className="mt-8">
        <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
          Specifications
        </h2>
        <WatchSpecs specs={watch.specs} />
      </section>

      {/* Complications */}
      {watch.specs.complications && watch.specs.complications.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
            Complications &amp; Features
          </h2>
          <div className="flex flex-wrap gap-2">
            {watch.specs.complications.map((c) => (
              <span key={c} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related Watches */}
      {relatedWatches.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-gray-900">
              More from {brand.name}
            </h2>
            <Link href={`/brands/${brand.slug}`} className="text-sm text-watchpedia-link hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedWatches.map((w) => (
              <WatchCard key={`${w.brandSlug}-${w.slug}`} watch={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
