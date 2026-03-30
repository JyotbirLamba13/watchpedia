import type { Watch } from '@/types';
import WatchCard from './WatchCard';

export default function WatchGrid({ watches }: { watches: Watch[] }) {
  if (watches.length === 0) {
    return <p className="text-gray-500 text-sm">No watches found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {watches.map((watch) => (
        <WatchCard key={`${watch.brandSlug}-${watch.slug}`} watch={watch} />
      ))}
    </div>
  );
}
