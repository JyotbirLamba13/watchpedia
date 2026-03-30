import groupsData from '@/data/groups.json';
import brandsData from '@/data/brands.json';
import watchesData from '@/data/watches.json';
import countriesData from '@/data/countries.json';
import type { WatchGroup, Brand, Watch, Country } from '@/types';

const groups: WatchGroup[] = groupsData;
const brands: Brand[] = brandsData;
const watches: Watch[] = watchesData as Watch[];
const countries: Country[] = countriesData;

export function getAllGroups(): WatchGroup[] {
  return groups;
}

export function getGroupBySlug(slug: string): WatchGroup | undefined {
  return groups.find((g) => g.slug === slug);
}

export function getAllBrands(): Brand[] {
  return brands.sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandsByGroup(groupSlug: string): Brand[] {
  return brands.filter((b) => b.groupSlug === groupSlug).sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrandsByCountry(countrySlug: string): Brand[] {
  return brands.filter((b) => b.country === countrySlug).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllWatches(): Watch[] {
  return watches;
}

export function getWatchByBrandAndRef(brandSlug: string, refSlug: string): Watch | undefined {
  return watches.find((w) => w.brandSlug === brandSlug && w.slug === refSlug);
}

export function getWatchesByBrand(brandSlug: string): Watch[] {
  return watches.filter((w) => w.brandSlug === brandSlug);
}

export function getWatchesByCountry(countrySlug: string): Watch[] {
  const countrBrands = getBrandsByCountry(countrySlug).map((b) => b.slug);
  return watches.filter((w) => countrBrands.includes(w.brandSlug));
}

export function getFeaturedWatches(): Watch[] {
  return watches.filter((w) => w.featured);
}

export function getAllCountries(): Country[] {
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getSearchIndex(): Array<{
  title: string;
  subtitle: string;
  url: string;
  type: 'brand' | 'watch' | 'group' | 'country';
  keywords: string;
}> {
  const index: Array<{
    title: string;
    subtitle: string;
    url: string;
    type: 'brand' | 'watch' | 'group' | 'country';
    keywords: string;
  }> = [];

  for (const brand of brands) {
    index.push({
      title: brand.name,
      subtitle: `Est. ${brand.founded} · ${brand.country}`,
      url: `/brands/${brand.slug}`,
      type: 'brand',
      keywords: `${brand.name} ${brand.slug} ${brand.country} ${brand.founded}`.toLowerCase(),
    });
  }

  for (const watch of watches) {
    const brand = getBrandBySlug(watch.brandSlug);
    index.push({
      title: `${brand?.name ?? watch.brandSlug} ${watch.name}`,
      subtitle: `Ref. ${watch.reference} · ${watch.collection}`,
      url: `/watches/${watch.brandSlug}/${watch.slug}`,
      type: 'watch',
      keywords: `${brand?.name} ${watch.name} ${watch.reference} ${watch.slug} ${watch.collection} ${watch.specs.movement} ${watch.specs.movementType} ${watch.specs.caseMaterial} ${watch.specs.dialColor}`.toLowerCase(),
    });
  }

  for (const group of groups) {
    index.push({
      title: group.name,
      subtitle: `${group.brandSlugs.length} brands`,
      url: `/groups/${group.slug}`,
      type: 'group',
      keywords: `${group.name} ${group.slug}`.toLowerCase(),
    });
  }

  for (const country of countries) {
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
