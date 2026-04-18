'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WatchCard from '@/components/watch/WatchCard';
import watchesData from '@/data/watches.json';
import brandsData from '@/data/brands.json';
import type { Watch } from '@/types';

const watches = watchesData as Watch[];

// ─── Normalizers ────────────────────────────────────────────────────────────

function normMovement(t: string): string {
  const l = t.toLowerCase();
  if (l.includes('spring drive')) return 'Spring Drive';
  if (l.includes('quartz') || l.includes('solar') || l.includes('meca') || l.includes('digital')) return 'Quartz / Solar';
  return t;
}

function normMaterial(m: string): string {
  const l = m.toLowerCase();
  if (l.includes('gold') && !l.includes('plated')) return 'Gold';
  if (l.includes('titanium')) return 'Titanium';
  if (l.includes('ceramic')) return 'Ceramic';
  if (l.includes('platinum')) return 'Platinum';
  if (l.includes('bronze')) return 'Bronze';
  if (l.includes('resin') || l.includes('carbon') || l.includes('polymer')) return 'Resin / Carbon';
  return 'Stainless steel';
}

function parseDiam(s: string): number {
  return parseFloat(s) || 0;
}

function parseWR(s: string): number {
  if (!s || s === 'None' || s === 'N/A') return 0;
  return parseFloat(s) || 0;
}

function diamBucket(mm: number): string {
  if (mm < 36) return 'Under 36mm';
  if (mm <= 39) return '36–39mm';
  if (mm <= 42) return '40–42mm';
  return '43mm+';
}

// ─── Filter config ───────────────────────────────────────────────────────────

const MOVEMENT_OPTIONS = ['Automatic', 'Manual winding', 'Quartz / Solar', 'Spring Drive'];
const MATERIAL_OPTIONS = ['Stainless steel', 'Gold', 'Titanium', 'Ceramic', 'Platinum', 'Bronze', 'Resin / Carbon'];
const DIAM_OPTIONS = ['Under 36mm', '36–39mm', '40–42mm', '43mm+'];
const WR_OPTIONS = [
  { label: 'Any', min: 0 },
  { label: '30m+', min: 30 },
  { label: '100m+', min: 100 },
  { label: '200m+', min: 200 },
  { label: '300m+', min: 300 },
];
const COMPLICATION_OPTIONS = ['Date', 'Chronograph', 'GMT', 'Moon phase', 'Power reserve indicator', 'Small seconds', 'Day', 'World time'];
const PAGE_SIZE = 24;

const brandOptions = brandsData.map(b => ({ slug: b.slug, name: b.name })).sort((a, b) => a.name.localeCompare(b.name));

// ─── URL param helpers ────────────────────────────────────────────────────────

function parseArr(params: URLSearchParams, key: string): string[] {
  return params.getAll(key);
}

function buildParams(state: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  state.brands.forEach(v => p.append('brand', v));
  state.movements.forEach(v => p.append('mov', v));
  state.materials.forEach(v => p.append('mat', v));
  state.diameters.forEach(v => p.append('diam', v));
  if (state.wrMin > 0) p.set('wr', String(state.wrMin));
  state.complications.forEach(v => p.append('comp', v));
  return p;
}

interface FilterState {
  brands: string[];
  movements: string[];
  materials: string[];
  diameters: string[];
  wrMin: number;
  complications: string[];
}

function emptyFilters(): FilterState {
  return { brands: [], movements: [], materials: [], diameters: [], wrMin: 0, complications: [] };
}

function filtersFromParams(p: URLSearchParams): FilterState {
  return {
    brands: parseArr(p, 'brand'),
    movements: parseArr(p, 'mov'),
    materials: parseArr(p, 'mat'),
    diameters: parseArr(p, 'diam'),
    wrMin: parseInt(p.get('wr') || '0') || 0,
    complications: parseArr(p, 'comp'),
  };
}

function hasFilters(f: FilterState): boolean {
  return f.brands.length > 0 || f.movements.length > 0 || f.materials.length > 0 ||
    f.diameters.length > 0 || f.wrMin > 0 || f.complications.length > 0;
}

// ─── Chips ───────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-wp-dark text-white text-xs rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-wp-gold transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

// ─── Filter section ───────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-wp-border/40 py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3 group">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-wp-dark">{title}</span>
        <svg className={`w-3.5 h-3.5 text-wp-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function CheckItem({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex items-center justify-between py-1 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-wp-dark border-wp-dark' : 'border-wp-border group-hover:border-wp-dark/40'}`}>
          {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>}
        </div>
        <span className="text-xs text-wp-dark">{label}</span>
      </div>
      {count !== undefined && <span className="text-[10px] text-wp-muted">{count}</span>}
    </label>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function BrowseContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => filtersFromParams(params));
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  const updateFilters = useCallback((next: FilterState) => {
    setFilters(next);
    setPage(1);
    const p = buildParams(next);
    router.replace(`/watches${p.toString() ? '?' + p.toString() : ''}`, { scroll: false });
  }, [router]);

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  const filtered = useMemo(() => {
    return watches.filter(w => {
      if (filters.brands.length && !filters.brands.includes(w.brandSlug)) return false;
      if (filters.movements.length && !filters.movements.includes(normMovement(w.specs.movementType))) return false;
      if (filters.materials.length && !filters.materials.includes(normMaterial(w.specs.caseMaterial))) return false;
      if (filters.diameters.length && !filters.diameters.includes(diamBucket(parseDiam(w.specs.caseDiameter)))) return false;
      if (filters.wrMin > 0 && parseWR(w.specs.waterResistance || '') < filters.wrMin) return false;
      if (filters.complications.length && !filters.complications.every(c => (w.specs.complications || []).includes(c))) return false;
      return true;
    });
  }, [filters]);

  // Counts for each filter option (based on current filtered set minus that filter)
  const movCounts = useMemo(() => {
    const base = watches.filter(w => {
      if (filters.brands.length && !filters.brands.includes(w.brandSlug)) return false;
      if (filters.materials.length && !filters.materials.includes(normMaterial(w.specs.caseMaterial))) return false;
      if (filters.diameters.length && !filters.diameters.includes(diamBucket(parseDiam(w.specs.caseDiameter)))) return false;
      if (filters.wrMin > 0 && parseWR(w.specs.waterResistance || '') < filters.wrMin) return false;
      return true;
    });
    const counts: Record<string, number> = {};
    base.forEach(w => { const k = normMovement(w.specs.movementType); counts[k] = (counts[k] || 0) + 1; });
    return counts;
  }, [filters.brands, filters.materials, filters.diameters, filters.wrMin]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const activeFilterCount = filters.brands.length + filters.movements.length + filters.materials.length +
    filters.diameters.length + (filters.wrMin > 0 ? 1 : 0) + filters.complications.length;

  const filteredBrands = brandOptions.filter(b =>
    !brandSearch || b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const sidebar = (
    <div className="space-y-0">
      <FilterSection title="Brand">
        <input
          type="text"
          placeholder="Search brands..."
          value={brandSearch}
          onChange={e => setBrandSearch(e.target.value)}
          className="w-full text-xs px-3 py-1.5 border border-wp-border/60 rounded-lg mb-2 focus:outline-none focus:border-wp-dark bg-white"
        />
        <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
          {filteredBrands.map(b => (
            <CheckItem
              key={b.slug}
              label={b.name}
              checked={filters.brands.includes(b.slug)}
              onChange={() => updateFilters({ ...filters, brands: toggle(filters.brands, b.slug) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Movement Type">
        {MOVEMENT_OPTIONS.map(m => (
          <CheckItem
            key={m}
            label={m}
            checked={filters.movements.includes(m)}
            count={movCounts[m] || 0}
            onChange={() => updateFilters({ ...filters, movements: toggle(filters.movements, m) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Case Diameter">
        <div className="grid grid-cols-2 gap-1.5">
          {DIAM_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => updateFilters({ ...filters, diameters: toggle(filters.diameters, d) })}
              className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${filters.diameters.includes(d) ? 'bg-wp-dark text-white border-wp-dark' : 'border-wp-border/60 text-wp-dark hover:border-wp-dark/40'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Case Material">
        {MATERIAL_OPTIONS.map(m => (
          <CheckItem
            key={m}
            label={m}
            checked={filters.materials.includes(m)}
            onChange={() => updateFilters({ ...filters, materials: toggle(filters.materials, m) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Water Resistance">
        <div className="flex flex-wrap gap-1.5">
          {WR_OPTIONS.map(o => (
            <button
              key={o.label}
              onClick={() => updateFilters({ ...filters, wrMin: filters.wrMin === o.min ? 0 : o.min })}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filters.wrMin === o.min && o.min > 0 ? 'bg-wp-dark text-white border-wp-dark' : 'border-wp-border/60 text-wp-dark hover:border-wp-dark/40'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Complications" defaultOpen={false}>
        {COMPLICATION_OPTIONS.map(c => (
          <CheckItem
            key={c}
            label={c}
            checked={filters.complications.includes(c)}
            onChange={() => updateFilters({ ...filters, complications: toggle(filters.complications, c) })}
          />
        ))}
      </FilterSection>

      {hasFilters(filters) && (
        <div className="pt-4">
          <button
            onClick={() => updateFilters(emptyFilters())}
            className="w-full text-xs text-wp-muted hover:text-wp-dark transition-colors underline underline-offset-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-wp-dark">Browse Watches</h1>
          <p className="text-sm text-wp-muted mt-1">{watches.length} references across {brandsData.length} brands</p>
        </div>
        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-wp-border rounded-lg text-sm text-wp-dark hover:bg-wp-cream transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-wp-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {hasFilters(filters) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.brands.map(b => {
            const brand = brandOptions.find(x => x.slug === b);
            return <Chip key={b} label={brand?.name ?? b} onRemove={() => updateFilters({ ...filters, brands: filters.brands.filter(x => x !== b) })} />;
          })}
          {filters.movements.map(m => <Chip key={m} label={m} onRemove={() => updateFilters({ ...filters, movements: filters.movements.filter(x => x !== m) })} />)}
          {filters.materials.map(m => <Chip key={m} label={m} onRemove={() => updateFilters({ ...filters, materials: filters.materials.filter(x => x !== m) })} />)}
          {filters.diameters.map(d => <Chip key={d} label={d} onRemove={() => updateFilters({ ...filters, diameters: filters.diameters.filter(x => x !== d) })} />)}
          {filters.wrMin > 0 && <Chip label={`${filters.wrMin}m+ WR`} onRemove={() => updateFilters({ ...filters, wrMin: 0 })} />}
          {filters.complications.map(c => <Chip key={c} label={c} onRemove={() => updateFilters({ ...filters, complications: filters.complications.filter(x => x !== c) })} />)}
        </div>
      )}

      <div className="lg:flex lg:gap-10">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            {sidebar}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-wp-muted mb-5 uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'watch' : 'watches'}
            {hasFilters(filters) ? ' matching filters' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-xl text-wp-dark mb-2">No watches match these filters</p>
              <p className="text-sm text-wp-muted mb-6">Try removing some filters to see more results.</p>
              <button onClick={() => updateFilters(emptyFilters())} className="text-sm underline underline-offset-2 text-wp-muted hover:text-wp-dark transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                {visible.map(w => <WatchCard key={`${w.brandSlug}-${w.slug}`} watch={w} />)}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-8 py-3 border border-wp-border rounded-xl text-sm text-wp-dark hover:bg-wp-cream transition-colors"
                  >
                    Show more ({filtered.length - visible.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-wp-border/40 px-5 py-4 flex items-center justify-between">
              <span className="font-semibold text-wp-dark text-sm">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-wp-muted hover:text-wp-dark transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-2">{sidebar}</div>
            <div className="sticky bottom-0 bg-white border-t border-wp-border/40 p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-wp-dark text-white py-3 rounded-xl text-sm font-medium"
              >
                Show {filtered.length} watches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WatchesPage() {
  return (
    <Suspense fallback={<div className="max-w-[1400px] mx-auto px-4 py-10"><p className="text-wp-muted text-sm">Loading...</p></div>}>
      <BrowseContent />
    </Suspense>
  );
}
