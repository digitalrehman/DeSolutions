import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { LoadingSpinner } from '@components/common';
import { useSelector } from 'react-redux';
import { useGetViewDataMutation, useGetViewGLMutation } from '@api/voidApi';
import Toast from 'react-native-toast-message';

const VoidTransactionDetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { trans_no, type, title } = route.params;
  const company = useSelector((state) => state.auth.company);

  const [showGL, setShowGL] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [glData, setGLData] = useState(null);

  const [getViewData, { isLoading: isDataLoading }] = useGetViewDataMutation();
  const [getViewGL, { isLoading: isGLLoading }] = useGetViewGLMutation();

  useEffect(() => {
    fetchDetails();
  }, [trans_no, type, company]);

  const fetchDetails = async () => {
    try {
      const payload = { company, trans_no, type };
      console.log('Fetching details with payload:', payload);
      
      const [dataRes, glRes] = await Promise.all([
        getViewData(payload).unwrap(),
        getViewGL(payload).unwrap(),
      ]);

      console.log('--- API Responses ---');
      console.log('Transaction Data Raw:', dataRes);
      console.log('GL Data Raw:', glRes);
      console.log('Transaction Status Header Value:', dataRes?.status_header, 'Type:', typeof dataRes?.status_header);
      console.log('GL Status Header Value:', glRes?.status_header, 'Type:', typeof glRes?.status_header);

      if (dataRes && (dataRes.status_header === 'true' || dataRes.status_header === true)) {
        console.log('SUCCESS: Setting transaction data...');
        setTransactionData(dataRes);
      } else {
        console.log('FAILURE: Transaction status_header was not true.');
      }

      if (glRes && (glRes.status_header === 'true' || glRes.status_header === true)) {
        console.log('SUCCESS: Setting GL data...');
        setGLData(glRes);
      } else {
        console.log('FAILURE: GL status_header was not true.');
      }
    } catch (error) {
      console.log('Detail Fetch Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load transaction details.',
      });
    }
  };

  const renderHeaderField = (label, value) => {
    if (!value && value !== 0) return null;
    return (
      <View style={styles.fieldRow}>
        <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>{label}:</Text>
        <Text style={[styles.fieldValue, { color: theme.colors.text }]}>{value}</Text>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <TouchableOpacity
        style={[
          styles.tab,
          !showGL && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        ]}
        onPress={() => setShowGL(false)}
      >
        <Icon name="document-text-outline" size={18} color={!showGL ? '#FFF' : theme.colors.textSecondary} />
        <Text style={[styles.tabText, { color: !showGL ? '#FFF' : theme.colors.textSecondary }]}>Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          showGL && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
        ]}
        onPress={() => setShowGL(true)}
      >
        <Icon name="swap-horizontal-outline" size={18} color={showGL ? '#FFF' : theme.colors.textSecondary} />
        <Text style={[styles.tabText, { color: showGL ? '#FFF' : theme.colors.textSecondary }]}>GL View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransactionView = () => {
    console.log('Rendering Transaction View. transactionData:', transactionData);
    if (!transactionData || !transactionData.data_header?.[0]) {
      console.log('No transaction data or header found.');
      return null;
    }
    const header = transactionData.data_header[0];
    const details = transactionData.data_detail || [];

    const decodeHtml = (html) => {
      if (!html) return '';
      return html
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ');
    };

    return (
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {renderHeaderField('Reference', header.reference)}
          {renderHeaderField('Date', header.trans_date)}
          {renderHeaderField('Due Date', header.due_date)}
          {renderHeaderField('Type', header.type)}
          {renderHeaderField('Name', header.name)}
          {renderHeaderField('Location', header.location_name)}
          {renderHeaderField('Salesman', header.salesman)}
          {renderHeaderField('Customer Ref', header.customer_ref)}
          {renderHeaderField('Payment Terms', header.payment_terms)}
          {renderHeaderField('Total', header.total)}
          {renderHeaderField('Discount', header.discount)}
          {header.comments && (
             <View style={styles.commentBox}>
               <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Comments:</Text>
               <Text style={[styles.commentText, { color: theme.colors.text }]}>{header.comments}</Text>
             </View>
          )}
        </View>

        {details.length > 0 && (
          <View style={styles.itemTable}>
            <Text style={[styles.subHeading, { color: theme.colors.text }]}>Item Details</Text>
            <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: theme.colors.primary + '10' }]}>
              <Text style={[styles.tableHeaderCell, { flex: 2, color: theme.colors.textSecondary }]}>Description</Text>
              <Text style={[styles.tableHeaderCell, { flex: 0.8, textAlign: 'center', color: theme.colors.textSecondary }]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right', color: theme.colors.textSecondary }]}>Price</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right', color: theme.colors.textSecondary }]}>Total</Text>
            </View>
            {details.map((item, index) => {
              const qty = parseFloat(item.quantity) || 0;
              const price = parseFloat(item.unit_price) || 0;
              const total = qty * price;
              
              return (
                <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border, flexDirection: 'column', alignItems: 'stretch' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.tableName, { color: theme.colors.text }]}>{decodeHtml(item.description)}</Text>
                    </View>
                    <Text style={[styles.tableCell, { flex: 0.8, textAlign: 'center', color: theme.colors.text }]}>
                      {qty}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right', color: theme.colors.text }]}>
                      {price.toLocaleString()}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'right', color: theme.colors.text, fontWeight: '700' }]}>
                      {total.toLocaleString()}
                    </Text>
                  </View>
                  {item.long_description && (
                    <Text style={[styles.tableSub, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                      {decodeHtml(item.long_description)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderGLView = () => {
    if (!glData || !glData.data_header?.[0]) return null;
    const header = glData.data_header[0];
    const details = glData.data_detail || [];

    return (
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {renderHeaderField('Reference', header.reference)}
          {renderHeaderField('Date', header.trans_date)}
          {renderHeaderField('Name', header.name)}
          {renderHeaderField('User', header.real_name)}
          {renderHeaderField('Cheque No', header.cheque_no)}
          {renderHeaderField('Cheque Date', header.cheque_date)}
          {renderHeaderField('Supp Ref', header.supp_reference)}
        </View>

        {details.length > 0 && (
          <View style={styles.glTable}>
            <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: theme.colors.primary + '10' }]}>
              <Text style={[styles.tableHeaderCell, { flex: 2, color: theme.colors.textSecondary }]}>Account</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Debit</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right', color: theme.colors.textSecondary }]}>Credit</Text>
            </View>
            {details.map((item, index) => (
              <View key={index} style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}>
                <View style={{ flex: 2 }}>
                  <Text style={[styles.tableName, { color: theme.colors.text }]}>{item.account_name}</Text>
                  <Text style={[styles.tableSub, { color: theme.colors.textSecondary }]}>{item.account}</Text>
                </View>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.success }]}>
                  {item.debit && item.debit !== 0 ? item.debit : '-'}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', color: theme.colors.error }]}>
                  {item.credit && item.credit !== 0 ? Math.abs(item.credit) : '-'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (isDataLoading || isGLLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.tabWrapperOuter}>
         {renderTabs()}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!showGL ? renderTransactionView() : renderGLView()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabWrapperOuter: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 20,
  },
  commentBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  commentText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 12,
  },
  glTable: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  itemTable: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  tableHeader: {
    paddingVertical: 10,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tableName: {
    fontSize: 12,
    fontWeight: '700',
  },
  tableSub: {
    fontSize: 10,
  },
  tableCell: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableWrapper: {
    marginTop: 10,
  }
});

export default VoidTransactionDetailScreen;
