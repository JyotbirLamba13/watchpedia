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
    description: `${group.name} watch group. Browse all brands owned by ${group.name} including their complete watch collections and specifications.`,
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
    subOrganization: brands.map((b) => ({
      '@type': 'Organization',
      name: b.name,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: 'Groups', href: '/groups' }, { label: group.name }]} />

      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">{group.name}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {country?.flag} {country?.name} &middot; {brands.length} brands &middot; {totalWatches} watches
      </p>
      <p className="text-gray-700 leading-relaxed mb-8">{group.description}</p>

      {group.website && (
        <p className="text-sm mb-6">
          <a href={group.website} target="_blank" rel="noopener noreferrer" className="text-watchpedia-link hover:underline">
            Official website &rarr;
          </a>
        </p>
      )}

      <section>
        <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
          Brands ({brands.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {brands.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
}
