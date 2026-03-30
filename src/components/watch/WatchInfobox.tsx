import type { Watch, Brand } from '@/types';

export default function WatchInfobox({ watch, brand }: { watch: Watch; brand: Brand }) {
  const { specs } = watch;

  return (
    <div className="float-none md:float-right w-full md:w-72 md:ml-6 mb-6 border border-watchpedia-border rounded bg-watchpedia-infobox">
      <div className="bg-gray-200 p-4 text-center">
        <div className="text-6xl mb-2">⌚</div>
        <p className="text-xs text-gray-500">{brand.name} {watch.name}</p>
      </div>
      <table className="w-full text-sm">
        <tbody>
          <InfoRow label="Brand" value={brand.name} />
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
          {specs.price && <InfoRow label="Approx. Price" value={specs.price} />}
          {specs.yearIntroduced && <InfoRow label="Introduced" value={String(specs.yearIntroduced)} />}
        </tbody>
      </table>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-gray-200">
      <th className="px-3 py-1.5 text-left text-gray-500 font-normal whitespace-nowrap align-top">{label}</th>
      <td className="px-3 py-1.5 text-gray-900">{value}</td>
    </tr>
  );
}
