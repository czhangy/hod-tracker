"use client";

import { data } from "@/lib/data";
import { characterChapterStats } from "@/lib/useProgress";
import type { ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { CharacterAvatar } from "./CharacterAvatar";

export function Sidebar({
  progress,
  selectedId,
  onSelect,
}: {
  progress: ProgressState;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 md:w-72">
      {data.characters.map((character) => {
        const stats = characterChapterStats(progress, character.id);
        const isSelected = character.id === selectedId;
        const isComplete = stats.percent === 100;
        return (
          <button
            key={character.id}
            onClick={() => onSelect(character.id)}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
              isSelected
                ? "border-red-600 bg-red-950/30"
                : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
            }`}
          >
            <CharacterAvatar character={character} size={32} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display flex items-center gap-1.5 truncate text-sm font-semibold text-neutral-100">
                  {character.name}
                  {character.dlc && (
                    <span className="rounded bg-neutral-800 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      DLC
                    </span>
                  )}
                </span>
                <span
                  className={`shrink-0 text-xs tabular-nums ${
                    isComplete ? "font-semibold text-green-500" : "text-neutral-400"
                  }`}
                >
                  {stats.percent}%
                </span>
              </div>
              <ProgressBar percent={stats.percent} />
            </div>
          </button>
        );
      })}
    </nav>
  );
}
