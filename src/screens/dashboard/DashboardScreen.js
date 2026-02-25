import React, { useState } from 'react';
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
import { DateFilter } from '@components/common';
import { useSelector } from 'react-redux';
import { useGetIncomeExpenseMutation } from '@api/dashboardApi';
import {LoadingSpinner} from '@components/common';
import { useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const company = useSelector(state => state.auth.company);
  const [getIncomeExpense, { isLoading }] = useGetIncomeExpenseMutation();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // Default dates: last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setFromDate(thirtyDaysAgo);
    setToDate(today);

    // Format for API
    const formatDateForAPI = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    fetchData(formatDateForAPI(thirtyDaysAgo), formatDateForAPI(today));
  }, []);

  const fetchData = async (start, end) => {
    try {
      // Start and end are already formatted strings here
      const response = await getIncomeExpense({
        from_date: start,
        to_date: end,
        company: company,
      }).unwrap();

      if (response.status_income_det === 'true') {
        const transformedIncome = response.data_income_det.map(
          (item, index) => ({
            id: `inc-${index}`,
            title: item.name,
            amount: Math.abs(parseFloat(item.total)).toLocaleString(),
            date: '',
            icon: 'trending-up-outline',
            color: '#10B981',
          }),
        );
        setIncomeList(transformedIncome);
      }

      if (response.status_exp_det === 'true') {
        const transformedExpense = response.data_exp_det.map((item, index) => ({
          id: `exp-${index}`,
          title: item.name,
          amount: Math.abs(parseFloat(item.total)).toLocaleString(),
          date: '',
          icon: 'trending-down-outline',
          color: '#EF4444',
        }));
        setExpenseList(transformedExpense);
      }
    } catch (error) {
      console.log('Dashboard fetch error:', error);
    }
  };

  const handleClearFilter = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setFromDate(thirtyDaysAgo);
    setToDate(today);

    const formatDateForAPI = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    fetchData(formatDateForAPI(thirtyDaysAgo), formatDateForAPI(today));
  };

  const handleApplyFilter = () => {
    const formatDateForAPI = date => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    fetchData(formatDateForAPI(fromDate), formatDateForAPI(toDate));
  };

  const stats = [
    {
      id: '1',
      title: 'Bank / Cash',
      value: '1.2M',
      icon: 'wallet-outline',
      color: '#3B82F6',
      trend: '+5.2%',
    },
    {
      id: '2',
      title: 'Receivables',
      value: '450K',
      icon: 'arrow-down-circle-outline',
      color: '#10B981',
      trend: '-2.1%',
    },
    {
      id: '3',
      title: 'Payables',
      value: '210K',
      icon: 'arrow-up-circle-outline',
      color: '#EF4444',
      trend: '+1.5%',
    },
    {
      id: '4',
      title: 'Inventory',
      value: '542 Items',
      icon: 'cube-outline',
      color: '#F59E0B',
      trend: 'In Stock',
    },
  ];

  const handleListItemPress = item => {
    // For now logging, later will navigate to specific details screen
    console.log('Clicked item:', item.title);
  };

  const renderListSection = (title, listData) => (
    <View style={s.listSection}>
      <Text style={[s.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View
        style={[
          s.listContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {listData.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              s.listItem,
              index !== listData.length - 1 && {
                borderBottomColor: theme.colors.border,
                borderBottomWidth: 1,
              },
            ]}
            activeOpacity={0.7}
            onPress={() => handleListItemPress(item)}
          >
            {/* Left Side: Icon & Title */}
            <View style={s.listItemLeft}>
              <View
                style={[s.listIconBox, { backgroundColor: item.color + '15' }]}
              >
                <Icon name={item.icon} size={20} color={item.color} />
              </View>
              <View style={s.listTextContent}>
                <Text
                  style={[s.listItemTitle, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    s.listItemDate,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.date}
                </Text>
              </View>
            </View>

            {/* Right Side: Amount */}
            <Text style={[s.listItemAmount, { color: item.color }]}>
              {item.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const s = getStyles(theme);

  return (
    <View style={s.container}>
      {isLoading && (
        <View style={StyleSheet.absoluteFill}>
          <LoadingSpinner />
        </View>
      )}
      <ScrollView
        contentContainerStyle={[s.content, isLoading && { opacity: 0.5 }]}
        showsVerticalScrollIndicator={false}
      >
        <DateFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDate={setFromDate}
          onToDate={setToDate}
          onClear={handleClearFilter}
          onFilter={handleApplyFilter}
        />

        {renderListSection('Income', incomeList)}
        {renderListSection('Expense', expenseList)}

        <Text style={[s.sectionTitle, { color: theme.colors.text }]}>
          Financial Overview
        </Text>

        <View style={s.statsGrid}>
          {stats.map(stat => (
            <View
              key={stat.id}
              style={[
                s.statCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={[s.iconBox, { backgroundColor: stat.color + '15' }]}>
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text
                style={[s.statValue, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {stat.value}
              </Text>
              <Text
                style={[s.statTitle, { color: theme.colors.textSecondary }]}
              >
                {stat.title}
              </Text>
              <View style={s.trendContainer}>
                <Text
                  style={[
                    s.trendText,
                    {
                      color:
                        stat.id === '3'
                          ? theme.colors.error
                          : theme.colors.success,
                    },
                  ]}
                >
                  {stat.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View
          style={[
            s.chartSection,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={s.chartHeader}>
            <Text style={[s.chartTitle, { color: theme.colors.text }]}>
              Monthly Cash Flow
            </Text>
            <Icon
              name="ellipsis-horizontal"
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={s.placeholderChart}>
            <Icon
              name="stats-chart-outline"
              size={50}
              color={theme.colors.border}
            />
            <Text style={{ color: theme.colors.textSecondary, marginTop: 10 }}>
              Analytics Visualization
            </Text>
          </View>
        </View>
      </ScrollView>
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
      padding: 20,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 14,
    },

    listSection: {
      marginBottom: 24,
    },
    listContainer: {
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    listItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    listIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    listTextContent: {
      flex: 1,
    },
    listItemTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 3,
    },
    listItemDate: {
      fontSize: 11,
      fontWeight: '500',
    },
    listItemAmount: {
      fontSize: 15,
      fontWeight: '800',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: (SCREEN_WIDTH - 55) / 2,
      padding: 15,
      borderRadius: 18,
      borderWidth: 1,
      marginBottom: 15,
    },
    iconBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 2,
    },
    statTitle: {
      fontSize: 11,
    },
    trendContainer: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendText: {
      fontSize: 11,
      fontWeight: '600',
    },
    chartSection: {
      marginTop: 10,
      borderRadius: 20,
      borderWidth: 1,
      padding: 20,
      minHeight: 250,
      marginBottom: 20,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '700',
    },
    placeholderChart: {
      flex: 1,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      borderRadius: 15,
    },
  });

export default DashboardScreen;
