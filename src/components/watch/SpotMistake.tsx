'use client';

import { useState } from 'react';
import type { Watch } from '@/types';
import type { Brand } from '@/types';

const SPEC_FIELDS: { key: string; label: string; getValue: (w: Watch) => string | undefined }[] = [
  { key: 'movement', label: 'Movement', getValue: (w) => w.specs.movement },
  { key: 'movementType', label: 'Movement Type', getValue: (w) => w.specs.movementType },
  { key: 'caseMaterial', label: 'Case Material', getValue: (w) => w.specs.caseMaterial },
  { key: 'caseDiameter', label: 'Case Diameter', getValue: (w) => w.specs.caseDiameter },
  { key: 'caseThickness', label: 'Case Thickness', getValue: (w) => w.specs.caseThickness },
  { key: 'waterResistance', label: 'Water Resistance', getValue: (w) => w.specs.waterResistance },
  { key: 'crystal', label: 'Crystal', getValue: (w) => w.specs.crystal },
  { key: 'dialColor', label: 'Dial Color', getValue: (w) => w.specs.dialColor },
  { key: 'strapMaterial', label: 'Bracelet/Strap', getValue: (w) => w.specs.strapMaterial },
  { key: 'powerReserve', label: 'Power Reserve', getValue: (w) => w.specs.powerReserve },
  { key: 'frequency', label: 'Frequency', getValue: (w) => w.specs.frequency },
  { key: 'price', label: 'Approximate MSRP', getValue: (w) => w.specs.price },
  { key: 'yearIntroduced', label: 'Year Introduced', getValue: (w) => w.specs.yearIntroduced?.toString() },
  { key: 'reference', label: 'Reference Number', getValue: (w) => w.reference },
  { key: 'name', label: 'Watch Name', getValue: (w) => w.name },
  { key: 'description', label: 'Description', getValue: (w) => w.description },
];

export default function SpotMistake({ watch, brand }: { watch: Watch; brand: Brand }) {
  const [open, setOpen] = useState(false);
  const [fieldKey, setFieldKey] = useState('movement');
  const [correctValue, setCorrectValue] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const selectedField = SPEC_FIELDS.find((f) => f.key === fieldKey)!;
  const currentValue = selectedField.getValue(watch);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!correctValue.trim()) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandSlug: brand.slug,
          watchReference: watch.reference,
          watchName: `${brand.name} ${watch.name}`,
          fieldName: selectedField.label,
          currentValue,
          correctValue: correctValue.trim(),
          reporterNote: note.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('done');
      setCorrectValue('');
      setNote('');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setOpen(false);
    setCorrectValue('');
    setNote('');
  }

  return (
    <div className="mt-3">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-wp-muted hover:text-wp-dark transition-colors underline underline-offset-2"
        >
          Spot a mistake?
        </button>
      ) : (
        <div className="rounded-xl border border-wp-border/60 bg-wp-cream p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-wp-dark">Report a correction</h3>
            <button onClick={reset} className="text-wp-muted hover:text-wp-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {status === 'done' ? (
            <div className="text-center py-4">
              <p className="text-sm font-medium text-wp-dark mb-1">Thanks for the correction!</p>
              <p className="text-xs text-wp-muted">We&apos;ll review and apply it shortly.</p>
              <button onClick={reset} className="mt-3 text-xs text-wp-gold hover:underline">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-wp-muted mb-1">Which field is wrong?</label>
                <select
                  value={fieldKey}
                  onChange={(e) => setFieldKey(e.target.value)}
                  className="w-full text-xs border border-wp-border/60 rounded-lg px-3 py-2 bg-white text-wp-dark focus:outline-none focus:ring-1 focus:ring-wp-gold/50"
                >
                  {SPEC_FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </div>

              {currentValue && (
                <div>
                  <label className="block text-xs font-medium text-wp-muted mb-1">Current value</label>
                  <p className="text-xs text-wp-dark/60 bg-white border border-wp-border/40 rounded-lg px-3 py-2">{currentValue}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-wp-muted mb-1">Correct value <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={correctValue}
                  onChange={(e) => setCorrectValue(e.target.value)}
                  placeholder="Enter the correct value"
                  required
                  className="w-full text-xs border border-wp-border/60 rounded-lg px-3 py-2 bg-white text-wp-dark focus:outline-none focus:ring-1 focus:ring-wp-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-wp-muted mb-1">Additional notes <span className="text-wp-muted/60">(optional)</span></label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Source, context, or explanation..."
                  rows={2}
                  className="w-full text-xs border border-wp-border/60 rounded-lg px-3 py-2 bg-white text-wp-dark focus:outline-none focus:ring-1 focus:ring-wp-gold/50 resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={status === 'submitting' || !correctValue.trim()}
                  className="flex-1 bg-wp-dark text-white text-xs font-medium py-2 px-4 rounded-lg hover:bg-wp-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit correction'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-wp-muted hover:text-wp-dark transition-colors px-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
