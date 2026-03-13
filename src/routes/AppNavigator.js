import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectIsAuthenticated, restoreSession } from '@store/slices/authSlice';
import { View } from 'react-native';

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
import AccountDetailScreen from '@screens/dashboard/AccountDetailScreen';
import LedgerScreen from '@components/ledger/LedgerScreen';
import CustomerAgingScreen from '@components/aging/CustomerAgingScreen';
import CustomerBalanceDetailsScreen from '@components/aging/CustomerBalanceDetailsScreen';
import FinancialDetailScreen from '@screens/dashboard/FinancialDetailScreen';
import InventoryValuationScreen from '@screens/dashboard/InventoryValuationScreen';
import { LoadingSpinner, CustomHeader, DimensionDropdown } from '@components/common';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = React.useState(true);

  // Restore session on app start
  useEffect(() => {
    const restoreUserSession = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const company = await AsyncStorage.getItem('company');

        if (userJson) {
          const user = JSON.parse(userJson);
          dispatch(restoreSession({ user, company }));
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
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
            />
            <Stack.Screen
              name="AccountDetail"
              component={AccountDetailScreen}
            />
            <Stack.Screen name="Ledger" component={LedgerScreen} />
            <Stack.Screen
              name="CustomerAging"
              component={CustomerAgingScreen}
            />
            <Stack.Screen
              name="CustomerBalanceDetails"
              component={CustomerBalanceDetailsScreen}
            />
            <Stack.Screen
              name="FinancialDetail"
              component={FinancialDetailScreen}
            />
            <Stack.Screen
              name="InventoryValuation"
              component={InventoryValuationScreen}
            />
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
