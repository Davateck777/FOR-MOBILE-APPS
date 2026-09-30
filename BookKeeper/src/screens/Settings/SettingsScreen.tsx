import React, {useState} from 'react';
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Screen} from '../../components/Screen';
import {Card} from '../../components/Card';
import {TextField} from '../../components/TextField';
import {PrimaryButton} from '../../components/PrimaryButton';
import {useAppData} from '../../store/AppDataContext';
import {useRootNavigation} from '../../navigation/hooks';
import {colors, radius, spacing} from '../../theme';
import {
  exportBackup,
  importBackup,
  resetAllData,
} from '../../database/repositories';

const CURRENCIES = ['₦', '$', '€', '£', 'R'];

export function SettingsScreen() {
  const navigation = useRootNavigation();
  const {settings, updateSettings, refresh} = useAppData();
  const [restoreText, setRestoreText] = useState('');
  const [busy, setBusy] = useState(false);

  const handleBackup = async () => {
    setBusy(true);
    try {
      const payload = await exportBackup();
      await Share.share({
        title: 'BookKeeper backup',
        message: JSON.stringify(payload),
      });
    } catch (error) {
      Alert.alert('Backup failed', String(error));
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = () => {
    if (!restoreText.trim()) {
      Alert.alert(
        'Nothing to restore',
        'Paste a BookKeeper backup JSON first.',
      );
      return;
    }
    Alert.alert(
      'Restore backup?',
      'This will replace all current data on this device with the backup you pasted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            try {
              const payload = JSON.parse(restoreText);
              await importBackup(payload);
              await refresh();
              setRestoreText('');
              Alert.alert('Restored', 'Your data has been restored.');
            } catch (error) {
              Alert.alert(
                'Restore failed',
                'That does not look like a valid BookKeeper backup.',
              );
            }
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Erase all data?',
      'This deletes every transaction, contact and setting on this device. This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Erase everything',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            await refresh();
            Alert.alert('Done', 'All data has been erased.');
          },
        },
      ],
    );
  };

  const handleDisableLock = () => {
    Alert.alert('Disable app lock?', undefined, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Disable',
        style: 'destructive',
        onPress: () => updateSettings({...settings, pinEnabled: false}),
      },
    ]);
  };

  return (
    <Screen>
      <Text style={styles.heading}>Settings</Text>

      <Card>
        <Text style={styles.sectionTitle}>Currency</Text>
        <View style={styles.chipRow}>
          {CURRENCIES.map(symbol => (
            <TouchableOpacity
              key={symbol}
              style={[
                styles.chip,
                settings.currencySymbol === symbol && styles.chipActive,
              ]}
              onPress={() =>
                updateSettings({...settings, currencySymbol: symbol})
              }>
              <Text
                style={[
                  styles.chipLabel,
                  settings.currencySymbol === symbol && styles.chipLabelActive,
                ]}>
                {symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>App lock</Text>
        <Text style={styles.helperText}>
          {settings.pinEnabled
            ? 'A PIN is required every time you open BookKeeper.'
            : 'Protect BookKeeper with a PIN so others cannot open it.'}
        </Text>
        {settings.pinEnabled ? (
          <>
            <PrimaryButton
              label="Change PIN"
              variant="outline"
              onPress={() => navigation.navigate('SetPin')}
              style={styles.settingButton}
            />
            <PrimaryButton
              label="Disable app lock"
              variant="danger"
              onPress={handleDisableLock}
            />
          </>
        ) : (
          <PrimaryButton
            label={settings.pinHash ? 'Re-enable app lock' : 'Set up app lock'}
            onPress={() =>
              settings.pinHash
                ? updateSettings({...settings, pinEnabled: true})
                : navigation.navigate('SetPin')
            }
          />
        )}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Backup &amp; restore</Text>
        <Text style={styles.helperText}>
          Export your data as JSON to keep a copy, and paste it back in to
          restore.
        </Text>
        <PrimaryButton
          label="Backup (share JSON)"
          onPress={handleBackup}
          loading={busy}
          style={styles.settingButton}
        />
        <TextField
          label="Paste backup JSON to restore"
          value={restoreText}
          onChangeText={setRestoreText}
          multiline
          placeholder="{ ... }"
        />
        <PrimaryButton
          label="Restore from pasted backup"
          variant="outline"
          onPress={handleRestore}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Danger zone</Text>
        <PrimaryButton
          label="Erase all data"
          variant="danger"
          onPress={handleReset}
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>BookKeeper — MVP v0.1.0</Text>
        <Text style={styles.aboutText}>
          Offline-first bookkeeping for small businesses.
        </Text>
        <Text style={styles.aboutText}>Author: Mr Dave Adex | DAVA TECK</Text>
      </Card>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  helperText: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  chipLabelActive: {
    color: '#fff',
  },
  settingButton: {
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 4,
  },
});
