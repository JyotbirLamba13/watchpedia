import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-serif font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-600 mb-6">
        The watch or page you&apos;re looking for doesn&apos;t exist in our encyclopedia yet.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="px-4 py-2 bg-watchpedia-link text-white rounded-lg hover:bg-watchpedia-link-hover text-sm">
          Go home
        </Link>
        <Link href="/search" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Search
        </Link>
      </div>
    </div>
  );
}
