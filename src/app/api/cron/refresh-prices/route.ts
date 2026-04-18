import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import watchesData from '@/data/watches.json';

export const maxDuration = 300;

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const BATCH_SIZE = 80;

interface Watch {
  reference: string;
  brandSlug: string;
  name: string;
  featured?: boolean;
  specs: { movementType?: string; price?: string };
}

async function fetchPrice(watch: Watch): Promise<{ price: string; source: string } | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const query = `What is the current secondary market / resale price of ${watch.name} reference ${watch.reference} in USD? Reply only with valid JSON: {"price_usd": "$X,XXX", "source": "site name"}`;

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: { text?: string }) => p.text ?? '').join('');
  const jsonMatch = text.match(/\{[^{}]*"price_usd"[^{}]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return { price: parsed.price_usd, source: parsed.source || 'Gemini search' };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Get existing price ages
  const { data: existing } = await supabase
    .from('watch_market_prices')
    .select('reference, brand_slug, refreshed_at');

  const refreshedAt = new Map(
    (existing ?? []).map(e => [`${e.brand_slug}:${e.reference}`, new Date(e.refreshed_at).getTime()])
  );

  // Only mechanical watches
  const mechanical = (watchesData as Watch[]).filter(
    w => !w.specs.movementType?.toLowerCase().includes('quartz')
  );

  // Sort: featured first, then by oldest refresh (never refreshed = 0)
  const sorted = mechanical.sort((a, b) => {
    const aAge = refreshedAt.get(`${a.brandSlug}:${a.reference}`) ?? 0;
    const bAge = refreshedAt.get(`${b.brandSlug}:${b.reference}`) ?? 0;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return aAge - bAge;
  });

  const batch = sorted.slice(0, BATCH_SIZE);

  let ok = 0, failed = 0;
  const results: string[] = [];

  for (const watch of batch) {
    try {
      const result = await fetchPrice(watch);
      if (result) {
        await supabase.from('watch_market_prices').upsert({
          reference: watch.reference,
          brand_slug: watch.brandSlug,
          market_price: result.price,
          price_source: result.source,
          refreshed_at: new Date().toISOString(),
        }, { onConflict: 'reference,brand_slug' });
        results.push(`${watch.reference}: ${result.price}`);
        ok++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return NextResponse.json({
    updated: ok,
    failed,
    batch: batch.length,
    total_mechanical: mechanical.length,
    results,
  });
}
