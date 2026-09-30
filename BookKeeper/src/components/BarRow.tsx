import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing} from '../theme';

interface BarRowProps {
  label: string;
  amountLabel: string;
  fraction: number; // 0..1
  color: string;
}

export function BarRow({label, amountLabel, fraction, color}: BarRowProps) {
  const clamped = Math.max(0, Math.min(1, fraction));
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.amount}>{amountLabel}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {width: `${clamped * 100}%`, backgroundColor: color},
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm + 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
