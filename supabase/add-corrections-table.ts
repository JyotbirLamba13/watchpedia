// Creates watch_corrections table in Supabase
// Usage: npx tsx supabase/add-corrections-table.ts

import postgres from 'postgres';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ref = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const connectionString = `postgresql://postgres:${SERVICE_KEY}@db.${ref}.supabase.co:5432/postgres`;

const statements = [
  `CREATE TABLE IF NOT EXISTS watch_corrections (
    id SERIAL PRIMARY KEY,
    brand_slug TEXT NOT NULL,
    watch_reference TEXT NOT NULL,
    watch_name TEXT NOT NULL,
    field_name TEXT NOT NULL,
    current_value TEXT,
    correct_value TEXT NOT NULL,
    reporter_note TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE watch_corrections ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "Public insert corrections" ON watch_corrections FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "Service read corrections" ON watch_corrections FOR SELECT USING (true)`,
  `CREATE POLICY "Service update corrections" ON watch_corrections FOR UPDATE USING (true)`,
];

async function run() {
  console.log('Connecting to Supabase...');
  const sql = postgres(connectionString, { ssl: 'require' });
  try {
    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt);
        console.log('✓ ' + stmt.substring(0, 60).replace(/\n/g, ' ') + '...');
      } catch (err: any) {
        if (err.message?.includes('already exists')) {
          console.log('⊘ Already exists: ' + stmt.substring(0, 50) + '...');
        } else {
          console.error('✗ ' + err.message);
        }
      }
    }
    console.log('\nwatch_corrections table ready.');
  } finally {
    await sql.end();
  }
}

run().catch(console.error);
