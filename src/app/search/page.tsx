'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

const typeBadge: Record<string, { label: string; class: string }> = {
  brand: { label: 'Brand', class: 'bg-wp-dark text-white' },
  watch: { label: 'Watch', class: 'bg-wp-gold text-white' },
  group: { label: 'Group', class: 'bg-wp-charcoal text-white' },
  country: { label: 'Country', class: 'bg-wp-muted text-white' },
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-wp-dark mb-8">Search</h1>

      <div className="relative mb-8">
        <input
          type="search"
          placeholder="Search watches, brands, collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full px-5 py-4 text-lg bg-wp-cream border border-wp-border rounded-xl focus:outline-none focus:border-wp-dark placeholder:text-wp-muted/50 transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg className="w-5 h-5 text-wp-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>

      {query.trim() && (
        <p className="text-xs text-wp-muted mb-6 uppercase tracking-wider">
          {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query.trim()}&rdquo;
        </p>
      )}

      <div className="space-y-2">
        {results.map((result) => {
          const badge = typeBadge[result.type];
          return (
            <Link
              key={result.url}
              href={result.url}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-wp-cream transition-colors border border-transparent hover:border-wp-border/40"
            >
              <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${badge.class}`}>
                {badge.label}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-semibold text-wp-dark">{result.title}</h3>
                <p className="text-[11px] text-wp-muted truncate">{result.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display text-xl text-wp-dark mb-2">No results found</p>
          <p className="text-sm text-wp-muted">Try a brand name, reference number, or collection.</p>
        </div>
      )}

      {!query.trim() && (
        <div className="text-center py-20">
          <p className="font-display text-xl text-wp-dark mb-2">Start typing to search</p>
          <p className="text-sm text-wp-muted">
            {searchIndex.length} entries across brands, watches, groups, and countries.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-10"><p className="text-wp-muted">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
