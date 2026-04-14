'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const heroWatches = [
  {
    name: 'Everest III',
    brand: 'Delhi Watch Company',
    image: 'https://delhiwatchcompany.com/cdn/shop/files/Screenshot2025-06-24at5.52.25PM.png?v=1750767845&width=800',
  },
  {
    name: 'Submariner Date',
    brand: 'Rolex',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/rolex/submariner/126610ln-0001-78.png',
  },
  {
    name: 'Speedmaster',
    brand: 'Omega',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/omega/baselworld-2017/329-30-44-51-04-001-34.png',
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
];

const orbitTerms = [
  'Chronograph', 'Tourbillon', 'Moonphase', 'Perpetual Calendar',
  'Automatic', 'Swiss Made', 'COSC', 'Skeleton',
  'Power Reserve', 'Sapphire Crystal', 'Luminova', 'GMT',
  'Dive Bezel', 'Guilloch\u00e9', 'Tachymeter', 'Spring Drive',
  'Column Wheel', 'Flyback', 'Retrograde', 'Minute Repeater',
];

export default function HeroWatchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroWatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[320px] h-[420px] sm:w-[380px] sm:h-[500px] lg:w-[460px] lg:h-[580px]">

      {/* Orbiting text ring - outer */}
      <div className="absolute inset-0 -m-12 sm:-m-16 lg:-m-20 orbit-ring">
        {orbitTerms.slice(0, 12).map((term, i) => {
          const angle = (i / 12) * 360;
          return (
            <span
              key={term}
              className="absolute left-1/2 top-1/2 text-[11px] sm:text-xs font-display text-white/20 whitespace-nowrap select-none"
              style={{
                transform: `rotate(${angle}deg) translateY(-50%) translateX(180px) rotate(-${angle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              {term}
            </span>
          );
        })}
      </div>

      {/* Orbiting text ring - inner */}
      <div className="absolute inset-0 -m-4 sm:-m-6 lg:-m-8 orbit-ring-reverse">
        {orbitTerms.slice(12).map((term, i) => {
          const angle = (i / 8) * 360;
          return (
            <span
              key={term}
              className="absolute left-1/2 top-1/2 text-[10px] sm:text-[11px] font-display text-wp-gold/15 whitespace-nowrap select-none"
              style={{
                transform: `rotate(${angle}deg) translateY(-50%) translateX(140px) rotate(-${angle}deg)`,
                transformOrigin: '0 0',
              }}
            >
              {term}
            </span>
          );
        })}
      </div>

      {/* Subtle orbit rings */}
      <div className="absolute inset-0 -m-12 sm:-m-16 lg:-m-20 rounded-full border border-white/[0.04] orbit-ring pointer-events-none" />
      <div className="absolute inset-0 -m-4 sm:-m-6 lg:-m-8 rounded-full border border-dashed border-white/[0.03] orbit-ring-reverse pointer-events-none" />

      {/* Watch images - crossfade */}
      {heroWatches.map((watch, i) => (
        <div
          key={watch.name}
          className="absolute inset-8 sm:inset-10 lg:inset-12 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <Image
            src={watch.image}
            alt={`${watch.brand} ${watch.name}`}
            fill
            className="object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 360px"
            priority={i === 0}
            unoptimized
          />
        </div>
      ))}

      {/* Watch label - bottom */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center w-full">
        <p
          key={`name-${activeIndex}`}
          className="text-white/90 text-sm sm:text-base font-display font-semibold tracking-wide hero-label-fade"
        >
          {heroWatches[activeIndex].name}
        </p>
        <p
          key={`brand-${activeIndex}`}
          className="text-wp-gold/50 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] mt-1 hero-label-fade"
        >
          {heroWatches[activeIndex].brand}
        </p>
      </div>
    </div>
  );
}
