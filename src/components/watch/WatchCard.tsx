import Link from 'next/link';
import Image from 'next/image';
import type { Watch } from '@/types';
import { getBrandBySlug } from '@/lib/data';

export default function WatchCard({ watch }: { watch: Watch }) {
  const brand = getBrandBySlug(watch.brandSlug);

  return (
    <Link
      href={`/watches/${watch.brandSlug}/${watch.slug}`}
      className="group block card-hover rounded-xl overflow-hidden bg-white border border-wp-border/60"
    >
      <div className="aspect-[4/5] bg-gradient-to-b from-wp-cream to-wp-light flex items-center justify-center overflow-hidden relative">
        {watch.image ? (
          <Image
            src={watch.image}
            alt={`${brand?.name} ${watch.name}`}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <span className="text-7xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">⌚</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-wp-gold mb-1">
          {brand?.name}
        </p>
        <h3 className="font-display text-sm font-semibold text-wp-dark leading-snug line-clamp-2 group-hover:text-wp-charcoal">
          {watch.name}
        </h3>
        <p className="text-[11px] text-wp-muted mt-1.5">Ref. {watch.reference}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-wp-border/40">
          <span className="text-[11px] text-wp-muted">{watch.specs.caseDiameter} &middot; {watch.specs.movementType}</span>
          {watch.specs.price && (
            <span className="text-xs font-semibold text-wp-dark">{watch.specs.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
