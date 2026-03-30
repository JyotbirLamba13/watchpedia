import type { WatchSpecs as WatchSpecsType } from '@/types';

export default function WatchSpecs({ specs }: { specs: WatchSpecsType }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-gray-700 font-medium w-1/3">Specification</th>
            <th className="px-4 py-2 text-left text-gray-700 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
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
          {specs.price && <SpecRow label="Approximate MSRP" value={specs.price} />}
          {specs.yearIntroduced && <SpecRow label="Year Introduced" value={String(specs.yearIntroduced)} />}
        </tbody>
      </table>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-2 text-gray-500 font-medium">{label}</td>
      <td className="px-4 py-2 text-gray-900">{value}</td>
    </tr>
  );
}
