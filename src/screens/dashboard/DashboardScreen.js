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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
  };

  const handleApplyFilter = () => {
    // Empty for now, will be implemented later whenever API is integrated
    console.log('Applying filter from:', fromDate, 'to:', toDate);
  };

  const stats = [
    {
      id: '1',
      title: 'Bank / Cash',
      value: 'PKR 1.2M',
      icon: 'wallet-outline',
      color: '#3B82F6',
      trend: '+5.2%',
    },
    {
      id: '2',
      title: 'Receivables',
      value: 'PKR 450K',
      icon: 'arrow-down-circle-outline',
      color: '#10B981',
      trend: '-2.1%',
    },
    {
      id: '3',
      title: 'Payables',
      value: 'PKR 210K',
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

  const incomeList = [
    {
      id: 'inc-1',
      title: 'Sales Revenue - Product A',
      amount: 'PKR 350,000',
      date: '12 Oct 2023',
      icon: 'trending-up-outline',
      color: '#10B981', // Success / Green
    },
    {
      id: 'inc-2',
      title: 'Consulting Services',
      amount: 'PKR 120,500',
      date: '08 Oct 2023',
      icon: 'trending-up-outline',
      color: '#10B981',
    },
  ];

  const expenseList = [
    {
      id: 'exp-1',
      title: 'Office Rent - Head Office',
      amount: 'PKR 150,000',
      date: '05 Oct 2023',
      icon: 'trending-down-outline',
      color: '#EF4444', // Error / Red
    },
    {
      id: 'exp-2',
      title: 'Software Subscriptions',
      amount: 'PKR 45,200',
      date: '02 Oct 2023',
      icon: 'trending-down-outline',
      color: '#EF4444',
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
      <ScrollView
        contentContainerStyle={s.content}
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
