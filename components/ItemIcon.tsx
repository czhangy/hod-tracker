"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import { SlotIcon } from "./SlotIcon";

export function ItemIcon({
  item,
  size = 28,
  background = true,
}: {
  item: Item;
  size?: number;
  /** Set false to draw the icon with no backing behind it. */
  background?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (item.iconUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/api/icon?url=${encodeURIComponent(item.iconUrl)}`}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded object-contain ${background ? "bg-neutral-950" : ""}`}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded text-neutral-500 ${
        background ? "bg-neutral-800/60" : ""
      }`}
      style={{ width: size, height: size }}
    >
      <SlotIcon slot={item.slot} size={Math.round(size * 0.6)} />
    </span>
  );
}
