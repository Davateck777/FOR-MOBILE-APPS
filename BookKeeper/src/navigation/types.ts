import type {LedgerEntryKind, TransactionType} from '../types/models';

export type RootStackParamList = {
  MainTabs: undefined;
  AddTransaction: {type?: TransactionType} | undefined;
  AddContact: undefined;
  ContactDetail: {contactId: string};
  AddLedgerEntry: {contactId: string; kind: LedgerEntryKind};
  SetPin: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Ledger: undefined;
  Reports: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
