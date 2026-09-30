import React, {useState} from 'react';
import {Alert} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Screen} from '../../components/Screen';
import {SegmentedControl} from '../../components/SegmentedControl';
import {TextField} from '../../components/TextField';
import {PrimaryButton} from '../../components/PrimaryButton';
import {useAppData} from '../../store/AppDataContext';
import type {RootStackParamList} from '../../navigation/types';
import type {ContactType} from '../../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'AddContact'>;

export function AddContactScreen({navigation}: Props) {
  const {addContact} = useAppData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<ContactType>('customer');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Enter a name for this contact.');
      return;
    }
    setSaving(true);
    try {
      await addContact({
        name: name.trim(),
        phone: phone.trim() || undefined,
        type,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <SegmentedControl
        options={[
          {label: 'Customer', value: 'customer'},
          {label: 'Supplier', value: 'supplier'},
        ]}
        value={type}
        onChange={setType}
      />
      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Mama Ngozi"
      />
      <TextField
        label="Phone (optional)"
        value={phone}
        onChangeText={setPhone}
        placeholder="e.g. 0803 000 0000"
        keyboardType="phone-pad"
      />
      <PrimaryButton
        label="Save contact"
        onPress={handleSave}
        loading={saving}
      />
    </Screen>
  );
}
