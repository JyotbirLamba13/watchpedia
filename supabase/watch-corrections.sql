-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/ksrvqrkkhmzzxwhwhvnr/sql

CREATE TABLE IF NOT EXISTS watch_corrections (
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
);

ALTER TABLE watch_corrections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert corrections" ON watch_corrections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service read corrections" ON watch_corrections
  FOR SELECT USING (true);

CREATE POLICY "Service update corrections" ON watch_corrections
  FOR UPDATE USING (true);
