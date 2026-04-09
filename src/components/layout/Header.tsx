'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/brands', label: 'Brands' },
  { href: '/groups', label: 'Groups' },
  { href: '/countries', label: 'Countries' },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-wp-dark text-white text-xs text-center py-1.5 tracking-wide">
        The World&apos;s Watch Encyclopedia &mdash; {' '}
        <Link href="/brands" className="underline underline-offset-2 hover:text-wp-gold transition-colors">
          Explore 34 Brands
        </Link>
      </div>

      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'border-b border-wp-border'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 bg-wp-dark rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <span className="text-lg font-display font-bold text-wp-dark tracking-tight">
                Watchpedia
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide transition-colors relative py-1 ${
                    pathname.startsWith(link.href)
                      ? 'text-wp-dark font-medium'
                      : 'text-wp-muted hover:text-wp-dark'
                  }`}
                >
                  {link.label}
                  {pathname.startsWith(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-wp-gold" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wp-muted/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search watches, brands, collections..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-wp-cream border border-wp-border rounded-full focus:outline-none focus:border-wp-dark placeholder:text-wp-muted/50 transition-colors"
                />
              </div>
            </form>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-wp-muted hover:text-wp-dark transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-wp-muted hover:text-wp-dark transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search overlay */}
        {searchOpen && (
          <div className="md:hidden absolute inset-x-0 top-full bg-white border-b border-wp-border shadow-lg">
            <div className="px-4 py-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search watches, brands, collections..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="w-full px-5 py-3 bg-wp-cream border border-wp-border rounded-full focus:outline-none focus:border-wp-dark placeholder:text-wp-muted/60"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-wp-dark text-white rounded-full hover:bg-wp-charcoal transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-wp-border bg-white">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname.startsWith(link.href)
                      ? 'bg-wp-cream text-wp-dark font-medium'
                      : 'text-wp-muted hover:bg-wp-cream hover:text-wp-dark'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
