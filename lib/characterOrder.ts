import { data } from "@/lib/data";
import type { Item, ItemSlot } from "@/lib/types";

/** Categories that belong to particular characters, so they follow the character order. */
const CHARACTER_SLOTS = new Set<ItemSlot>([
  "soulsBlue",
  "soulsRed",
  "soulsYellow",
  "spells",
  "subWeapons",
  "boundSpells",
  "glyphs",
]);

function characterIndex(characterId: string) {
  const index = data.characters.findIndex((c) => c.id === characterId);
  return index === -1 ? Infinity : index;
}

/**
 * Position of a section's character in the character list, or null for sections that aren't
 * tied to a character. A section tied to one character (characterId) uses that; otherwise a
 * character category uses the first character able to use any of its items.
 */
export function sectionOwner(
  slot: ItemSlot,
  items: Item[],
  characterId?: string | null
): number | null {
  if (characterId) return characterIndex(characterId);
  if (!CHARACTER_SLOTS.has(slot)) return null;
  return Math.min(...items.flatMap((item) => (item.usableBy ?? []).map(characterIndex)));
}

/**
 * Orders the character sections by character (Soma, Alucard, Jonathan, ...) while the other
 * sections keep their places: the character sections trade positions among themselves.
 */
export function sortByCharacter<T>(sections: T[], ownerOf: (section: T) => number | null): T[] {
  const owned = sections
    .map((section) => ({ section, owner: ownerOf(section) }))
    .filter((entry): entry is { section: T; owner: number } => entry.owner !== null)
    .sort((a, b) => a.owner - b.owner);
  let next = 0;
  return sections.map((section) => (ownerOf(section) === null ? section : owned[next++].section));
}
