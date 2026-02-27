import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { DateFilter, LoadingSpinner } from '@components/common';
import { useGetGLAccountInquiryMutation } from '@api/ledgerApi';

const { width, height } = Dimensions.get('window');

const LedgerScreen = ({ route, navigation }) => {
  const { account, title, fromDate: pFromDate, toDate: pToDate } = route.params;
  const { theme } = useTheme();

  // Screen is meant to be viewed in landscape.
  // For now, we use a rotation transform to simulate landscape if the library is not installed.
  // Or simply design it to be wide and scrollable.

  const [getGLAccountInquiry, { isLoading }] = useGetGLAccountInquiryMutation();
  const [fromDate, setFromDate] = useState(
    pFromDate ? new Date(pFromDate) : null,
  );
  const [toDate, setToDate] = useState(pToDate ? new Date(pToDate) : null);
  const [ledgerData, setLedgerData] = useState([]);
  const [opening, setOpening] = useState('0');

  useEffect(() => {
    if (!fromDate && !toDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      setFromDate(thirtyDaysAgo);
      setToDate(today);
      fetchData(thirtyDaysAgo, today);
    } else {
      fetchData(fromDate, toDate);
    }
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
      const response = await getGLAccountInquiry({
        from_date: formatDateForAPI(start),
        to_date: formatDateForAPI(end),
        account: account,
      }).unwrap();

      if (response && response.status === 'true') {
        setLedgerData(response.data || []);
        setOpening(response.opening || '0');
      } else {
        setLedgerData([]);
        setOpening('0');
      }
    } catch (error) {
      console.log('Ledger fetch error:', error);
      setLedgerData([]);
    }
  };

  const handleApplyFilter = () => {
    fetchData(fromDate, toDate);
  };

  const calculateClosing = () => {
    const openNum = parseFloat(opening || 0);
    const transSum = ledgerData.reduce(
      (acc, item) => acc + parseFloat(item.amount || 0),
      0,
    );
    return (openNum + transSum).toLocaleString();
  };

  const s = getStyles(theme);

  const renderHeader = () => (
    <View style={s.summaryContainer}>
      <View style={[s.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[s.summaryLabel, { color: theme.colors.textSecondary }]}>
          Opening Balance
        </Text>
        <Text style={[s.summaryValue, { color: theme.colors.primary }]}>
          {parseFloat(opening).toLocaleString()}
        </Text>
      </View>
      <View style={[s.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[s.summaryLabel, { color: theme.colors.textSecondary }]}>
          Closing Balance
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
        style={[s.cell, s.cellDate, s.headerText, { color: theme.colors.text }]}
      >
        Date
      </Text>
      <Text
        style={[s.cell, s.cellRef, s.headerText, { color: theme.colors.text }]}
      >
        Reference
      </Text>
      <Text
        style={[s.cell, s.cellMemo, s.headerText, { color: theme.colors.text }]}
      >
        Memo
      </Text>
      <Text
        style={[
          s.cell,
          s.cellAmount,
          s.headerText,
          { color: theme.colors.text },
        ]}
      >
        Amount
      </Text>
      <Text
        style={[
          s.cell,
          s.cellBalance,
          s.headerText,
          { color: theme.colors.text },
        ]}
      >
        Balance
      </Text>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.fixedHeader}>
        <DateFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDate={setFromDate}
          onToDate={setToDate}
          onFilter={handleApplyFilter}
        />
        <Text style={[s.title, { color: theme.colors.text }]}>
          {title} Ledger
        </Text>
        {renderHeader()}
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <TableHeader />
            <ScrollView style={s.tableScroll}>
              {ledgerData.length > 0 ? (
                ledgerData.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      s.tableRow,
                      { borderBottomColor: theme.colors.border },
                      index % 2 === 0 && {
                        backgroundColor: theme.colors.surface + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[s.cell, s.cellDate, { color: theme.colors.text }]}
                    >
                      {item.doc_date}
                    </Text>
                    <Text
                      style={[
                        s.cell,
                        s.cellRef,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {item.reference}
                    </Text>
                    <Text
                      style={[s.cell, s.cellMemo, { color: theme.colors.text }]}
                      numberOfLines={2}
                    >
                      {item.memo}
                    </Text>
                    <Text
                      style={[
                        s.cell,
                        s.cellAmount,
                        {
                          color:
                            parseFloat(item.amount) >= 0
                              ? theme.colors.success
                              : theme.colors.error,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {parseFloat(item.amount).toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        s.cell,
                        s.cellBalance,
                        { color: theme.colors.text, fontWeight: '600' },
                      ]}
                    >
                      {parseFloat(item.balance).toLocaleString()}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={s.emptyContainer}>
                  <Text style={{ color: theme.colors.textSecondary }}>
                    No transactions found.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    fixedHeader: {
      padding: 15,
    },
    title: {
      fontSize: 18,
      fontWeight: '800',
      marginVertical: 10,
      textAlign: 'center',
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    summaryCard: {
      flex: 0.48,
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 2,
    },
    summaryLabel: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '800',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      width: 800, // Fixed width for horizontal scroll to mimic landscape
    },
    tableHeader: {
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    headerText: {
      fontWeight: '800',
      fontSize: 13,
    },
    cell: {
      fontSize: 12,
      paddingHorizontal: 5,
    },
    cellDate: { width: 90 },
    cellRef: { width: 120 },
    cellMemo: { flex: 1 },
    cellAmount: { width: 100, textAlign: 'right' },
    cellBalance: { width: 110, textAlign: 'right' },
    tableScroll: {
      flex: 1,
    },
    emptyContainer: {
      width: 800,
      padding: 40,
      alignItems: 'center',
    },
  });

export default LedgerScreen;
