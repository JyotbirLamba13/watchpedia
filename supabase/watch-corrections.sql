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


-- Market prices table (run this too)
CREATE TABLE IF NOT EXISTS watch_market_prices (
  reference TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  market_price TEXT,
  price_source TEXT,
  refreshed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (reference, brand_slug)
);

ALTER TABLE watch_market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read prices" ON watch_market_prices FOR SELECT USING (true);
CREATE POLICY "Service write prices" ON watch_market_prices FOR ALL USING (true);
