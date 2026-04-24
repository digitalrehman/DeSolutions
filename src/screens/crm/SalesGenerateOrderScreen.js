import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'FGPH_ISB',
    address: 'Islamabad',
    outstanding: '0',
    due: '0',
    payment_terms: '1 Year',
    credit_limit: '0',
  },
  {
    id: '2',
    name: 'DGHS_Punjab',
    address: 'Lahore',
    outstanding: '0',
    due: '0',
    payment_terms: '1 Year',
    credit_limit: '0',
  },
  {
    id: '3',
    name: 'Aziz Bhatti Hospital_Gujrat',
    address: 'Gujrat',
    outstanding: '0',
    due: '0',
    payment_terms: '1 Year',
    credit_limit: '0',
  },
  {
    id: '4',
    name: 'Mayo Hospital',
    address: 'Lahore',
    outstanding: '500',
    due: '100',
    payment_terms: '6 Months',
    credit_limit: '1000',
  },
  {
    id: '5',
    name: 'Jinnah Hospital',
    address: 'Karachi',
    outstanding: '200',
    due: '0',
    payment_terms: '30 Days',
    credit_limit: '500',
  },
];

// A utility to get a random subset of an array
const getRandomSubarray = (arr, size) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
};

const CustomerCard = ({ item, theme }) => {
  const styles = getCardStyles(theme);

  // Address and Name combination
  const displayName = item.address
    ? `${item.name} , ${item.address}`
    : item.name;

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="person" size={16} color="#1f3d58" />
        </View>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {displayName}
        </Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Left Column: Details */}
        <View style={styles.detailsColumn}>
          {/* Outstanding */}
          <View style={styles.detailRow}>
            <Icon name="pie-chart" size={14} color="#3b82f6" />
            <Text style={styles.detailLabel}>OUTSTANDING</Text>
          </View>
          <Text style={styles.detailValueRed}>{item.outstanding || '0'}</Text>

          {/* Due */}
          <View style={[styles.detailRow, { marginTop: 12 }]}>
            <Icon name="warning" size={14} color="#ef4444" />
            <Text style={styles.detailLabel}>DUE</Text>
          </View>
          <Text style={styles.detailValueRed}>{item.due || '0'}</Text>

          {/* Payment Terms */}
          <View style={[styles.detailRow, { marginTop: 12 }]}>
            <Icon name="document-text" size={14} color="#10b981" />
            <Text style={styles.detailLabel}>PAYMENT TERMS</Text>
          </View>
          <Text style={styles.detailValueBlack}>
            {item.payment_terms || '0 Days'}
          </Text>

          {/* Credit Limit */}
          <View style={[styles.detailRow, { marginTop: 12 }]}>
            <Icon name="card" size={14} color="#0ea5e9" />
            <Text style={styles.detailLabel}>CREDIT LIMIT</Text>
          </View>
          <Text style={styles.detailValueBlack}>
            {item.credit_limit || '0'}
          </Text>
        </View>

        {/* Right Column: Buttons */}
        <View style={styles.actionsColumn}>
          <TouchableOpacity style={[styles.actionButton, styles.btnNewOrder]}>
            <Icon name="cart" size={16} color="#1f3d58" />
            <Text style={[styles.actionBtnText, { color: '#1f3d58' }]}>
              New Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.btnPayment]}>
            <Icon name="cash" size={16} color="#10b981" />
            <Text style={[styles.actionBtnText, { color: '#10b981' }]}>
              Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.btnReturn]}>
            <Icon name="swap-horizontal" size={16} color="#ef4444" />
            <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>
              Return
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerCol}>
          <Text style={styles.footerLabel}>LAST ORDER</Text>
          <Text style={styles.footerValueBlack}>—</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerLabel}>DATE</Text>
          <Text style={styles.footerValueBlack}>N/A</Text>
        </View>
        <View style={styles.footerCol}>
          <Text style={styles.footerLabel}>DAYS</Text>
          <Text style={styles.footerValueRed}>N/A</Text>
        </View>
      </View>
    </View>
  );
};

const SalesGenerateOrderScreen = () => {
  const { theme } = useTheme();

  // Pick some random cards from the hardcoded list
  const randomCards = useMemo(() => {
    return getRandomSubarray(MOCK_CUSTOMERS, 3);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={randomCards}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => <CustomerCard item={item} theme={theme} />}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.colors.textSecondary, marginTop: 40 }}>
            No customers found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const getCardStyles = theme =>
  StyleSheet.create({
    cardContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    header: {
      backgroundColor: '#1f3d58', // Dark blue from the image
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      flex: 1,
      lineHeight: 22,
    },
    body: {
      flexDirection: 'row',
      padding: 16,
      justifyContent: 'space-between',
    },
    detailsColumn: {
      flex: 1,
      paddingRight: 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: '#64748b',
      marginLeft: 6,
      letterSpacing: 0.5,
    },
    detailValueRed: {
      fontSize: 15,
      fontWeight: '600',
      color: '#ef4444',
      marginLeft: 20,
    },
    detailValueBlack: {
      fontSize: 15,
      fontWeight: '600',
      color: '#1e293b',
      marginLeft: 20,
    },
    actionsColumn: {
      flex: 1,
      justifyContent: 'center',
      gap: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 24,
      borderWidth: 1,
    },
    btnNewOrder: {
      borderColor: '#1f3d58',
      backgroundColor: '#f8fafc',
    },
    btnPayment: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
    },
    btnReturn: {
      borderColor: '#ef4444',
      backgroundColor: '#fef2f2',
    },
    actionBtnText: {
      fontSize: 13,
      fontWeight: '600',
      marginLeft: 6,
    },
    footer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#f1f5f9',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fafafa',
    },
    footerCol: {
      flex: 1,
      alignItems: 'center',
    },
    footerLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: '#64748b',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    footerValueBlack: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1e293b',
    },
    footerValueRed: {
      fontSize: 13,
      fontWeight: '600',
      color: '#ef4444',
    },
  });

export default SalesGenerateOrderScreen;
