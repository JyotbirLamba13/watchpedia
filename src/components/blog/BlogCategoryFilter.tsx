'use client';

import Link from 'next/link';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Guides', value: 'guide' },
  { label: 'Buying Guides', value: 'buying guide' },
  { label: 'Brand Stories', value: 'history' },
  { label: 'Comparisons', value: 'comparison' },
  { label: 'News & Events', value: 'event coverage' },
  { label: 'Industry', value: 'trends' },
];

export default function BlogCategoryFilter({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {CATEGORIES.map(cat => {
        const isActive = active === cat.value;
        const href = cat.value ? `/blog?category=${encodeURIComponent(cat.value)}` : '/blog';
        return (
          <Link
            key={cat.value}
            href={href}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
