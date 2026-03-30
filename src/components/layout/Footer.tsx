import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse</h3>
            <ul className="space-y-1">
              <li><Link href="/brands" className="text-gray-600 hover:text-watchpedia-link">All Brands</Link></li>
              <li><Link href="/groups" className="text-gray-600 hover:text-watchpedia-link">Watch Groups</Link></li>
              <li><Link href="/countries" className="text-gray-600 hover:text-watchpedia-link">By Country</Link></li>
              <li><Link href="/search" className="text-gray-600 hover:text-watchpedia-link">Search</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Popular Brands</h3>
            <ul className="space-y-1">
              <li><Link href="/brands/rolex" className="text-gray-600 hover:text-watchpedia-link">Rolex</Link></li>
              <li><Link href="/brands/omega" className="text-gray-600 hover:text-watchpedia-link">Omega</Link></li>
              <li><Link href="/brands/seiko" className="text-gray-600 hover:text-watchpedia-link">Seiko</Link></li>
              <li><Link href="/brands/cartier" className="text-gray-600 hover:text-watchpedia-link">Cartier</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Major Groups</h3>
            <ul className="space-y-1">
              <li><Link href="/groups/swatch-group" className="text-gray-600 hover:text-watchpedia-link">Swatch Group</Link></li>
              <li><Link href="/groups/richemont" className="text-gray-600 hover:text-watchpedia-link">Richemont</Link></li>
              <li><Link href="/groups/lvmh" className="text-gray-600 hover:text-watchpedia-link">LVMH</Link></li>
              <li><Link href="/groups/seiko-group" className="text-gray-600 hover:text-watchpedia-link">Seiko Group</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Watchpedia is a free, community-driven encyclopedia of watches from every brand and country around the world.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Watchpedia. All watch names and trademarks belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
