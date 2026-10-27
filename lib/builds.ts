import { data, getCharacter } from "@/lib/data";
import type { Item, ItemSlot, ProgressState } from "@/lib/types";
import { itemLevel } from "@/lib/useProgress";

export interface BuildSlot {
  key: string;
  label: string;
  /** Whether an item can be equipped here (before checking who can use it). */
  accepts: (item: Item) => boolean;
  /** Leave the slot out of the build entirely for characters with nothing to put in it. */
  hideWhenEmpty?: boolean;
}

const inSlots = (...slots: ItemSlot[]) => (item: Item) => slots.includes(item.slot);

/** Personal skills are their own category, plus Soma's Guardian Souls. */
const isPersonalSkill = (item: Item) =>
  item.slot === "personalSkills" || item.slot === "soulsBlue";

/** Skills that go in the four "hunter skill" slots: everything a character casts or throws. */
const inHunterSkillSlots = inSlots(
  "subWeapons",
  "soulsRed",
  "spells",
  "glyphs",
  "boundSpells",
);

export const BUILD_SLOTS: BuildSlot[] = [
  {
    key: "mainHand",
    label: "Main Hand",
    accepts: (item) => item.slot === "weapons" && !item.offHandOnly,
  },
  { key: "offHand", label: "Off-Hand", accepts: inSlots("weapons") },
  {
    key: "personalSkill",
    label: "Personal Skill",
    accepts: isPersonalSkill,
    hideWhenEmpty: true,
  },
  {
    key: "enchantedSoul",
    label: "Enchanted Soul",
    accepts: inSlots("soulsYellow"),
    hideWhenEmpty: true,
  },
  ...[1, 2, 3, 4].map((n) => ({
    key: `hunterSkill${n}`,
    label: `Hunter Skill ${n}`,
    accepts: inHunterSkillSlots,
  })),
  { key: "head", label: "Head", accepts: inSlots("headGear") },
  { key: "chest", label: "Chest", accepts: inSlots("armor") },
  { key: "legs", label: "Legs", accepts: inSlots("legProtection") },
  { key: "back", label: "Back", accepts: inSlots("cloaks") },
  { key: "accessory1", label: "Accessory 1", accepts: inSlots("accessories") },
  { key: "accessory2", label: "Accessory 2", accepts: inSlots("accessories") },
];

const itemsById = new Map(data.items.map((item) => [item.id, item]));

export function getBuild(
  progress: ProgressState,
  characterId: string,
): Record<string, Item> {
  const build: Record<string, Item> = {};
  for (const [slotKey, itemId] of Object.entries(
    progress.builds[characterId] ?? {},
  )) {
    const item = itemsById.get(itemId);
    if (item) build[slotKey] = item;
  }
  return build;
}

/** The slot's title for a character: their override if there is one, else the default. */
export function slotLabel(characterId: string, slot: BuildSlot): string {
  return getCharacter(characterId)?.buildSlotLabels?.[slot.key] ?? slot.label;
}

/** Whether a slot can't be used: the character has no use for it, or a two-hander blocks it. */
export function isSlotDisabled(
  characterId: string,
  slotKey: string,
  build: Record<string, Item>,
): boolean {
  if (getCharacter(characterId)?.disabledBuildSlots?.includes(slotKey))
    return true;
  return slotKey === "offHand" && isTwoHanded(build.mainHand);
}

/**
 * The item a slot fills automatically: the only possible item for it, when that is starter gear
 * (there's nothing to choose, and the player always has it).
 */
export function autoItem(characterId: string, slot: BuildSlot): Item | null {
  const options = slotOptions(characterId, slot);
  return options.length === 1 && options[0].starterGear ? options[0] : null;
}

/**
 * The build as displayed: the saved picks, plus any auto-filled slot (see autoItem). No pick is
 * stored for those.
 */
export function effectiveBuild(
  progress: ProgressState,
  characterId: string,
): Record<string, Item> {
  const build = getBuild(progress, characterId);
  for (const slot of BUILD_SLOTS) {
    if (isSlotDisabled(characterId, slot.key, build)) {
      delete build[slot.key];
      continue;
    }
    const item = autoItem(characterId, slot);
    if (item) build[slot.key] = item;
  }
  return build;
}

/** Two-handed weapons take up both hands, so they can't be paired with an off-hand item. */
export function isTwoHanded(item: Item | undefined) {
  return item?.handedness === "2h";
}

/** Items that can be equipped in a slot: everything the character can use, obtained or not. */
export function slotOptions(characterId: string, slot: BuildSlot): Item[] {
  return data.items
    .filter((item) => {
      if (!slot.accepts(item)) return false;
      if (!item.usableBy?.includes(characterId)) return false;
      return !(slot.key === "offHand" && isTwoHanded(item));
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Whether the item equipped in a slot is fully collected: owned and, for items with levels, at
 * max level. When the same item fills several slots, each copy owned covers one slot in build
 * order (e.g. two Valmanways equipped but only one owned: only the first slot counts).
 */
export function isSlotComplete(
  progress: ProgressState,
  characterId: string,
  slotKey: string,
  build: Record<string, Item>,
): boolean {
  const item = build[slotKey];
  if (!item) return false;
  let copiesBefore = 0;
  for (const slot of BUILD_SLOTS) {
    if (slot.key === slotKey) break;
    if (build[slot.key]?.id === item.id) copiesBefore++;
  }
  if ((progress.itemsObtained[item.id] ?? 0) <= copiesBefore) return false;
  if (typeof item.levelCap === "number") {
    return itemLevel(progress, item, characterId) >= item.levelCap;
  }
  return true;
}
