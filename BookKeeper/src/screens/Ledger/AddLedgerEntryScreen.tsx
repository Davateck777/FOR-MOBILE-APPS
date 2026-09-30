import React, {useState} from 'react';
import {Alert, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../../components/Screen';
import {TextField} from '../../components/TextField';
import {SegmentedControl} from '../../components/SegmentedControl';
import {PrimaryButton} from '../../components/PrimaryButton';
import {useAppData} from '../../store/AppDataContext';
import {isValidISODate, todayISO, yesterdayISO} from '../../utils/format';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLedgerEntry'>;

export function AddLedgerEntryScreen({navigation, route}: Props) {
  const {contactId, kind} = route.params;
  const {contacts, addLedgerEntry} = useAppData();
  const contact = contacts.find(c => c.id === contactId);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dateChoice, setDateChoice] = useState<
    'today' | 'yesterday' | 'custom'
  >('today');
  const [customDate, setCustomDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);

  const resolvedDate =
    dateChoice === 'today'
      ? todayISO()
      : dateChoice === 'yesterday'
      ? yesterdayISO()
      : customDate;

  const handleSave = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than zero.');
      return;
    }
    if (dateChoice === 'custom' && !isValidISODate(customDate)) {
      Alert.alert('Invalid date', 'Use the format YYYY-MM-DD.');
      return;
    }
    setSaving(true);
    try {
      await addLedgerEntry({
        contactId,
        kind,
        amount: numericAmount,
        note: note.trim() || undefined,
        date: resolvedDate,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={{marginBottom: 16, fontWeight: '600'}}>
        {kind === 'charge' ? 'Add a charge for' : 'Record a payment from'}{' '}
        {contact?.name ?? 'contact'}
      </Text>

      <TextField
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />

      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: 8,
        }}>
        Date
      </Text>
      <SegmentedControl
        options={[
          {label: 'Today', value: 'today'},
          {label: 'Yesterday', value: 'yesterday'},
          {label: 'Custom', value: 'custom'},
        ]}
        value={dateChoice}
        onChange={setDateChoice}
      />
      {dateChoice === 'custom' && (
        <TextField
          label="Custom date (YYYY-MM-DD)"
          value={customDate}
          onChangeText={setCustomDate}
          placeholder="2026-09-30"
        />
      )}

      <TextField
        label="Note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <PrimaryButton label="Save entry" onPress={handleSave} loading={saving} />
    </Screen>
  );
}
