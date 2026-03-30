import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getBrandBySlug, getWatchesByBrand, getGroupBySlug, getCountryBySlug } from '@/lib/data';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import WatchGrid from '@/components/watch/WatchGrid';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Watches`,
    description: `${brand.name} watch encyclopedia. Browse all ${brand.name} collections, references, and specifications. Founded ${brand.founded}.`,
    openGraph: {
      title: `${brand.name} Watches | Watchpedia`,
      description: `Complete guide to ${brand.name} watches. History, collections, and detailed specifications.`,
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const watches = getWatchesByBrand(brand.slug);
  const group = brand.groupSlug ? getGroupBySlug(brand.groupSlug) : null;
  const country = getCountryBySlug(brand.country);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    description: brand.description,
    foundingDate: String(brand.founded),
    ...(brand.website && { url: brand.website }),
    ...(group && { parentOrganization: { '@type': 'Organization', name: group.name } }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: 'Brands', href: '/brands' }, { label: brand.name }]} />

      <div className="lg:flex lg:gap-8">
        {/* Infobox */}
        <div className="lg:order-2 w-full lg:w-72 shrink-0 mb-6">
          <div className="border border-watchpedia-border rounded bg-watchpedia-infobox">
            <div className="bg-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-2xl font-serif font-bold text-gray-400">
                {brand.name[0]}
              </div>
              <p className="mt-2 font-semibold text-sm">{brand.name}</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-gray-200">
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Founded</th>
                  <td className="px-3 py-1.5 text-gray-900">{brand.founded}</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Country</th>
                  <td className="px-3 py-1.5 text-gray-900">{country?.flag} {country?.name}</td>
                </tr>
                {group && (
                  <tr className="border-t border-gray-200">
                    <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Group</th>
                    <td className="px-3 py-1.5">
                      <Link href={`/groups/${group.slug}`} className="text-watchpedia-link hover:underline">
                        {group.name}
                      </Link>
                    </td>
                  </tr>
                )}
                <tr className="border-t border-gray-200">
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Watches</th>
                  <td className="px-3 py-1.5 text-gray-900">{watches.length} references</td>
                </tr>
                {brand.website && (
                  <tr className="border-t border-gray-200">
                    <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Website</th>
                    <td className="px-3 py-1.5">
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-watchpedia-link hover:underline text-xs">
                        Official site
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:order-1 flex-1 min-w-0">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">{brand.name}</h1>
          <p className="text-gray-700 leading-relaxed mb-8">{brand.description}</p>

          {watches.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-1 mb-4">
                Watches ({watches.length})
              </h2>
              <WatchGrid watches={watches} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
