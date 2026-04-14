// Migration script: JSON files → Supabase
// Usage: npx tsx supabase/migrate.ts

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function migrate() {
  const dataDir = path.join(__dirname, '..', 'src', 'data');

  // 1. Countries
  const countries = JSON.parse(fs.readFileSync(path.join(dataDir, 'countries.json'), 'utf8'));
  console.log(`Migrating ${countries.length} countries...`);
  const { error: countryErr } = await supabase.from('countries').upsert(countries, { onConflict: 'slug' });
  if (countryErr) console.error('Countries error:', countryErr.message);

  // 2. Groups
  const groups = JSON.parse(fs.readFileSync(path.join(dataDir, 'groups.json'), 'utf8'));
  console.log(`Migrating ${groups.length} groups...`);
  const groupRows = groups.map((g: any) => ({
    slug: g.slug,
    name: g.name,
    country: g.country,
    description: g.description,
    website: g.website,
  }));
  const { error: groupErr } = await supabase.from('groups').upsert(groupRows, { onConflict: 'slug' });
  if (groupErr) console.error('Groups error:', groupErr.message);

  // 3. Brands
  const brands = JSON.parse(fs.readFileSync(path.join(dataDir, 'brands.json'), 'utf8'));
  console.log(`Migrating ${brands.length} brands...`);
  const brandRows = brands.map((b: any) => ({
    slug: b.slug,
    name: b.name,
    country: b.country,
    founded: b.founded,
    description: b.description,
    website: b.website,
    group_slug: b.groupSlug || null,
  }));
  const { error: brandErr } = await supabase.from('brands').upsert(brandRows, { onConflict: 'slug' });
  if (brandErr) console.error('Brands error:', brandErr.message);

  // 4. Group-Brand relationships
  console.log('Migrating group-brand relationships...');
  const groupBrands: { group_slug: string; brand_slug: string }[] = [];
  for (const g of groups) {
    for (const bs of g.brandSlugs) {
      groupBrands.push({ group_slug: g.slug, brand_slug: bs });
    }
  }
  const { error: gbErr } = await supabase.from('group_brands').upsert(groupBrands, { onConflict: 'group_slug,brand_slug' });
  if (gbErr) console.error('Group-brands error:', gbErr.message);

  // 5. Watches
  const watches = JSON.parse(fs.readFileSync(path.join(dataDir, 'watches.json'), 'utf8'));
  console.log(`Migrating ${watches.length} watches...`);
  const watchRows = watches.map((w: any) => ({
    slug: w.slug,
    name: w.name,
    brand_slug: w.brandSlug,
    collection: w.collection,
    reference: w.reference,
    image: w.image,
    featured: w.featured || false,
    description: w.description,
    case_diameter: w.specs?.caseDiameter,
    case_material: w.specs?.caseMaterial,
    case_thickness: w.specs?.caseThickness,
    movement: w.specs?.movement,
    movement_type: w.specs?.movementType,
    caliber: w.specs?.caliber,
    crystal: w.specs?.crystal,
    dial_color: w.specs?.dialColor,
    water_resistance: w.specs?.waterResistance,
    power_reserve: w.specs?.powerReserve,
    strap_material: w.specs?.strapMaterial,
    price: w.specs?.price,
    year_introduced: w.specs?.yearIntroduced,
  }));

  // Upsert in batches of 50
  for (let i = 0; i < watchRows.length; i += 50) {
    const batch = watchRows.slice(i, i + 50);
    const { error } = await supabase.from('watches').upsert(batch, { onConflict: 'brand_slug,slug' });
    if (error) console.error(`Watches batch ${i} error:`, error.message);
    else console.log(`  Batch ${i}-${i + batch.length} done`);
  }

  console.log('\nMigration complete!');
  console.log(`  Countries: ${countries.length}`);
  console.log(`  Groups: ${groups.length}`);
  console.log(`  Brands: ${brands.length}`);
  console.log(`  Watches: ${watches.length}`);
}

migrate().catch(console.error);
