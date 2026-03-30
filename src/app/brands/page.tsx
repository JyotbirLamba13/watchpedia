import type { Metadata } from 'next';
import { getAllBrands } from '@/lib/data';
import BrandCard from '@/components/brand/BrandCard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'All Watch Brands A-Z',
  description:
    'Browse every watch brand in the world alphabetically. From Audemars Piguet to Zenith, find detailed information about each brand, their history, and watch collections.',
};

export default function BrandsPage() {
  const brands = getAllBrands();
  const letters = [...new Set(brands.map((b) => b.name[0].toUpperCase()))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: 'Brands' }]} />
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">All Watch Brands</h1>
      <p className="text-gray-600 mb-6">{brands.length} brands from around the world</p>

      {/* Alphabet filter */}
      <nav className="flex flex-wrap gap-1 mb-8 text-sm">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-watchpedia-link hover:text-white transition-colors"
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* Brands by letter */}
      {letters.map((letter) => {
        const letterBrands = brands.filter((b) => b.name[0].toUpperCase() === letter);
        return (
          <section key={letter} id={`letter-${letter}`} className="mb-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">
              {letter}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {letterBrands.map((brand) => (
                <BrandCard key={brand.slug} brand={brand} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
