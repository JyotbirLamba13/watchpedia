import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllGroups, getGroupBySlug, getBrandsByGroup, getCountryBySlug, getWatchesByBrand } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import BrandCard from '@/components/brand/BrandCard';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ group: string }>;
}

export async function generateStaticParams() {
  return getAllGroups().map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group: slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) return {};
  return {
    title: `${group.name} - Watch Brands & Collections`,
    description: `${group.name} watch group. Browse all brands owned by ${group.name}.`,
  };
}

export default async function GroupPage({ params }: Props) {
  const { group: slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) notFound();

  const brands = getBrandsByGroup(group.slug);
  const country = getCountryBySlug(group.country);
  const totalWatches = brands.reduce((sum, b) => sum + getWatchesByBrand(b.slug).length, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: group.name,
    description: group.description,
    ...(group.website && { url: group.website }),
    subOrganization: brands.map((b) => ({ '@type': 'Organization', name: b.name })),
  };

  return (
    <div>
      <div className="bg-wp-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <p className="text-wp-gold text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Watch Group</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{group.name}</h1>
          <p className="text-white/50 text-sm">
            {country?.flag} {country?.name} &middot; {brands.length} brands &middot; {totalWatches} references
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JsonLd data={jsonLd} />
        <Breadcrumbs items={[{ label: 'Groups', href: '/groups' }, { label: group.name }]} />

        <div className="max-w-3xl mb-12">
          <p className="text-wp-dark/80 leading-relaxed">{group.description}</p>
          {group.website && (
            <p className="mt-4">
              <a href={group.website} target="_blank" rel="noopener noreferrer" className="text-sm text-wp-gold hover:underline">
                Official website &rarr;
              </a>
            </p>
          )}
        </div>

        <section>
          <h2 className="font-display text-2xl font-bold text-wp-dark mb-6">
            Brands <span className="text-wp-muted font-normal text-base ml-1">({brands.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {brands.map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
