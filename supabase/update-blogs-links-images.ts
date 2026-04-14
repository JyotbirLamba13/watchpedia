// Update all blog posts with internal links + generate cover images via Gemini
// Usage: npx tsx supabase/update-blogs-links-images.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_KEY = process.env.GEMINI_API_KEY!;
const admin = createClient(url, key);

// All brands on our site
const brands: Record<string, string> = {
  'Rolex': '/brands/rolex',
  'Omega': '/brands/omega',
  'Patek Philippe': '/brands/patek-philippe',
  'Audemars Piguet': '/brands/audemars-piguet',
  'Cartier': '/brands/cartier',
  'Seiko': '/brands/seiko',
  'Grand Seiko': '/brands/grand-seiko',
  'TAG Heuer': '/brands/tag-heuer',
  'IWC': '/brands/iwc',
  'Jaeger-LeCoultre': '/brands/jaeger-lecoultre',
  'Tudor': '/brands/tudor',
  'Longines': '/brands/longines',
  'Tissot': '/brands/tissot',
  'Citizen': '/brands/citizen',
  'Casio': '/brands/casio',
  'G-Shock': '/brands/g-shock',
  'Hublot': '/brands/hublot',
  'Zenith': '/brands/zenith',
  'Panerai': '/brands/panerai',
  'Vacheron Constantin': '/brands/vacheron-constantin',
  'A. Lange & Söhne': '/brands/a-lange-sohne',
  'Hamilton': '/brands/hamilton',
  'Orient': '/brands/orient',
  'Bulgari': '/brands/bulgari',
  'Breitling': '/brands/breitling',
  'NOMOS': '/brands/nomos-glashutte',
  'Rado': '/brands/rado',
  'Frederique Constant': '/brands/frederique-constant',
  'Bulova': '/brands/bulova',
  'Piaget': '/brands/piaget',
  'Blancpain': '/brands/blancpain',
  'Breguet': '/brands/breguet',
  'Oris': '/brands/oris',
  'Titan': '/brands/titan',
  'HMT': '/brands/hmt',
};

// Add internal links - only first occurrence of each brand
function addInternalLinks(html: string): string {
  let result = html;
  const linked = new Set<string>();

  // Sort brands by name length descending to match longer names first
  // (e.g. "Grand Seiko" before "Seiko", "A. Lange & Söhne" before "Lange")
  const sorted = Object.entries(brands).sort((a, b) => b[0].length - a[0].length);

  for (const [name, href] of sorted) {
    if (linked.has(name)) continue;

    // Escape special regex chars in brand name
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Match brand name that's NOT already inside an <a> tag or HTML tag
    // Only match first occurrence that's inside text content (not in tags)
    const regex = new RegExp(
      `(?<![<\\/a-zA-Z])\\b(${escaped})\\b(?![^<]*<\\/a>)(?![^<]*>)`,
      ''
    );

    if (regex.test(result)) {
      result = result.replace(regex, `<a href="${href}">$1</a>`);
      linked.add(name);
    }
  }

  return result;
}

// Image prompts for each blog slug
const imagePrompts: Record<string, string> = {
  'what-is-a-chronograph-complete-guide': 'A luxury chronograph watch face in extreme close-up showing sub-dials and tachymeter bezel, dramatic side lighting on polished steel, dark moody background, professional product photography',
  'top-10-watch-brands-by-heritage': 'An antique watchmaker workbench with vintage pocket watches, brass tools, and magnifying loupes arranged on aged wood, warm golden lighting from a desk lamp, historical atmosphere',
  'mechanical-vs-quartz-watches-which-is-better': 'Split composition showing a mechanical watch movement with visible gears on the left and a quartz circuit board on the right, clean white background, studio lighting, educational comparison',
  'ultimate-guide-to-watch-movements': 'A detailed close-up of a luxury watch movement with visible gears and springs, golden brass components against a dark background, macro photography with shallow depth of field',
  'best-dive-watches-2026': 'A luxury dive watch submerged in clear blue ocean water with sunlight refracting through the surface, small air bubbles floating around, the watch dial clearly visible',
  'rolex-vs-omega-complete-comparison': 'Two luxury watches side by side on a dark leather surface with dramatic lighting, one with a black bezel and one with a blue bezel, polished steel cases, shot from above',
  'watch-collecting-beginners-guide': 'An elegant wooden watch box with velvet interior containing three luxury watches, warm soft lighting from above, different styles arranged neatly',
  'grand-seiko-vs-rolex-value-proposition': 'A beautifully textured watch dial with intricate snowflake-like patterns, extreme macro photography with directional lighting revealing surface depth, cool blue-white tones',
  'how-to-read-watch-specifications': 'A technical watch blueprint or specification sheet with elegant typography next to a luxury watch with open caseback revealing the movement, warm desk lamp lighting',
  'history-of-the-tourbillon': 'A dramatic close-up of a tourbillon complication, the spinning cage visible through a dial aperture, intricate metal components, dark background with single beam of light',
  'watch-strap-guide-leather-rubber-nato-bracelet': 'A flat lay of different watch straps on marble - brown leather, black rubber, olive NATO, polished steel bracelet, arranged artfully with soft natural window lighting',
  'swiss-vs-japanese-watchmaking': 'A Swiss mountain village with a clock tower on the left and a Japanese zen garden with modern architecture on the right, split composition, warm and cool tones contrasting',
  'watch-water-resistance-explained': 'A luxury dive watch partially submerged in crystal clear water with visible droplets on the crystal surface, dramatic underwater lighting creating caustic patterns',
};

async function generateImage(prompt: string, slug: string): Promise<string | null> {
  if (!GEMINI_KEY) {
    console.log('    No GEMINI_API_KEY');
    return null;
  }

  try {
    console.log(`    Generating image...`);
    const fullPrompt = `${prompt}\n\nStyle: Clean, modern, editorial photography for a luxury watch encyclopedia website. High contrast, elegant lighting, minimalist composition. Wide 16:9 aspect ratio. NO text or watermarks.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt,
            }]
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.log(`    API error ${res.status}: ${err.substring(0, 200)}`);
      return null;
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!parts) {
      console.log('    No parts in response');
      return null;
    }

    for (const part of parts) {
      if (part.inlineData?.data) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        const mime = part.inlineData.mimeType || 'image/png';
        const ext = mime.includes('png') ? 'png' : 'jpg';
        const filePath = `blog/${slug}.${ext}`;

        const { error } = await admin.storage.from('watch-images').upload(filePath, buffer, {
          contentType: mime,
          upsert: true,
        });

        if (error) {
          console.log(`    Upload error: ${error.message}`);
          return null;
        }

        const { data: urlData } = admin.storage.from('watch-images').getPublicUrl(filePath);
        console.log(`    Image uploaded!`);
        return urlData.publicUrl;
      }
    }

    console.log('    No image data in response');
    return null;
  } catch (e: any) {
    console.log(`    Error: ${e.message}`);
    return null;
  }
}

async function main() {
  // Fetch all published posts
  const { data: posts, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error || !posts) {
    console.error('Failed to fetch posts:', error?.message);
    return;
  }

  console.log(`Processing ${posts.length} blog posts...\n`);

  for (const post of posts) {
    console.log(`\n${post.title.substring(0, 60)}...`);

    // 1. Add internal links
    const linkedContent = addInternalLinks(post.content);
    const linksAdded = linkedContent !== post.content;
    console.log(`  Links: ${linksAdded ? 'added' : 'none needed'}`);

    // 2. Generate cover image if missing
    let coverImage = post.cover_image;
    if (!coverImage && imagePrompts[post.slug]) {
      coverImage = await generateImage(imagePrompts[post.slug], post.slug);
      if (coverImage) console.log(`  Cover: ${coverImage.substring(0, 60)}...`);
    } else if (coverImage) {
      console.log(`  Cover: already has image`);
    } else {
      console.log(`  Cover: no prompt defined`);
    }

    // 3. Update if changed
    if (linksAdded || coverImage !== post.cover_image) {
      const update: Record<string, any> = {};
      if (linksAdded) update.content = linkedContent;
      if (coverImage !== post.cover_image) update.cover_image = coverImage;

      const { error: updateErr } = await admin
        .from('blog_posts')
        .update(update)
        .eq('id', post.id);

      if (updateErr) {
        console.error(`  Update error: ${updateErr.message}`);
      } else {
        console.log(`  Updated!`);
      }
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\nDone! All posts updated with internal links and cover images.');
}

main().catch(console.error);
