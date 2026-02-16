import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();

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

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Financial Overview
        </Text>

        <View style={styles.statsGrid}>
          {stats.map(stat => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[styles.iconBox, { backgroundColor: stat.color + '15' }]}
              >
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text
                style={[styles.statValue, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statTitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {stat.title}
              </Text>
              <View style={styles.trendContainer}>
                <Text
                  style={[
                    styles.trendText,
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

        {/* Placeholder for Analytics Charts */}
        <View
          style={[
            styles.chartSection,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Monthly Cash Flow
            </Text>
            <Icon
              name="ellipsis-horizontal"
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.placeholderChart}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (SCREEN_WIDTH - 55) / 2,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 15,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  trendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chartSection: {
    marginTop: 10,
    borderRadius: 25,
    borderWidth: 1,
    padding: 20,
    minHeight: 250,
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
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 15,
  },
});

export default DashboardScreen;
