-- Watchpedia Database Schema

-- Countries
CREATE TABLE countries (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flag TEXT NOT NULL
);

-- Groups (watch conglomerates)
CREATE TABLE groups (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES countries(slug),
  description TEXT,
  website TEXT
);

-- Brands
CREATE TABLE brands (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES countries(slug),
  founded INTEGER NOT NULL,
  description TEXT,
  website TEXT,
  group_slug TEXT REFERENCES groups(slug),
  logo_url TEXT
);

-- Watches
CREATE TABLE watches (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  brand_slug TEXT NOT NULL REFERENCES brands(slug) ON DELETE CASCADE,
  collection TEXT,
  reference TEXT NOT NULL,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  -- Specs (flattened for easier querying)
  case_diameter TEXT,
  case_material TEXT,
  case_thickness TEXT,
  movement TEXT,
  movement_type TEXT,
  caliber TEXT,
  crystal TEXT,
  dial_color TEXT,
  water_resistance TEXT,
  power_reserve TEXT,
  strap_material TEXT,
  price TEXT,
  year_introduced INTEGER,
  image_source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_slug, slug)
);

-- Group-Brand junction (groups.brandSlugs)
CREATE TABLE group_brands (
  group_slug TEXT NOT NULL REFERENCES groups(slug) ON DELETE CASCADE,
  brand_slug TEXT NOT NULL REFERENCES brands(slug) ON DELETE CASCADE,
  PRIMARY KEY (group_slug, brand_slug)
);

-- Blog posts (for SEO)
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Watchpedia',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}'
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER watches_updated_at BEFORE UPDATE ON watches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read" ON groups FOR SELECT USING (true);
CREATE POLICY "Public read" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read" ON watches FOR SELECT USING (true);
CREATE POLICY "Public read" ON group_brands FOR SELECT USING (true);
CREATE POLICY "Public read" ON blog_posts FOR SELECT USING (published = true);

-- Admin write access (via service role key, bypasses RLS)
