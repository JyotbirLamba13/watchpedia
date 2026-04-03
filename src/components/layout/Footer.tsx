'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-wp-dark text-white mt-20">
      {/* Newsletter */}
      <div className="border-b border-wp-border-dark">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="font-display text-2xl font-bold mb-2">Stay in the Loop</h3>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
            Get the latest additions and watch news delivered to your inbox.
          </p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2.5 bg-wp-charcoal border border-wp-border-dark rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-wp-gold"
            />
            <button type="submit" className="btn-pill btn-gold shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Browse</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/brands">All Brands</FooterLink>
              <FooterLink href="/groups">Watch Groups</FooterLink>
              <FooterLink href="/countries">By Country</FooterLink>
              <FooterLink href="/search">Search</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Top Brands</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/brands/rolex">Rolex</FooterLink>
              <FooterLink href="/brands/omega">Omega</FooterLink>
              <FooterLink href="/brands/patek-philippe">Patek Philippe</FooterLink>
              <FooterLink href="/brands/audemars-piguet">Audemars Piguet</FooterLink>
              <FooterLink href="/brands/cartier">Cartier</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Groups</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/groups/swatch-group">Swatch Group</FooterLink>
              <FooterLink href="/groups/richemont">Richemont</FooterLink>
              <FooterLink href="/groups/lvmh">LVMH</FooterLink>
              <FooterLink href="/groups/seiko-group">Seiko Group</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">About</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Watchpedia is the free, open encyclopedia of watches. Every brand, every reference, from every corner of the world.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-wp-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span className="font-display text-sm font-semibold">Watchpedia</span>
          </div>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Watchpedia. All watch names and trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/60 hover:text-wp-gold transition-colors">
        {children}
      </Link>
    </li>
  );
}
