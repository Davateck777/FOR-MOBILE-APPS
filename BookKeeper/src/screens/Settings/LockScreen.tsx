import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextField} from '../../components/TextField';
import {PrimaryButton} from '../../components/PrimaryButton';
import {colors, spacing} from '../../theme';
import {simpleHash} from '../../utils/hash';

interface LockScreenProps {
  pinHash: string;
  onUnlock: () => void;
}

export function LockScreen({pinHash, onUnlock}: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (simpleHash(pin) === pinHash) {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 BookKeeper is locked</Text>
      <Text style={styles.subtitle}>Enter your PIN to continue</Text>
      <TextField
        label="PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        placeholder="••••"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label="Unlock" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
