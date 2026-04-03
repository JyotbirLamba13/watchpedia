import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-display font-bold text-wp-border mb-6">404</p>
      <h1 className="font-display text-2xl font-bold text-wp-dark mb-3">Page not found</h1>
      <p className="text-wp-muted text-sm mb-8">
        The watch or page you&apos;re looking for doesn&apos;t exist in our encyclopedia yet.
      </p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="btn-pill btn-dark">
          Go home
        </Link>
        <Link href="/search" className="btn-pill btn-outline">
          Search
        </Link>
      </div>
    </div>
  );
}
