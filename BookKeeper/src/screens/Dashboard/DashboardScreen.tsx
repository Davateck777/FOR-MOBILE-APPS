import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Screen} from '../../components/Screen';
import {Card} from '../../components/Card';
import {PrimaryButton} from '../../components/PrimaryButton';
import {EmptyState} from '../../components/EmptyState';
import {useAppData} from '../../store/AppDataContext';
import {useRootNavigation} from '../../navigation/hooks';
import {colors, spacing} from '../../theme';
import {formatMoney, isSameMonth} from '../../utils/format';

export function DashboardScreen() {
  const navigation = useRootNavigation();
  const {transactions, categories, settings} = useAppData();

  const summary = useMemo(() => {
    const thisMonth = transactions.filter(t => isSameMonth(t.date));
    const income = thisMonth
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = thisMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {income, expense, net: income - expense};
  }, [transactions]);

  const recent = transactions.slice(0, 5);
  const categoryName = (id: string) =>
    categories.find(c => c.id === id)?.name ?? 'Uncategorized';

  return (
    <Screen>
      <Text style={styles.heading}>Overview — this month</Text>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <SummaryItem
            label="Income"
            value={formatMoney(summary.income, settings.currencySymbol)}
            color={colors.income}
          />
          <SummaryItem
            label="Expenses"
            value={formatMoney(summary.expense, settings.currencySymbol)}
            color={colors.expense}
          />
        </View>
        <View style={styles.divider} />
        <SummaryItem
          label="Net profit"
          value={formatMoney(summary.net, settings.currencySymbol)}
          color={summary.net >= 0 ? colors.income : colors.expense}
          big
        />
      </Card>

      <View style={styles.quickActions}>
        <PrimaryButton
          label="+ Income"
          onPress={() =>
            navigation.navigate('AddTransaction', {type: 'income'})
          }
          style={styles.quickButton}
        />
        <PrimaryButton
          label="+ Expense"
          variant="danger"
          onPress={() =>
            navigation.navigate('AddTransaction', {type: 'expense'})
          }
          style={styles.quickButton}
        />
      </View>

      <Text style={styles.sectionTitle}>Recent transactions</Text>
      <Card>
        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            subtitle="Tap + Income or + Expense above to record your first entry."
          />
        ) : (
          recent.map(item => (
            <View key={item.id} style={styles.transactionRow}>
              <View style={styles.flexShrink}>
                <Text style={styles.transactionCategory}>
                  {categoryName(item.categoryId)}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      item.type === 'income' ? colors.income : colors.expense,
                  },
                ]}>
                {item.type === 'income' ? '+' : '-'}
                {formatMoney(item.amount, settings.currencySymbol)}
              </Text>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

function SummaryItem({
  label,
  value,
  color,
  big = false,
}: {
  label: string;
  value: string;
  color: string;
  big?: boolean;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text
        style={[styles.summaryValue, {color}, big && styles.summaryValueBig]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryCard: {
    paddingVertical: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryValueBig: {
    fontSize: 26,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  quickButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  flexShrink: {
    flexShrink: 1,
    paddingRight: spacing.sm,
  },
  transactionCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
