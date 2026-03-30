import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGroups, getBrandsByGroup, getCountryBySlug } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Watch Groups & Conglomerates',
  description: 'Browse the major watch industry groups and conglomerates. Swatch Group, Richemont, LVMH, Seiko Group, Citizen Group, and more.',
};

export default function GroupsPage() {
  const groups = getAllGroups();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs items={[{ label: 'Groups' }]} />
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Watch Groups &amp; Conglomerates</h1>
      <p className="text-gray-600 mb-6">The major companies that own the world&apos;s watch brands</p>

      <div className="space-y-4">
        {groups.map((group) => {
          const brands = getBrandsByGroup(group.slug);
          const country = getCountryBySlug(group.country);
          return (
            <Link
              key={group.slug}
              href={`/groups/${group.slug}`}
              className="group block p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-watchpedia-link">
                    {group.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {country?.flag} {country?.name} &middot; {brands.length} brands
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{group.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {brands.map((b) => (
                  <span key={b.slug} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
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
