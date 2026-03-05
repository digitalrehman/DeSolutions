import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import { useTheme } from '@config/useTheme';
import { DateFilter, LoadingSpinner } from '@components/common';
import { useGetCustomerBalanceDetailsMutation } from '@api/ledgerApi';
import { useSelector } from 'react-redux';

const CustomerBalanceDetailsScreen = ({ route, navigation }) => {
  const { customerId, customerName } = route.params;
  const { theme } = useTheme();
  const company = useSelector(state => state.auth.company);

  const [getCustomerBalanceDetails, { isLoading }] = useGetCustomerBalanceDetailsMutation();
  const [balanceData, setBalanceData] = useState([]);
  const [opening, setOpening] = useState('0');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    const decodedName = customerName ? customerName.replace(/&amp;/g, '&') : 'Balance Details';
    const truncatedName =
      decodedName.length > 25
        ? decodedName.substring(0, 22) + '...'
        : decodedName;
    navigation.setOptions({
      title: truncatedName,
    });
  }, [navigation, customerName]);

  useEffect(() => {
    Orientation.lockToLandscape();

    // Set default one month range
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    setFromDate(thirtyDaysAgo);
    setToDate(today);

    fetchData(thirtyDaysAgo, today);

    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const formatDateForAPI = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchData = async (start, end) => {
    try {
      const response = await getCustomerBalanceDetails({
        company: company,
        customer_id: customerId,
        from_date: formatDateForAPI(start),
        to_date: formatDateForAPI(end),
      }).unwrap();

      if (response && response.status_cust_age === 'true') {
        setBalanceData(response.data_cust_age || []);
        setOpening(response.opening || '0');
      } else {
        setBalanceData([]);
        setOpening('0');
      }
    } catch (error) {
      console.log('Customer balance details fetch error:', error);
      setBalanceData([]);
      setOpening('0');
    }
  };

  const handleApplyFilter = () => {
    fetchData(fromDate, toDate);
  };

  const calculateClosing = () => {
    const openNum = parseFloat(opening || 0);
    const transSum = balanceData.reduce((acc, item) => {
      const debit = parseFloat(item.debit || 0);
      const credit = parseFloat(item.credit || 0);
      return acc + (debit !== 0 ? debit : -credit);
    }, 0);
    return (openNum + transSum).toLocaleString();
  };

  const s = getStyles(theme);

  const renderHeader = () => (
    <View style={s.summaryContainer}>
      <View style={[s.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[s.summaryLabel, { color: theme.colors.textSecondary }]}>
          Opening
        </Text>
        <Text style={[s.summaryValue, { color: theme.colors.primary }]}>
          {parseFloat(opening).toLocaleString()}
        </Text>
      </View>
      <View style={[s.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[s.summaryLabel, { color: theme.colors.textSecondary }]}>
          Closing
        </Text>
        <Text style={[s.summaryValue, { color: theme.colors.success }]}>
          {calculateClosing()}
        </Text>
      </View>
    </View>
  );

  const TableHeader = () => (
    <View
      style={[
        s.tableRow,
        s.tableHeader,
        { backgroundColor: theme.colors.primary + '20' },
      ]}
    >
      <Text
        style={[s.cell, s.cellReference, s.headerText, { color: theme.colors.text }]}
      >
        Reference
      </Text>
      <Text
        style={[s.cell, s.cellDate, s.headerText, { color: theme.colors.text }]}
      >
        Date
      </Text>
      <Text
        style={[s.cell, s.cellDebit, s.headerText, { color: theme.colors.text }]}
      >
        Debit
      </Text>
      <Text
        style={[s.cell, s.cellCredit, s.headerText, { color: theme.colors.text }]}
      >
        Credit
      </Text>
      <Text
        style={[s.cell, s.cellBalance, s.headerText, { color: theme.colors.text }]}
      >
        Balance
      </Text>
    </View>
  );

  const renderItemRow = (item, index, isNested = false) => (
    <View
      style={[
        s.tableRow,
        { borderBottomColor: theme.colors.border },
        index % 2 === 0 && !isNested && {
          backgroundColor: theme.colors.surface + '10',
        },
        isNested && { backgroundColor: theme.colors.primary + '05' },
      ]}
    >
      <View style={[s.cell, s.cellReference]}>
        <Text style={{ color: theme.colors.text, fontSize: isNested ? 10 : 11, fontStyle: isNested ? 'italic' : 'normal' }}>
          {isNested ? `  ↳ ${item.description}` : item.reference}
        </Text>
      </View>
      <View style={[s.cell, s.cellDate]}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: isNested ? 10 : 11 }}>
          {isNested ? '' : item.tran_date}
        </Text>
      </View>
      <View style={[s.cell, s.cellDebit]}>
        <Text
          style={{
            color: isNested ? theme.colors.textSecondary : parseFloat(item.debit || 0) !== 0 ? theme.colors.error : theme.colors.textSecondary,
            fontSize: isNested ? 10 : 11,
            fontWeight: isNested ? '400' : '600',
          }}
        >
          {isNested ? item.unit_price : parseFloat(item.debit || 0) !== 0 ? parseFloat(item.debit).toLocaleString() : '-'}
        </Text>
      </View>
      <View style={[s.cell, s.cellCredit]}>
        <Text
          style={{
            color: isNested ? theme.colors.textSecondary : parseFloat(item.credit || 0) !== 0 ? theme.colors.success : theme.colors.textSecondary,
            fontSize: isNested ? 10 : 11,
            fontWeight: isNested ? '400' : '600',
          }}
        >
          {isNested ? `Qty: ${item.quantity}` : parseFloat(item.credit || 0) !== 0 ? parseFloat(item.credit).toLocaleString() : '-'}
        </Text>
      </View>
      <View style={[s.cell, s.cellBalance]}>
        <Text
          style={{
            color: isNested ? theme.colors.textSecondary : theme.colors.text,
            fontSize: isNested ? 10 : 11,
            fontWeight: isNested ? '400' : '700',
          }}
        >
          {isNested ? `Disc: ${item.discount_percent}%` : parseFloat(item.balance || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderRow = ({ item, index }) => {
    const hasItems = item.items && item.items.length > 0;
    
    return (
      <View>
        {/* Main Transaction Row */}
        {renderItemRow(item, index)}
        
        {/* Nested Items Rows */}
        {hasItems && item.items.map((nestedItem, nestedIndex) => (
          <View key={`${index}-nested-${nestedIndex}`}>
            {renderItemRow(nestedItem, nestedIndex, true)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={balanceData}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          style={s.mainScroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={true}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          ListHeaderComponent={
            <View>
              {/* Header section with Date Filter */}
              <View style={s.scrollableHeader}>
                <View style={s.headerRow}>
                  <DateFilter
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDate={setFromDate}
                    onToDate={setToDate}
                    onFilter={handleApplyFilter}
                  />
                </View>
                {renderHeader()}
              </View>

              {/* Table section header */}
              <View
                style={[
                  s.tableContainer,
                  { marginBottom: 0, borderBottomWidth: 0 },
                ]}
              >
                <TableHeader />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <Text style={{ color: theme.colors.textSecondary }}>
                No balance details found.
              </Text>
            </View>
          }
          CellRendererComponent={({ children, style, ...props }) => (
            <View
              {...props}
              style={[
                style,
                {
                  marginHorizontal: 15,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              {children}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mainScroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    scrollableHeader: {
      paddingHorizontal: 15,
      paddingTop: 10,
    },
    headerRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    summaryCard: {
      flex: 0.49,
      padding: 8,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    summaryLabel: {
      fontSize: 10,
      fontWeight: '600',
      marginBottom: 2,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '800',
    },
    tableContainer: {
      flex: 1,
      marginHorizontal: 15,
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
    },
    tableHeader: {
      borderBottomWidth: 2,
    },
    headerText: {
      fontWeight: '800',
      fontSize: 11,
    },
    cell: {
      paddingHorizontal: 4,
      justifyContent: 'center',
    },
    cellReference: { width: '30%', paddingLeft: 5 },
    cellDate: { width: '15%' },
    cellDebit: { width: '18%', alignItems: 'flex-end' },
    cellCredit: { width: '18%', alignItems: 'flex-end' },
    cellBalance: { width: '19%', alignItems: 'flex-end' },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
    },
  });

export default CustomerBalanceDetailsScreen;
