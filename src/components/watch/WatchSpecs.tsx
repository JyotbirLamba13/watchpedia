import type { WatchSpecs as WatchSpecsType } from '@/types';

export default function WatchSpecs({ specs }: { specs: WatchSpecsType }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-wp-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-wp-dark text-white">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider w-1/3">Specification</th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-wp-border/40">
          <SpecRow label="Movement" value={specs.movement} />
          <SpecRow label="Movement Type" value={specs.movementType} />
          <SpecRow label="Case Material" value={specs.caseMaterial} />
          <SpecRow label="Case Diameter" value={specs.caseDiameter} />
          {specs.caseThickness && <SpecRow label="Case Thickness" value={specs.caseThickness} />}
          {specs.waterResistance && <SpecRow label="Water Resistance" value={specs.waterResistance} />}
          <SpecRow label="Crystal" value={specs.crystal} />
          <SpecRow label="Dial Color" value={specs.dialColor} />
          {specs.strapMaterial && <SpecRow label="Bracelet/Strap" value={specs.strapMaterial} />}
          {specs.powerReserve && <SpecRow label="Power Reserve" value={specs.powerReserve} />}
          {specs.frequency && <SpecRow label="Frequency" value={specs.frequency} />}
          {specs.complications && specs.complications.length > 0 && (
            <SpecRow label="Complications" value={specs.complications.join(', ')} />
          )}
          {specs.price && <SpecRow label="Approximate MSRP" value={specs.price} highlight />}
          {specs.yearIntroduced && <SpecRow label="Year Introduced" value={String(specs.yearIntroduced)} />}
        </tbody>
      </table>
    </div>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-wp-cream' : 'bg-white even:bg-wp-cream/50'}>
      <td className="px-5 py-3 text-wp-muted text-xs font-medium">{label}</td>
      <td className={`px-5 py-3 text-xs ${highlight ? 'font-semibold text-wp-dark' : 'text-wp-dark'}`}>{value}</td>
    </tr>
  );
}
