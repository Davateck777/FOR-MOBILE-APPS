/**
 * BookKeeper — offline-first bookkeeping for small businesses.
 * Author: Mr Dave Adex | DAVA TECK
 */
import React, {useState} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppDataProvider, useAppData} from './src/store/AppDataContext';
import {RootNavigator} from './src/navigation/RootNavigator';
import {LockScreen} from './src/screens/Settings/LockScreen';
import {colors} from './src/theme';

function Gate() {
  const {loading, settings} = useAppData();
  const [unlocked, setUnlocked] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isLocked = settings.pinEnabled && !!settings.pinHash && !unlocked;

  if (isLocked) {
    return (
      <LockScreen
        pinHash={settings.pinHash as string}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppDataProvider>
          <Gate />
        </AppDataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
