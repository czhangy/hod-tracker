"use client";

import { data } from "@/lib/data";
import { characterChapterStats } from "@/lib/useProgress";
import type { Difficulty, ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { CharacterAvatar } from "./CharacterAvatar";

export function CharacterDetail({
  characterId,
  progress,
  onToggleChapter,
}: {
  characterId: string;
  progress: ProgressState;
  onToggleChapter: (characterId: string, chapterId: string, difficulty: Difficulty) => void;
}) {
  const character = data.characters.find((c) => c.id === characterId);
  const stats = characterChapterStats(progress, characterId);

  if (!character) return null;

  const clearedNormal = progress.chapterClears[characterId] ?? {};
  const clearedHard = progress.chapterClearsHard[characterId] ?? {};

  return (
    <div className="flex-1 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} size={48} />
          <h2 className="font-display flex items-center gap-2 text-2xl font-bold text-neutral-50">
            {character.name}
            {character.dlc && (
              <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                DLC
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={stats.percent} />
          </div>
          <span className="font-display text-sm tabular-nums text-neutral-400">
            {stats.chapterDone}/{stats.chapterTotal} chapters ({stats.percent}%)
          </span>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Chapter Clears
          </h3>
          <span className="text-xs tabular-nums text-neutral-600">
            Normal {stats.normalDone}/{stats.chapterCount} · Hard {stats.hardDone}/
            {stats.chapterCount}
          </span>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {data.chapters.map((chapter) => (
            <li key={chapter.id}>
              <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-neutral-300">
                  {chapter.number}. {chapter.name}
                </span>
                {chapter.dlc && (
                  <span className="shrink-0 rounded bg-neutral-800 px-1 py-0.5 text-[10px] font-semibold uppercase text-neutral-500">
                    DLC
                  </span>
                )}
                <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-neutral-500">
                  <input
                    type="checkbox"
                    checked={Boolean(clearedNormal[chapter.id])}
                    onChange={() => onToggleChapter(characterId, chapter.id, "normal")}
                    className="size-4 cursor-pointer accent-red-600"
                  />
                  N
                </label>
                <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-neutral-500">
                  <input
                    type="checkbox"
                    checked={Boolean(clearedHard[chapter.id])}
                    onChange={() => onToggleChapter(characterId, chapter.id, "hard")}
                    className="size-4 cursor-pointer accent-amber-500"
                  />
                  H
                </label>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
