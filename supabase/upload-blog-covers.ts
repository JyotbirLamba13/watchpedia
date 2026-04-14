// Upload blog cover images from Wikimedia Commons to Supabase Storage
// Usage: npx tsx supabase/upload-blog-covers.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, key);

// Blog slug → Wikimedia Commons image URL (all CC-licensed)
const coverImages: Record<string, string> = {
  'what-is-a-chronograph-complete-guide':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Detailed_view_of_dial_of_chronograph_watch.jpg/1280px-Detailed_view_of_dial_of_chronograph_watch.jpg',
  'top-10-watch-brands-by-heritage':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Vienna_-_Vintage_pocket_watch_display_-_0499.jpg/1280px-Vienna_-_Vintage_pocket_watch_display_-_0499.jpg',
  'mechanical-vs-quartz-watches-which-is-better':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Miyota_caliber_6S21_quartz_chronograph_movement.jpg/1280px-Miyota_caliber_6S21_quartz_chronograph_movement.jpg',
  'ultimate-guide-to-watch-movements':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Grand_Seiko_Caliber_9S65_Automatic.JPG/1280px-Grand_Seiko_Caliber_9S65_Automatic.JPG',
  'best-dive-watches-2026':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Dive_decompression_tables_plus_a_diving_watch_plus_a_diving_depth_gauge.jpg/1280px-Dive_decompression_tables_plus_a_diving_watch_plus_a_diving_depth_gauge.jpg',
  'rolex-vs-omega-complete-comparison':
    'https://upload.wikimedia.org/wikipedia/commons/2/27/Rolex_Submariner_diving_watch.jpg',
  'watch-collecting-beginners-guide':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Box%2C_watch_%28AM_673042-1%29.jpg/1280px-Box%2C_watch_%28AM_673042-1%29.jpg',
  'grand-seiko-vs-rolex-value-proposition':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Grand_Seiko_Automatic_Hi-Beat.jpg/1280px-Grand_Seiko_Automatic_Hi-Beat.jpg',
  'how-to-read-watch-specifications':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Grand_Seiko_SBGR051_sideview.JPG/1280px-Grand_Seiko_SBGR051_sideview.JPG',
  'history-of-the-tourbillon':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tourbillon_wheel_close-up_%283370466847%29.jpg/1280px-Tourbillon_wheel_close-up_%283370466847%29.jpg',
  'watch-strap-guide-leather-rubber-nato-bracelet':
    'https://upload.wikimedia.org/wikipedia/commons/6/63/Breitling_avenger_seawolf.jpg',
  'swiss-vs-japanese-watchmaking':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/2018-Cortebert-Ehemalige-Omega-5.jpg/1280px-2018-Cortebert-Ehemalige-Omega-5.jpg',
  'watch-water-resistance-explained':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Citizen_Aqualand_Promaster_JP1010_diving_watch_with_depth_gauge.jpg/1280px-Citizen_Aqualand_Promaster_JP1010_diving_watch_with_depth_gauge.jpg',
};

async function downloadAndUpload(imageUrl: string, slug: string): Promise<string | null> {
  try {
    console.log(`  Downloading...`);
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.log(`  Download failed: ${res.status}`);
      return null;
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
      return null;
    }

    const { data: urlData } = admin.storage.from('watch-images').getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (e: any) {
    console.log(`  Error: ${e.message}`);
    return null;
  }
}

async function main() {
  const entries = Object.entries(coverImages);
  console.log(`Uploading cover images for ${entries.length} blog posts...\n`);

  for (const [slug, imageUrl] of entries) {
    console.log(`${slug}`);

    const publicUrl = await downloadAndUpload(imageUrl, slug);
    if (!publicUrl) {
      console.log(`  FAILED\n`);
      continue;
    }

    // Update blog post with cover image
    const { error } = await admin
      .from('blog_posts')
      .update({ cover_image: publicUrl })
      .eq('slug', slug);

    if (error) {
      console.log(`  DB update error: ${error.message}\n`);
    } else {
      console.log(`  Done: ${publicUrl.substring(0, 70)}...\n`);
    }

    // Small delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('All cover images uploaded!');
}

main().catch(console.error);
