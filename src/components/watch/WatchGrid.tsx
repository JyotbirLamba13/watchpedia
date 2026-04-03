import type { Watch } from '@/types';
import WatchCard from './WatchCard';

export default function WatchGrid({ watches }: { watches: Watch[] }) {
  if (watches.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-wp-muted text-sm">No watches found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {watches.map((watch) => (
        <WatchCard key={`${watch.brandSlug}-${watch.slug}`} watch={watch} />
      ))}
    </div>
  );
}
