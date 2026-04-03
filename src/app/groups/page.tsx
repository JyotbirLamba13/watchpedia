import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGroups, getBrandsByGroup, getCountryBySlug } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Watch Groups & Conglomerates',
  description: 'Browse the major watch industry groups and conglomerates. Swatch Group, Richemont, LVMH, Seiko Group, and more.',
};

export default function GroupsPage() {
  const groups = getAllGroups();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: 'Groups' }]} />
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wp-dark mb-2">Watch Groups &amp; Conglomerates</h1>
        <p className="text-wp-muted text-sm">The major companies that own the world&apos;s watch brands</p>
      </div>

      <div className="space-y-4">
        {groups.map((group) => {
          const brands = getBrandsByGroup(group.slug);
          const country = getCountryBySlug(group.country);
          return (
            <Link
              key={group.slug}
              href={`/groups/${group.slug}`}
              className="group block p-6 rounded-xl border border-wp-border/60 bg-white card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-wp-dark group-hover:text-wp-charcoal">
                    {group.name}
                  </h2>
                  <p className="text-xs text-wp-muted mt-1">
                    {country?.flag} {country?.name} &middot; {brands.length} brands
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-wp-border/40 flex items-center justify-center group-hover:border-wp-dark/30 transition-colors shrink-0">
                  <svg className="w-4 h-4 text-wp-muted/40 group-hover:text-wp-dark transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-wp-muted line-clamp-2 mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((b) => (
                  <span key={b.slug} className="px-2.5 py-1 bg-wp-cream border border-wp-border/40 rounded-full text-[11px] text-wp-dark/70">
                    {b.name}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
