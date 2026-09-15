export type ItemSlot =
  | "armor"
  | "headGear"
  | "legProtection"
  | "cloaks"
  | "shields"
  | "accessories"
  | "swords"
  | "katanas"
  | "axes"
  | "cestuses"
  | "cudgels"
  | "daggers"
  | "greatSwords"
  | "lances"
  | "rapiers"
  | "firearms"
  | "otherWeapons"
  | "subWeapons"
  | "soulsBlue"
  | "soulsRed"
  | "soulsYellow"
  | "spells"
  | "glyphs"
  | "scrolls"
  | "martialArts"
  | "personalSkills"
  | "dualCrushes"
  | "medicine";

export type Handedness = "1h" | "2h";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  notes?: string;
  stats?: string | null;
  dropLocation?: string | null;
  iconUrl?: string | null;
  /** Informational only: main-weapon items are 1- or 2-handed. */
  handedness?: Handedness | null;
  /**
   * Items that can be collected multiple times to increase in power (e.g. Soma's Souls,
   * which level up with duplicates) are tracked by count rather than a single checkbox.
   */
  levelable?: boolean;
  /** Max count/level for a levelable item, if known. Undefined/null means no known cap. */
  maxLevel?: number | null;
}

export interface Character {
  id: string;
  name: string;
  class?: string;
  dlc: boolean;
  portraitUrl?: string | null;
}

export interface Chapter {
  id: string;
  number: number;
  name: string;
  dlc: boolean;
}

export interface GameData {
  characters: Character[];
  chapters: Chapter[];
  items: Item[];
}

/**
 * Persisted in localStorage.
 * chapterClears: characterId -> chapterId -> cleared?
 * itemsObtained: itemId -> count owned. HoD's item stash is shared, not per-character.
 *   0/absent = not obtained. Non-levelable items only ever go to 1. Levelable items
 *   (see Item.levelable) can go higher as duplicates are collected.
 */
export interface ProgressState {
  version: 1;
  chapterClears: Record<string, Record<string, boolean>>;
  itemsObtained: Record<string, number>;
}

export function emptyProgress(): ProgressState {
  return { version: 1, chapterClears: {}, itemsObtained: {} };
}
