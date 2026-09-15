import { data } from "@/lib/data";
import type { Difficulty, ProgressState } from "@/lib/types";

const STORAGE_KEY = "hod-tracker-progress";
const EMPTY_STATE: ProgressState = {
  version: 1,
  chapterClears: {},
  chapterClearsHard: {},
  itemsObtained: {},
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
    if (typeof value === "number") out[itemId] = value;
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
      chapterClears: parsed.chapterClears ?? {},
      chapterClearsHard: parsed.chapterClearsHard ?? {},
      itemsObtained: migrateItemsObtained(parsed.itemsObtained),
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

export function toggleChapter(characterId: string, chapterId: string, difficulty: Difficulty) {
  ensureInitialized();
  const key = difficulty === "hard" ? "chapterClearsHard" : "chapterClears";
  const characterChapters = { ...(state[key][characterId] ?? {}) };
  characterChapters[chapterId] = !characterChapters[chapterId];
  commit({
    ...state,
    [key]: { ...state[key], [characterId]: characterChapters },
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
