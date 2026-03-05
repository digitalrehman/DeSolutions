import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { useSelector } from 'react-redux';
import {
  useGetDashReceivableMutation,
  useGetDashPayableMutation,
  useGetDashBanksMutation,
} from '@api/dashboardApi';
import { LoadingSpinner } from '@components/common';


const FinancialDetailScreen = ({ route, navigation }) => {
  const { type, title } = route.params;
  const { theme } = useTheme();
  const company = useSelector(state => state.auth.company);
  const [viewAll, setViewAll] = useState(false);
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);

  const [getReceivable, { isLoading: recLoading }] =
    useGetDashReceivableMutation();
  const [getPayable, { isLoading: payLoading }] = useGetDashPayableMutation();
  const [getBanks, { isLoading: bankLoading }] = useGetDashBanksMutation();
  console.log('FinancialDetailScreen loaded', getBanks);
  
  const isLoading = recLoading || payLoading || bankLoading;

  useEffect(() => {
    navigation.setOptions({
      title: title,
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 8 }}>
          <TouchableOpacity
            style={[
              s.headerBtn,
              { backgroundColor: theme.colors.success + '15' },
            ]}
            onPress={() => handleDownload('excel')}
            activeOpacity={0.7}
          >
            <Icon name="document-text-outline" size={18} color={theme.colors.success} />
            <Text style={[s.headerBtnText, { color: theme.colors.success }]}>Excel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.headerBtn,
              { backgroundColor: theme.colors.error + '15', marginLeft: 8 },
            ]}
            onPress={() => handleDownload('pdf')}
            activeOpacity={0.7}
          >
            <Icon name="document-outline" size={18} color={theme.colors.error} />
            <Text style={[s.headerBtnText, { color: theme.colors.error }]}>PDF</Text>
          </TouchableOpacity>
        </View>
      ),
    });
    fetchData();
  }, [type, company, theme, navigation, title]);

  const fetchData = async () => {
    try {
      let response;
      if (type === 'Receivable') {
        response = await getReceivable({ company }).unwrap();
        if (response.status_cust_bal === 'true') {
          setData(response.data_cust_bal || []);
          setFullData(response.data_view_cust_bal || []);
        }
      } else if (type === 'Payable') {
        response = await getPayable({ company }).unwrap();
        if (
          response.status_supp_bal === 'true' ||
          response.status_supp_bal_view_all === 'true'
        ) {
          setData(response.data_supp_bal || []);
          setFullData(response.data_supp_bal_view_all || []);
        }
      } else if (type === 'Cash/Bank') {
        response = await getBanks({ company }).unwrap();
        if (response.status_cash_bank === 'true') {
          setData(response.data_bank_bal || []);
          setFullData(response.data_bank_bal_view_all || []);
        }
      }
    } catch (error) {
      console.log('Fetch error:', error);
    }
  };

  const handleDownload = format => {
    // TODO: Implement download functionality
    console.log(`Download ${format} for ${type}`);
  };

  const currentList = viewAll ? fullData : data;

  const totalBalance = currentList.reduce((acc, item) => {
    const balance = parseFloat(item.Balance || item.bank_balance || '0');
    return acc + (isNaN(balance) ? 0 : balance);
  }, 0);

  const renderItemComp = ({ item, index }) => {
    const name = item.name || item.supp_name || item.bank_name;
    const balance = item.Balance || item.bank_balance || '0';
    const accountCode = item.account;
    const customerId = item.customer_id || item.person_id;
    const isBank = type === 'Cash/Bank';

    // Simple Bank Card UI
    if (isBank) {
      return (
        <TouchableOpacity
          key={index}
          style={[
            s.simpleCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => {
            if (accountCode) {
              navigation.navigate('Ledger', {
                account: accountCode,
                title: name,
              });
            }
          }}
          activeOpacity={0.7}
        >
          <View style={s.simpleCardLeft}>
            <View
              style={[
                s.simpleIconBox,
                { backgroundColor: theme.colors.primary + '15' },
              ]}
            >
              <Icon
                name="business-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={s.simpleTextCont}>
              <Text
                style={[s.simpleItemName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
          </View>
          <View style={s.simpleCardRight}>
            <Text style={[s.simpleItemAmount, { color: theme.colors.text }]}>
              {parseFloat(balance).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </Text>
            {accountCode && (
              <Icon
                name="chevron-forward"
                size={16}
                color={theme.colors.textSecondary}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }

    // Receivable/Payable Card UI with Action Buttons
    return (
      <View
        key={index}
        style={[
          s.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={s.cardRow}>
          <View style={s.cardLeft}>
            <View
              style={[
                s.iconBox,
                { backgroundColor: theme.colors.primary + '15' },
              ]}
            >
              <Icon
                name={
                  type === 'Receivable'
                    ? 'person-outline'
                    : 'people-outline'
                }
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={s.textCont}>
              <Text
                style={[s.itemName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {name}
              </Text>

            </View>
          </View>
          <View style={s.cardRight}>
            <Text style={[s.itemAmount, { color: theme.colors.text }]}>
              {parseFloat(balance).toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>

        {/* Action Buttons for Receivable/Payable */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: theme.colors.primary + '10' }]}
            onPress={() => {
              navigation.navigate('CustomerBalanceDetails', {
                customerId: customerId,
                customerName: name,
              });
            }}
            activeOpacity={0.7}
          >
            <Icon name="eye-outline" size={14} color={theme.colors.primary} />
            <Text style={[s.actionBtnText, { color: theme.colors.primary }]}>
              Detail
            </Text>
          </TouchableOpacity>

          {accountCode && (
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: theme.colors.success + '10' }]}
              onPress={() => {
                navigation.navigate('Ledger', {
                  account: accountCode,
                  title: name,
                });
              }}
              activeOpacity={0.7}
            >
              <Icon name="book-outline" size={14} color={theme.colors.success} />
              <Text style={[s.actionBtnText, { color: theme.colors.success }]}>
                Ledger
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: theme.colors.warning + '10' }]}
            onPress={() => {
              navigation.navigate('CustomerAging', {
                customerId: customerId,
                customerName: name,
              });
            }}
            activeOpacity={0.7}
          >
            <Icon name="time-outline" size={14} color={theme.colors.warning} />
            <Text style={[s.actionBtnText, { color: theme.colors.warning }]}>
              Aging
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const s = getStyles(theme);

  return (
    <View style={s.container}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={currentList}
          renderItem={renderItemComp}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          removeClippedSubviews={Platform.OS === 'android'}
          ListHeaderComponent={
            <View>
              {currentList.length > 0 && (
                <View
                  style={[
                    s.summaryCard,
                    {
                      backgroundColor: theme.colors.primary + '10',
                      borderColor: theme.colors.primary + '30',
                    },
                  ]}
                >
                  <View style={s.summaryLeft}>
                    <View
                      style={[
                        s.summaryIconBox,
                        { backgroundColor: theme.colors.primary + '20' },
                      ]}
                    >
                      <Icon
                        name="calculator-outline"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={[
                          s.summaryTitle,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Total {viewAll ? 'All' : 'Top 10'} {type}
                      </Text>
                      <Text
                        style={[
                          s.summaryAmount,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {totalBalance.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={s.header}>
                <Text style={[s.sectionTitle, { color: theme.colors.text }]}>
                  {viewAll ? 'All Records' : 'Top 10 Records'}
                </Text>
                <TouchableOpacity
                  style={[
                    s.toggleBtn,
                    { backgroundColor: theme.colors.primary + '15' },
                  ]}
                  onPress={() => setViewAll(!viewAll)}
                >
                  <Text style={[s.toggleText, { color: theme.colors.primary }]}>
                    {viewAll ? 'Show Top 10' : 'View All'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={{ color: theme.colors.textSecondary }}>
                No data found
              </Text>
            </View>
          }
        />
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
    content: {
      padding: 12,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 20,
    },
    summaryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    summaryIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 4,
    },
    summaryAmount: {
      fontSize: 22,
      fontWeight: '800',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    toggleBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    toggleText: {
      fontSize: 13,
      fontWeight: '700',
    },
    card: {
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
      padding: 10,
      ...theme.shadows?.sm,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    itemCode: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
    },
    textCont: {
      flex: 1,
    },
    itemName: {
      fontSize: 13,
      fontWeight: '600',
    },
    actionRow: {
      flexDirection: 'row',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border + '50',
      gap: 8,
    },
    actionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 8,
      gap: 4,
    },
    actionBtnText: {
      fontSize: 11,
      fontWeight: '600',
    },
    headerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      gap: 4,
    },
    headerBtnText: {
      fontSize: 12,
      fontWeight: '600',
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 12,
    },
    summaryIconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 2,
    },
    summaryAmount: {
      fontSize: 18,
      fontWeight: '800',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    toggleBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    toggleText: {
      fontSize: 12,
      fontWeight: '700',
    },
    cardRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemAmount: {
      fontSize: 14,
      fontWeight: '700',
    },
    // Simple Card Styles for Bank
    simpleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 10,
    },
    simpleCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    simpleIconBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    simpleTextCont: {
      flex: 1,
    },
    simpleItemName: {
      fontSize: 14,
      fontWeight: '700',
    },
    simpleCardRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    simpleItemAmount: {
      fontSize: 15,
      fontWeight: '800',
      marginRight: 8,
    },
    empty: {
      padding: 40,
      alignItems: 'center',
    },
    summaryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
  });

export default FinancialDetailScreen;
