import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const revalidate = 3600;

export async function GET() {
  const { data, error } = await getSupabaseAdmin()
    .from('blog_posts')
    .select('slug, title, excerpt, tags')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}
