import {readJSON, writeJSON, StorageKeys, clearAll} from './storage';
import {generateId} from '../utils/id';
import type {
  AppSettings,
  BackupPayload,
  Category,
  Contact,
  LedgerEntry,
  Transaction,
} from '../types/models';

const DEFAULT_CATEGORIES: Category[] = [
  {id: 'cat-sales', name: 'Sales', type: 'income', color: '#2E7D32'},
  {id: 'cat-services', name: 'Services', type: 'income', color: '#388E3C'},
  {
    id: 'cat-other-income',
    name: 'Other Income',
    type: 'income',
    color: '#66BB6A',
  },
  {
    id: 'cat-inventory',
    name: 'Stock / Inventory',
    type: 'expense',
    color: '#C62828',
  },
  {id: 'cat-rent', name: 'Rent', type: 'expense', color: '#D84315'},
  {id: 'cat-transport', name: 'Transport', type: 'expense', color: '#EF6C00'},
  {id: 'cat-salaries', name: 'Salaries', type: 'expense', color: '#AD1457'},
  {id: 'cat-utilities', name: 'Utilities', type: 'expense', color: '#6A1B9A'},
  {
    id: 'cat-other-expense',
    name: 'Other Expense',
    type: 'expense',
    color: '#78909C',
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  currencySymbol: '₦',
  pinHash: null,
  pinEnabled: false,
};

/** Seeds default categories exactly once, on first app launch. */
export async function ensureSeeded(): Promise<void> {
  const alreadySeeded = await readJSON(StorageKeys.seeded, false);
  if (alreadySeeded) {
    return;
  }
  const existingCategories = await readJSON<Category[]>(
    StorageKeys.categories,
    [],
  );
  if (existingCategories.length === 0) {
    await writeJSON(StorageKeys.categories, DEFAULT_CATEGORIES);
  }
  await writeJSON(StorageKeys.seeded, true);
}

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

export async function getTransactions(): Promise<Transaction[]> {
  return readJSON<Transaction[]>(StorageKeys.transactions, []);
}

export async function saveTransaction(
  input: Omit<Transaction, 'id' | 'createdAt'>,
): Promise<Transaction> {
  const transactions = await getTransactions();
  const record: Transaction = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await writeJSON(StorageKeys.transactions, [record, ...transactions]);
  return record;
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await getTransactions();
  await writeJSON(
    StorageKeys.transactions,
    transactions.filter(t => t.id !== id),
  );
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  return readJSON<Category[]>(StorageKeys.categories, DEFAULT_CATEGORIES);
}

export async function saveCategory(
  input: Omit<Category, 'id'>,
): Promise<Category> {
  const categories = await getCategories();
  const record: Category = {...input, id: generateId()};
  await writeJSON(StorageKeys.categories, [...categories, record]);
  return record;
}

// ---------------------------------------------------------------------------
// Contacts (customers / suppliers)
// ---------------------------------------------------------------------------

export async function getContacts(): Promise<Contact[]> {
  return readJSON<Contact[]>(StorageKeys.contacts, []);
}

export async function saveContact(
  input: Omit<Contact, 'id'>,
): Promise<Contact> {
  const contacts = await getContacts();
  const record: Contact = {...input, id: generateId()};
  await writeJSON(StorageKeys.contacts, [record, ...contacts]);
  return record;
}

export async function deleteContact(id: string): Promise<void> {
  const contacts = await getContacts();
  await writeJSON(
    StorageKeys.contacts,
    contacts.filter(c => c.id !== id),
  );
  const entries = await getLedgerEntries();
  await writeJSON(
    StorageKeys.ledgerEntries,
    entries.filter(e => e.contactId !== id),
  );
}

// ---------------------------------------------------------------------------
// Ledger entries (debtor / creditor tracking)
// ---------------------------------------------------------------------------

export async function getLedgerEntries(): Promise<LedgerEntry[]> {
  return readJSON<LedgerEntry[]>(StorageKeys.ledgerEntries, []);
}

export async function saveLedgerEntry(
  input: Omit<LedgerEntry, 'id' | 'createdAt'>,
): Promise<LedgerEntry> {
  const entries = await getLedgerEntries();
  const record: LedgerEntry = {
    ...input,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await writeJSON(StorageKeys.ledgerEntries, [record, ...entries]);
  return record;
}

export async function deleteLedgerEntry(id: string): Promise<void> {
  const entries = await getLedgerEntries();
  await writeJSON(
    StorageKeys.ledgerEntries,
    entries.filter(e => e.id !== id),
  );
}

/** Positive balance = contact owes the business money. */
export function computeContactBalance(
  entries: LedgerEntry[],
  contactId: string,
): number {
  return entries
    .filter(e => e.contactId === contactId)
    .reduce((sum, e) => sum + (e.kind === 'charge' ? e.amount : -e.amount), 0);
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function getSettings(): Promise<AppSettings> {
  return readJSON<AppSettings>(StorageKeys.settings, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await writeJSON(StorageKeys.settings, settings);
}

// ---------------------------------------------------------------------------
// Backup / restore
// ---------------------------------------------------------------------------

export async function exportBackup(): Promise<BackupPayload> {
  const [transactions, categories, contacts, ledgerEntries, settings] =
    await Promise.all([
      getTransactions(),
      getCategories(),
      getContacts(),
      getLedgerEntries(),
      getSettings(),
    ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions,
    categories,
    contacts,
    ledgerEntries,
    settings,
  };
}

export async function importBackup(payload: BackupPayload): Promise<void> {
  await writeJSON(StorageKeys.transactions, payload.transactions ?? []);
  await writeJSON(
    StorageKeys.categories,
    payload.categories ?? DEFAULT_CATEGORIES,
  );
  await writeJSON(StorageKeys.contacts, payload.contacts ?? []);
  await writeJSON(StorageKeys.ledgerEntries, payload.ledgerEntries ?? []);
  await writeJSON(StorageKeys.settings, payload.settings ?? DEFAULT_SETTINGS);
  await writeJSON(StorageKeys.seeded, true);
}

export async function resetAllData(): Promise<void> {
  await clearAll();
}

export {DEFAULT_CATEGORIES, DEFAULT_SETTINGS};
