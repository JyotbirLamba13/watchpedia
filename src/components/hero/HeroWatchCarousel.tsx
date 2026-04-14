'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const heroWatches = [
  {
    name: 'Everest III',
    brand: 'Delhi Watch Company',
    image: 'https://delhiwatchcompany.com/cdn/shop/files/Screenshot2025-06-24at5.52.25PM.png?v=1750767845&width=800',
    href: '/brands/delhi-watch-company',
  },
  {
    name: 'Submariner Date',
    brand: 'Rolex',
    image: 'https://cdn.watchbase.com/watch/lg/origin:png/rolex/submariner/126610ln-0001-78.png',
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

const orbitTerms = [
  'Chronograph', 'Tourbillon', 'Moonphase', 'Perpetual Calendar',
  'Automatic', 'Swiss Made', 'COSC', 'Skeleton',
  'Power Reserve', 'Sapphire', 'Luminova', 'GMT',
  'Dive Bezel', 'Guilloch\u00e9', 'Tachymeter', 'Spring Drive',
];

export default function HeroWatchCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const angleRef = useRef(0);
  const [positions, setPositions] = useState<{ x: number; y: number; opacity: number }[]>([]);

  useEffect(() => {
    const watchInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroWatches.length);
    }, 5000);
    return () => clearInterval(watchInterval);
  }, []);

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      angleRef.current = (angleRef.current + delta * 0.008) % 360;

      const newPositions = orbitTerms.map((_, i) => {
        const baseAngle = (i / orbitTerms.length) * 360;
        const currentAngle = baseAngle + angleRef.current;
        const radians = (currentAngle * Math.PI) / 180;
        const radiusX = 220;
        const radiusY = 240;
        const x = Math.cos(radians) * radiusX;
        const y = Math.sin(radians) * radiusY;

        // Hide terms when they're near the bottom label area (y > 200)
        // and fade terms when near center of watch
        const absX = Math.abs(x);
        const absY = Math.abs(y);
        let opacity = 0.25 + (absX / radiusX) * 0.5;
        // Fade out near bottom where the label is
        if (y > 180) opacity = Math.max(0, opacity * (1 - (y - 180) / 80));

        return { x, y, opacity };
      });

      setPositions(newPositions);
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const watch = heroWatches[activeIndex];

  return (
    <Link
      href={watch.href}
      className="relative flex items-center justify-center w-[300px] h-[400px] sm:w-[360px] sm:h-[480px] lg:w-[440px] lg:h-[560px] group cursor-pointer"
    >
      {/* Orbiting terms - IN FRONT, text always upright, fades near label */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {orbitTerms.map((term, i) => {
          const pos = positions[i];
          if (!pos) return null;

          const size = i % 3 === 0 ? 'text-sm sm:text-base' : i % 3 === 1 ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs';

          return (
            <span
              key={term}
              className={`absolute ${size} font-display text-white whitespace-nowrap select-none font-medium`}
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: 'translate(-50%, -50%)',
                opacity: pos.opacity,
                textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 20px rgba(201,169,110,0.2)',
                willChange: 'left, top, opacity',
              }}
            >
              {term}
            </span>
          );
        })}
      </div>

      {/* Subtle orbit path ring */}
      <svg className="absolute inset-0 -m-4 w-[calc(100%+32px)] h-[calc(100%+32px)] z-10 pointer-events-none" viewBox="0 0 500 600">
        <ellipse cx="250" cy="300" rx="220" ry="240" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 8" />
      </svg>

      {/* Watch images - crossfade */}
      {heroWatches.map((w, i) => (
        <div
          key={w.name}
          className="absolute inset-12 sm:inset-14 lg:inset-16 flex items-center justify-center transition-opacity duration-[1500ms] ease-in-out z-[5]"
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

      {/* Watch label - bottom, high z-index to stay above orbiting text */}
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
