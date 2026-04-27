import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const quickActions = [
  { id: 'contact', title: 'CRM\nCONTACT', icon: 'people-outline', color: '#3b82f6' },
  { id: 'hospital', title: 'HOSPITAL', icon: 'business-outline', color: '#ef4444' },
  { id: 'new_order', title: 'NEW ORDER', icon: 'clipboard-outline', color: '#16a34a' },
  { id: 'order_status', title: 'ORDER STATUS', icon: 'document-text-outline', color: '#f59e0b' },
  { id: 'add_customer', title: 'ADD CUSTOMER', icon: 'person-add-outline', color: '#9333ea' },
  { id: 'supply_info', title: 'SUPPLY INFO', icon: 'bus-outline', color: '#2563eb' },
  { id: 'payment', title: 'PAYMENT ENTRY', icon: 'cash-outline', color: '#16a34a' },
  { id: 'sample', title: 'SAMPLE REQUEST', icon: 'flask-outline', color: '#a855f7' },
];

const reports = [
  { id: 'sales_target', title: 'SALES VS\nTARGET', icon: 'bar-chart-outline', color: '#3b82f6' },
  { id: 'cust_balance', title: 'CUSTOMER\nBALANCE', icon: 'pie-chart-outline', color: '#16a34a' },
  { id: 'collection', title: 'COLLECTION\nREPORT', icon: 'wallet-outline', color: '#f59e0b' },
  { id: 'daily_summary', title: 'DAILY\nSUMMARY', icon: 'calendar-outline', color: '#8b5cf6' },
];


const SaleManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleActionPress = (item) => {
    if (item.id === 'new_order') {
      navigation.navigate('SalesAddCustomer');
    } else if (item.id === 'add_customer') {
      navigation.navigate('SalesAddCustomer');
    }
    // Handle other actions here
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TODAY'S PLAN SECTION */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>TODAY'S PLAN</Text>
          <TouchableOpacity>
            <Text style={styles.sectionRightText}>ATTENDANCE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.planCard}>
          <View style={styles.planHalf}>
            <View style={[styles.iconCircle, { backgroundColor: '#eff6ff' }]}>
              <Icon name="calendar-outline" size={24} color="#3b82f6" />
            </View>
            <View style={styles.planTextCol}>
              <Text style={styles.planCount}>5 <Text style={styles.planSub}>Tasks</Text></Text>
              <Text style={styles.planSub}>Today</Text>
            </View>
          </View>
          
          <View style={styles.planHalf}>
            <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
              <Icon name="calendar-outline" size={24} color="#16a34a" />
            </View>
            <View style={styles.planTextCol}>
              <Text style={styles.planMainText}>Mark</Text>
              <Text style={styles.planMainText}>Attendance</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>QUICK ACTIONS</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => handleActionPress(action)}
            >
              <Icon name={action.icon} size={28} color={action.color} style={styles.actionIcon} />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* REPORTS SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>REPORTS</Text>
        <View style={styles.reportsGrid}>
          {reports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportTile} activeOpacity={0.7}>
              <Icon name={report.icon} size={28} color={report.color} style={styles.reportIcon} />
              <Text style={styles.reportText}>{report.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FIELD EXPENSE SECTION */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>FIELD EXPENSE</Text>
        <TouchableOpacity style={styles.expenseCard} activeOpacity={0.7}>
          <View style={[styles.iconCircle, { backgroundColor: '#eff6ff', marginRight: 16 }]}>
            <Icon name="wallet-outline" size={24} color="#3b82f6" />
          </View>
          <View style={styles.expenseTextCol}>
            <Text style={styles.expenseTitle}>Field Expense</Text>
            <Text style={styles.expenseSub}>Add and manage expenses</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    sectionHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
    },
    sectionRightText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#3b82f6',
      textTransform: 'uppercase',
    },
    planCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    planHalf: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      margin: 4,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    planTextCol: {
      marginLeft: 12,
      flex: 1,
      justifyContent: 'center',
    },
    planCount: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.text,
      lineHeight: 26,
    },
    planSub: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    planMainText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.text,
      lineHeight: 18,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 12,
    },
    actionButton: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionIcon: {
      marginRight: 12,
    },
    actionText: {
      flex: 1,
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text,
      lineHeight: 16,
    },
    reportsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reportTile: {
      width: '23%',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 4,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    reportIcon: {
      marginBottom: 8,
    },
    reportText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 14,
    },
    expenseCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    expenseTextCol: {
      flex: 1,
    },
    expenseTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 2,
    },
    expenseSub: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
  });

export default SaleManagementScreen;
