// Fetches secondary market prices via Gemini search grounding and stores in Supabase.
// Usage: npx tsx scripts/refresh-market-prices.ts [--all] [--brand=rolex] [--stale-days=30]
//   --all          refresh every watch regardless of age
//   --brand=X      only refresh watches from brand slug X
//   --stale-days=N only refresh entries older than N days (default: 30)

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

interface Watch {
  reference: string;
  brandSlug: string;
  name: string;
  specs: { price?: string; movementType?: string };
}

const args = process.argv.slice(2);
const ALL = args.includes('--all');
const BRAND = args.find(a => a.startsWith('--brand='))?.split('=')[1];
const STALE_DAYS = parseInt(args.find(a => a.startsWith('--stale-days='))?.split('=')[1] || '30');

async function fetchPrice(watch: Watch): Promise<{ price: string; source: string } | null> {
  const query = `What is the current secondary market / resale price of ${watch.name} reference ${watch.reference} in USD? Reply only with valid JSON: {"price_usd": "$X,XXX", "source": "site name"}`;

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 100)}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: { text?: string }) => p.text ?? '').join('');

  // Extract JSON from response
  const jsonMatch = text.match(/\{[^{}]*"price_usd"[^{}]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return { price: parsed.price_usd, source: parsed.source || 'Gemini search' };
  } catch {
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const watchesPath = path.join(__dirname, '..', 'src', 'data', 'watches.json');
  let watches: Watch[] = JSON.parse(fs.readFileSync(watchesPath, 'utf8'));

  // Filter to only mechanical/luxury watches with MSRP > $500 approx (skip quartz/digital)
  watches = watches.filter(w => {
    if (w.specs.movementType?.toLowerCase().includes('quartz')) return false;
    if (!BRAND) return true;
    return w.brandSlug === BRAND;
  });

  // Get existing prices to check staleness
  const { data: existing } = await supabase.from('watch_market_prices').select('reference, brand_slug, refreshed_at');
  const existingMap = new Map((existing ?? []).map(e => [`${e.brand_slug}:${e.reference}`, e.refreshed_at]));

  const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);
  const toRefresh = ALL
    ? watches
    : watches.filter(w => {
        const key = `${w.brandSlug}:${w.reference}`;
        const last = existingMap.get(key);
        return !last || new Date(last) < cutoff;
      });

  console.log(`Refreshing ${toRefresh.length} watches (${STALE_DAYS}-day staleness cutoff)...`);
  if (BRAND) console.log(`Brand filter: ${BRAND}`);

  let ok = 0, failed = 0;

  for (let i = 0; i < toRefresh.length; i++) {
    const watch = toRefresh[i];
    const label = `[${i + 1}/${toRefresh.length}] ${watch.brandSlug} ${watch.name} (${watch.reference})`;

    try {
      const result = await fetchPrice(watch);
      if (!result) {
        console.log(`  ⊘ ${label} — no price found`);
        failed++;
      } else {
        await supabase.from('watch_market_prices').upsert({
          reference: watch.reference,
          brand_slug: watch.brandSlug,
          market_price: result.price,
          price_source: result.source,
          refreshed_at: new Date().toISOString(),
        }, { onConflict: 'reference,brand_slug' });
        console.log(`  ✓ ${label} → ${result.price} (${result.source})`);
        ok++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${label} — ${msg}`);
      failed++;
      // Back off on rate limit
      if (msg.includes('429')) {
        console.log('  Rate limited — waiting 60s...');
        await sleep(60000);
      }
    }

    // Polite delay between requests: 3s
    if (i < toRefresh.length - 1) await sleep(3000);
  }

  console.log(`\nDone. ${ok} updated, ${failed} failed.`);
}

main().catch(console.error);
