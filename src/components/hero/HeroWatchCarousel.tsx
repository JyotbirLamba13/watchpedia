'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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

const sizes = ['text-[10px] sm:text-xs', 'text-xs sm:text-sm', 'text-sm sm:text-base'];

// Zones around the watch — positions as percentages
const zones = [
  { xMin: 2, xMax: 28, yMin: 2, yMax: 18 },
  { xMin: 72, xMax: 98, yMin: 2, yMax: 18 },
  { xMin: 0, xMax: 12, yMin: 25, yMax: 55 },
  { xMin: 88, xMax: 100, yMin: 25, yMax: 55 },
  { xMin: 0, xMax: 22, yMin: 60, yMax: 78 },
  { xMin: 78, xMax: 100, yMin: 60, yMax: 78 },
  { xMin: 28, xMax: 72, yMin: 0, yMax: 8 },
];

interface FloatingTerm {
  id: number;
  term: string;
  x: number;
  y: number;
  opacity: number;
  size: string;
}

export default function HeroWatchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [terms, setTerms] = useState<FloatingTerm[]>([]);
  const termIndexRef = useRef(0);
  const idRef = useRef(0);

  // Watch cycling — 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroWatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating terms — spawn every 1s, no dependency on state
  useEffect(() => {
    const shuffled = [...allTerms].sort(() => Math.random() - 0.5);

    function spawn() {
      const idx = termIndexRef.current % shuffled.length;
      termIndexRef.current++;
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const newTerm: FloatingTerm = {
        id: idRef.current++,
        term: shuffled[idx],
        x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
        y: zone.yMin + Math.random() * (zone.yMax - zone.yMin),
        opacity: 0,
        size: sizes[Math.floor(Math.random() * sizes.length)],
      };

      // Add with opacity 0
      setTerms((prev) => [...prev.slice(-7), newTerm]);

      // Fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTerms((prev) =>
            prev.map((t) => (t.id === newTerm.id ? { ...t, opacity: 1 } : t))
          );
        });
      });

      // Fade out after 2.5s
      setTimeout(() => {
        setTerms((prev) =>
          prev.map((t) => (t.id === newTerm.id ? { ...t, opacity: 0 } : t))
        );
      }, 2500);

      // Remove after fade completes
      setTimeout(() => {
        setTerms((prev) => prev.filter((t) => t.id !== newTerm.id));
      }, 3500);
    }

    // Spawn initial batch
    spawn();
    setTimeout(spawn, 200);
    setTimeout(spawn, 400);
    setTimeout(spawn, 700);

    const interval = setInterval(spawn, 1000);
    return () => clearInterval(interval);
  }, []); // No dependencies — stable effect

  const watch = heroWatches[activeIndex];

  return (
    <Link
      href={watch.href}
      className="relative flex items-center justify-center w-[280px] h-[370px] sm:w-[360px] sm:h-[480px] lg:w-[440px] lg:h-[560px] group cursor-pointer"
    >
      {/* Floating terms */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {terms.map((t) => (
          <span
            key={t.id}
            className={`absolute ${t.size} font-display text-white/80 whitespace-nowrap select-none font-medium`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              opacity: t.opacity,
              transition: 'opacity 800ms ease-in-out',
              textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 8px rgba(201,169,110,0.2)',
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
