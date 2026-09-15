"use client";

import { useState } from "react";
import type { Enemy } from "@/lib/types";

function GenericMonsterGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3c3.9 0 7 3 7 7v5.5c0 .8-.7 1.5-1.5 1.5S16 17 16 16.5V15h-1v3.5c0 .8-.7 1.5-1.5 1.5S12 19 12 18.5V15h-1v3.5c0 .8-.7 1.5-1.5 1.5S8 19 8 18.5V15H7v1.5c0 .8-.7 1.5-1.5 1.5S4 17.3 4 16.5V10c0-3.9 3.1-7 7-7Zm-3 6a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 9 9Zm6 0a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 15 9Z" />
    </svg>
  );
}

export function EnemyIcon({ enemy, size = 28 }: { enemy: Enemy; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (enemy.iconUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/icon?url=${encodeURIComponent(enemy.iconUrl)}`}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded bg-neutral-950 object-contain"
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded bg-neutral-800/60 text-neutral-500"
      style={{ width: size, height: size }}
    >
      <GenericMonsterGlyph className="h-[60%] w-[60%]" />
    </span>
  );
}
