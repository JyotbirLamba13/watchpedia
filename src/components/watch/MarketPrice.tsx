'use client';

import { useEffect, useState } from 'react';

interface PriceData {
  price: string;
  source: string;
  refreshedAt: string;
}

export default function MarketPrice({ reference, msrp }: { reference: string; msrp?: string }) {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/market-price/${reference}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d?.price ? d : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return (
      <div className="rounded-xl border border-wp-border/60 bg-wp-cream p-4 animate-pulse">
        <div className="h-3 w-24 bg-wp-border/40 rounded mb-2" />
        <div className="h-6 w-32 bg-wp-border/40 rounded" />
      </div>
    );
  }

  // Fall back to static MSRP if no market data
  if (!data && !msrp) return null;

  const updatedDate = data?.refreshedAt
    ? new Date(data.refreshedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="rounded-xl border border-wp-border/60 bg-wp-cream p-4">
      {data ? (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-wp-muted mb-1">
            Secondary Market
          </p>
          <p className="text-2xl font-bold text-wp-dark">{data.price}</p>
          <p className="text-[10px] text-wp-muted mt-1">
            via {data.source}
            {updatedDate && <> &middot; updated {updatedDate}</>}
          </p>
          {msrp && (
            <p className="text-[10px] text-wp-muted/60 mt-2 pt-2 border-t border-wp-border/40">
              MSRP {msrp}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-wp-muted mb-1">
            Approx. MSRP
          </p>
          <p className="text-2xl font-bold text-wp-dark">{msrp}</p>
        </>
      )}
    </div>
  );
}
