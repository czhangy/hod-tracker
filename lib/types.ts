export type ItemSlot =
  | "armor"
  | "headGear"
  | "legProtection"
  | "cloaks"
  | "shields"
  | "accessories"
  | "weapons"
  | "subWeapons"
  | "soulsBlue"
  | "soulsRed"
  | "soulsYellow"
  | "spells"
  | "glyphs"
  | "boundSpells"
  | "yokoSpells"
  | "martialArts"
  | "personalSkills";

export type Handedness = "1h" | "2h";

export const DIFFICULTIES = ["Normal", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** A chest that can drop an item: which chapter and difficulty it's in. */
export interface ChestDrop {
  chapter: number;
  /** Unset when not known (or when the chest appears on every difficulty). */
  difficulty?: Difficulty | null;
}

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  /** Sorts this item ahead of the rest of its section (still alphabetical among pinned items). */
  listFirst?: boolean;
  /** Ids of the characters that can use this item. Unset/empty means none are known yet. */
  usableBy?: string[] | null;
  /** True for items the player starts with. */
  starterGear?: boolean;
  /** True for items that can be bought in the shop. */
  shop?: boolean;
  /** Enemy drops: the names of the enemies that drop this item. */
  enemyDrops?: string[] | null;
  /** Chest drops: every chest (chapter, difficulty, chest type) this item can come from. */
  chestDrops?: ChestDrop[] | null;
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
  /**
   * Set on items whose power can be leveled up, separately from how many copies are owned.
   * The value is the highest level; the item shows up in the Leveling tab.
   */
  levelCap?: number | null;
  /** Each character that can use this item levels it separately (e.g. sub-weapons). */
  levelPerCharacter?: boolean;
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
 * chapterClears: characterId -> chapterId -> cleared? A chapter counts as cleared once it is
 *   beaten on Hard Mode.
 * itemsObtained: itemId -> count owned. HoD's item stash is shared, not per-character.
 *   0/absent = not obtained. Non-levelable items only ever go to 1. Levelable items
 *   (see Item.levelable) can go higher as duplicates are collected.
 * itemLevels: level key -> current level, for items with a levelCap. Absent = level 1. The
 *   key is the item id, or "itemId:characterId" for levelPerCharacter items (see levelKey).
 */
export interface ProgressState {
  version: 1;
  chapterClears: Record<string, Record<string, boolean>>;
  itemsObtained: Record<string, number>;
  itemLevels: Record<string, number>;
}

export function emptyProgress(): ProgressState {
  return { version: 1, chapterClears: {}, itemsObtained: {}, itemLevels: {} };
}
