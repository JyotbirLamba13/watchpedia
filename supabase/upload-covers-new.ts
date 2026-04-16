// Upload cover images from Wikimedia for the 10 new blog posts
// Usage: npx tsx supabase/upload-covers-new.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const BUCKET = 'watch-images';

const slugToSearch: Record<string, string> = {
  'best-dress-watches-2026': 'Patek Philippe Calatrava watch',
  'understanding-watch-complications': 'watch movement tourbillon',
  'best-watches-under-1000': 'Seiko automatic watch',
  'complete-guide-to-watch-crystals': 'sapphire crystal watch close up',
  'patek-philippe-nautilus-history': 'Patek Philippe Nautilus',
  'rolex-buying-guide-2026': 'Rolex Submariner watch',
  'omega-speedmaster-moonwatch-history': 'Omega Speedmaster moon',
  'watch-size-guide-how-to-choose': 'wristwatch on wrist',
  'audemars-piguet-royal-oak-story': 'Audemars Piguet Royal Oak',
  'how-to-maintain-your-watch': 'watchmaker repair',
};

async function findWikimediaImage(query: string): Promise<string | null> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&gsrnamespace=6&prop=imageinfo&iiprop=url|mime&iiurlwidth=1200&format=json&origin=*`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Watchpedia/1.0 (jyotbir.neo@gmail.com)' },
  });
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  for (const page of Object.values(pages) as any[]) {
    const info = page.imageinfo?.[0];
    if (info?.mime?.startsWith('image/') && info.thumburl) {
      return info.thumburl;
    }
  }
  return null;
}

async function downloadAndUpload(imageUrl: string, slug: string): Promise<string | null> {
  const res = await fetch(imageUrl);
  if (!res.ok) return null;
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
  const filePath = `blog/${slug}.${ext}`;

  const { error } = await admin.storage.from(BUCKET).upload(filePath, buffer, {
    contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
    upsert: true,
  });
  if (error) {
    console.log(`  Upload error: ${error.message}`);
    return null;
  }
  const { data } = admin.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

(async () => {
  for (const [slug, query] of Object.entries(slugToSearch)) {
    console.log(`\n${slug}...`);
    const imageUrl = await findWikimediaImage(query);
    if (!imageUrl) {
      console.log('  No image found');
      continue;
    }
    console.log(`  Found: ${imageUrl.substring(0, 80)}...`);

    const publicUrl = await downloadAndUpload(imageUrl, slug);
    if (!publicUrl) continue;

    const { error } = await admin
      .from('blog_posts')
      .update({ cover_image: publicUrl })
      .eq('slug', slug);
    if (error) console.log(`  DB update error: ${error.message}`);
    else console.log(`  ✓ Cover image set`);

    // Rate limit delay
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('\nDone!');
})();
