import type { Watch, Brand } from '@/types';

export default function WatchInfobox({ watch, brand }: { watch: Watch; brand: Brand }) {
  const { specs } = watch;

  return (
    <div className="float-none md:float-right w-full md:w-80 md:ml-8 mb-8 rounded-xl overflow-hidden border border-wp-border/60 bg-white shadow-sm">
      {/* Image area */}
      <div className="aspect-square bg-gradient-to-b from-wp-cream to-wp-light flex items-center justify-center">
        <span className="text-8xl opacity-30">⌚</span>
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
        {specs.price && (
          <div className="flex justify-between items-center px-5 py-2.5 bg-wp-cream">
            <span className="text-xs text-wp-muted">Approx. Price</span>
            <span className="text-sm font-semibold text-wp-dark">{specs.price}</span>
          </div>
        )}
        {specs.yearIntroduced && <InfoRow label="Introduced" value={String(specs.yearIntroduced)} />}
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
