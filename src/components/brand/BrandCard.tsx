import Link from 'next/link';
import type { Brand } from '@/types';
import { getCountryBySlug, getWatchesByBrand } from '@/lib/data';

export default function BrandCard({ brand }: { brand: Brand }) {
  const country = getCountryBySlug(brand.country);
  const watchCount = getWatchesByBrand(brand.slug).length;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-white"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg font-serif font-bold text-gray-400 shrink-0">
        {brand.name[0]}
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-sm text-gray-900 group-hover:text-watchpedia-link truncate">
          {brand.name}
        </h3>
        <p className="text-xs text-gray-500">
          {country?.flag} {country?.name} · Est. {brand.founded} · {watchCount} {watchCount === 1 ? 'watch' : 'watches'}
        </p>
      </div>
    </Link>
  );
}
