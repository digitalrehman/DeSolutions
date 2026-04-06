import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import Toast from 'react-native-toast-message';

const VOUCHER_TYPES = [
  { id: 0, title: "Journal Entry", icon: "document-text-outline" },
  { id: 1, title: "Bank Payment", icon: "cash-outline" },
  { id: 2, title: "Bank Deposit", icon: "wallet-outline" },
  { id: 41, title: "Cash Payment", icon: "cash-outline" },
  { id: 42, title: "Cash Receipt", icon: "receipt-outline" },
  { id: 4, title: "Funds Transfer", icon: "swap-horizontal-outline" },
  { id: 10, title: "Sales Invoice", icon: "document-outline" },
  { id: 11, title: "Customer Credit Note", icon: "return-down-back-outline" },
  { id: 12, title: "Customer Payment", icon: "card-outline" },
  { id: 13, title: "Delivery Note", icon: "car-outline" },
  { id: 16, title: "Location Transfer", icon: "location-outline" },
  { id: 17, title: "Inventory Adjustment", icon: "construct-outline" },
  { id: 20, title: "Supplier Invoice", icon: "document-text-outline" },
  { id: 21, title: "Supplier Credit Note", icon: "return-down-forward-outline" },
  { id: 43, title: "Import Invoice", icon: "airplane-outline" },
  { id: 22, title: "Supplier Payment", icon: "card-outline" },
  { id: 25, title: "GRN", icon: "cube-outline" },
  { id: 26, title: "Work Order", icon: "hammer-outline" },
  { id: 28, title: "Work Order Issue", icon: "arrow-redo-outline" },
  { id: 29, title: "Work Order Production", icon: "cog-outline" },
  { id: 35, title: "Cost Update", icon: "pricetag-outline" },
];

const VoidTransactionsScreen = () => {
  const { theme } = useTheme();

  const handleVoucherPress = async (voucherId) => {
    // TODO: Connect RTK Query API here
    // Example:
    // const formData = new FormData();
    // formData.append('no', voucherId);
    // await postVoucherData(formData);
    
    Toast.show({
      type: 'info',
      text1: 'API Call Pending',
      text2: `Sending Post Request with No: ${voucherId}`,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Void Transactions</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Select a transaction type to void</Text>
        </View>
        <View style={styles.grid}>
          {VOUCHER_TYPES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
              ]}
              activeOpacity={0.7}
              onPress={() => handleVoucherPress(item.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
                <Icon name={item.icon || 'document-outline'} size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VoidTransactionsScreen;
