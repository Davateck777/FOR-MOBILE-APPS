import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabs} from './MainTabs';
import {AddTransactionScreen} from '../screens/Transactions/AddTransactionScreen';
import {AddContactScreen} from '../screens/Ledger/AddContactScreen';
import {ContactDetailScreen} from '../screens/Ledger/ContactDetailScreen';
import {AddLedgerEntryScreen} from '../screens/Ledger/AddLedgerEntryScreen';
import {SetPinScreen} from '../screens/Settings/SetPinScreen';
import {colors} from '../theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.surface},
        headerTintColor: colors.text,
        headerTitleStyle: {fontWeight: '700'},
      }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{title: 'Add transaction', presentation: 'modal'}}
      />
      <Stack.Screen
        name="AddContact"
        component={AddContactScreen}
        options={{title: 'Add contact', presentation: 'modal'}}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{title: 'Contact'}}
      />
      <Stack.Screen
        name="AddLedgerEntry"
        component={AddLedgerEntryScreen}
        options={{title: 'Add ledger entry', presentation: 'modal'}}
      />
      <Stack.Screen
        name="SetPin"
        component={SetPinScreen}
        options={{title: 'App lock', presentation: 'modal'}}
      />
    </Stack.Navigator>
  );
}
