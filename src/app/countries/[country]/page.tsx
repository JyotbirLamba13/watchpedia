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
    <div>
      <div className="bg-wp-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-5">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{country.name}</h1>
              <p className="text-white/50 text-sm mt-1">{brands.length} brands &middot; {watches.length} references</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: 'Countries', href: '/countries' }, { label: country.name }]} />

        {brands.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-wp-dark mb-6">
              Brands <span className="text-wp-muted font-normal text-base ml-1">({brands.length})</span>
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
            <h2 className="font-display text-2xl font-bold text-wp-dark mb-6">
              All Watches <span className="text-wp-muted font-normal text-base ml-1">({watches.length})</span>
            </h2>
            <WatchGrid watches={watches} />
          </section>
        )}
      </div>
    </div>
  );
}
