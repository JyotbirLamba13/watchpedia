// Retry failed blog cover uploads
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const coverImages: Record<string, string> = {
  'mechanical-vs-quartz-watches-which-is-better':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Miyota_caliber_6S21_quartz_chronograph_movement.jpg/1280px-Miyota_caliber_6S21_quartz_chronograph_movement.jpg',
  'rolex-vs-omega-complete-comparison':
    'https://upload.wikimedia.org/wikipedia/commons/2/27/Rolex_Submariner_diving_watch.jpg',
  'grand-seiko-vs-rolex-value-proposition':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Grand_Seiko_Automatic_Hi-Beat.jpg/1280px-Grand_Seiko_Automatic_Hi-Beat.jpg',
  'watch-strap-guide-leather-rubber-nato-bracelet':
    'https://upload.wikimedia.org/wikipedia/commons/6/63/Breitling_avenger_seawolf.jpg',
  'swiss-vs-japanese-watchmaking':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/2018-Cortebert-Ehemalige-Omega-5.jpg/1280px-2018-Cortebert-Ehemalige-Omega-5.jpg',
  'watch-water-resistance-explained':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Citizen_Aqualand_Promaster_JP1010_diving_watch_with_depth_gauge.jpg/1280px-Citizen_Aqualand_Promaster_JP1010_diving_watch_with_depth_gauge.jpg',
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(coverImages)) {
    console.log(`\n${slug}`);
    console.log('  Downloading...');

    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'WatchpediaBlogBot/1.0 (contact@watchpedia.com)' }
    });

    if (!res.ok) {
      console.log(`  Failed: ${res.status}`);
      await new Promise(r => setTimeout(r, 5000));
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get('content-type') || 'image/jpeg';
    const ext = mime.includes('png') ? 'png' : 'jpg';
    const filePath = `blog/${slug}.${ext}`;

    console.log(`  Uploading ${(buffer.length / 1024).toFixed(0)}KB...`);
    const { error } = await admin.storage.from('watch-images').upload(filePath, buffer, {
      contentType: mime,
      upsert: true,
    });

    if (error) {
      console.log(`  Upload error: ${error.message}`);
      continue;
    }

    const { data: urlData } = admin.storage.from('watch-images').getPublicUrl(filePath);
    const { error: dbErr } = await admin
      .from('blog_posts')
      .update({ cover_image: urlData.publicUrl })
      .eq('slug', slug);

    console.log(dbErr ? `  DB error: ${dbErr.message}` : `  Done!`);

    // 3 second delay between downloads
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('\nRetry complete!');
}

main().catch(console.error);
