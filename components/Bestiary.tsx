"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/data";
import type { Enemy } from "@/lib/types";

function chapterLabel(chapterId: string) {
  const chapter = data.chapters.find((c) => c.id === chapterId);
  return chapter ? `${chapter.number}. ${chapter.name}` : chapterId;
}

export function Bestiary() {
  const [filter, setFilter] = useState("");
  const [bossesOnly, setBossesOnly] = useState(false);

  const grouped = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = data.enemies.filter((enemy) => {
      if (bossesOnly && enemy.type !== "boss") return false;
      if (q && !enemy.name.toLowerCase().includes(q)) return false;
      return true;
    });

    const byChapter = new Map<string, Enemy[]>();
    for (const enemy of filtered) {
      for (const chapterId of enemy.chapters.length ? enemy.chapters : ["unknown"]) {
        const list = byChapter.get(chapterId) ?? [];
        list.push(enemy);
        byChapter.set(chapterId, list);
      }
    }

    return data.chapters
      .map((chapter) => ({ chapter, enemies: byChapter.get(chapter.id) ?? [] }))
      .filter((group) => group.enemies.length > 0);
  }, [filter, bossesOnly]);

  const bossCount = data.enemies.filter((e) => e.type === "boss").length;

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Bestiary</h2>
        <p className="text-sm text-neutral-500">
          {data.enemies.length} enemies across all chapters, including {bossCount} bosses.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter enemies..."
          className="w-full max-w-xs rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-red-700 focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-400">
          <input
            type="checkbox"
            checked={bossesOnly}
            onChange={(e) => setBossesOnly(e.target.checked)}
            className="size-3.5 cursor-pointer accent-red-600"
          />
          Bosses only
        </label>
      </div>

      <div className="space-y-6">
        {grouped.map(({ chapter, enemies }) => (
          <div key={chapter.id} className="space-y-1.5">
            <h3 className="font-display flex items-center gap-2 text-sm font-semibold text-neutral-300">
              {chapterLabel(chapter.id)}
              {chapter.dlc && (
                <span className="rounded bg-neutral-800 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  DLC
                </span>
              )}
            </h3>
            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3">
              {enemies.map((enemy) => (
                <li
                  key={`${chapter.id}-${enemy.id}`}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    enemy.type === "boss"
                      ? "border-red-900/60 bg-red-950/20"
                      : "border-neutral-800 bg-neutral-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={enemy.type === "boss" ? "text-red-400" : "text-neutral-300"}
                    >
                      {enemy.name}
                    </span>
                    {enemy.type === "boss" && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-red-500">
                        Boss
                      </span>
                    )}
                  </div>
                  {(enemy.hp || enemy.notes) && (
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {enemy.hp ? `HP ${enemy.hp}` : ""}
                      {enemy.hp && enemy.notes ? " · " : ""}
                      {enemy.notes ?? ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className="text-sm text-neutral-600">No enemies match that filter.</p>
        )}
      </div>
    </div>
  );
}
