"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/data";
import { itemStats } from "@/lib/useProgress";
import type { Item, ItemSlot, ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";

const SLOT_LABELS: Record<ItemSlot, string> = {
  swords: "Swords",
  otherWeapons: "Other Weapons",
  firearms: "Firearms",
  subWeapons: "Sub-Weapons",
  armor: "Armor",
  headGear: "Head Gear",
  legProtection: "Leg Protection",
  cloaks: "Cloaks",
  shields: "Shields",
  accessories: "Accessories",
};

const SLOT_ORDER: ItemSlot[] = [
  "swords",
  "otherWeapons",
  "firearms",
  "subWeapons",
  "armor",
  "headGear",
  "legProtection",
  "cloaks",
  "shields",
  "accessories",
];

function groupBySlot(items: Item[]) {
  const groups = new Map<ItemSlot, Item[]>();
  for (const item of items) {
    const list = groups.get(item.slot) ?? [];
    list.push(item);
    groups.set(item.slot, list);
  }
  return SLOT_ORDER.filter((slot) => groups.has(slot)).map((slot) => ({
    slot,
    items: groups.get(slot)!,
  }));
}

export function ItemsPanel({
  progress,
  onToggleItem,
}: {
  progress: ProgressState;
  onToggleItem: (itemId: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const [hideObtained, setHideObtained] = useState(false);
  const stats = itemStats(progress);

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = data.items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (hideObtained && progress.itemsObtained[item.id]) return false;
      return true;
    });
    return groupBySlot(filtered);
  }, [filter, hideObtained, progress.itemsObtained]);

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Item Collection</h2>
        <p className="text-sm text-neutral-500">
          All equippable items in Harmony of Despair (base game + DLC), shared across your
          whole roster.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={stats.percent} />
          </div>
          <span className="text-sm tabular-nums text-neutral-400">
            {stats.itemDone}/{stats.itemTotal} ({stats.percent}%)
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
          className="w-full max-w-xs rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-red-700 focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={hideObtained}
            onChange={(e) => setHideObtained(e.target.checked)}
            className="size-3.5 cursor-pointer accent-red-600"
          />
          Hide obtained
        </label>
      </div>

      <div className="space-y-6">
        {groups.map(({ slot, items }) => {
          const doneInSlot = items.filter((i) => progress.itemsObtained[i.id]).length;
          return (
            <div key={slot} className="space-y-1.5">
              <h3 className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <span>{SLOT_LABELS[slot]}</span>
                <span className="tabular-nums text-neutral-600">
                  {doneInSlot}/{items.length}
                </span>
              </h3>
              <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/40 px-2.5 py-1.5 text-sm hover:border-neutral-700">
                      <input
                        type="checkbox"
                        checked={Boolean(progress.itemsObtained[item.id])}
                        onChange={() => onToggleItem(item.id)}
                        className="size-4 shrink-0 cursor-pointer accent-red-600"
                      />
                      <span className="truncate text-neutral-300">{item.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {groups.length === 0 && (
          <p className="text-sm text-neutral-600">No items match that filter.</p>
        )}
      </div>
    </div>
  );
}
