"use client";

import { data, getCharacter } from "@/lib/data";
import {
  BUILD_SLOTS,
  autoItem,
  effectiveBuild,
  isSlotComplete,
  isSlotDisabled,
  slotLabel,
  slotOptions,
  type BuildSlot,
} from "@/lib/builds";
import { usePersistedState } from "@/lib/usePersistedState";
import { characterLevelingStats } from "@/lib/useProgress";
import type { ProgressState } from "@/lib/types";
import { CharacterAvatar } from "./CharacterAvatar";
import { ProgressBar } from "./ProgressBar";
import { ItemIcon } from "./ItemIcon";

const slotsByKey = (keys: string[]) =>
  keys.map((key) => BUILD_SLOTS.find((slot) => slot.key === key)!);

// Armor on the left of the character art, hands and accessories on the right, skills below
// (hunter skills in a 2x2 grid with the personal skill centered under it).
const LEFT_SLOTS = slotsByKey(["head", "chest", "legs", "back"]);
const RIGHT_SLOTS = slotsByKey([
  "mainHand",
  "offHand",
  "accessory1",
  "accessory2",
]);
const HUNTER_SLOTS = slotsByKey([
  "hunterSkill1",
  "hunterSkill2",
  "hunterSkill3",
  "hunterSkill4",
]);
const EXTRA_SLOTS = BUILD_SLOTS.filter((slot) => slot.hideWhenEmpty);

export function BuildsPanel({
  progress,
  onSetBuildSlot,
}: {
  progress: ProgressState;
  onSetBuildSlot: (
    characterId: string,
    slotKey: string,
    itemId: string | null,
  ) => void;
}) {
  const [characterId, setCharacterId] = usePersistedState<string>(
    "hod-tracker-build-character",
    data.characters[0]?.id ?? "",
    (v) => data.characters.some((c) => c.id === v),
  );
  const character = getCharacter(characterId);
  const build = effectiveBuild(progress, characterId);
  const leveling = characterLevelingStats(progress, characterId);

  // Personal skill / enchanted soul only exist for characters that have something for them.
  const extraSlots = EXTRA_SLOTS.filter(
    (slot) => slotOptions(characterId, slot).length > 0,
  );

  const renderSlot = (slot: BuildSlot) => {
    const equipped = build[slot.key];
    const options = slotOptions(characterId, slot);
    const auto = autoItem(characterId, slot);
    const disabled = isSlotDisabled(characterId, slot.key, build);
    // Slots with nothing to choose are shown as text rather than a dropdown.
    const staticText = disabled
      ? "N/A"
      : auto
        ? auto.name
        : options.length === 0
          ? "N/A"
          : null;
    const complete =
      !disabled && isSlotComplete(progress, characterId, slot.key, build);
    return (
      <div
        key={slot.key}
        className={`flex items-center gap-2 rounded-md border p-2 ${
          complete
            ? "border-green-800 bg-green-950/80"
            : "border-neutral-800 bg-neutral-900/80"
        }`}
      >
        {equipped && !disabled ? (
          <ItemIcon item={equipped} size={28} background={false} />
        ) : (
          <span className="size-7 shrink-0" />
        )}
        <label className="min-w-0 flex-1 space-y-0.5">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            {slotLabel(characterId, slot)}
          </span>
          {staticText !== null ? (
            // Nothing to pick (N/A, blocked, or only starter gear): plain text, no dropdown.
            <span
              className={`block h-8 truncate border border-transparent pl-2 text-sm leading-[1.875rem] ${
                complete
                  ? "text-green-400"
                  : auto && !disabled
                    ? "text-neutral-200"
                    : "text-neutral-500"
              }`}
            >
              {staticText}
            </span>
          ) : (
            <span className="relative block">
              <select
                value={equipped?.id ?? ""}
                                onChange={(e) =>
                  onSetBuildSlot(characterId, slot.key, e.target.value || null)
                }
                className={`w-full cursor-pointer appearance-none rounded border h-8 pr-7 pl-2 text-sm ${complete ? "border-green-800 bg-green-900/30 text-green-400" : "border-neutral-800 bg-neutral-950 text-neutral-200"} focus:border-red-700 focus:outline-none`}
              >
                <option value="" className="text-neutral-200">
                  Empty
                </option>
                {options.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="text-neutral-200"
                  >
                    {item.name}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-neutral-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 4.5 6 8l3.5-3.5" />
              </svg>
            </span>
          )}
        </label>
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-6">
      <header>
        <h2 className="font-display text-2xl font-bold text-neutral-50">
          Builds
        </h2>
      </header>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Choose character"
      >
        {data.characters.map((c) => {
          const selected = c.id === characterId;
          return (
            <button
              key={c.id}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={selected}
              onClick={() => setCharacterId(c.id)}
              className={`cursor-pointer rounded-md ring-2 transition-opacity ${
                selected
                  ? "ring-red-600"
                  : "opacity-40 grayscale ring-transparent hover:opacity-80"
              }`}
            >
              <CharacterAvatar character={c} size={36} square />
            </button>
          );
        })}
      </div>

      {character && leveling.levelTotal > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar percent={leveling.percent} />
          </div>
          <span className="font-display text-sm tabular-nums text-neutral-400">
            {leveling.levelDone}/{leveling.levelTotal} ({leveling.percent}%)
          </span>
        </div>
      )}

      {character && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_16rem_1fr]">
            <div className="relative z-10 flex flex-col gap-2 lg:order-1">
              {LEFT_SLOTS.map(renderSlot)}
            </div>
            {/* On large screens the art is taken out of flow, so the slot columns set the row
                height and the art runs on underneath the hunter skills. */}
            <div className="flex justify-center lg:relative lg:order-2">
              {character.artUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/icon?url=${encodeURIComponent(character.artUrl)}`}
                  alt={character.name}
                  className="pointer-events-none h-72 w-auto max-w-none object-contain object-top lg:absolute lg:top-0 lg:left-1/2 lg:h-[22rem] lg:-translate-x-1/2"
                />
              )}
            </div>
            <div className="relative z-10 flex flex-col gap-2 lg:order-3">
              {RIGHT_SLOTS.map(renderSlot)}
            </div>
          </div>
          <div className="relative z-10 mx-auto max-w-xl space-y-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {HUNTER_SLOTS.map(renderSlot)}
            </div>
            {extraSlots.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                {extraSlots.map((slot) => (
                  <div key={slot.key} className="sm:w-1/2">
                    {renderSlot(slot)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
