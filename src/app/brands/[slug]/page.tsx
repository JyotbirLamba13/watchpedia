import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getBrandBySlug, getWatchesByBrand, getGroupBySlug, getCountryBySlug } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import WatchGrid from '@/components/watch/WatchGrid';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Watches`,
    description: `${brand.name} watch encyclopedia. Browse all ${brand.name} collections, references, and specifications. Founded ${brand.founded}.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const watches = getWatchesByBrand(brand.slug);
  const group = brand.groupSlug ? getGroupBySlug(brand.groupSlug) : null;
  const country = getCountryBySlug(brand.country);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    description: brand.description,
    foundingDate: String(brand.founded),
    ...(brand.website && { url: brand.website }),
    ...(group && { parentOrganization: { '@type': 'Organization', name: group.name } }),
  };

  return (
    <div>
      {/* Brand hero */}
      <div className="bg-wp-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-display font-bold text-white shrink-0">
              {brand.name[0]}
            </div>
            <div>
              <p className="text-wp-gold text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">
                {country?.flag} {country?.name} &middot; Est. {brand.founded}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{brand.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                {group && (
                  <Link href={`/groups/${group.slug}`} className="hover:text-wp-gold transition-colors">
                    {group.name}
                  </Link>
                )}
                <span>{watches.length} references</span>
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:text-wp-gold transition-colors">
                    Official site &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={[{ label: 'Brands', href: '/brands' }, { label: brand.name }]} />

        {/* Description */}
        <div className="max-w-3xl mb-12">
          <p className="text-wp-dark/80 leading-relaxed">{brand.description}</p>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <FactCard label="Founded" value={String(brand.founded)} />
          <FactCard label="Country" value={`${country?.flag} ${country?.name}`} />
          <FactCard label="Group" value={group?.name ?? 'Independent'} />
          <FactCard label="References" value={String(watches.length)} />
        </div>

        {/* Watches */}
        {watches.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-wp-dark mb-6">
              Watches
              <span className="text-wp-muted font-normal text-base ml-2">({watches.length})</span>
            </h2>
            <WatchGrid watches={watches} />
          </section>
        )}
      </div>
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-wp-cream border border-wp-border/40">
      <p className="text-[10px] uppercase tracking-wider text-wp-muted mb-1">{label}</p>
      <p className="text-sm font-display font-semibold text-wp-dark">{value}</p>
    </div>
  );
}
