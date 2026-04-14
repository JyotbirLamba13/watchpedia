import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedWatches, getAllBrands, getAllGroups, getAllCountries, getAllWatches } from '@/lib/data';
import WatchCard from '@/components/watch/WatchCard';
import { brandLogos } from '@/lib/brandLogos';

export default function HomePage() {
  const featured = getFeaturedWatches();
  const brands = getAllBrands();
  const groups = getAllGroups();
  const countries = getAllCountries();
  const totalWatches = getAllWatches().length;

  const topBrands = ['rolex', 'omega', 'patek-philippe', 'audemars-piguet', 'cartier', 'seiko', 'grand-seiko', 'tudor', 'tag-heuer', 'iwc', 'jaeger-lecoultre', 'breitling'];
  const popularBrands = brands.filter((b) => topBrands.includes(b.slug));

  return (
    <div>
      {/* Hero - Cinematic */}
      <section className="relative bg-wp-dark overflow-hidden min-h-[90vh] flex items-center">
        {/* Ambient glow effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-wp-gold/8 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-wp-charcoal via-wp-dark to-black" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-wp-gold" />
                <p className="text-wp-gold text-xs font-semibold uppercase tracking-[0.25em]">
                  The Watch Encyclopedia
                </p>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6">
                Every Watch.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-wp-gold to-wp-gold-light">Every Brand.</span><br />
                One Place.
              </h1>
              <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-10 max-w-md">
                Explore {brands.length} brands and {totalWatches} references from the world&apos;s finest watchmakers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/search" className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-wp-gold text-white text-sm font-medium rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(201,169,110,0.3)]">
                  <span className="relative z-10">Explore Watches</span>
                  <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/brands" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white text-sm font-medium rounded-full hover:bg-white/5 hover:border-white/25 transition-all">
                  Browse Brands
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 mt-14 pt-8 border-t border-white/10">
                <Stat value={`${brands.length}+`} label="Brands" />
                <div className="w-px h-10 bg-white/10" />
                <Stat value={`${totalWatches}`} label="References" />
                <div className="w-px h-10 bg-white/10" />
                <Stat value={`${countries.length}`} label="Countries" />
              </div>
            </div>

            {/* Right - Watch showcase */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow ring behind watch */}
                <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-wp-gold/10 via-transparent to-wp-gold/5 blur-3xl" />
                {/* Rotating ring decoration */}
                <div className="absolute inset-0 -m-6 rounded-full border border-wp-gold/10 hero-rotate" />
                <div className="absolute inset-0 -m-12 rounded-full border border-dashed border-white/5 hero-rotate-reverse" />
                {/* Main watch image */}
                <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px]">
                  <Image
                    src="https://ksrvqrkkhmzzxwhwhvnr.supabase.co/storage/v1/object/public/watch-images/hero/hero-speedmaster.jpg"
                    alt="Omega Speedmaster - iconic luxury chronograph"
                    fill
                    className="object-contain drop-shadow-[0_0_80px_rgba(201,169,110,0.15)] hero-float"
                    priority
                    unoptimized
                  />
                </div>
                {/* Floating brand badges */}
                <div className="absolute -left-4 top-1/4 hidden lg:flex items-center gap-2 px-3 py-2 bg-wp-charcoal/80 backdrop-blur-sm border border-white/10 rounded-lg hero-float-delayed">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[11px] text-white/70 font-medium">{totalWatches} watches indexed</span>
                </div>
                <div className="absolute -right-2 bottom-1/4 hidden lg:flex items-center gap-2 px-3 py-2 bg-wp-charcoal/80 backdrop-blur-sm border border-white/10 rounded-lg hero-float-delayed-2">
                  <span className="text-[11px] text-wp-gold font-medium">{brands.length} brands</span>
                  <span className="text-[11px] text-white/40">catalogued</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-wp-dark to-transparent" />
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full hero-scroll-dot" />
          </div>
        </div>
      </section>

      {/* Featured Watches */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHeader title="Featured Watches" subtitle="Iconic timepieces from the world's finest manufacturers" href="/search" linkText="View all" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((watch) => (
            <WatchCard key={`${watch.brandSlug}-${watch.slug}`} watch={watch} />
          ))}
        </div>
      </section>

      {/* Browse Categories - 3 columns */}
      <section className="bg-wp-cream">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <SectionHeader title="Discover" subtitle="Browse the encyclopedia your way" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CategoryCard
              href="/brands"
              title="By Brand"
              count={brands.length}
              description="From Audemars Piguet to Zenith"
              gradient="from-[#1a1a1a] to-[#2d2d2d]"
            />
            <CategoryCard
              href="/groups"
              title="By Group"
              count={groups.length}
              description="Swatch Group, Richemont, LVMH & more"
              gradient="from-[#2d2d2d] to-[#3a3a3a]"
            />
            <CategoryCard
              href="/countries"
              title="By Country"
              count={countries.length}
              description="Switzerland, Japan, Germany & beyond"
              gradient="from-[#3a3a3a] to-[#4a4a4a]"
            />
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <SectionHeader title="Popular Brands" subtitle="The most sought-after names in horology" href="/brands" linkText="All brands" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group flex flex-col items-center p-5 rounded-xl border border-wp-border/60 bg-white card-hover text-center"
            >
              <div className="w-full h-12 flex items-center justify-center mb-3 px-3">
                {brandLogos[brand.slug] ? (
                  <Image
                    src={brandLogos[brand.slug]}
                    alt={`${brand.name} logo`}
                    width={120}
                    height={48}
                    className="object-contain max-h-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    unoptimized
                  />
                ) : (
                  <span className="text-xl font-display font-bold text-wp-muted/50">{brand.name[0]}</span>
                )}
              </div>
              <span className="text-sm font-display font-semibold text-wp-dark">{brand.name}</span>
              <span className="text-[10px] text-wp-muted mt-1">Est. {brand.founded}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Groups Banner */}
      <section className="bg-wp-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-wp-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Industry</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Watch Groups &amp; Conglomerates</h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              The major companies that shape the global watch industry
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const country = countries.find((c) => c.slug === group.country);
              return (
                <Link
                  key={group.slug}
                  href={`/groups/${group.slug}`}
                  className="group p-5 rounded-xl bg-wp-charcoal/50 border border-wp-border-dark hover:bg-wp-charcoal transition-colors"
                >
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-wp-gold transition-colors">
                    {group.name}
                  </h3>
                  <p className="text-white/40 text-xs mt-1">
                    {country?.flag} {country?.name} &middot; {group.brandSlugs.length} brands
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {group.brandSlugs.slice(0, 5).map((slug) => {
                      const b = brands.find((br) => br.slug === slug);
                      return (
                        <span key={slug} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
                          {b?.name ?? slug}
                        </span>
                      );
                    })}
                    {group.brandSlugs.length > 5 && (
                      <span className="px-2 py-0.5 text-[10px] text-white/30">+{group.brandSlugs.length - 5} more</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-wp-gold text-xs font-semibold uppercase tracking-[0.2em] mb-3">Open Encyclopedia</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-wp-dark mb-4">
          The World of Watches, Encyclopedized
        </h2>
        <p className="text-wp-muted max-w-lg mx-auto mb-8">
          From a $15 Casio to a $500,000 Patek Philippe &mdash; every watch has a story. Start exploring.
        </p>
        <Link href="/search" className="btn-pill btn-dark">
          Search the Encyclopedia
        </Link>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  href,
  linkText,
}: {
  title: string;
  subtitle: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-wp-dark">{title}</h2>
        <p className="text-wp-muted text-sm mt-1">{subtitle}</p>
      </div>
      {href && linkText && (
        <Link href={href} className="hidden sm:flex items-center gap-1 text-sm text-wp-muted hover:text-wp-dark transition-colors">
          {linkText}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">{value}</p>
      <p className="text-white/35 text-[10px] uppercase tracking-[0.15em] mt-1">{label}</p>
    </div>
  );
}

function CategoryCard({
  href,
  title,
  count,
  description,
  gradient,
}: {
  href: string;
  title: string;
  count: number;
  description: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative block p-8 rounded-xl bg-gradient-to-br ${gradient} overflow-hidden card-hover`}
    >
      <div className="relative z-10">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">{count} entries</p>
        <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-wp-gold transition-colors">
          {title}
        </h3>
        <p className="text-white/50 text-sm">{description}</p>
      </div>
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-wp-gold/30 transition-colors">
        <svg className="w-4 h-4 text-white/30 group-hover:text-wp-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
