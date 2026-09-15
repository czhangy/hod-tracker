"use client";

import { useMemo, useState } from "react";
import { data } from "@/lib/data";
import type { Enemy } from "@/lib/types";
import { EnemyIcon } from "./EnemyIcon";
import { EnemyDetailPanel } from "./EnemyDetailPanel";

function chapterLabel(chapterId: string) {
  const chapter = data.chapters.find((c) => c.id === chapterId);
  return chapter ? `${chapter.number}` : chapterId;
}

export function Bestiary() {
  const [filter, setFilter] = useState("");
  const [bossesOnly, setBossesOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    data.enemies.find((e) => e.type === "boss")?.id ?? data.enemies[0]?.id ?? null
  );

  const enemies = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return data.enemies
      .filter((e) => (bossesOnly ? e.type === "boss" : true))
      .filter((e) => (q ? e.name.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "boss" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }, [filter, bossesOnly]);

  const selectedEnemy: Enemy | null = selectedId
    ? (data.enemies.find((e) => e.id === selectedId) ?? null)
    : null;

  const bossCount = data.enemies.filter((e) => e.type === "boss").length;

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Bestiary</h2>
        <p className="text-sm text-neutral-500">
          {data.enemies.length} enemies across the campaign, including {bossCount} bosses.
          Click one to see its details.
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

      <div className="flex flex-col gap-6 lg:flex-row">
        <ul className="min-w-0 flex-[3] grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {enemies.map((enemy) => {
            const isSelected = enemy.id === selectedId;
            return (
              <li key={enemy.id}>
                <button
                  onClick={() => setSelectedId(enemy.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-left text-sm ${
                    isSelected
                      ? "border-red-600 bg-red-950/20"
                      : enemy.type === "boss"
                        ? "border-red-900/60 bg-red-950/10 hover:border-red-700"
                        : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                  }`}
                >
                  <EnemyIcon enemy={enemy} size={24} />
                  <span className="min-w-0 flex-1 truncate">
                    <span className={enemy.type === "boss" ? "text-red-400" : "text-neutral-300"}>
                      {enemy.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-600">
                    {enemy.chapters.map(chapterLabel).join(",")}
                  </span>
                </button>
              </li>
            );
          })}
          {enemies.length === 0 && (
            <p className="text-sm text-neutral-600">No enemies match that filter.</p>
          )}
        </ul>

        <div className="lg:sticky lg:top-4 lg:w-80 lg:flex-none lg:self-start">
          <EnemyDetailPanel enemy={selectedEnemy} />
        </div>
      </div>
    </div>
  );
}
