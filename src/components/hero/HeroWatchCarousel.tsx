'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const heroWatches = [
  {
    name: 'Milgauss',
    brand: 'Rolex',
    image: 'https://res.cloudinary.com/wc-photo/image/upload/c_fill,w_2000,h_2000,g_center/f_auto/q_auto/v1699416717/product/12a5476a79cadcf6c31f0f28c6312e0f/f3b37da6e3b65357d4b8ea7eaa757bab?_a=BAVAfVDW0',
    href: '/watches/rolex/126610ln',
  },
  {
    name: 'Speedmaster Racing',
    brand: 'Omega',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/omega/baselworld-2017/329-30-44-51-04-001-34.png',
    href: '/watches/omega/329-30-44-51-04-001',
  },
  {
    name: 'Royal Oak',
    brand: 'Audemars Piguet',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/audemars-piguet/royal-oak/15500st-oo-1220st-01-a7.png',
    href: '/watches/audemars-piguet/15500st-oo-1220st-01',
  },
  {
    name: 'Nautilus',
    brand: 'Patek Philippe',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/patek-philippe/nautilus/5711-1a-010-fa.png',
    href: '/watches/patek-philippe/5711-1a-010',
  },
];

const allTerms = [
  'Chronograph', 'Tourbillon', 'Moonphase', 'Perpetual Calendar',
  'Automatic', 'Swiss Made', 'COSC', 'Skeleton Dial',
  'Power Reserve', 'Sapphire Crystal', 'Luminova', 'GMT',
  'Dive Bezel', 'Guilloch\u00e9', 'Tachymeter', 'Spring Drive',
  'Column Wheel', 'Flyback', 'Retrograde', 'Minute Repeater',
  'Haute Horlogerie', 'Caliber', 'Complication', 'Exhibition Caseback',
];

// Generate a random position that avoids the watch center and bottom label
function getRandomPosition(): { x: number; y: number } {
  // Positions are percentages relative to the container
  // We place terms in zones: top-left, top-right, left, right, top-center
  const zones = [
    { xMin: 2, xMax: 25, yMin: 5, yMax: 30 },   // top-left
    { xMin: 75, xMax: 98, yMin: 5, yMax: 30 },   // top-right
    { xMin: 0, xMax: 20, yMin: 30, yMax: 65 },    // left
    { xMin: 80, xMax: 100, yMin: 30, yMax: 65 },  // right
    { xMin: 5, xMax: 30, yMin: 65, yMax: 85 },    // bottom-left
    { xMin: 70, xMax: 95, yMin: 65, yMax: 85 },   // bottom-right
    { xMin: 25, xMax: 75, yMin: 0, yMax: 12 },    // top-center
  ];

  const zone = zones[Math.floor(Math.random() * zones.length)];
  const x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
  const y = zone.yMin + Math.random() * (zone.yMax - zone.yMin);

  return { x, y };
}

interface FloatingTerm {
  id: number;
  term: string;
  x: number;
  y: number;
  phase: 'in' | 'visible' | 'out';
  size: string;
}

let nextId = 0;

export default function HeroWatchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [terms, setTerms] = useState<FloatingTerm[]>([]);
  const [termPool, setTermPool] = useState(() => [...allTerms].sort(() => Math.random() - 0.5));
  const [poolIndex, setPoolIndex] = useState(0);

  // Watch cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroWatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sizes = ['text-[10px] sm:text-xs', 'text-xs sm:text-sm', 'text-sm sm:text-base'];

  // Spawn a new term every 1 second
  const spawnTerm = useCallback(() => {
    const term = termPool[poolIndex % termPool.length];
    const pos = getRandomPosition();
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const newTerm: FloatingTerm = {
      id: nextId++,
      term,
      x: pos.x,
      y: pos.y,
      phase: 'in',
      size,
    };

    setPoolIndex((prev) => {
      const next = prev + 1;
      // Reshuffle when we've gone through all terms
      if (next >= termPool.length) {
        setTermPool([...allTerms].sort(() => Math.random() - 0.5));
        return 0;
      }
      return next;
    });

    setTerms((prev) => {
      // Keep max 6 terms visible at a time
      const active = [...prev, newTerm];
      return active.slice(-8);
    });

    // Transition to visible after fade-in
    setTimeout(() => {
      setTerms((prev) =>
        prev.map((t) => (t.id === newTerm.id ? { ...t, phase: 'visible' } : t))
      );
    }, 50);

    // Start fade-out after 2.5s
    setTimeout(() => {
      setTerms((prev) =>
        prev.map((t) => (t.id === newTerm.id ? { ...t, phase: 'out' } : t))
      );
    }, 2500);

    // Remove after fade-out completes
    setTimeout(() => {
      setTerms((prev) => prev.filter((t) => t.id !== newTerm.id));
    }, 3500);
  }, [termPool, poolIndex, sizes]);

  useEffect(() => {
    // Spawn initial batch staggered
    const initialTimers = [0, 300, 600, 900, 1200].map((delay) =>
      setTimeout(spawnTerm, delay)
    );

    const interval = setInterval(spawnTerm, 1000);
    return () => {
      initialTimers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, [spawnTerm]);

  const watch = heroWatches[activeIndex];

  return (
    <Link
      href={watch.href}
      className="relative flex items-center justify-center w-[280px] h-[370px] sm:w-[360px] sm:h-[480px] lg:w-[440px] lg:h-[560px] group cursor-pointer"
    >
      {/* Floating terms - appear and fade at random positions */}
      <div className="absolute -inset-8 sm:-inset-12 lg:-inset-16 z-20 pointer-events-none">
        {terms.map((t) => (
          <span
            key={t.id}
            className={`absolute ${t.size} font-display text-white/70 whitespace-nowrap select-none font-medium transition-opacity duration-[800ms] ease-in-out`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              opacity: t.phase === 'in' ? 0 : t.phase === 'visible' ? 1 : 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(201,169,110,0.15)',
            }}
          >
            {t.term}
          </span>
        ))}
      </div>

      {/* Watch images - crossfade */}
      {heroWatches.map((w, i) => (
        <div
          key={w.name}
          className="absolute inset-8 sm:inset-10 lg:inset-12 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out z-[5]"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <Image
            src={w.image}
            alt={`${w.brand} ${w.name}`}
            fill
            className="object-contain drop-shadow-[0_10px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 340px"
            priority={i === 0}
            unoptimized
          />
        </div>
      ))}

      {/* Watch label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center w-full z-30">
        <p
          key={`name-${activeIndex}`}
          className="text-white text-sm sm:text-base font-display font-semibold tracking-wide hero-label-fade drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {watch.name}
        </p>
        <p
          key={`brand-${activeIndex}`}
          className="text-wp-gold/60 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] mt-1 hero-label-fade drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          {watch.brand}
        </p>
      </div>
    </Link>
  );
}
