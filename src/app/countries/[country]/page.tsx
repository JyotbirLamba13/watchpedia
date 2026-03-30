import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCountries, getCountryBySlug, getBrandsByCountry, getWatchesByCountry } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import BrandCard from '@/components/brand/BrandCard';
import WatchGrid from '@/components/watch/WatchGrid';

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return getAllCountries().map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} Watch Brands`,
    description: `Discover watch brands from ${country.name}. Browse all ${country.name} watchmakers and their collections.`,
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const brands = getBrandsByCountry(country.slug);
  const watches = getWatchesByCountry(country.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: 'Countries', href: '/countries' }, { label: country.name }]} />

      <div className="flex items-center gap-3 mb-6">
        <span className="text-5xl">{country.flag}</span>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">{country.name}</h1>
          <p className="text-gray-600">{brands.length} brands &middot; {watches.length} watches</p>
        </div>
      </div>

      {brands.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
            Brands from {country.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {brands.map((brand) => (
              <BrandCard key={brand.slug} brand={brand} />
            ))}
          </div>
        </section>
      )}

      {watches.length > 0 && (
        <section>
          <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
            All Watches ({watches.length})
          </h2>
          <WatchGrid watches={watches} />
        </section>
      )}
    </div>
  );
}
