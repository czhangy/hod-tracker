import { data } from "@/lib/data";
import type { ProgressState } from "@/lib/types";

const STORAGE_KEY = "hod-tracker-progress";
const EMPTY_STATE: ProgressState = {
  version: 1,
  chapterClears: {},
  itemsObtained: {},
  itemLevels: {},
};

type Listener = () => void;

let state: ProgressState = EMPTY_STATE;
let initialized = false;
const listeners = new Set<Listener>();

/** Older saves stored itemsObtained as booleans; newer ones use counts for leveling. */
function migrateItemsObtained(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [itemId, value] of Object.entries(raw as Record<string, unknown>)) {
    // Clamp in case a cap was lowered after the count was saved.
    const maxLevel = data.items.find((i) => i.id === itemId)?.maxLevel;
    const cap = typeof maxLevel === "number" ? maxLevel : Infinity;
    if (typeof value === "number") out[itemId] = Math.min(value, cap);
    else if (value === true) out[itemId] = 1;
  }
  return out;
}

function readFromStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return EMPTY_STATE;
    return {
      version: 1,
      // Older saves tracked Normal (chapterClears) and Hard (chapterClearsHard) separately;
      // a chapter is now cleared only when beaten on Hard, so carry the Hard clears over.
      chapterClears: parsed.chapterClearsHard ?? parsed.chapterClears ?? {},
      itemsObtained: migrateItemsObtained(parsed.itemsObtained),
      itemLevels: parsed.itemLevels && typeof parsed.itemLevels === "object" ? parsed.itemLevels : {},
    };
  } catch {
    return EMPTY_STATE;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota, etc) - fail silently
  }
}

function ensureInitialized() {
  if (!initialized && typeof window !== "undefined") {
    state = readFromStorage();
    initialized = true;
  }
}

function commit(next: ProgressState) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ProgressState {
  ensureInitialized();
  return state;
}

export function getServerSnapshot(): ProgressState {
  return EMPTY_STATE;
}

export function toggleChapter(characterId: string, chapterId: string) {
  ensureInitialized();
  const characterChapters = { ...(state.chapterClears[characterId] ?? {}) };
  characterChapters[chapterId] = !characterChapters[chapterId];
  commit({
    ...state,
    chapterClears: { ...state.chapterClears, [characterId]: characterChapters },
  });
}

/** For simple (non-levelable) items: toggles between 0 and 1. */
export function toggleItem(itemId: string) {
  ensureInitialized();
  const current = state.itemsObtained[itemId] ?? 0;
  commit({
    ...state,
    itemsObtained: { ...state.itemsObtained, [itemId]: current > 0 ? 0 : 1 },
  });
}

/** For levelable items: increases/decreases the owned count, clamped to [0, maxLevel]. */
export function adjustItemCount(itemId: string, delta: number) {
  ensureInitialized();
  const current = state.itemsObtained[itemId] ?? 0;
  const maxLevel = data.items.find((i) => i.id === itemId)?.maxLevel;
  let next = current + delta;
  next = Math.max(0, next);
  if (typeof maxLevel === "number") next = Math.min(maxLevel, next);
  commit({
    ...state,
    itemsObtained: { ...state.itemsObtained, [itemId]: next },
  });
}

/** For items with a levelCap: raises/lowers the level, clamped to [1, levelCap]. */
export function adjustItemLevel(key: string, delta: number) {
  ensureInitialized();
  const itemId = key.split(":")[0];
  const cap = data.items.find((i) => i.id === itemId)?.levelCap;
  if (typeof cap !== "number") return;
  const current = state.itemLevels[key] ?? 1;
  const next = Math.min(cap, Math.max(1, current + delta));
  commit({
    ...state,
    itemLevels: { ...state.itemLevels, [key]: next },
  });
}
