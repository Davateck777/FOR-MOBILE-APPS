import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DashboardScreen} from '../screens/Dashboard/DashboardScreen';
import {TransactionsScreen} from '../screens/Transactions/TransactionsScreen';
import {LedgerScreen} from '../screens/Ledger/LedgerScreen';
import {ReportsScreen} from '../screens/Reports/ReportsScreen';
import {SettingsScreen} from '../screens/Settings/SettingsScreen';
import {colors} from '../theme';
import type {MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  Dashboard: '🏠',
  Transactions: '💵',
  Ledger: '📒',
  Reports: '📊',
  Settings: '⚙️',
};

function TabIcon({routeName}: {routeName: keyof MainTabParamList}) {
  return <Text>{ICONS[routeName]}</Text>;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerTitleAlign: 'left',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: () => (
          <TabIcon routeName={route.name as keyof MainTabParamList} />
        ),
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'BookKeeper'}}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{title: 'Transactions'}}
      />
      <Tab.Screen
        name="Ledger"
        component={LedgerScreen}
        options={{title: 'Ledger'}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{title: 'Reports'}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
    </Tab.Navigator>
  );
}
