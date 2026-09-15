"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import { SlotIcon } from "./SlotIcon";

export function ItemIcon({ item, size = 28 }: { item: Item; size?: number }) {
  const [failed, setFailed] = useState(false);

  if (item.iconUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/icon?url=${encodeURIComponent(item.iconUrl)}`}
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
      <SlotIcon slot={item.slot} size={Math.round(size * 0.6)} />
    </span>
  );
}
