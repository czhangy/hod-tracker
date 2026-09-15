export function HeroBanner() {
  return (
    <svg
      viewBox="0 0 200 80"
      className="h-16 w-40 shrink-0 opacity-90 sm:h-20 sm:w-48"
      aria-hidden
    >
      <defs>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* moon */}
      <circle cx="160" cy="22" r="24" fill="url(#moon-glow)" />
      <circle cx="160" cy="22" r="13" fill="#fef9e7" />
      <circle cx="166" cy="17" r="13" fill="#0a0a0a" />

      {/* bats */}
      <g fill="#dc2626" transform="translate(104,14) scale(0.6)">
        <path d="M14 16c-4-6-8-9-11-7 3 2 5 4 7 4-2 3-5 4-8 7 5-1 9-2 12-1Z M18 16c4-6 8-9 11-7-3 2-5 4-7 4 2 3 5 4 8 7-5-1-9-2-12-1Z" />
        <circle cx="16" cy="17" r="2.4" />
      </g>
      <g fill="#dc2626" opacity="0.7" transform="translate(126,30) scale(0.4)">
        <path d="M14 16c-4-6-8-9-11-7 3 2 5 4 7 4-2 3-5 4-8 7 5-1 9-2 12-1Z M18 16c4-6 8-9 11-7-3 2-5 4-7 4 2 3 5 4 8 7-5-1-9-2-12-1Z" />
        <circle cx="16" cy="17" r="2.4" />
      </g>

      {/* castle silhouette */}
      <polygon
        fill="#171313"
        points="20,70 20,52 26,52 26,45 32,45 32,52 38,52 38,36 42,36 42,28 46,36 50,36 50,52 56,52 56,45 62,45 62,52 68,52 68,70"
      />
      <rect x="20" y="70" width="48" height="4" fill="#171313" />
    </svg>
  );
}
