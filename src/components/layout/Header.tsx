'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⌚</span>
            <span className="text-xl font-serif font-bold text-gray-900">Watchpedia</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/brands" className="text-gray-600 hover:text-watchpedia-link">Brands</Link>
            <Link href="/groups" className="text-gray-600 hover:text-watchpedia-link">Groups</Link>
            <Link href="/countries" className="text-gray-600 hover:text-watchpedia-link">Countries</Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <input
              type="search"
              placeholder="Search watches, brands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 lg:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:border-watchpedia-link"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
            <form onSubmit={handleSearch} className="flex sm:hidden mb-3">
              <input
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none"
              />
              <button type="submit" className="px-3 py-1.5 text-sm bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                Search
              </button>
            </form>
            <Link href="/brands" className="block px-2 py-1 text-sm text-gray-600 hover:text-watchpedia-link" onClick={() => setMenuOpen(false)}>Brands</Link>
            <Link href="/groups" className="block px-2 py-1 text-sm text-gray-600 hover:text-watchpedia-link" onClick={() => setMenuOpen(false)}>Groups</Link>
            <Link href="/countries" className="block px-2 py-1 text-sm text-gray-600 hover:text-watchpedia-link" onClick={() => setMenuOpen(false)}>Countries</Link>
          </div>
        )}
      </div>
    </header>
  );
}
