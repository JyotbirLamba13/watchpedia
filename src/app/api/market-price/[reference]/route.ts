import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const { reference } = await params;

  const { data, error } = await supabase
    .from('watch_market_prices')
    .select('market_price, price_source, refreshed_at')
    .eq('reference', reference.toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ price: null }, { status: 404 });
  }

  return NextResponse.json({
    price: data.market_price,
    source: data.price_source,
    refreshedAt: data.refreshed_at,
  });
}
