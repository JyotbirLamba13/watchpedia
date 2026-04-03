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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Brands' }]} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wp-dark mb-2">All Watch Brands</h1>
        <p className="text-wp-muted text-sm">{brands.length} brands from around the world</p>
      </div>

      {/* Alphabet filter */}
      <nav className="flex flex-wrap gap-1.5 mb-10 sticky top-16 z-40 bg-white/90 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-wp-border/40">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium text-wp-muted hover:bg-wp-dark hover:text-white transition-all duration-200"
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* Brands by letter */}
      {letters.map((letter) => {
        const letterBrands = brands.filter((b) => b.name[0].toUpperCase() === letter);
        return (
          <section key={letter} id={`letter-${letter}`} className="mb-10 scroll-mt-32">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-wp-dark text-white rounded-lg flex items-center justify-center font-display text-lg font-bold">
                {letter}
              </span>
              <div className="flex-1 h-px bg-wp-border/40" />
              <span className="text-xs text-wp-muted">{letterBrands.length} {letterBrands.length === 1 ? 'brand' : 'brands'}</span>
            </div>
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
