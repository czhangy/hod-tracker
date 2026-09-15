import gameData from "@/data/game-data.json";
import type { GameData } from "@/lib/types";

export const data = gameData as GameData;

export function getCharacter(id: string) {
  return data.characters.find((c) => c.id === id);
}
