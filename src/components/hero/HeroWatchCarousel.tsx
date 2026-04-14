'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const heroWatches = [
  {
    name: 'Rolex Submariner',
    brand: 'Rolex',
    image: 'https://cdn.watchbase.com/watch/lg/origin:jpg/rolex/submariner/126610ln-0001-78.png',
  },
  {
    name: 'Omega Speedmaster',
    brand: 'Omega',
    image: 'https://cdn.watchbase.com/watch/lg/origin:jpg/omega/speedmaster/310-30-42-50-01-002-7f.png',
  },
  {
    name: 'Royal Oak',
    brand: 'Audemars Piguet',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/audemars-piguet/royal-oak/15500st-oo-1220st-01-a7.png',
  },
  {
    name: 'Nautilus',
    brand: 'Patek Philippe',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/patek-philippe/nautilus/5711-1a-010-fa.png',
  },
  {
    name: 'Black Bay 58',
    brand: 'Tudor',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/tudor/heritage/79030n-0001-53.png',
  },
];

const watchTerms = [
  'Chronograph', 'Tourbillon', 'Moonphase', 'Perpetual Calendar',
  'Automatic', 'Swiss Made', 'COSC Certified', 'Skeleton Dial',
  'Power Reserve', 'Sapphire Crystal', 'Luminova', 'GMT',
  'Dive Bezel', 'Guilloch\u00e9', 'Tachymeter', 'Spring Drive',
  'Column Wheel', 'Flyback', 'Retrograde', 'Minute Repeater',
];

export default function HeroWatchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroWatches.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Word cloud - floating terms */}
      <div className="absolute inset-0 -m-16 hidden lg:block">
        {watchTerms.map((term, i) => {
          const angle = (i / watchTerms.length) * Math.PI * 2;
          const radius = 180 + (i % 3) * 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const opacity = 0.08 + (i % 4) * 0.06;
          const size = i % 3 === 0 ? 'text-sm' : i % 3 === 1 ? 'text-xs' : 'text-[11px]';

          return (
            <span
              key={term}
              className={`absolute ${size} font-display text-white whitespace-nowrap select-none hero-term`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                opacity,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {term}
            </span>
          );
        })}
      </div>

      {/* Watch image container */}
      <div className="relative w-[260px] h-[340px] sm:w-[320px] sm:h-[420px] lg:w-[380px] lg:h-[500px]">
        {heroWatches.map((watch, i) => (
          <div
            key={watch.name}
            className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              transform: i === activeIndex ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <Image
              src={watch.image}
              alt={`${watch.brand} ${watch.name}`}
              fill
              className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 380px"
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Watch name label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center">
        <p
          key={activeIndex}
          className="text-white/80 text-sm font-display font-semibold tracking-wide hero-label-fade"
        >
          {heroWatches[activeIndex].name}
        </p>
        <p
          key={`brand-${activeIndex}`}
          className="text-wp-gold/60 text-[11px] uppercase tracking-[0.2em] mt-0.5 hero-label-fade"
        >
          {heroWatches[activeIndex].brand}
        </p>
      </div>

      {/* Carousel dots */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        {heroWatches.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? 'bg-wp-gold w-6'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Show ${heroWatches[i].name}`}
          />
        ))}
      </div>
    </div>
  );
}
