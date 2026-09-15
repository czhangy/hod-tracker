import type { Item } from "@/lib/types";
import { isItemObtained } from "@/lib/useProgress";
import { ItemIcon } from "./ItemIcon";

const SLOT_LABELS: Record<string, string> = {
  swords: "Sword",
  katanas: "Katana",
  axes: "Axe",
  cestuses: "Cestus",
  cudgels: "Cudgel",
  daggers: "Dagger",
  greatSwords: "Great Sword",
  lances: "Lance",
  rapiers: "Rapier",
  otherWeapons: "Other Weapon",
  firearms: "Firearm",
  subWeapons: "Sub-Weapon",
  armor: "Armor",
  headGear: "Head Gear",
  legProtection: "Leg Protection",
  cloaks: "Cloak",
  shields: "Shield",
  accessories: "Accessory",
  soulsBlue: "Guardian Soul (Soma)",
  soulsRed: "Bullet Soul (Soma)",
  soulsYellow: "Enchanted Soul (Soma)",
  spells: "Spell (Alucard)",
  glyphs: "Glyph (Shanoa)",
  scrolls: "Dark Magic Scroll (Charlotte)",
  martialArts: "Martial Art",
  personalSkills: "Personal Skill",
  medicine: "Unique Medicine",
};

export function ItemDetailPanel({
  item,
  count,
  onToggleObtained,
  onAdjustCount,
}: {
  item: Item | null;
  count: number;
  onToggleObtained: (itemId: string) => void;
  onAdjustCount: (itemId: string, delta: number) => void;
}) {
  if (!item) {
    return (
      <div className="flex h-full min-h-[16rem] flex-1 items-center justify-center rounded-lg border border-dashed border-neutral-800 text-sm text-neutral-600">
        Select an item to see its details.
      </div>
    );
  }

  const obtained = isItemObtained(item, count);

  return (
    <div className="flex-1 space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="flex items-start gap-3">
        <ItemIcon item={item} size={48} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-neutral-50">{item.name}</h3>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {SLOT_LABELS[item.slot] ?? item.slot}
            {item.handedness && (
              <span className="ml-2 text-neutral-600">
                {item.handedness === "2h" ? "Two-handed" : "One-handed"}
              </span>
            )}
          </p>
        </div>
      </div>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Stats
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {item.stats ?? <span className="text-neutral-600">Unknown</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Drop Location
          </dt>
          <dd className="mt-0.5 text-neutral-300">
            {item.dropLocation ?? <span className="text-neutral-600">Unknown</span>}
          </dd>
        </div>
        {item.notes && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Notes
            </dt>
            <dd className="mt-0.5 text-neutral-300">{item.notes}</dd>
          </div>
        )}
      </dl>

      {item.levelable ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Copies Owned (Level)
            {typeof item.maxLevel === "number" && (
              <span className="ml-1.5 normal-case text-neutral-600">max {item.maxLevel}</span>
            )}
          </p>
          <div
            className={`flex items-center justify-center gap-4 rounded-md border py-2 ${
              obtained ? "border-green-800 bg-green-950/20" : "border-neutral-700"
            }`}
          >
            <button
              onClick={() => onAdjustCount(item.id, -1)}
              disabled={count === 0}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-neutral-700 text-lg text-neutral-300 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              −
            </button>
            <span
              className={`text-center text-lg font-semibold tabular-nums ${
                obtained ? "text-green-400" : "text-neutral-100"
              }`}
            >
              {count}
              {typeof item.maxLevel === "number" && (
                <span className="text-sm font-normal text-neutral-500">/{item.maxLevel}</span>
              )}
            </span>
            <button
              onClick={() => onAdjustCount(item.id, 1)}
              disabled={typeof item.maxLevel === "number" && count >= item.maxLevel}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-neutral-700 text-lg text-neutral-300 hover:border-red-700 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            >
              +
            </button>
          </div>
          {typeof item.maxLevel === "number" && !obtained && (
            <p className="text-center text-xs text-neutral-600">
              Counts toward 100% only once maxed at {item.maxLevel}.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={() => onToggleObtained(item.id)}
          className={`w-full cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            obtained
              ? "border-green-800 bg-green-950/40 text-green-400 hover:bg-green-950/70"
              : "border-neutral-700 text-neutral-300 hover:border-red-700 hover:text-red-400"
          }`}
        >
          {obtained ? "✓ Obtained" : "Mark as obtained"}
        </button>
      )}
    </div>
  );
}
