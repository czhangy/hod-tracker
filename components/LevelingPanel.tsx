"use client";

import { useMemo } from "react";
import { data, getCharacter } from "@/lib/data";
import { usePersistedState } from "@/lib/usePersistedState";
import { levelEntries, levelingStats } from "@/lib/useProgress";
import type { ProgressState } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { CharacterFilter } from "./CharacterFilter";
import { CharacterAvatar } from "./CharacterAvatar";
import { ItemIcon } from "./ItemIcon";
import { ItemStepper, SLOT_LABELS, groupBySlot } from "./ItemsPanel";

export function LevelingPanel({
  progress,
  onAdjustItemLevel,
}: {
  progress: ProgressState;
  onAdjustItemLevel: (itemId: string, delta: number) => void;
}) {
  const [filter, setFilter] = usePersistedState<string>("hod-tracker-leveling-filter", "");
  const [characterId, setCharacterId] = usePersistedState<string>(
    "hod-tracker-leveling-character",
    "",
    (v) => data.characters.some((c) => c.id === v)
  );
  const [hideMaxedValue, setHideMaxedValue] = usePersistedState<string>(
    "hod-tracker-leveling-hide-maxed",
    "false"
  );
  const hideMaxed = hideMaxedValue === "true";
  const stats = levelingStats(progress);

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = levelEntries.filter(({ key, item, characterId: entryCharacter }) => {
      if (!(progress.itemsObtained[item.id] > 0)) return false;
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (characterId) {
        if (entryCharacter ? entryCharacter !== characterId : !item.usableBy?.includes(characterId))
          return false;
      }
      if (hideMaxed && (progress.itemLevels[key] ?? 1) >= (item.levelCap as number)) return false;
      return true;
    });
    return groupBySlot(filtered, (entry) => entry.item);
  }, [filter, characterId, hideMaxed, progress.itemLevels, progress.itemsObtained]);

  return (
    <div className="flex-1 space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Leveling</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={stats.percent} />
          </div>
          <span className="font-display text-sm tabular-nums text-neutral-400">
            {stats.levelDone}/{stats.levelTotal} ({stats.percent}%)
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
            checked={hideMaxed}
            onChange={(e) => setHideMaxedValue(String(e.target.checked))}
            className="size-3.5 cursor-pointer"
          />
          Hide maxed
        </label>
      </div>

      <CharacterFilter characterId={characterId} onChange={setCharacterId} />

      <div className="space-y-6">
        {groups.map(({ slot, items }) => (
          <div key={slot} className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {SLOT_LABELS[slot]}
            </h3>
            <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {items.map(({ key, item, characterId: entryCharacter }) => {
                const level = progress.itemLevels[key] ?? 1;
                const character = entryCharacter ? getCharacter(entryCharacter) : undefined;
                const maxed = level >= (item.levelCap as number);
                return (
                  <li key={key}>
                    <div
                      className={`flex items-center gap-1.5 rounded-md border py-1 pr-1.5 pl-1.5 text-sm ${
                        maxed
                          ? "border-green-800 bg-green-950/20 hover:border-green-700"
                          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                      }`}
                    >
                      <ItemStepper
                        count={level}
                        min={1}
                        maxLevel={item.levelCap}
                        obtained={maxed}
                        onAdjust={(delta) => onAdjustItemLevel(key, delta)}
                      />
                      <ItemIcon item={item} size={22} />
                      <span className={`truncate ${maxed ? "text-green-400" : "text-neutral-300"}`}>
                        {item.name}
                      </span>
                      {character && (
                        <span title={character.name} className="ml-auto shrink-0">
                          <CharacterAvatar character={character} size={20} square />
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-neutral-600">No obtained items match that filter.</p>
        )}
      </div>
    </div>
  );
}
