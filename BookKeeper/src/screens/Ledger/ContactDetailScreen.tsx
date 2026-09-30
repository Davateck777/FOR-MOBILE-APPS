import React, {useMemo} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../../components/Screen';
import {Card} from '../../components/Card';
import {PrimaryButton} from '../../components/PrimaryButton';
import {EmptyState} from '../../components/EmptyState';
import {useAppData} from '../../store/AppDataContext';
import {colors, spacing} from '../../theme';
import {formatMoney} from '../../utils/format';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ContactDetail'>;

export function ContactDetailScreen({navigation, route}: Props) {
  const {contactId} = route.params;
  const {contacts, ledgerEntries, settings, contactBalance, removeContact} =
    useAppData();

  const contact = contacts.find(c => c.id === contactId);
  const entries = useMemo(
    () =>
      ledgerEntries
        .filter(e => e.contactId === contactId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [ledgerEntries, contactId],
  );
  const balance = contactBalance(contactId);

  if (!contact) {
    return (
      <Screen>
        <EmptyState
          title="Contact not found"
          subtitle="It may have been deleted."
        />
      </Screen>
    );
  }

  const isCustomer = contact.type === 'customer';
  const balanceLabel =
    balance === 0
      ? 'Settled up'
      : isCustomer
      ? `Owes you ${formatMoney(balance, settings.currencySymbol)}`
      : `You owe ${formatMoney(balance, settings.currencySymbol)}`;

  const handleDelete = () => {
    Alert.alert(
      'Delete contact?',
      'All ledger history for this contact will be removed.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeContact(contactId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.type}>{isCustomer ? 'Customer' : 'Supplier'}</Text>
        {contact.phone ? (
          <Text style={styles.phone}>{contact.phone}</Text>
        ) : null}
        <Text
          style={[
            styles.balance,
            {
              color:
                balance === 0
                  ? colors.muted
                  : isCustomer
                  ? colors.income
                  : colors.expense,
            },
          ]}>
          {balanceLabel}
        </Text>
      </Card>

      <View style={styles.actionsRow}>
        <PrimaryButton
          label={isCustomer ? '+ They bought (charge)' : '+ Bill received'}
          onPress={() =>
            navigation.navigate('AddLedgerEntry', {contactId, kind: 'charge'})
          }
          style={styles.actionButton}
        />
        <PrimaryButton
          label="+ Payment"
          variant="outline"
          onPress={() =>
            navigation.navigate('AddLedgerEntry', {contactId, kind: 'payment'})
          }
          style={styles.actionButton}
        />
      </View>

      <Text style={styles.sectionTitle}>History</Text>
      <Card>
        {entries.length === 0 ? (
          <EmptyState title="No history yet" />
        ) : (
          entries.map(entry => (
            <View key={entry.id} style={styles.entryRow}>
              <View style={styles.flexShrink}>
                <Text style={styles.entryKind}>
                  {entry.kind === 'charge' ? 'Charge' : 'Payment'}
                </Text>
                {entry.note ? (
                  <Text style={styles.entryNote}>{entry.note}</Text>
                ) : null}
                <Text style={styles.entryDate}>{entry.date}</Text>
              </View>
              <Text
                style={[
                  styles.entryAmount,
                  {
                    color:
                      entry.kind === 'charge' ? colors.expense : colors.income,
                  },
                ]}>
                {entry.kind === 'charge' ? '+' : '-'}
                {formatMoney(entry.amount, settings.currencySymbol)}
              </Text>
            </View>
          ))
        )}
      </Card>

      <PrimaryButton
        label="Delete contact"
        variant="danger"
        onPress={handleDelete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {fontSize: 18, fontWeight: '700', color: colors.text},
  type: {fontSize: 13, color: colors.muted, marginTop: 2},
  phone: {fontSize: 13, color: colors.muted, marginTop: 2},
  balance: {fontSize: 20, fontWeight: '700', marginTop: spacing.md},
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {flex: 1},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  flexShrink: {flexShrink: 1, paddingRight: spacing.sm},
  entryKind: {fontSize: 14, fontWeight: '600', color: colors.text},
  entryNote: {fontSize: 12, color: colors.muted, marginTop: 2},
  entryDate: {fontSize: 12, color: colors.muted, marginTop: 2},
  entryAmount: {fontSize: 15, fontWeight: '700'},
});
