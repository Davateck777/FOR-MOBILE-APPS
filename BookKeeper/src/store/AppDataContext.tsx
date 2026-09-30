import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as repo from '../database/repositories';
import type {
  AppSettings,
  Category,
  Contact,
  LedgerEntry,
  Transaction,
} from '../types/models';

interface AppDataContextValue {
  loading: boolean;
  transactions: Transaction[];
  categories: Category[];
  contacts: Contact[];
  ledgerEntries: LedgerEntry[];
  settings: AppSettings;
  refresh: () => Promise<void>;
  addTransaction: (
    input: Omit<Transaction, 'id' | 'createdAt'>,
  ) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addContact: (input: Omit<Contact, 'id'>) => Promise<Contact>;
  removeContact: (id: string) => Promise<void>;
  addLedgerEntry: (
    input: Omit<LedgerEntry, 'id' | 'createdAt'>,
  ) => Promise<void>;
  removeLedgerEntry: (id: string) => Promise<void>;
  updateSettings: (next: AppSettings) => Promise<void>;
  contactBalance: (contactId: string) => number;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined,
);

export function AppDataProvider({children}: {children: React.ReactNode}) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(repo.DEFAULT_SETTINGS);

  const refresh = useCallback(async () => {
    const [tx, cats, cons, ledger, sett] = await Promise.all([
      repo.getTransactions(),
      repo.getCategories(),
      repo.getContacts(),
      repo.getLedgerEntries(),
      repo.getSettings(),
    ]);
    setTransactions(tx);
    setCategories(cats);
    setContacts(cons);
    setLedgerEntries(ledger);
    setSettings(sett);
  }, []);

  useEffect(() => {
    (async () => {
      await repo.ensureSeeded();
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const addTransaction = useCallback(
    async (input: Omit<Transaction, 'id' | 'createdAt'>) => {
      await repo.saveTransaction(input);
      await refresh();
    },
    [refresh],
  );

  const removeTransaction = useCallback(
    async (id: string) => {
      await repo.deleteTransaction(id);
      await refresh();
    },
    [refresh],
  );

  const addContact = useCallback(
    async (input: Omit<Contact, 'id'>) => {
      const record = await repo.saveContact(input);
      await refresh();
      return record;
    },
    [refresh],
  );

  const removeContact = useCallback(
    async (id: string) => {
      await repo.deleteContact(id);
      await refresh();
    },
    [refresh],
  );

  const addLedgerEntry = useCallback(
    async (input: Omit<LedgerEntry, 'id' | 'createdAt'>) => {
      await repo.saveLedgerEntry(input);
      await refresh();
    },
    [refresh],
  );

  const removeLedgerEntry = useCallback(
    async (id: string) => {
      await repo.deleteLedgerEntry(id);
      await refresh();
    },
    [refresh],
  );

  const updateSettings = useCallback(async (next: AppSettings) => {
    await repo.saveSettings(next);
    setSettings(next);
  }, []);

  const contactBalance = useCallback(
    (contactId: string) => repo.computeContactBalance(ledgerEntries, contactId),
    [ledgerEntries],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      loading,
      transactions,
      categories,
      contacts,
      ledgerEntries,
      settings,
      refresh,
      addTransaction,
      removeTransaction,
      addContact,
      removeContact,
      addLedgerEntry,
      removeLedgerEntry,
      updateSettings,
      contactBalance,
    }),
    [
      loading,
      transactions,
      categories,
      contacts,
      ledgerEntries,
      settings,
      refresh,
      addTransaction,
      removeTransaction,
      addContact,
      removeContact,
      addLedgerEntry,
      removeLedgerEntry,
      updateSettings,
      contactBalance,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
}
