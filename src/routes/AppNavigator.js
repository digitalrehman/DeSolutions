import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectIsAuthenticated, restoreSession } from '@store/slices/authSlice';

// Screens
import LoginScreen from '@screens/auth/LoginScreen';
import MainScreen from '@screens/MainScreen';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import ApprovalsScreen from '@screens/approvals/ApprovalsScreen';
import SalesScreen from '@screens/sales/SalesScreen';
import PurchaseScreen from '@screens/purchase/PurchaseScreen';
import InventoryScreen from '@screens/inventory/InventoryScreen';
import HCMScreen from '@screens/hcm/HCMScreen';
import ManufacturingScreen from '@screens/manufacturing/ManufacturingScreen';
import CRMScreen from '@screens/crm/CRMScreen';
import FinanceScreen from '@screens/finance/FinanceScreen';
import { LoadingSpinner, CustomHeader } from '@components/common';

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
          header: props => <CustomHeader {...props} />,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              initialRouteName="MainScreen"
              name="MainScreen"
              component={MainScreen}
            />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Approvals" component={ApprovalsScreen} />
            <Stack.Screen name="Sales" component={SalesScreen} />
            <Stack.Screen name="Purchase" component={PurchaseScreen} />
            <Stack.Screen name="Inventory" component={InventoryScreen} />
            <Stack.Screen name="HCM" component={HCMScreen} />
            <Stack.Screen
              name="Manufacturing"
              component={ManufacturingScreen}
            />
            <Stack.Screen name="CRM" component={CRMScreen} />
            <Stack.Screen name="Finance" component={FinanceScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
