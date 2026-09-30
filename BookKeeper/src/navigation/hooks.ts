import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';

/**
 * Screens rendered inside the bottom-tab navigator still need to be able to
 * push root-level stack screens (AddTransaction, AddContact, ContactDetail,
 * SetPin, ...). React Navigation supports this natively — the nested
 * `navigate()` call bubbles up to the parent stack — this hook just gives
 * us a correctly-typed navigation object to call it with.
 */
export function useRootNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
