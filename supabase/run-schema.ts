// Run schema.sql against Supabase PostgreSQL
// Usage: npx tsx supabase/run-schema.ts

import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase direct connection (uses transaction pooler)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ref = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Try direct connection first, then pooler with different regions
const connectionString = `postgresql://postgres:${SERVICE_KEY}@db.${ref}.supabase.co:5432/postgres`;

async function runSchema() {
  console.log('Connecting to Supabase PostgreSQL...');
  const sql = postgres(connectionString, { ssl: 'require' });

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    // Split by semicolons and run each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt);
        const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
        console.log(`✓ ${preview}...`);
      } catch (err: any) {
        // Skip "already exists" errors
        if (err.message?.includes('already exists')) {
          console.log(`⊘ Already exists: ${stmt.substring(0, 50)}...`);
        } else {
          console.error(`✗ Error: ${err.message}`);
          console.error(`  Statement: ${stmt.substring(0, 80)}...`);
        }
      }
    }

    console.log('\nSchema setup complete!');
  } finally {
    await sql.end();
  }
}

runSchema().catch(console.error);
