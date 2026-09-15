import { type ProgressState } from "@/lib/types";

const STORAGE_KEY = "hod-tracker-progress";
const EMPTY_STATE: ProgressState = { version: 1, chapterClears: {}, itemsObtained: {} };

type Listener = () => void;

let state: ProgressState = EMPTY_STATE;
let initialized = false;
const listeners = new Set<Listener>();

function readFromStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return EMPTY_STATE;
    return parsed as ProgressState;
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

export function toggleItem(itemId: string) {
  ensureInitialized();
  commit({
    ...state,
    itemsObtained: { ...state.itemsObtained, [itemId]: !state.itemsObtained[itemId] },
  });
}
