import React, {useState} from 'react';
import {Alert, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../../components/Screen';
import {TextField} from '../../components/TextField';
import {PrimaryButton} from '../../components/PrimaryButton';
import {useAppData} from '../../store/AppDataContext';
import {simpleHash} from '../../utils/hash';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SetPin'>;

export function SetPinScreen({navigation}: Props) {
  const {settings, updateSettings} = useAppData();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSave = async () => {
    if (!/^\d{4,6}$/.test(pin)) {
      Alert.alert('Invalid PIN', 'Use 4 to 6 digits.');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('PINs do not match', 'Re-enter your PIN to confirm.');
      return;
    }
    await updateSettings({
      ...settings,
      pinHash: simpleHash(pin),
      pinEnabled: true,
    });
    Alert.alert(
      'App lock enabled',
      'You will need this PIN next time you open BookKeeper.',
    );
    navigation.goBack();
  };

  return (
    <Screen>
      <Text style={{marginBottom: 16, color: '#6B7280'}}>
        Choose a 4–6 digit PIN. You will be asked for it every time you open the
        app.
      </Text>
      <TextField
        label="New PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        placeholder="••••"
      />
      <TextField
        label="Confirm PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="number-pad"
        secureTextEntry
        placeholder="••••"
      />
      <PrimaryButton label="Enable app lock" onPress={handleSave} />
    </Screen>
  );
}
