import React, {useMemo, useState} from 'react';
import {Share, StyleSheet, Text} from 'react-native';
import {Screen} from '../../components/Screen';
import {Card} from '../../components/Card';
import {SegmentedControl} from '../../components/SegmentedControl';
import {BarRow} from '../../components/BarRow';
import {PrimaryButton} from '../../components/PrimaryButton';
import {EmptyState} from '../../components/EmptyState';
import {useAppData} from '../../store/AppDataContext';
import {colors, spacing} from '../../theme';
import {formatMoney, monthKey} from '../../utils/format';

type RangeOption = 'this_month' | 'last_month' | 'all_time';

export function ReportsScreen() {
  const {transactions, categories, settings} = useAppData();
  const [range, setRange] = useState<RangeOption>('this_month');

  const filtered = useMemo(() => {
    if (range === 'all_time') {
      return transactions;
    }
    const now = new Date();
    const target =
      range === 'this_month'
        ? now.toISOString().slice(0, 7)
        : (() => {
            const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return d.toISOString().slice(0, 7);
          })();
    return transactions.filter(t => monthKey(t.date) === target);
  }, [transactions, range]);

  const totals = useMemo(() => {
    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    return {income, expense, net: income - expense};
  }, [filtered]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    });
    const maxAmount = Math.max(1, ...Array.from(map.values()));
    return Array.from(map.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          name: category?.name ?? 'Uncategorized',
          color: category?.color ?? colors.muted,
          amount,
          fraction: amount / maxAmount,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filtered, categories]);

  const handleExportCSV = async () => {
    const header = 'date,type,category,amount,note';
    const rows = filtered.map(t => {
      const category = categories.find(c => c.id === t.categoryId)?.name ?? '';
      const note = (t.note ?? '').replace(/,/g, ';');
      return `${t.date},${t.type},${category},${t.amount},${note}`;
    });
    const csv = [header, ...rows].join('\n');
    try {
      await Share.share({message: csv, title: 'BookKeeper export (CSV)'});
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  return (
    <Screen>
      <Text style={styles.heading}>Reports</Text>
      <SegmentedControl
        options={[
          {label: 'This month', value: 'this_month'},
          {label: 'Last month', value: 'last_month'},
          {label: 'All time', value: 'all_time'},
        ]}
        value={range}
        onChange={setRange}
      />

      <Card>
        <Text style={styles.row}>
          Income:{' '}
          <Text style={styles.income}>
            {formatMoney(totals.income, settings.currencySymbol)}
          </Text>
        </Text>
        <Text style={styles.row}>
          Expenses:{' '}
          <Text style={styles.expense}>
            {formatMoney(totals.expense, settings.currencySymbol)}
          </Text>
        </Text>
        <Text style={styles.row}>
          Net:{' '}
          <Text
            style={{
              color: totals.net >= 0 ? colors.income : colors.expense,
              fontWeight: '700',
            }}>
            {formatMoney(totals.net, settings.currencySymbol)}
          </Text>
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Breakdown by category</Text>
      <Card>
        {byCategory.length === 0 ? (
          <EmptyState
            title="Nothing to show"
            subtitle="No transactions in this period yet."
          />
        ) : (
          byCategory.map(item => (
            <BarRow
              key={item.categoryId}
              label={item.name}
              amountLabel={formatMoney(item.amount, settings.currencySymbol)}
              fraction={item.fraction}
              color={item.color}
            />
          ))
        )}
      </Card>

      <PrimaryButton
        label="Export as CSV"
        variant="outline"
        onPress={handleExportCSV}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  income: {color: colors.income, fontWeight: '700'},
  expense: {color: colors.expense, fontWeight: '700'},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
