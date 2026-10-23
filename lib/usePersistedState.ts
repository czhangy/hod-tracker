"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * useState that survives a refresh by mirroring a string value to localStorage. The server
 * (and the hydration pass) render `defaultValue`, then the stored value takes over, so there
 * is no hydration mismatch. `isValid` guards against stale values (e.g. a removed character).
 */
export function usePersistedState<T extends string = string>(
  key: string,
  defaultValue: NoInfer<T>,
  isValid: (value: string) => boolean = () => true
): [T, (value: T) => void] {
  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
  const value = stored !== null && isValid(stored) ? (stored as T) : defaultValue;

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // localStorage unavailable - fail silently
      }
      listeners.forEach((listener) => listener());
    },
    [key]
  );

  return [value, setValue];
}
