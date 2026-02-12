import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';
import store from './src/store';
import AppNavigator from './src/routes/AppNavigator';

import { ThemeProvider } from './src/config/ThemeContext';
import { useTheme } from './src/config/useTheme';

const AppContent = () => {
  const { theme } = useTheme();

  React.useEffect(() => {
    const init = async () => {
      // …do some stuff (fetch some data, etc.)
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={
          theme.name === 'Arctic White' ? 'dark-content' : 'light-content'
        }
        backgroundColor={theme.colors.background}
      />
      <AppNavigator />
      <Toast />
    </SafeAreaProvider>
  );
};

/**
 * App - Root component
 * Sets up Redux, Navigation, and Toast notifications
 */
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
