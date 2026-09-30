import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Screen} from '../../components/Screen';
import {SegmentedControl} from '../../components/SegmentedControl';
import {EmptyState} from '../../components/EmptyState';
import {PrimaryButton} from '../../components/PrimaryButton';
import {useAppData} from '../../store/AppDataContext';
import {useRootNavigation} from '../../navigation/hooks';
import {colors, spacing} from '../../theme';
import {formatMoney} from '../../utils/format';

type Filter = 'all' | 'customer' | 'supplier';

export function LedgerScreen() {
  const navigation = useRootNavigation();
  const {contacts, settings, contactBalance} = useAppData();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return contacts;
    }
    return contacts.filter(c => c.type === filter);
  }, [contacts, filter]);

  return (
    <Screen scroll={false} style={styles.body}>
      <View style={styles.header}>
        <Text style={styles.heading}>Customers &amp; Suppliers</Text>
        <SegmentedControl
          options={[
            {label: 'All', value: 'all'},
            {label: 'Customers', value: 'customer'},
            {label: 'Suppliers', value: 'supplier'},
          ]}
          value={filter}
          onChange={setFilter}
        />
        <PrimaryButton
          label="+ Add Contact"
          onPress={() => navigation.navigate('AddContact')}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No contacts yet"
            subtitle="Add a customer to track what they owe you, or a supplier to track what you owe them."
          />
        }
        renderItem={({item}) => {
          const balance = contactBalance(item.id);
          const isCustomer = item.type === 'customer';
          const balanceColor =
            balance === 0
              ? colors.muted
              : isCustomer
              ? colors.income
              : colors.expense;
          const balanceLabel =
            balance === 0
              ? 'Settled'
              : isCustomer
              ? `Owes you ${formatMoney(balance, settings.currencySymbol)}`
              : `You owe ${formatMoney(balance, settings.currencySymbol)}`;

          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                navigation.navigate('ContactDetail', {contactId: item.id})
              }
              activeOpacity={0.7}>
              <View style={styles.flexShrink}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>
                  {isCustomer ? 'Customer' : 'Supplier'}
                </Text>
              </View>
              <Text style={[styles.balance, {color: balanceColor}]}>
                {balanceLabel}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {padding: 0},
  header: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  flexShrink: {
    flexShrink: 1,
    paddingRight: spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  type: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  balance: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 1,
  },
});
