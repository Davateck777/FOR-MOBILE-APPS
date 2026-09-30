import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin, typed wrapper around AsyncStorage so every repository reads/writes
 * JSON the same way. Swapping the persistence engine later (e.g. to SQLite)
 * only means re-implementing this file — repositories and screens are
 * unaffected because they only ever talk to `StorageKeys.*Repository`.
 */
export const StorageKeys = {
  transactions: '@bookkeeper/transactions',
  categories: '@bookkeeper/categories',
  contacts: '@bookkeeper/contacts',
  ledgerEntries: '@bookkeeper/ledger_entries',
  settings: '@bookkeeper/settings',
  seeded: '@bookkeeper/seeded_v1',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function readJSON<T>(key: StorageKey, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(
      `[BookKeeper] Failed to read "${key}" — using fallback.`,
      error,
    );
    return fallback;
  }
}

export async function writeJSON<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(StorageKeys));
}
