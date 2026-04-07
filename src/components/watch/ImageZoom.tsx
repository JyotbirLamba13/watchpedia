'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

export default function ImageZoom({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute inset-0 z-10 cursor-zoom-in group/zoom"
        aria-label={`Zoom in on ${alt}`}
      >
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover/zoom:opacity-100 transition-opacity flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
          </svg>
          Click to zoom
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out animate-fadeIn"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-50"
            aria-label="Close zoom"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-[90vw] h-[90vh] max-w-4xl">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="90vw"
              quality={100}
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
