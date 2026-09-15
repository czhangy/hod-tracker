"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/data";
import { itemStats } from "@/lib/useProgress";
import type { Item, ItemSlot, ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { ItemIcon } from "./ItemIcon";
import { ItemDetailPanel } from "./ItemDetailPanel";

const SLOT_LABELS: Record<ItemSlot, string> = {
  swords: "Swords",
  katanas: "Katanas",
  axes: "Axes",
  cestuses: "Cestuses",
  cudgels: "Cudgels",
  daggers: "Daggers",
  greatSwords: "Great Swords",
  lances: "Lances",
  rapiers: "Rapiers",
  otherWeapons: "Other Weapons",
  firearms: "Firearms",
  subWeapons: "Sub-Weapons",
  armor: "Armor",
  headGear: "Head Gear",
  legProtection: "Leg Protection",
  cloaks: "Cloaks",
  shields: "Shields",
  accessories: "Accessories",
  soulsBlue: "Blue Souls (Soma)",
  soulsRed: "Red Souls (Soma)",
  soulsYellow: "Yellow Souls (Soma)",
  spells: "Spells (Alucard)",
  glyphs: "Glyphs (Shanoa)",
  scrolls: "Dark Magic Scrolls (Charlotte)",
  martialArts: "Martial Arts",
};

const SLOT_ORDER: ItemSlot[] = [
  "swords",
  "katanas",
  "greatSwords",
  "rapiers",
  "daggers",
  "axes",
  "lances",
  "cestuses",
  "cudgels",
  "otherWeapons",
  "firearms",
  "subWeapons",
  "armor",
  "headGear",
  "legProtection",
  "cloaks",
  "shields",
  "accessories",
  "spells",
  "glyphs",
  "scrolls",
  "martialArts",
  "soulsBlue",
  "soulsRed",
  "soulsYellow",
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

function ItemStepper({
  count,
  onAdjust,
}: {
  count: number;
  onAdjust: (delta: number) => void;
}) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdjust(-1);
        }}
        disabled={count === 0}
        className="flex size-5 cursor-pointer items-center justify-center rounded border border-neutral-700 text-xs text-neutral-400 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
      <span className="w-4 text-center text-xs tabular-nums text-neutral-300">{count}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdjust(1);
        }}
        className="flex size-5 cursor-pointer items-center justify-center rounded border border-neutral-700 text-xs text-neutral-400 hover:border-red-700 hover:text-red-400"
      >
        +
      </button>
    </span>
  );
}

export function ItemsPanel({
  progress,
  onToggleItem,
  onAdjustItemCount,
}: {
  progress: ProgressState;
  onToggleItem: (itemId: string) => void;
  onAdjustItemCount: (itemId: string, delta: number) => void;
}) {
  const [filter, setFilter] = useState("");
  const [hideObtained, setHideObtained] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const stats = itemStats(progress);

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = data.items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (hideObtained && (progress.itemsObtained[item.id] ?? 0) > 0) return false;
      return true;
    });
    return groupBySlot(filtered);
  }, [filter, hideObtained, progress.itemsObtained]);

  const selectedItem = selectedItemId
    ? (data.items.find((i) => i.id === selectedItemId) ?? null)
    : null;

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Item Collection</h2>
        <p className="text-sm text-neutral-500">
          All collectible items in Harmony of Despair (base game + DLC), shared across your
          whole roster. Click an item to see its stats and drop location. Souls level up as
          you collect duplicates — use the +/− count instead of a checkbox.
        </p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={stats.percent} />
          </div>
          <span className="font-display text-sm tabular-nums text-neutral-400">
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

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-[3] space-y-6">
          {groups.map(({ slot, items }) => {
            const doneInSlot = items.filter(
              (i) => (progress.itemsObtained[i.id] ?? 0) > 0
            ).length;
            return (
              <div key={slot} className="space-y-1.5">
                <h3 className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  <span>{SLOT_LABELS[slot]}</span>
                  <span className="tabular-nums text-neutral-600">
                    {doneInSlot}/{items.length}
                  </span>
                </h3>
                <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((item) => {
                    const count = progress.itemsObtained[item.id] ?? 0;
                    const isSelected = item.id === selectedItemId;
                    return (
                      <li key={item.id}>
                        <div
                          className={`flex items-center gap-1.5 rounded-md border py-1 pr-1.5 pl-1.5 text-sm ${
                            isSelected
                              ? "border-red-600 bg-red-950/20"
                              : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                          }`}
                        >
                          {item.levelable ? (
                            <ItemStepper
                              count={count}
                              onAdjust={(delta) => onAdjustItemCount(item.id, delta)}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={count > 0}
                              onChange={() => onToggleItem(item.id)}
                              className="size-4 shrink-0 cursor-pointer accent-red-600"
                            />
                          )}
                          <button
                            onClick={() => setSelectedItemId(item.id)}
                            className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left"
                          >
                            <ItemIcon item={item} size={22} />
                            <span className="truncate text-neutral-300">{item.name}</span>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {groups.length === 0 && (
            <p className="text-sm text-neutral-600">No items match that filter.</p>
          )}
        </div>

        <div className="lg:sticky lg:top-4 lg:w-80 lg:flex-none lg:self-start">
          <ItemDetailPanel
            item={selectedItem}
            count={selectedItem ? (progress.itemsObtained[selectedItem.id] ?? 0) : 0}
            onToggleObtained={onToggleItem}
            onAdjustCount={onAdjustItemCount}
          />
        </div>
      </div>
    </div>
  );
}
