import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@config/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';

// Generic dummy data for dropdowns
const DUMMY_OPTIONS = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
  { label: 'Option C', value: 'C' },
];

const CRMAddHospitalScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [activeTab, setActiveTab] = useState('Basic');

  // Basic Information State
  const [basicInfo, setBasicInfo] = useState({
    hospitalName: '',
    address: '',
    city: null,
    website: '',
    type1: null,
    segment: null,
    noOfOts: '',
    noOfBeds: '',
    status: null,
    customersType: null,
  });

  // Dynamic States
  const [facilities, setFacilities] = useState([{ facility1: null, facility2: null, facility3: null }]);
  const [businessOps, setBusinessOps] = useState([{ fundingSource: null, paymentTerms: null, creditHistory: null, procurementChannel: null, wallet: null }]);
  const [competitors, setCompetitors] = useState([{ sutures: null, airway: null }]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Hospital',
    });
  }, [navigation]);

  const updateBasicField = (key, value) => {
    setBasicInfo((prev) => ({ ...prev, [key]: value }));
  };

  const updateDynamicField = (setState, index, key, value) => {
    setState((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const addDynamicRow = (setState, emptyRow) => {
    setState((prev) => [...prev, emptyRow]);
  };

  const removeDynamicRow = (setState, index) => {
    setState((prev) => prev.filter((_, i) => i !== index));
  };

  // UI Helpers
  const renderInput = (label, value, onChangeText, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );

  const renderDropdown = (label, value, onChange) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <Dropdown
        style={[styles.dropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.textSecondary }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.text }]}
        itemTextStyle={[styles.itemTextStyle, { color: theme.colors.text }]}
        containerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        data={DUMMY_OPTIONS}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={`Select ${label}`}
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </View>
  );

  // Render Tabs
  const tabs = [
    { key: 'Basic', label: 'Basic Info' },
    { key: 'Facilities', label: 'Facilities' },
    { key: 'Business', label: 'Business Opp.' },
    { key: 'Competitor', label: 'Competitor' },
  ];

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, { color: isActive ? '#FFF' : theme.colors.textSecondary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Tab Contents
  const renderBasicInfo = () => (
    <View style={styles.formContent}>
      {renderInput('Hospital Name', basicInfo.hospitalName, (text) => updateBasicField('hospitalName', text))}
      {renderInput('Address', basicInfo.address, (text) => updateBasicField('address', text))}
      {renderDropdown('City', basicInfo.city, (val) => updateBasicField('city', val))}
      {renderInput('Website', basicInfo.website, (text) => updateBasicField('website', text), 'url')}
      {renderDropdown('Type 1', basicInfo.type1, (val) => updateBasicField('type1', val))}
      {renderDropdown('Segment', basicInfo.segment, (val) => updateBasicField('segment', val))}
      {renderInput('No. of OTs', basicInfo.noOfOts, (text) => updateBasicField('noOfOts', text), 'numeric')}
      {renderInput('No. of Beds', basicInfo.noOfBeds, (text) => updateBasicField('noOfBeds', text), 'numeric')}
      {renderDropdown('Current Status', basicInfo.status, (val) => updateBasicField('status', val))}
      {renderDropdown('Customers Type', basicInfo.customersType, (val) => updateBasicField('customersType', val))}
    </View>
  );

  const renderFacilities = () => (
    <View style={styles.formContent}>
      {facilities.map((item, index) => (
        <View key={index} style={[styles.dynamicRowBlock, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
          <View style={styles.dynamicHeader}>
            <Text style={[styles.dynamicTitle, { color: theme.colors.primary }]}>Facility Set {index + 1}</Text>
            {facilities.length > 1 && (
              <TouchableOpacity onPress={() => removeDynamicRow(setFacilities, index)}>
                <Icon name="trash-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
          {renderDropdown('Surgical Facility 1', item.facility1, (val) => updateDynamicField(setFacilities, index, 'facility1', val))}
          {renderDropdown('Surgical Facility 2', item.facility2, (val) => updateDynamicField(setFacilities, index, 'facility2', val))}
          {renderDropdown('Surgical Facility 3', item.facility3, (val) => updateDynamicField(setFacilities, index, 'facility3', val))}
        </View>
      ))}
      <TouchableOpacity 
        style={[styles.addMoreBtn, { borderColor: theme.colors.primary }]}
        onPress={() => addDynamicRow(setFacilities, { facility1: null, facility2: null, facility3: null })}
      >
        <Icon name="add" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.addMoreText, { color: theme.colors.primary }]}>Add More Facilities</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBusinessOpp = () => (
    <View style={styles.formContent}>
      {businessOps.map((item, index) => (
        <View key={index} style={[styles.dynamicRowBlock, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
          <View style={styles.dynamicHeader}>
            <Text style={[styles.dynamicTitle, { color: theme.colors.primary }]}>Business Opp {index + 1}</Text>
            {businessOps.length > 1 && (
              <TouchableOpacity onPress={() => removeDynamicRow(setBusinessOps, index)}>
                <Icon name="trash-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
          {renderDropdown('Funding Source', item.fundingSource, (val) => updateDynamicField(setBusinessOps, index, 'fundingSource', val))}
          {renderDropdown('Payment Terms', item.paymentTerms, (val) => updateDynamicField(setBusinessOps, index, 'paymentTerms', val))}
          {renderDropdown('Credit History', item.creditHistory, (val) => updateDynamicField(setBusinessOps, index, 'creditHistory', val))}
          {renderDropdown('Procurement Channel', item.procurementChannel, (val) => updateDynamicField(setBusinessOps, index, 'procurementChannel', val))}
          {renderDropdown('Wallet', item.wallet, (val) => updateDynamicField(setBusinessOps, index, 'wallet', val))}
        </View>
      ))}
      <TouchableOpacity 
        style={[styles.addMoreBtn, { borderColor: theme.colors.primary }]}
        onPress={() => addDynamicRow(setBusinessOps, { fundingSource: null, paymentTerms: null, creditHistory: null, procurementChannel: null, wallet: null })}
      >
        <Icon name="add" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.addMoreText, { color: theme.colors.primary }]}>Add More Business Opp</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompetitor = () => (
    <View style={styles.formContent}>
      {competitors.map((item, index) => (
        <View key={index} style={[styles.dynamicRowBlock, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
          <View style={styles.dynamicHeader}>
            <Text style={[styles.dynamicTitle, { color: theme.colors.primary }]}>Analysis {index + 1}</Text>
            {competitors.length > 1 && (
              <TouchableOpacity onPress={() => removeDynamicRow(setCompetitors, index)}>
                <Icon name="trash-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>
          {renderDropdown('Sutures', item.sutures, (val) => updateDynamicField(setCompetitors, index, 'sutures', val))}
          {renderDropdown('Airway Management', item.airway, (val) => updateDynamicField(setCompetitors, index, 'airway', val))}
        </View>
      ))}
      <TouchableOpacity 
        style={[styles.addMoreBtn, { borderColor: theme.colors.primary }]}
        onPress={() => addDynamicRow(setCompetitors, { sutures: null, airway: null })}
      >
        <Icon name="add" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.addMoreText, { color: theme.colors.primary }]}>Add More Competitor Analysis</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderTabs()}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'Basic' && renderBasicInfo()}
        {activeTab === 'Facilities' && renderFacilities()}
        {activeTab === 'Business' && renderBusinessOpp()}
        {activeTab === 'Competitor' && renderCompetitor()}
        
        {/* Save Button visible on all tabs */}
        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveBtnText}>Save Hospital</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  formContent: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  itemTextStyle: {
    fontSize: 15,
  },
  dynamicRowBlock: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dynamicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dynamicTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CRMAddHospitalScreen;
