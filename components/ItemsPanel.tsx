"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/data";
import { sectionOwner, sortByCharacter } from "@/lib/characterOrder";
import { usePersistedState } from "@/lib/usePersistedState";
import { isItemObtained, itemStats } from "@/lib/useProgress";
import type { Item, ItemSlot, ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { CharacterFilter } from "./CharacterFilter";
import { ItemIcon } from "./ItemIcon";
import { ItemDetailPanel } from "./ItemDetailPanel";

const HIDE_OBTAINED_KEY = "hod-tracker-hide-obtained";

export const SLOT_LABELS: Record<ItemSlot, string> = {
  weapons: "Weapons",
  subWeapons: "Sub-Weapons",
  armor: "Chest",
  headGear: "Head",
  legProtection: "Legs",
  cloaks: "Back",
  accessories: "Accessories",
  soulsBlue: "Guardian Souls (Soma)",
  soulsRed: "Bullet Souls (Soma)",
  soulsYellow: "Enchanted Souls (Soma)",
  spells: "Dark Magic (Alucard)",
  glyphs: "Glyphs (Shanoa)",
  boundSpells: "Bound Spells (Charlotte)",
  martialArts: "Martial Arts",
  personalSkills: "Personal Skills",
};

const SLOT_ORDER: ItemSlot[] = [
  "weapons",
  "soulsRed",
  "soulsBlue",
  "soulsYellow",
  "subWeapons",
  "spells",
  "glyphs",
  "boundSpells",
  "martialArts",
  "personalSkills",
  "headGear",
  "armor",
  "legProtection",
  "cloaks",
  "accessories",
];

export function groupBySlot<T = Item>(
  entries: T[],
  getItem: (entry: T) => Item = (entry) => entry as Item
) {
  const groups = new Map<ItemSlot, T[]>();
  for (const entry of entries) {
    const slot = getItem(entry).slot;
    const list = groups.get(slot) ?? [];
    list.push(entry);
    groups.set(slot, list);
  }
  return SLOT_ORDER.filter((slot) => groups.has(slot)).map((slot) => ({
    slot,
    items: groups
      .get(slot)!
      .sort(
        (a, b) =>
          Number(!!getItem(b).listFirst) - Number(!!getItem(a).listFirst) ||
          getItem(a).name.localeCompare(getItem(b).name)
      ),
  }));
}

export function ItemStepper({
  count,
  min = 0,
  locked = false,
  maxLevel,
  obtained,
  onAdjust,
}: {
  count: number;
  /** Lowest value the stepper can go down to. */
  min?: number;
  /** Disables both buttons. */
  locked?: boolean;
  maxLevel?: number | null;
  obtained: boolean;
  onAdjust: (delta: number) => void;
}) {
  const atMax = typeof maxLevel === "number" && count >= maxLevel;
  return (
    <span className="flex shrink-0 items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdjust(-1);
        }}
        disabled={locked || count <= min}
        className="flex size-5 cursor-pointer items-center justify-center rounded border border-neutral-700 text-xs text-neutral-400 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
      <span
        className={`w-8 text-center text-[11px] tabular-nums ${
          obtained ? "font-semibold text-green-500" : "text-neutral-300"
        }`}
      >
        {count}
        {typeof maxLevel === "number" && <span className="text-neutral-600">/{maxLevel}</span>}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdjust(1);
        }}
        disabled={locked || atMax}
        className="flex size-5 cursor-pointer items-center justify-center rounded border border-neutral-700 text-xs text-neutral-400 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
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
  const [filter, setFilter] = usePersistedState("hod-tracker-item-filter", "");
  // "" means no character filter.
  const [characterId, setCharacterId] = usePersistedState<string>(
    "hod-tracker-item-character",
    "",
    (v) => data.characters.some((c) => c.id === v)
  );
  const [hideObtainedValue, setHideObtainedValue] = usePersistedState<string>(
    HIDE_OBTAINED_KEY,
    "false"
  );
  const hideObtained = hideObtainedValue === "true";
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const stats = itemStats(progress);

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = data.items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (characterId && !item.usableBy?.includes(characterId)) return false;
      if (hideObtained && isItemObtained(item, progress.itemsObtained[item.id] ?? 0))
        return false;
      return true;
    });
    return sortByCharacter(groupBySlot(filtered), ({ slot, items }) =>
      sectionOwner(slot, items)
    );
  }, [filter, characterId, hideObtained, progress.itemsObtained]);

  const selectedItem = selectedItemId
    ? (data.items.find((i) => i.id === selectedItemId) ?? null)
    : null;

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Items</h2>
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
            onChange={(e) => setHideObtainedValue(String(e.target.checked))}
            className="size-3.5 cursor-pointer [--check-color:var(--color-red-600)]"
          />
          Hide obtained
        </label>
      </div>

      <CharacterFilter characterId={characterId} onChange={setCharacterId} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-[3] space-y-6">
          {groups.map(({ slot, items }) => {
            return (
              <div key={slot} className="space-y-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {SLOT_LABELS[slot]}
                </h3>
                <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {items.map((item) => {
                    const count = progress.itemsObtained[item.id] ?? 0;
                    const obtained = isItemObtained(item, count);
                    const isSelected = item.id === selectedItemId;
                    return (
                      <li key={item.id}>
                        <div
                          className={`flex items-center gap-1.5 rounded-md border py-1 pr-1.5 pl-1.5 text-sm ${
                            isSelected
                              ? "border-red-600 bg-red-950/20"
                              : obtained
                                ? "border-green-800 bg-green-900/30 hover:border-green-700"
                                : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                          }`}
                        >
                          {item.levelable ? (
                            <ItemStepper
                              count={count}
                              maxLevel={item.maxLevel}
                              obtained={obtained}
                              onAdjust={(delta) => onAdjustItemCount(item.id, delta)}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={obtained}
                              onChange={() => onToggleItem(item.id)}
                              className="size-4 shrink-0 cursor-pointer"
                            />
                          )}
                          <button
                            onClick={() => setSelectedItemId(item.id)}
                            className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 text-left"
                          >
                            <ItemIcon item={item} size={22} background={false} />
                            <span
                              className={`truncate ${obtained ? "text-green-400" : "text-neutral-300"}`}
                            >
                              {item.name}
                            </span>
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
