import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const group1 = [
  {
    id: 3,
    title: 'ATTENDANCE',
    icon: 'finger-print-outline',
    color: '#f59e0b',
  },
  { id: 4, title: 'TODAYS PLAN', icon: 'calendar-outline', color: '#8b5cf6' },
];

const group2 = [
  { id: 1, title: 'CONTACT', icon: 'call-outline', color: '#3b82f6' },
  { id: 2, title: 'HOSPITAL', icon: 'medkit-outline', color: '#10b981' },
];

const group3 = [
  { id: 5, title: 'NEW ORDERS', icon: 'cart-outline', color: '#ef4444' },
  { id: 6, title: 'ORDER STATUS', icon: 'analytics-outline', color: '#0ea5e9' },
  { id: 7, title: 'SHIPPING INFO', icon: 'car-outline', color: '#14b8a6' },
  {
    id: 8,
    title: 'CUSTOMER BALANCES',
    icon: 'wallet-outline',
    color: '#f97316',
  },
];

const group4 = [
  { id: 9, title: 'SAMPLE REQUEST', icon: 'gift-outline', color: '#ec4899' },
  { id: 10, title: 'FIELD EXPENSE', icon: 'cash-outline', color: '#84cc16' },
  {
    id: 11,
    title: 'SALES VS TARGET',
    icon: 'trending-up-outline',
    color: '#6366f1',
  },
  { id: 12, title: 'NEW ORDER', icon: 'add-circle-outline', color: '#10b981' },
];

const SaleManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handlePress = item => {
    if (item.title === 'NEW ORDERS' || item.title === 'NEW ORDER') {
      navigation.navigate('SalesNewOrders');
    }
  };

  const renderTile = item => (
    <TouchableOpacity
      key={item.id}
      style={styles.tile}
      activeOpacity={0.7}
      onPress={() => handlePress(item)}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + '1A' }]}
      >
        <Icon name={item.icon} size={26} color={item.color} />
      </View>
      <Text style={styles.tileText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.box}>{group1.map(renderTile)}</View>

        <View style={styles.box}>{group2.map(renderTile)}</View>

        <View style={styles.box}>{group3.map(renderTile)}</View>

        <View style={styles.box}>{group4.map(renderTile)}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      ...theme.shadows.md,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    box: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 16,
      ...theme.shadows.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tile: {
      width: '48%',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    tileText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
  });

export default SaleManagementScreen;
