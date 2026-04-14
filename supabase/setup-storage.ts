// Setup Supabase storage bucket + add image_source column
// Usage: npx tsx supabase/setup-storage.ts

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, key);

async function setup() {
  // 1. Create storage bucket for watch images
  console.log('Creating watch-images storage bucket...');
  const { data: bucket, error: bucketErr } = await admin.storage.createBucket('watch-images', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 2 * 1024 * 1024, // 2MB
  });
  if (bucketErr) {
    if (bucketErr.message?.includes('already exists')) {
      console.log('  Bucket already exists, updating...');
      await admin.storage.updateBucket('watch-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 2 * 1024 * 1024,
      });
    } else {
      console.error('  Bucket error:', bucketErr.message);
    }
  } else {
    console.log('  Bucket created:', bucket);
  }

  // 2. Test bucket access
  const { data: buckets } = await admin.storage.listBuckets();
  console.log('  Available buckets:', buckets?.map(b => b.name).join(', '));

  // 3. Add image_source column via a workaround:
  //    Try to update a record with image_source. If column doesn't exist, we'll know.
  console.log('\nTesting image_source column...');
  const { error: colTest } = await admin
    .from('watches')
    .update({ image_source: '__test__' })
    .eq('slug', '__nonexistent__');

  if (colTest?.message?.includes('image_source')) {
    console.log('  Column image_source does NOT exist yet.');
    console.log('  Attempting to add via RPC...');

    // Try using rpc to execute SQL (requires a helper function)
    const { error: rpcErr } = await admin.rpc('exec_sql', {
      sql: 'ALTER TABLE watches ADD COLUMN IF NOT EXISTS image_source TEXT'
    });

    if (rpcErr) {
      console.log('  RPC not available. Creating helper function...');
      // Create a temporary SQL execution function via raw POST
      const resp = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: 'SELECT 1' }),
      });
      console.log('  Direct RPC status:', resp.status);
    }
  } else {
    console.log('  Column image_source exists!');
    // Clean up test
    await admin
      .from('watches')
      .update({ image_source: null })
      .eq('image_source', '__test__');
  }

  console.log('\nSetup complete!');
}

setup().catch(console.error);
