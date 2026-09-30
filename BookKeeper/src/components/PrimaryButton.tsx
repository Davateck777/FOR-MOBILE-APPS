import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {colors, radius, spacing} from '../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const isOutline = variant === 'outline';
  const backgroundColor =
    variant === 'danger'
      ? colors.danger
      : variant === 'outline'
      ? 'transparent'
      : colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {backgroundColor, opacity: disabled ? 0.5 : 1},
        isOutline && styles.outline,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.label, isOutline && styles.outlineLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineLabel: {
    color: colors.primary,
  },
});
