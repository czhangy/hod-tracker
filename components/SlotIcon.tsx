import type { ItemSlot } from "@/lib/types";

/** Minimal original line-icon per equipment category, used as a fallback when no real icon is available. */
export function SlotIcon({
  slot,
  size = 20,
  className = "",
}: {
  slot: ItemSlot;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (slot) {
    case "swords":
      return (
        <svg {...common}>
          <path d="M6 18 17 7" />
          <path d="M14 4l6 0 0 6" />
          <path d="M4 20l3-3" />
          <path d="M12 12l-2.5 -2.5" />
        </svg>
      );
    case "otherWeapons":
      return (
        <svg {...common}>
          <path d="M5 19l6-14" />
          <path d="M9 5l6 1-4 5" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
      );
    case "firearms":
      return (
        <svg {...common}>
          <path d="M3 14h10l3-3h5v3h-2v3h-5l-2-2H5" />
          <path d="M8 14v3" />
        </svg>
      );
    case "subWeapons":
      return (
        <svg {...common}>
          <path d="M12 3v7" />
          <path d="M9 7l3 3 3-3" />
          <circle cx="12" cy="16" r="4" />
        </svg>
      );
    case "armor":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        </svg>
      );
    case "headGear":
      return (
        <svg {...common}>
          <path d="M4 16a8 8 0 0 1 16 0" />
          <path d="M3 16h18" />
          <path d="M6 16v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case "legProtection":
      return (
        <svg {...common}>
          <path d="M8 3h8v9l2 9h-5l-1-7-1 7H6l2-9Z" />
        </svg>
      );
    case "cloaks":
      return (
        <svg {...common}>
          <path d="M12 3c-2 1.5-2 3-2 3H8L4 20h16L16 6h-2s0-1.5-2-3Z" />
        </svg>
      );
    case "shields":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          <path d="M9 11l2 2 4-4" />
        </svg>
      );
    case "accessories":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
