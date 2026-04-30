import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { SearchableDropdown, CustomButton } from '@components/common';
import {
  useGetSalesCategoryMutation,
  useGetSalesActivityMutation,
  useGetHospitalMutation,
  useGetHospitalContactsMutation,
} from '@api/baseApi';

const SaleTaskScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeTab, setActiveTab] = useState('plan'); // 'plan' or 'progress'

  // Dropdown States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  // API Mutations
  const [getSalesCategory, { data: catRes, isLoading: catLoading }] = useGetSalesCategoryMutation();
  const [getSalesActivity, { data: actRes, isLoading: actLoading }] = useGetSalesActivityMutation();
  const [getHospital, { data: hospRes, isLoading: hospLoading }] = useGetHospitalMutation();
  const [getHospitalContacts, { data: contactRes, isLoading: contactLoading }] = useGetHospitalContactsMutation();

  useEffect(() => {
    // Initial data fetch
    getSalesCategory({});
    getHospital({});
  }, []);

  const handleCategorySelect = (item) => {
    setSelectedCategory(item.id);
    setSelectedActivity(null);
    getSalesActivity({ sales_category: item.id });
  };

  const handleHospitalSelect = (item) => {
    setSelectedHospital(item.debtor_no);
    setSelectedContact(null);
    getHospitalContacts({ hospital_id: item.debtor_no });
  };

  const renderPlanTab = () => {
    return (
      <View style={styles.tabContent}>
        <SearchableDropdown
          label="Category"
          placeholder="Select Category"
          data={catRes?.data || []}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
          isLoading={catLoading}
          labelKey="description"
          iconName="apps-outline"
        />

        <SearchableDropdown
          label="Activity"
          placeholder={selectedCategory ? "Select Activity" : "First select category"}
          data={actRes?.data || []}
          selectedId={selectedActivity}
          onSelect={(item) => setSelectedActivity(item.id)}
          isLoading={actLoading}
          labelKey="description"
          iconName="walk-outline"
          disabled={!selectedCategory}
        />

        <SearchableDropdown
          label="Hospital"
          placeholder="Select Hospital"
          data={hospRes?.data || []}
          selectedId={selectedHospital}
          onSelect={handleHospitalSelect}
          isLoading={hospLoading}
          idKey="debtor_no"
          labelKey="name"
          iconName="business-outline"
        />

        <SearchableDropdown
          label="Hospital Contact"
          placeholder={selectedHospital ? "Select Contact" : "First select hospital"}
          data={contactRes?.data || []}
          selectedId={selectedContact}
          onSelect={(item) => setSelectedContact(item.id)}
          isLoading={contactLoading}
          labelKey="person_name"
          iconName="people-outline"
          disabled={!selectedHospital}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="ADD TASK"
            onPress={() => console.log('Add Task Clicked')}
            icon="add-circle-outline"
          />
        </View>
      </View>
    );
  };

  const renderProgressTab = () => {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="construct-outline" size={64} color={theme.colors.textSecondary + '40'} />
        <Text style={styles.emptyText}>Work in progress...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'plan' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab('plan')}
        >
          <Text style={[styles.tabText, activeTab === 'plan' && styles.activeTabText]}>PLAN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'progress' && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab('progress')}
        >
          <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>PROGRESS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'plan' ? renderPlanTab() : renderProgressTab()}
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
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    tabText: {
      fontWeight: '700',
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    tabContent: {
      paddingTop: 8,
    },
    buttonContainer: {
      marginTop: 10,
    },
    emptyContainer: {
      flex: 1,
      paddingTop: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
  });

export default SaleTaskScreen;
