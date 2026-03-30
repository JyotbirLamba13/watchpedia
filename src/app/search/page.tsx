'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Import search index data directly — this gets bundled at build time
import brandsData from '@/data/brands.json';
import watchesData from '@/data/watches.json';
import groupsData from '@/data/groups.json';
import countriesData from '@/data/countries.json';

interface SearchEntry {
  title: string;
  subtitle: string;
  url: string;
  type: 'brand' | 'watch' | 'group' | 'country';
  keywords: string;
}

function buildSearchIndex(): SearchEntry[] {
  const index: SearchEntry[] = [];

  for (const brand of brandsData) {
    index.push({
      title: brand.name,
      subtitle: `Est. ${brand.founded} · ${brand.country}`,
      url: `/brands/${brand.slug}`,
      type: 'brand',
      keywords: `${brand.name} ${brand.slug} ${brand.country} ${brand.founded}`.toLowerCase(),
    });
  }

  for (const watch of watchesData) {
    const brand = brandsData.find((b) => b.slug === watch.brandSlug);
    index.push({
      title: `${brand?.name ?? watch.brandSlug} ${watch.name}`,
      subtitle: `Ref. ${watch.reference} · ${watch.collection}`,
      url: `/watches/${watch.brandSlug}/${watch.slug}`,
      type: 'watch',
      keywords: `${brand?.name} ${watch.name} ${watch.reference} ${watch.slug} ${watch.collection} ${watch.specs.movement} ${watch.specs.movementType} ${watch.specs.caseMaterial} ${watch.specs.dialColor}`.toLowerCase(),
    });
  }

  for (const group of groupsData) {
    index.push({
      title: group.name,
      subtitle: `${group.brandSlugs.length} brands`,
      url: `/groups/${group.slug}`,
      type: 'group',
      keywords: `${group.name} ${group.slug}`.toLowerCase(),
    });
  }

  for (const country of countriesData) {
    index.push({
      title: `${country.flag} ${country.name}`,
      subtitle: 'Country',
      url: `/countries/${country.slug}`,
      type: 'country',
      keywords: `${country.name} ${country.slug}`.toLowerCase(),
    });
  }

  return index;
}

const typeLabels: Record<string, string> = {
  brand: 'Brand',
  watch: 'Watch',
  group: 'Group',
  country: 'Country',
};

const typeColors: Record<string, string> = {
  brand: 'bg-blue-100 text-blue-700',
  watch: 'bg-green-100 text-green-700',
  group: 'bg-purple-100 text-purple-700',
  country: 'bg-orange-100 text-orange-700',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return searchIndex
      .filter((entry) => terms.every((term) => entry.keywords.includes(term)))
      .slice(0, 50);
  }, [query, searchIndex]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Search Watchpedia</h1>

      <div className="relative mb-8">
        <input
          type="search"
          placeholder="Search watches, brands, groups, countries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-watchpedia-link focus:ring-1 focus:ring-watchpedia-link"
        />
      </div>

      {query.trim() && (
        <p className="text-sm text-gray-500 mb-4">
          {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query.trim()}&rdquo;
        </p>
      )}

      <div className="space-y-2">
        {results.map((result) => (
          <Link
            key={result.url}
            href={result.url}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${typeColors[result.type]}`}>
              {typeLabels[result.type]}
            </span>
            <div className="min-w-0">
              <h3 className="font-medium text-gray-900 text-sm">{result.title}</h3>
              <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No results found</p>
          <p className="text-sm">Try a different search term, such as a brand name, reference number, or collection.</p>
        </div>
      )}

      {!query.trim() && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Start typing to search</p>
          <p className="text-sm">Search across {searchIndex.length} brands, watches, groups, and countries.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8"><p>Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
