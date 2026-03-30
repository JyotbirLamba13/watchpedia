import Link from 'next/link';
import { getFeaturedWatches, getAllBrands, getAllGroups, getAllCountries, getAllWatches } from '@/lib/data';
import WatchCard from '@/components/watch/WatchCard';

export default function HomePage() {
  const featured = getFeaturedWatches();
  const brands = getAllBrands();
  const groups = getAllGroups();
  const countries = getAllCountries();
  const totalWatches = getAllWatches().length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          Watchpedia
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          The free encyclopedia of watches. {brands.length} brands, {totalWatches} references, and counting.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-watchpedia-link text-white rounded-lg hover:bg-watchpedia-link-hover transition-colors text-sm"
        >
          Search the encyclopedia
        </Link>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Browse Categories */}
        <section className="py-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Browse</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CategoryLink
              href="/brands"
              title="Brands"
              count={brands.length}
              description="Browse all watch brands from A to Z"
              icon="🏷️"
            />
            <CategoryLink
              href="/groups"
              title="Watch Groups"
              count={groups.length}
              description="Swatch Group, Richemont, LVMH, Seiko Group, and more"
              icon="🏢"
            />
            <CategoryLink
              href="/countries"
              title="By Country"
              count={countries.length}
              description="Switzerland, Japan, Germany, and beyond"
              icon="🌍"
            />
          </div>
        </section>

        {/* Featured Watches */}
        <section className="py-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Featured Watches</h2>
            <Link href="/search" className="text-sm text-watchpedia-link hover:text-watchpedia-link-hover">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((watch) => (
              <WatchCard key={`${watch.brandSlug}-${watch.slug}`} watch={watch} />
            ))}
          </div>
        </section>

        {/* Popular Brands */}
        <section className="py-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Popular Brands</h2>
            <Link href="/brands" className="text-sm text-watchpedia-link hover:text-watchpedia-link-hover">
              All brands &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {brands.slice(0, 12).map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-white text-sm"
              >
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-serif font-bold text-gray-400 shrink-0">
                  {brand.name[0]}
                </span>
                <span className="text-gray-900 truncate">{brand.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CategoryLink({
  href,
  title,
  count,
  description,
  icon,
}: {
  href: string;
  title: string;
  count: number;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900 group-hover:text-watchpedia-link">
        {title} <span className="text-gray-400 font-normal text-sm">({count})</span>
      </h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
}
