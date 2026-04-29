export default function WatchPlaceholder({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Strap top */}
      <rect x="72" y="0" width="56" height="44" rx="8" fill="#e8e4dc" />
      {/* Strap bottom */}
      <rect x="72" y="196" width="56" height="44" rx="8" fill="#e8e4dc" />
      {/* Case */}
      <circle cx="100" cy="120" r="72" fill="#ede9e0" />
      <circle cx="100" cy="120" r="66" fill="#f5f2ec" />
      {/* Crown */}
      <rect x="172" y="114" width="10" height="12" rx="3" fill="#ddd8ce" />
      {/* Dial ring */}
      <circle cx="100" cy="120" r="58" fill="none" stroke="#ddd8ce" strokeWidth="1.5" />
      {/* Hour markers */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const isMain = i % 3 === 0;
        const r1 = isMain ? 48 : 50;
        const r2 = isMain ? 54 : 53;
        const x1 = 100 + r1 * Math.cos(rad);
        const y1 = 120 + r1 * Math.sin(rad);
        const x2 = 100 + r2 * Math.cos(rad);
        const y2 = 120 + r2 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#c8c4bc"
            strokeWidth={isMain ? 2.5 : 1.2}
            strokeLinecap="round"
          />
        );
      })}
      {/* Center dot */}
      <circle cx="100" cy="120" r="3" fill="#c8c4bc" />
    </svg>
  );
}
