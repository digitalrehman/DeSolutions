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

const DUMMY_DROPDOWN = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const CRMSampleRequestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Sample Request',
    });
  }, [navigation]);

  // Top Section State
  const [basicInfo, setBasicInfo] = useState({
    salePerson: null,
    salesRegion: null,
    hospital: null,
    surgeonName: '',
    surgeonSpecialty: '',
    department: null,
  });

  // Dynamic Products Section State
  const emptyProduct = {
    product: null,
    quantity: '',
    batchNo: '',
    primaryQuantity: '',
    expectedDate: '',
    secondaryQuantity: '',
    currentBrand: '',
    samplePurpose: '',
  };
  const [products, setProducts] = useState([{ ...emptyProduct }]);

  // Remarks State
  const [remarks, setRemarks] = useState('');

  // Handlers
  const updateBasicField = (key, value) => {
    setBasicInfo(prev => ({ ...prev, [key]: value }));
  };

  const updateProductField = (index, key, value) => {
    const updated = [...products];
    updated[index][key] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { ...emptyProduct }]);
  };

  const removeProduct = (index) => {
    setProducts(prev => prev.filter((_, i) => i !== index));
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
        data={DUMMY_DROPDOWN}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={`Select ${label}`}
        value={value}
        onChange={(item) => onChange(item.value)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Top Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {renderDropdown('Sale Person Name', basicInfo.salePerson, (val) => updateBasicField('salePerson', val))}
          {renderDropdown('Sales Region/Territory', basicInfo.salesRegion, (val) => updateBasicField('salesRegion', val))}
          {renderDropdown('Hospital', basicInfo.hospital, (val) => updateBasicField('hospital', val))}
          {renderInput('Surgeon Name', basicInfo.surgeonName, (text) => updateBasicField('surgeonName', text))}
          {renderInput('Surgeon Specialty', basicInfo.surgeonSpecialty, (text) => updateBasicField('surgeonSpecialty', text))}
          {renderDropdown('Department', basicInfo.department, (val) => updateBasicField('department', val))}
        </View>

        {/* Dynamic Products Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Products Details</Text>
          
          {products.map((item, index) => (
            <View key={index} style={[styles.dynamicBlock, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
              <View style={styles.dynamicHeader}>
                <Text style={[styles.dynamicTitle, { color: theme.colors.text }]}>Item {index + 1}</Text>
                {products.length > 1 && (
                  <TouchableOpacity onPress={() => removeProduct(index)}>
                    <Icon name="trash-outline" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              {renderDropdown('Product', item.product, (val) => updateProductField(index, 'product', val))}
              {renderInput('Quantity', item.quantity, (text) => updateProductField(index, 'quantity', text), 'numeric')}
              {renderInput('Batch No.', item.batchNo, (text) => updateProductField(index, 'batchNo', text))}
              {renderInput('Primary Quantity', item.primaryQuantity, (text) => updateProductField(index, 'primaryQuantity', text), 'numeric')}
              {renderInput('Expected Date of Use', item.expectedDate, (text) => updateProductField(index, 'expectedDate', text))}
              {renderInput('Secondary Quantity', item.secondaryQuantity, (text) => updateProductField(index, 'secondaryQuantity', text), 'numeric')}
              {renderInput('Current Brand', item.currentBrand, (text) => updateProductField(index, 'currentBrand', text))}
              {renderInput('Sample Purpose', item.samplePurpose, (text) => updateProductField(index, 'samplePurpose', text))}
            </View>
          ))}
          
          <TouchableOpacity 
            style={[styles.addMoreBtn, { borderColor: theme.colors.primary }]}
            onPress={addProduct}
          >
            <Icon name="add" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.addMoreText, { color: theme.colors.primary }]}>Add More Item</Text>
          </TouchableOpacity>
        </View>

        {/* Remarks */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Remarks</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Add any remarks..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={remarks}
              onChangeText={setRemarks}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.submitBtnText}>Submit Request</Text>
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
  content: {
    padding: 16,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  placeholderStyle: { fontSize: 15 },
  selectedTextStyle: { fontSize: 15 },
  itemTextStyle: { fontSize: 15 },
  dynamicBlock: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CRMSampleRequestScreen;
