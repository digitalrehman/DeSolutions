import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectIsAuthenticated, restoreSession } from '@store/slices/authSlice';

// Screens
import LoginScreen from '@screens/auth/LoginScreen';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import { LoadingSpinner } from '@components/common';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator - Main navigation setup
 * Handles auth and main app navigation
 */
const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = React.useState(true);

  // Restore session on app start
  useEffect(() => {
    const restoreUserSession = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');

        if (userJson) {
          const user = JSON.parse(userJson);
          dispatch(restoreSession({ user, token }));
        }
      } catch (error) {
        console.log('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUserSession();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Main App Stack
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
