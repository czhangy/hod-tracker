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
 * Whether an item counts as "obtained" for completion purposes. Levelable items with a
 * known cap (Souls, Spells, Scrolls, Glyphs, Sub-Weapons, ...) only count once maxed out;
 * everything else just needs a count above zero.
 */
export function isItemObtained(item: Item, count: number): boolean {
  if (item.levelable && typeof item.maxLevel === "number") {
    return count >= item.maxLevel;
  }
  return count > 0;
}

export function itemStats(progress: ProgressState) {
  const itemTotal = data.items.length;
  const itemDone = data.items.filter((item) =>
    isItemObtained(item, progress.itemsObtained[item.id] ?? 0)
  ).length;
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
