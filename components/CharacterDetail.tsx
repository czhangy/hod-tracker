"use client";

import { data } from "@/lib/data";
import { characterChapterStats } from "@/lib/useProgress";
import type { ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { CharacterAvatar } from "./CharacterAvatar";

export function CharacterDetail({
  characterId,
  progress,
  onToggleChapter,
}: {
  characterId: string;
  progress: ProgressState;
  onToggleChapter: (characterId: string, chapterId: string) => void;
}) {
  const character = data.characters.find((c) => c.id === characterId);
  const stats = characterChapterStats(progress, characterId);

  if (!character) return null;

  const cleared = progress.chapterClears[characterId] ?? {};

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
            {stats.chapterDone}/{stats.chapterTotal} ({stats.percent}%)
          </span>
        </div>
      </header>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Chapter Clears
        </h3>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {data.chapters.map((chapter) => {
            const isCleared = Boolean(cleared[chapter.id]);
            return (
            <li key={chapter.id}>
              <div
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                  isCleared
                    ? "border-green-800 bg-green-900/30 hover:border-green-700"
                    : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                }`}
              >
                <span
                  className={`min-w-0 flex-1 truncate ${
                    isCleared ? "text-green-400" : "text-neutral-300"
                  }`}
                >
                  {chapter.number}. {chapter.name}
                </span>
                {chapter.dlc && (
                  <span className="shrink-0 rounded bg-neutral-800 px-1 py-0.5 text-[10px] font-semibold uppercase text-neutral-500">
                    DLC
                  </span>
                )}
                <input
                  type="checkbox"
                  checked={isCleared}
                  onChange={() => onToggleChapter(characterId, chapter.id)}
                  className="size-4 cursor-pointer"
                />
              </div>
            </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
