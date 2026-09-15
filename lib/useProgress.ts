"use client";

import { useSyncExternalStore } from "react";
import { data } from "@/lib/data";
import type { ProgressState } from "@/lib/types";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  toggleChapter,
  toggleItem,
  toggleEquipped,
} from "@/lib/progressStore";

export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    progress,
    toggleChapter,
    toggleItem,
    toggleEquipped,
  };
}

export function characterChapterStats(progress: ProgressState, characterId: string) {
  const chapterTotal = data.chapters.length;
  const chapterDone = Object.values(progress.chapterClears[characterId] ?? {}).filter(
    Boolean
  ).length;
  const percent = chapterTotal === 0 ? 0 : Math.round((chapterDone / chapterTotal) * 100);
  return { chapterTotal, chapterDone, percent };
}

export function itemStats(progress: ProgressState) {
  const itemTotal = data.items.length;
  const itemDone = Object.values(progress.itemsObtained).filter(Boolean).length;
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
