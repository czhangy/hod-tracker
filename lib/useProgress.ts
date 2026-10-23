"use client";

import { useSyncExternalStore } from "react";
import { data } from "@/lib/data";
import type { Item, ProgressState } from "@/lib/types";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  toggleChapter,
  toggleItem,
  adjustItemCount,
  adjustItemLevel,
} from "@/lib/progressStore";

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    progress,
    toggleChapter,
    toggleItem,
    adjustItemCount,
    adjustItemLevel,
  };
}

/** A chapter counts as cleared once it has been beaten on Hard Mode. */
export function characterChapterStats(progress: ProgressState, characterId: string) {
  const chapterTotal = data.chapters.length;
  const chapterDone = Object.values(progress.chapterClears[characterId] ?? {}).filter(
    Boolean
  ).length;
  const percent = chapterTotal === 0 ? 0 : Math.round((chapterDone / chapterTotal) * 100);
  return { chapterTotal, chapterDone, percent };
}

/**
 * Whether an item is fully obtained (maxed out, for levelable items with a known cap).
 * Used for the "obtained" visual state / hide-obtained filter. Individual copies below
 * the cap still count toward completion (see itemProgressUnits) - this just says whether
 * there's nothing left to collect for this item.
 */
export function isItemObtained(item: Item, count: number): boolean {
  if (item.levelable && typeof item.maxLevel === "number") {
    return count >= item.maxLevel;
  }
  return count > 0;
}

/** One thing that has its own level: an item, or an item for one specific character. */
export interface LevelEntry {
  key: string;
  item: Item;
  /** Set for levelPerCharacter items. */
  characterId: string | null;
}

/** Items that can be leveled up, tracked on the Leveling tab. */
export const levelEntries: LevelEntry[] = data.items.flatMap((item): LevelEntry[] => {
  if (typeof item.levelCap !== "number") return [];
  if (!item.levelPerCharacter) return [{ key: item.id, item, characterId: null }];
  return data.characters
    .filter((c) => item.usableBy?.includes(c.id))
    .map((c) => ({ key: `${item.id}:${c.id}`, item, characterId: c.id }));
});

/** Level progress counts from level 1, so a fresh item is 0% and a maxed one is 100%. */
export function levelingStats(progress: ProgressState) {
  let levelTotal = 0;
  let levelDone = 0;
  for (const { key, item } of levelEntries) {
    const cap = item.levelCap as number;
    levelTotal += cap - 1;
    levelDone += Math.min(cap, progress.itemLevels[key] ?? 1) - 1;
  }
  const percent = levelTotal === 0 ? 0 : Math.round((levelDone / levelTotal) * 100);
  return { levelTotal, levelDone, percent };
}

/**
 * How much of an item's max copies/levels have been collected, in whole units. Items
 * with a cap > 1 (Souls, 1h weapons, Accessories, ...) contribute each copy as partial
 * progress rather than all-or-nothing.
 */
export function itemProgressUnits(item: Item, count: number): { done: number; max: number } {
  if (item.levelable && typeof item.maxLevel === "number") {
    return { done: Math.min(count, item.maxLevel), max: item.maxLevel };
  }
  return { done: count > 0 ? 1 : 0, max: 1 };
}

export function itemStats(progress: ProgressState) {
  let itemTotal = 0;
  let itemDone = 0;
  for (const item of data.items) {
    const { done, max } = itemProgressUnits(item, progress.itemsObtained[item.id] ?? 0);
    itemTotal += max;
    itemDone += done;
  }
  const percent = itemTotal === 0 ? 0 : Math.round((itemDone / itemTotal) * 100);
  return { itemTotal, itemDone, percent };
}

export function overallStats(progress: ProgressState) {
  let chapterCells = 0;
  let chapterDone = 0;
  for (const character of data.characters) {
    const stats = characterChapterStats(progress, character.id);
    chapterCells += stats.chapterTotal;
    chapterDone += stats.chapterDone;
  }
  const items = itemStats(progress);
  const levels = levelingStats(progress);
  const total = chapterCells + items.itemTotal + levels.levelTotal;
  const done = chapterDone + items.itemDone + levels.levelDone;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent, chapterCells, chapterDone, items, levels };
}
