import Image from 'next/image';
import type { Watch, Brand } from '@/types';
import ImageZoom from './ImageZoom';
import MarketPrice from './MarketPrice';
import WatchPlaceholder from './WatchPlaceholder';

export default function WatchInfobox({ watch, brand }: { watch: Watch; brand: Brand }) {
  const { specs } = watch;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-wp-border/60 bg-white shadow-sm">
      {/* Image area */}
      <div className="aspect-square bg-white flex items-center justify-center relative">
        {watch.image ? (
          <>
            <Image
              src={watch.image}
              alt={`${brand.name} ${watch.name}`}
              fill
              className="object-contain p-6 mix-blend-multiply"
              sizes="640px"
              quality={95}
              priority
            />
            <ImageZoom src={watch.image} alt={`${brand.name} ${watch.name}`} />
          </>
        ) : (
          <WatchPlaceholder className="w-48 h-auto opacity-60" />
        )}
      </div>

      {/* Title bar */}
      <div className="bg-wp-dark text-white px-5 py-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-wp-gold mb-0.5">{brand.name}</p>
        <p className="text-sm font-display font-semibold">{watch.name}</p>
      </div>

      {/* Specs */}
      <div className="divide-y divide-wp-border/40">
        <InfoRow label="Reference" value={watch.reference} />
        <InfoRow label="Collection" value={watch.collection} />
        <InfoRow label="Movement" value={specs.movement} />
        <InfoRow label="Type" value={specs.movementType} />
        <InfoRow label="Case" value={specs.caseMaterial} />
        <InfoRow label="Diameter" value={specs.caseDiameter} />
        {specs.caseThickness && <InfoRow label="Thickness" value={specs.caseThickness} />}
        <InfoRow label="Crystal" value={specs.crystal} />
        <InfoRow label="Dial" value={specs.dialColor} />
        {specs.waterResistance && <InfoRow label="Water Res." value={specs.waterResistance} />}
        {specs.powerReserve && <InfoRow label="Power Reserve" value={specs.powerReserve} />}
        {specs.yearIntroduced && <InfoRow label="Introduced" value={String(specs.yearIntroduced)} />}
      </div>

      {/* Dynamic market price */}
      <div className="p-3 border-t border-wp-border/40">
        <MarketPrice reference={watch.reference} msrp={specs.price} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start px-5 py-2.5">
      <span className="text-xs text-wp-muted shrink-0">{label}</span>
      <span className="text-xs text-wp-dark text-right ml-4">{value}</span>
    </div>
  );
}
