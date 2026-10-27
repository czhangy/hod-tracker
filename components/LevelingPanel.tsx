"use client";

import { useMemo } from "react";
import { data, getCharacter } from "@/lib/data";
import { sectionOwner, sortByCharacter } from "@/lib/characterOrder";
import { usePersistedState } from "@/lib/usePersistedState";
import { itemLevel, levelEntries } from "@/lib/useProgress";
import type { ProgressState } from "@/lib/types";
import { CharacterFilter } from "./CharacterFilter";
import { ItemIcon } from "./ItemIcon";
import { ItemStepper, SLOT_LABELS, groupBySlot } from "./ItemsPanel";

export function LevelingPanel({
  progress,
  onAdjustItemLevel,
  onAdjustItemCount,
}: {
  progress: ProgressState;
  onAdjustItemLevel: (itemId: string, delta: number) => void;
  onAdjustItemCount: (itemId: string, delta: number) => void;
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

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = levelEntries.filter(({ item, characterId: entryCharacter }) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (characterId) {
        if (entryCharacter ? entryCharacter !== characterId : !item.usableBy?.includes(characterId))
          return false;
      }
      if (hideMaxed && itemLevel(progress, item, entryCharacter) >= (item.levelCap as number)) return false;
      return true;
    });
    // Per-character items (sub-weapons) get a section for each character instead of one mixed
    // list: "Sub-Weapons (Jonathan)".
    const sections = groupBySlot(filtered, (entry) => entry.item).flatMap(({ slot, items }) => {
      const parts = [
        {
          key: slot as string,
          slot,
          characterId: null as string | null,
          title: SLOT_LABELS[slot],
          items: items.filter((e) => !e.characterId),
        },
      ];
      for (const character of data.characters) {
        parts.push({
          key: `${slot}:${character.id}`,
          slot,
          characterId: character.id,
          title: `${SLOT_LABELS[slot]} (${character.name.split(" ")[0]})`,
          items: items.filter((e) => e.characterId === character.id),
        });
      }
      // Personal skills have no character in their title, so when every item in the section
      // belongs to one character (just Yoko's Philosopher's Stone), name and place it by them.
      if (slot === "personalSkills") {
        const users = new Set(parts[0].items.flatMap((e) => e.item.usableBy ?? []));
        const [only] = users;
        const character = users.size === 1 ? getCharacter(only) : undefined;
        if (character) {
          parts[0].characterId = character.id;
          parts[0].title = `${SLOT_LABELS[slot]} (${character.name.split(" ")[0]})`;
        }
      }
      return parts.filter((part) => part.items.length > 0);
    });
    return sortByCharacter(sections, (section) =>
      sectionOwner(
        section.slot,
        section.items.map((e) => e.item),
        section.characterId
      )
    );
  }, [filter, characterId, hideMaxed, progress]);

  return (
    <div className="flex-1 space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-neutral-50">Leveling</h2>
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
            className="size-3.5 cursor-pointer [--check-color:var(--color-red-600)]"
          />
          Hide maxed
        </label>
      </div>

      <CharacterFilter characterId={characterId} onChange={setCharacterId} />

      <div className="space-y-6">
        {groups.map(({ key: sectionKey, title, items }) => (
          <div key={sectionKey} className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {title}
            </h3>
            <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {items.map(({ key, item, characterId: entryCharacter }) => {
                const level = itemLevel(progress, item, entryCharacter);
                const maxed = level >= (item.levelCap as number);
                return (
                  <li key={key}>
                    <div
                      className={`flex items-center gap-1.5 rounded-md border py-1 pr-1.5 pl-1.5 text-sm ${
                        maxed
                          ? "border-green-800 bg-green-900/30 hover:border-green-700"
                          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                      }`}
                    >
                      <ItemStepper
                        count={level}
                        min={item.levelFromCount ? 0 : 1}
                        // Unowned items sit at level 0; their level only moves once owned.
                        locked={!item.levelFromCount && level === 0}
                        maxLevel={item.levelCap}
                        obtained={maxed}
                        onAdjust={(delta) =>
                          item.levelFromCount
                            ? onAdjustItemCount(item.id, delta)
                            : onAdjustItemLevel(key, delta)
                        }
                      />
                      <ItemIcon item={item} size={22} background={false} />
                      <span className={`truncate ${maxed ? "text-green-400" : "text-neutral-300"}`}>
                        {item.name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="text-sm text-neutral-600">No items match that filter.</p>
        )}
      </div>
    </div>
  );
}
