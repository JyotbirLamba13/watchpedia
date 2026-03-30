import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCountries, getBrandsByCountry, getWatchesByCountry } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Watches by Country',
  description: 'Browse watches by country of origin. Switzerland, Japan, Germany, France, USA, and more. Discover watchmaking traditions from around the world.',
};

export default function CountriesPage() {
  const countries = getAllCountries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: 'Countries' }]} />
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Watches by Country</h1>
      <p className="text-gray-600 mb-6">Explore watchmaking traditions from around the world</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => {
          const brandCount = getBrandsByCountry(country.slug).length;
          const watchCount = getWatchesByCountry(country.slug).length;
          return (
            <Link
              key={country.slug}
              href={`/countries/${country.slug}`}
              className="group flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <span className="text-4xl">{country.flag}</span>
              <div>
                <h2 className="font-semibold text-gray-900 group-hover:text-watchpedia-link">
                  {country.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {brandCount} {brandCount === 1 ? 'brand' : 'brands'} &middot; {watchCount} {watchCount === 1 ? 'watch' : 'watches'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
