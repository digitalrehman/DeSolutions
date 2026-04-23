import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const dummyOrders = [
  {
    id: '1',
    customer: 'Tech Solutions Pvt Ltd',
    reference: 'SO-2024-001',
    poNumber: 'PO-TECH-101',
    branch: 'Mumbai - Andheri East',
    orderDate: '21-April-2026',
    poDate: '15-April-2026',
    status: 'APPROVED',
    amount: '1,25,000'
  },
  {
    id: '2',
    customer: 'Global Retail Chain',
    reference: 'SO-2024-002',
    poNumber: 'PO-GLB-202',
    branch: 'Delhi - Connaught Place',
    orderDate: '21-April-2026',
    poDate: '18-April-2026',
    status: 'UNAPPROVED',
    amount: '78,500'
  },
  {
    id: '3',
    customer: 'Apex Industries',
    reference: 'SO-2024-003',
    poNumber: 'PO-APX-789',
    branch: 'Chennai - Ambattur',
    orderDate: '21-April-2026',
    poDate: '20-April-2026',
    status: 'APPROVED',
    amount: '2,50,000'
  },
  {
    id: '4',
    customer: 'NexGen Logistics',
    reference: 'SO-2024-004',
    poNumber: 'PO-NXG-456',
    branch: 'Kolkata - Salt Lake',
    orderDate: '21-April-2026',
    poDate: '-',
    status: 'UNAPPROVED',
    amount: '45,200'
  },
  {
    id: '5',
    customer: 'Prime Healthcare',
    reference: 'SO-2024-005',
    poNumber: 'PO-PH-334',
    branch: 'Bangalore - Indiranagar',
    orderDate: '21-April-2026',
    poDate: '19-April-2026',
    status: 'APPROVED',
    amount: '3,15,750'
  },
  {
    id: '6',
    customer: 'Sunrise Enterprises',
    reference: 'SO-2024-006',
    poNumber: 'PO-SUN-567',
    branch: 'Pune - Hinjawadi',
    orderDate: '21-April-2026',
    poDate: '17-April-2026',
    status: 'UNAPPROVED',
    amount: '92,300'
  }
];

const SalesOrderStatusScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Derived stats
  const totalOrders = dummyOrders.length;
  const approvedCount = dummyOrders.filter(o => o.status === 'APPROVED').length;
  const unapprovedCount = dummyOrders.filter(o => o.status === 'UNAPPROVED').length;

  const filteredOrders = useMemo(() => {
    return dummyOrders.filter(order => {
      // Filter by search query
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.customer.toLowerCase().includes(query) ||
        order.reference.toLowerCase().includes(query) ||
        order.poNumber.toLowerCase().includes(query) ||
        order.branch.toLowerCase().includes(query);

      // Filter by status
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const renderFilterButton = (title, count, icon, color, filterType) => {
    const isActive = statusFilter === filterType || (filterType === 'ALL' && statusFilter === 'ALL');
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isActive && { borderColor: color, backgroundColor: color + '10' }
        ]}
        onPress={() => setStatusFilter(filterType)}
      >
        <Icon name={icon} size={20} color={color} />
        <View style={styles.filterTextContainer}>
          <Text style={styles.filterTitle}>{title}</Text>
          <Text style={[styles.filterCount, { color }]}>{count}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerArea}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Icon name="stats-chart" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.screenTitle}>Order Status Dashboard</Text>
            <Text style={styles.screenSubtitle}>click on stats to filter orders</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order, customer, branch, PO."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {renderFilterButton('TOTAL ORDERS', totalOrders, 'bar-chart', theme.colors.primary, 'ALL')}
          {renderFilterButton('APPROVED', approvedCount, 'checkmark-circle', '#10B981', 'APPROVED')}
          {renderFilterButton('UNAPPROVED', unapprovedCount, 'warning', '#EF4444', 'UNAPPROVED')}
          
          <TouchableOpacity 
            style={[styles.filterButton, { justifyContent: 'center' }]}
            onPress={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
          >
            <Icon name="close-circle-outline" size={16} color={theme.colors.textSecondary} style={{marginRight: 4}} />
            <Text style={{color: theme.colors.textSecondary, fontWeight: '600'}}>Clear Filter</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredOrders.map(order => {
          const isApproved = order.status === 'APPROVED';
          const statusColor = isApproved ? '#10B981' : '#EF4444';
          const statusBg = isApproved ? '#D1FAE5' : '#FEE2E2';

          return (
            <View key={order.id} style={styles.orderCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.customerRow}>
                  <View style={styles.customerIcon}>
                    <Icon name="business" size={16} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.customerName}>{order.customer}</Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                  <Icon name={isApproved ? "checkmark-circle" : "warning"} size={14} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>{order.status}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Left side details */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}>
                        <Icon name="pricetag-outline" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Reference</Text>
                      </View>
                      <Text style={styles.detailValue} numberOfLines={1} adjustsFontSizeToFit>{order.reference}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}>
                        <Icon name="calendar-outline" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Order Date</Text>
                      </View>
                      <Text style={styles.detailValue}>{order.orderDate}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}>
                        <Icon name="document-text-outline" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>PO Number</Text>
                      </View>
                      <Text style={styles.detailValue} numberOfLines={1} adjustsFontSizeToFit>{order.poNumber}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={styles.detailLabelRow}>
                        <Icon name="calendar-outline" size={12} color={theme.colors.textSecondary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>PO Date</Text>
                      </View>
                      <Text style={styles.detailValue}>{order.poDate}</Text>
                    </View>
                  </View>

                  <View style={styles.branchContainer}>
                    <Icon name="location-outline" size={16} color={theme.colors.primary} style={styles.detailIcon} />
                    <Text style={styles.branchLabel}>Branch Location:</Text>
                    <Text style={styles.branchValue}>{order.branch}</Text>
                  </View>
                </View>

                {/* Right side amount and button */}
                <View style={styles.amountSection}>
                  <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
                  <Text style={styles.amountValue}>{order.amount}</Text>
                  
                  <TouchableOpacity style={styles.viewDetailsBtn}>
                    <Icon name="eye-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Icon name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="search-outline" size={48} color={theme.colors.border} />
            <Text style={styles.emptyStateText}>No orders found matching your criteria</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light blue-ish gray like the image
  },
  headerArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  screenSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: theme.colors.text,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 130,
  },
  filterTextContainer: {
    marginLeft: 10,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  filterCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  cardBody: {
    flexDirection: 'column',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  branchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
  },
  branchLabel: {
    fontSize: 13,
    color: theme.colors.primary,
    marginRight: 6,
  },
  branchValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    flex: 1,
  },
  amountSection: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    color: theme.colors.textSecondary,
    fontSize: 14,
  }
});

export default SalesOrderStatusScreen;
