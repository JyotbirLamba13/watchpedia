import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllWatches, getWatchByBrandAndRef, getBrandBySlug, getWatchesByBrand } from '@/lib/data';
import { getPostsMentioningWatch } from '@/lib/blog';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import WatchInfobox from '@/components/watch/WatchInfobox';
import WatchSpecs from '@/components/watch/WatchSpecs';
import SpotMistake from '@/components/watch/SpotMistake';
import WatchCard from '@/components/watch/WatchCard';
import RelatedBlogPosts from '@/components/watch/RelatedBlogPosts';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 3600;

interface Props {
  params: Promise<{ brand: string; reference: string }>;
}

export async function generateStaticParams() {
  return getAllWatches().map((w) => ({ brand: w.brandSlug, reference: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug, reference } = await params;
  const watch = getWatchByBrandAndRef(brandSlug, reference);
  const brand = getBrandBySlug(brandSlug);
  if (!watch || !brand) return {};
  return {
    title: `${brand.name} ${watch.name} - Ref. ${watch.reference}`,
    description: `${brand.name} ${watch.name} (Ref. ${watch.reference}) — ${watch.specs.movementType}, ${watch.specs.caseDiameter} ${watch.specs.caseMaterial}. Full specifications and details.`,
  };
}

export default async function WatchPage({ params }: Props) {
  const { brand: brandSlug, reference } = await params;
  const watch = getWatchByBrandAndRef(brandSlug, reference);
  const brand = getBrandBySlug(brandSlug);
  if (!watch || !brand) notFound();

  const relatedWatches = getWatchesByBrand(brand.slug).filter((w) => w.slug !== watch.slug).slice(0, 4);
  const relatedPosts = await getPostsMentioningWatch(watch.name, brand.name, watch.reference);

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
    <div>
      <JsonLd data={jsonLd} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs
          items={[
            { label: 'Brands', href: '/brands' },
            { label: brand.name, href: `/brands/${brand.slug}` },
            { label: watch.name },
          ]}
        />

        <div className="lg:flex lg:gap-10">
          {/* Infobox - right side on desktop */}
          <div className="lg:order-2 lg:w-80 shrink-0 mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              <WatchInfobox watch={watch} brand={brand} />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:order-1 flex-1 min-w-0">
            <p className="text-wp-gold text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">
              {brand.name} &middot; {watch.collection}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-wp-dark mb-2">
              {watch.name}
            </h1>
            <p className="text-sm text-wp-muted mb-8">
              Reference {watch.reference}
              {watch.specs.yearIntroduced && <> &middot; Introduced {watch.specs.yearIntroduced}</>}
            </p>

            <div className="prose prose-sm max-w-none mb-10">
              <p className="text-wp-dark/80 leading-relaxed text-[15px]">{watch.description}</p>
            </div>

            {/* History */}
            {watch.history && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-wp-dark mb-4">History &amp; Heritage</h2>
                <p className="text-wp-dark/80 leading-relaxed text-[15px]">{watch.history}</p>
              </section>
            )}

            {/* Notable Wearers */}
            {watch.notableWearers && watch.notableWearers.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-wp-dark mb-4">Notable Wearers</h2>
                <div className="flex flex-wrap gap-2">
                  {watch.notableWearers.map((person) => (
                    <span key={person} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-wp-dark text-white rounded-full text-xs font-medium">
                      <svg className="w-3 h-3 text-wp-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-7 9a7 7 0 1 1 14 0H3Z"/></svg>
                      {person}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Related Blog Posts */}
            <RelatedBlogPosts posts={relatedPosts} />

            {/* Record Sale */}
            {watch.highestSalePrice && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-wp-dark mb-4">Record Sale</h2>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-wp-gold/5 border border-wp-gold/20">
                  <svg className="w-5 h-5 text-wp-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <p className="text-sm text-wp-dark leading-relaxed">{watch.highestSalePrice}</p>
                </div>
              </section>
            )}

            {/* Fun Facts */}
            {watch.funFacts && watch.funFacts.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-wp-dark mb-4">Did You Know?</h2>
                <ul className="space-y-3">
                  {watch.funFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-wp-gold text-white text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <p className="text-sm text-wp-dark/80 leading-relaxed">{fact}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Complications */}
            {watch.specs.complications && watch.specs.complications.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-bold text-wp-dark mb-4">
                  Complications &amp; Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {watch.specs.complications.map((c) => (
                    <span key={c} className="px-3.5 py-1.5 bg-wp-cream border border-wp-border/40 rounded-full text-xs font-medium text-wp-dark">
                      {c}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Full Specifications */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-wp-dark mb-4">
                Full Specifications
              </h2>
              <WatchSpecs specs={watch.specs} />
              <SpotMistake watch={watch} brand={brand} />
            </section>
          </div>
        </div>

        {/* Related Watches */}
        {relatedWatches.length > 0 && (
          <section className="mt-16 pt-12 border-t border-wp-border/40">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-wp-dark">More from {brand.name}</h2>
                <p className="text-sm text-wp-muted mt-1">Explore other references from this manufacturer</p>
              </div>
              <Link href={`/brands/${brand.slug}`} className="hidden sm:flex items-center gap-1 text-sm text-wp-muted hover:text-wp-dark transition-colors">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedWatches.map((w) => (
                <WatchCard key={`${w.brandSlug}-${w.slug}`} watch={w} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
