import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@config/useTheme';

const SalesNewOrdersScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  
  const CurrentUser = useSelector(state => state.auth.user);
  const company = useSelector(state => state.auth.company);
  
  const day = moment().format('dddd');

  const [AllOrders, setAllOrders] = useState([]);
  const [Loader, setLoader] = useState(true);
  const [Search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loadermore, setLoadMore] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, []);

  const filteredOrders = AllOrders?.filter(val =>
    val?.name?.toLowerCase()?.includes(Search.toLowerCase()),
  ).slice(0, 50);

  const getAllOrders = async () => {
    setLoader(true);
    let datas = new FormData();
    // Use the theme/API specific fields
    datas.append('company', company?.trim()?.toUpperCase());
    datas.append('user_id', CurrentUser?.company_user_id || CurrentUser?.user_id || '');
    
    // User provided fields from the prompt
    datas.append('dim_id', CurrentUser?.dim_id || '');
    datas.append('area_code', CurrentUser?.area_code || '');
    datas.append('role_id', CurrentUser?.role_id || '');
    datas.append('week_day', day);
    datas.append('customer_status', 0);
    datas.append('page', page);

    try {
      const res = await axios.post(`${API_BASE_URL}portal/debtors_master.php`, datas, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let responseData = res.data;
      if (typeof responseData === 'string') {
         const match = responseData.match(/(\{|\[)[\s\S]*(\}|\])/);
         if (match) responseData = JSON.parse(match[0]);
      }

      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        const newData = [...responseData.data];
        const uniqueOrders = newData.filter(
          (order, index, self) =>
            index === self.findIndex(o => o.debtor_no === order.debtor_no || o.debtor_ref === order.debtor_ref),
        );

        setAllOrders(uniqueOrders.slice(0, 50));
        await AsyncStorage.setItem(
          'GetAllCustomersSales',
          JSON.stringify(responseData.data),
        );
      } else if (Array.isArray(responseData)) {
        setAllOrders(responseData.slice(0, 50));
      }
    } catch (err) {
      console.log('Error fetching orders:', err);
      const offlineData = await AsyncStorage.getItem('GetAllCustomersSales');
      if (offlineData) setAllOrders(JSON.parse(offlineData));
    } finally {
      setLoader(false);
    }
  };

  const loaderMoreData = async () => {
    if (loadermore) return;
    setLoadMore(true);
    let datas = new FormData();
    datas.append('company', company?.trim()?.toUpperCase());
    datas.append('user_id', CurrentUser?.company_user_id || CurrentUser?.user_id || '');
    datas.append('dim_id', CurrentUser?.dim_id || '');
    datas.append('area_code', CurrentUser?.area_code || '');
    datas.append('role_id', CurrentUser?.role_id || '');
    datas.append('week_day', day);
    datas.append('customer_status', 0);
    datas.append('page', page + 1);

    try {
      const res = await axios.post(`${API_BASE_URL}portal/debtors_master.php`, datas, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let responseData = res.data;
      if (typeof responseData === 'string') {
         const match = responseData.match(/(\{|\[)[\s\S]*(\}|\])/);
         if (match) responseData = JSON.parse(match[0]);
      }

      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        const newData = [...responseData.data];
        const allOrders = [...AllOrders, ...newData];
        const uniqueOrders = allOrders.filter(
          (order, index, self) =>
            index === self.findIndex(o => o.debtor_no === order.debtor_no || o.debtor_ref === order.debtor_ref),
        );

        setAllOrders(uniqueOrders.slice(0, 50));
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.log('Pagination error:', err);
    } finally {
      setLoadMore(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Top Row: Name and Phone */}
      <View style={styles.cardHeader}>
        <View style={styles.iconRow}>
          <Ionicons name="person-outline" size={18} color={theme.colors.text} />
          <Text style={styles.customerName}>{item.name ? item.name.replace(/&amp;/g, '&') : 'Test-Hasaan'}</Text>
        </View>
        <View style={styles.iconRow}>
          <Ionicons name="call-outline" size={18} color={theme.colors.text} />
          <Text style={styles.customerPhone}>{item.contact_no || item.phone || '03000096347'}</Text>
        </View>
      </View>

      {/* Address Row */}
      <View style={[styles.iconRow, { marginTop: 8 }]}>
        <Ionicons name="location-outline" size={18} color={theme.colors.text} />
        <Text style={styles.customerAddress}>{item.city || item.address || 'Abc'}</Text>
      </View>

      {/* Buttons Row 1 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('HCMOrderForm', { customer: item, mode: 'Order' })}
          style={styles.gradientButton}>
          <LinearGradient
            colors={[theme.colors.primary, '#F39C12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientInside}>
            <Text style={styles.buttonText}>Take Order</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('HCMOrderForm', { customer: item, mode: 'Return' })}
          style={styles.gradientButton}>
          <LinearGradient
            colors={[theme.colors.primary, '#F39C12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientInside}>
            <Text style={styles.buttonText}>Return</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Buttons Row 2 + Stats */}
      <View style={styles.bottomRow}>
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={() => navigation.navigate('HCMPaymentScreen', { customer: item })}
        >
          <LinearGradient
            colors={[theme.colors.primary, '#F39C12']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.paymentGradient}>
            <Text style={styles.buttonText}>Payment</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Order</Text>
            <Text style={styles.statValue}>{item.last_order_date || 'N/A'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Outstand</Text>
            <Text style={styles.statValue}>{item.outstanding ?? '0.00'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Due</Text>
            <Text style={[styles.statValue, {color: theme.colors.error}]}>{item.due ?? '0.00'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header with Search and Add Button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 15,
          paddingTop: Platform.OS === 'ios' ? insets.top + 10 : insets.top + 30,
          backgroundColor: theme.colors.primary,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerIconButton}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <LinearGradient
          colors={['#F39C12', '#F1C40F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.searchBarGradient}>
          <Ionicons
            name="search"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#fff"
            style={styles.searchInput}
            onChangeText={txt => setSearch(txt)}
            value={Search}
          />
        </LinearGradient>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HCMInsertNewCustomer', {
              onSuccess: () => getAllOrders(),
            })
          }
          style={styles.headerIconButton}>
          <Ionicons name="person-add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {Loader ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* Fallback ActivityIndicator if Lottie isn't loaded */}
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredOrders}
            renderItem={renderItem}
            keyExtractor={(item, index) => (item.debtor_no || index) + '-' + index}
            onEndReached={loaderMoreData}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Record Found</Text>
              </View>
            )}
            ListFooterComponent={() =>
              loadermore ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
};

export default SalesNewOrdersScreen;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerIconButton: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 3,
  },
  searchBarGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    padding: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginLeft: 6,
    flex: 1,
  },
  customerPhone: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: 6,
  },
  customerAddress: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  gradientButton: {
    width: '48%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientInside: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  paymentButton: {
    width: '30%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentGradient: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    color: theme.colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
