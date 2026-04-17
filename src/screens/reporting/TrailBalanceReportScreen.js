import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { useSelector } from 'react-redux';
import { useGetTrailBalanceMutation } from '@api/ledgerApi';
import { DateFilter, LoadingSpinner } from '@components/common';
import Toast from 'react-native-toast-message';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TrailBalanceReportScreen = ({ route }) => {
  const { theme } = useTheme();
  const company = useSelector(state => state.auth.company);
  const reportType = route.params?.type || 'trail_balance'; // Could handle others if needed

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const [getTrailBalance, { isLoading }] = useGetTrailBalanceMutation();

  useEffect(() => {
    // Default from_date to start of current fiscal year or 30 days ago
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setFromDate(start);
  }, []);

  const formatDateForAPI = date => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleFetchReport = async () => {
    try {
      const response = await getTrailBalance({
        company,
        from_date: formatDateForAPI(fromDate),
        to_date: formatDateForAPI(toDate),
        show_zero: 0,
      }).unwrap();

      if (response.status) {
        setReportData(response.data || []);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch report data.',
        });
      }
    } catch (error) {
      console.log('Trail Balance Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while fetching report.',
      });
    }
  };

  const toggleClass = className => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedClasses(prev => ({ ...prev, [className]: !prev[className] }));
  };

  const toggleGroup = groupName => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const renderAccount = account => (
    <View
      key={account.code}
      style={[
        styles.accountRow,
        { borderBottomColor: theme.colors.border + '50' },
      ]}
    >
      <View style={styles.accountInfo}>
        <Text
          style={[styles.accountCode, { color: theme.colors.textSecondary }]}
        >
          {account.code}
        </Text>
        <Text style={[styles.accountName, { color: theme.colors.text }]}>
          {account.name}
        </Text>
      </View>
      <View style={styles.accountValues}>
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Op:</Text>
          <Text style={[styles.valueText, { color: theme.colors.text }]}>
            {account.opening.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={styles.valueGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Dr</Text>
            <Text style={[styles.gridValue, { color: theme.colors.success }]}>
              {account.debit.toLocaleString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Cr</Text>
            <Text style={[styles.gridValue, { color: theme.colors.error }]}>
              {account.credit.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Cl:</Text>
          <Text
            style={[
              styles.valueText,
              { color: theme.colors.primary, fontWeight: '700' },
            ]}
          >
            {account.closing.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderGroup = group => {
    const isExpanded = expandedGroups[group.group_name];
    return (
      <View key={group.group_name} style={styles.groupContainer}>
        <TouchableOpacity
          style={[
            styles.groupHeader,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={() => toggleGroup(group.group_name)}
          activeOpacity={0.7}
        >
          <View style={styles.row}>
            <Icon
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.groupName, { color: theme.colors.text }]}>
              {group.group_name}
            </Text>
          </View>
          <View style={styles.headerTotal}>
            <Text style={[styles.totalText, { color: theme.colors.primary }]}>
              {group.total.closing.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.accountList}>
            {group.accounts.map(renderAccount)}
          </View>
        )}
      </View>
    );
  };

  const renderClass = item => {
    const isExpanded = expandedClasses[item.class_name];
    return (
      <View
        key={item.class_name}
        style={[styles.classCard, { borderColor: theme.colors.border }]}
      >
        <TouchableOpacity
          style={[
            styles.classHeader,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={() => toggleClass(item.class_name)}
          activeOpacity={0.8}
        >
          <View style={styles.row}>
            {/* <View style={[styles.classIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="business" size={18} color={theme.colors.primary} />
            </View> */}
            <View>
              <Text style={[styles.className, { color: theme.colors.text }]}>
                {item.class_name}
              </Text>
              <Text
                style={[styles.classBalance, { color: theme.colors.primary }]}
              >
                {item.total.closing.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.groupList}>{item.groups.map(renderGroup)}</View>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.filterWrapper}>
        <DateFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDate={setFromDate}
          onToDate={setToDate}
          onFilter={handleFetchReport}
          onClear={() => {
            setFromDate(null);
            setToDate(new Date());
            setReportData([]);
          }}
        />
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reportData.length > 0 ? (
            reportData.map(renderClass)
          ) : (
            <View style={styles.emptyContainer}>
              <Icon
                name="document-text-outline"
                size={60}
                color={theme.colors.border}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Select dates and click filter to generate report
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterWrapper: {
    padding: 16,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },
  classCard: {
    borderRadius: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  classIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  className: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  classBalance: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  groupList: {
    paddingHorizontal: 8,
  },
  groupContainer: {
    marginBottom: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  headerTotal: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 13,
    fontWeight: '600',
  },
  accountList: {
    paddingLeft: 24,
    paddingRight: 12,
  },
  accountRow: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  accountInfo: {
    marginBottom: 6,
  },
  accountCode: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 13,
    fontWeight: '600',
  },
  accountValues: {
    gap: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 10,
    color: '#999',
    width: 24,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  valueGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 4,
    padding: 6,
    gap: 12,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  classTotal: {
    marginVertical: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  classTotalValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default TrailBalanceReportScreen;
