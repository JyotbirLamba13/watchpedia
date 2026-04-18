import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandSlug, watchReference, watchName, fieldName, currentValue, correctValue, reporterNote } = body;

    if (!brandSlug || !watchReference || !watchName || !fieldName || !correctValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('watch_corrections').insert({
      brand_slug: brandSlug,
      watch_reference: watchReference,
      watch_name: watchName,
      field_name: fieldName,
      current_value: currentValue || null,
      correct_value: correctValue,
      reporter_note: reporterNote || null,
      status: 'pending',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to submit correction' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
