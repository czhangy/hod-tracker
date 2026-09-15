"use client";

import { useEffect } from "react";
import type { Item } from "@/lib/types";
import { ItemIcon } from "./ItemIcon";

const SLOT_LABELS: Record<string, string> = {
  swords: "Sword",
  otherWeapons: "Other Weapon",
  firearms: "Firearm",
  subWeapons: "Sub-Weapon",
  armor: "Armor",
  headGear: "Head Gear",
  legProtection: "Leg Protection",
  cloaks: "Cloak",
  shields: "Shield",
  accessories: "Accessory",
};

export function ItemDetailModal({
  item,
  obtained,
  onToggleObtained,
  onClose,
}: {
  item: Item;
  obtained: boolean;
  onToggleObtained: (itemId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-900 p-5 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <ItemIcon item={item} size={48} />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-bold text-neutral-50">{item.name}</h3>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {SLOT_LABELS[item.slot] ?? item.slot}
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Stats
            </dt>
            <dd className="mt-0.5 text-neutral-300">
              {item.stats ?? <span className="text-neutral-600">Unknown</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Drop Location
            </dt>
            <dd className="mt-0.5 text-neutral-300">
              {item.dropLocation ?? <span className="text-neutral-600">Unknown</span>}
            </dd>
          </div>
        </dl>

        <button
          onClick={() => onToggleObtained(item.id)}
          className={`mt-5 w-full cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            obtained
              ? "border-green-800 bg-green-950/40 text-green-400 hover:bg-green-950/70"
              : "border-neutral-700 text-neutral-300 hover:border-red-700 hover:text-red-400"
          }`}
        >
          {obtained ? "✓ Obtained" : "Mark as obtained"}
        </button>
      </div>
    </div>
  );
}
