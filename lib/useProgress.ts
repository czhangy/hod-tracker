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
} from "@/lib/progressStore";

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    progress,
    toggleChapter,
    toggleItem,
    adjustItemCount,
  };
}

/** Each chapter counts for two slots per character: a Normal clear and a Hard Mode clear. */
export function characterChapterStats(progress: ProgressState, characterId: string) {
  const chapterCount = data.chapters.length;
  const chapterTotal = chapterCount * 2;
  const normalDone = Object.values(progress.chapterClears[characterId] ?? {}).filter(
    Boolean
  ).length;
  const hardDone = Object.values(progress.chapterClearsHard[characterId] ?? {}).filter(
    Boolean
  ).length;
  const chapterDone = normalDone + hardDone;
  const percent = chapterTotal === 0 ? 0 : Math.round((chapterDone / chapterTotal) * 100);
  return { chapterTotal, chapterDone, normalDone, hardDone, chapterCount, percent };
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
  const total = chapterCells + items.itemTotal;
  const done = chapterDone + items.itemDone;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, percent, chapterCells, chapterDone, items };
}
