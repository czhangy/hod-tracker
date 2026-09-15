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

export interface GameData {
  characters: Character[];
  chapters: Chapter[];
  items: Item[];
}

/**
 * Persisted in localStorage.
 * chapterClears: characterId -> chapterId -> cleared?
 * itemsObtained: itemId -> obtained? (HoD equipment is a shared stash, not per-character)
 */
export interface ProgressState {
  version: 1;
  chapterClears: Record<string, Record<string, boolean>>;
  itemsObtained: Record<string, boolean>;
}

export function emptyProgress(): ProgressState {
  return { version: 1, chapterClears: {}, itemsObtained: {} };
}
