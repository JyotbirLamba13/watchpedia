import type { MetadataRoute } from 'next';
import { getAllBrands, getAllWatches, getAllCountries, getAllGroups } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://watchpedia.org';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/brands`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/groups`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/countries`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/search`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const brandPages: MetadataRoute.Sitemap = getAllBrands().map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const watchPages: MetadataRoute.Sitemap = getAllWatches().map((watch) => ({
    url: `${baseUrl}/watches/${watch.brandSlug}/${watch.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const countryPages: MetadataRoute.Sitemap = getAllCountries().map((country) => ({
    url: `${baseUrl}/countries/${country.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const groupPages: MetadataRoute.Sitemap = getAllGroups().map((group) => ({
    url: `${baseUrl}/groups/${group.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...brandPages, ...watchPages, ...countryPages, ...groupPages];
}
