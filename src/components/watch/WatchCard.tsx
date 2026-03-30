import Link from 'next/link';
import type { Watch } from '@/types';
import { getBrandBySlug } from '@/lib/data';

export default function WatchCard({ watch }: { watch: Watch }) {
  const brand = getBrandBySlug(watch.brandSlug);

  return (
    <Link
      href={`/watches/${watch.brandSlug}/${watch.slug}`}
      className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl">
        ⌚
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{brand?.name}</p>
        <h3 className="font-medium text-sm text-gray-900 group-hover:text-watchpedia-link mt-0.5 line-clamp-2">
          {watch.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">Ref. {watch.reference}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{watch.specs.caseDiameter}</span>
          {watch.specs.price && (
            <span className="text-xs font-medium text-gray-700">{watch.specs.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
