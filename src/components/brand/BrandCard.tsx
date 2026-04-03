import Link from 'next/link';
import type { Brand } from '@/types';
import { getCountryBySlug, getWatchesByBrand } from '@/lib/data';

export default function BrandCard({ brand }: { brand: Brand }) {
  const country = getCountryBySlug(brand.country);
  const watchCount = getWatchesByBrand(brand.slug).length;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-wp-border/60 bg-white card-hover"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-wp-cream to-wp-light rounded-full flex items-center justify-center text-lg font-display font-bold text-wp-muted/60 shrink-0 group-hover:from-wp-dark group-hover:to-wp-charcoal group-hover:text-white transition-all duration-300">
        {brand.name[0]}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-sm font-semibold text-wp-dark group-hover:text-wp-charcoal truncate">
          {brand.name}
        </h3>
        <p className="text-[11px] text-wp-muted mt-0.5">
          {country?.flag} {country?.name} &middot; Est. {brand.founded}
        </p>
        <p className="text-[10px] text-wp-gold font-medium mt-0.5">
          {watchCount} {watchCount === 1 ? 'reference' : 'references'}
        </p>
      </div>
    </Link>
  );
}
