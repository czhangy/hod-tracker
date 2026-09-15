export type ItemSlot =
  | "armor"
  | "headGear"
  | "legProtection"
  | "cloaks"
  | "shields"
  | "accessories"
  | "swords"
  | "firearms"
  | "otherWeapons"
  | "subWeapons";

export interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  notes?: string;
  stats?: string | null;
  dropLocation?: string | null;
  iconUrl?: string | null;
}

export interface Character {
  id: string;
  name: string;
  class?: string;
  dlc: boolean;
  dlcPack?: string | null;
}

export interface Chapter {
  id: string;
  number: number;
  name: string;
  dlc: boolean;
  dlcPack?: string | null;
}

export type EnemyType = "common" | "boss";

export interface Enemy {
  id: string;
  name: string;
  type: EnemyType;
  chapters: string[];
  hp?: number | null;
  notes?: string | null;
}

export interface GameData {
  characters: Character[];
  chapters: Chapter[];
  items: Item[];
  enemies: Enemy[];
}

/** How many items a character can have equipped in a given slot at once. */
export const MAX_EQUIPPED_PER_SLOT: Record<ItemSlot, number> = {
  swords: 1,
  otherWeapons: 1,
  firearms: 1,
  subWeapons: 1,
  armor: 1,
  headGear: 1,
  legProtection: 1,
  cloaks: 1,
  shields: 1,
  accessories: 2,
};

/**
 * Persisted in localStorage.
 * chapterClears: characterId -> chapterId -> cleared?
 * itemsObtained: itemId -> obtained? (HoD equipment is a shared stash, not per-character)
 * equippedGear: characterId -> slot -> item ids currently equipped in that slot
 */
export interface ProgressState {
  version: 1;
  chapterClears: Record<string, Record<string, boolean>>;
  itemsObtained: Record<string, boolean>;
  equippedGear: Record<string, Partial<Record<ItemSlot, string[]>>>;
}

export function emptyProgress(): ProgressState {
  return { version: 1, chapterClears: {}, itemsObtained: {}, equippedGear: {} };
}
