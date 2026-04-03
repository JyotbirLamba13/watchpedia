import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCountries, getBrandsByCountry, getWatchesByCountry } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Watches by Country',
  description: 'Browse watches by country of origin. Switzerland, Japan, Germany, France, USA, and more.',
};

export default function CountriesPage() {
  const countries = getAllCountries();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Countries' }]} />
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wp-dark mb-2">Watches by Country</h1>
        <p className="text-wp-muted text-sm">Explore watchmaking traditions from around the world</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => {
          const brandCount = getBrandsByCountry(country.slug).length;
          const watchCount = getWatchesByCountry(country.slug).length;
          if (brandCount === 0) return null;
          return (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="group flex items-center gap-5 p-5 rounded-xl border border-wp-border/60 bg-white card-hover"
            >
              <span className="text-5xl">{country.flag}</span>
              <div>
                <h2 className="font-display font-semibold text-wp-dark group-hover:text-wp-charcoal">
                  {country.name}
                </h2>
                <p className="text-xs text-wp-muted mt-1">
                  {brandCount} {brandCount === 1 ? 'brand' : 'brands'} &middot; {watchCount} {watchCount === 1 ? 'reference' : 'references'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
