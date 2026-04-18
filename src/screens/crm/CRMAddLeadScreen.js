import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useTheme } from '@config/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';

// Dummy data for dropdowns
const titles = [
  { label: 'Mr.', value: 'Mr' },
  { label: 'Ms.', value: 'Ms' },
  { label: 'Dr.', value: 'Dr' },
  { label: 'Prof.', value: 'Prof' },
];
const genders = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];
const educationList = [
  { label: 'MBBS', value: 'MBBS' },
  { label: 'FCPS', value: 'FCPS' },
  { label: 'FRCS', value: 'FRCS' },
  { label: 'MD', value: 'MD' },
];
const cities = [
  { label: 'Karachi', value: 'Karachi' },
  { label: 'Lahore', value: 'Lahore' },
  { label: 'Islamabad', value: 'Islamabad' },
];
const genericList = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];
const multiGenericList = [
  { label: 'Item A', value: 'A' },
  { label: 'Item B', value: 'B' },
  { label: 'Item C', value: 'C' },
  { label: 'Item D', value: 'D' },
];

const CRMAddLeadScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [formData, setFormData] = useState({
    title: null,
    personName: '',
    gender: null,
    education: null,
    personalEmail: '',
    mobileNo: '',
    city: null,
    paName: '',
    paNo: '',
    facebook: '',
    linkedin: '',
    whatsappCommunity: null,
    salesPerson: null,
    community: null,
    surgicalRole: null,
    adminRole: null,
    department: null,
    surgerySpecialty: null,
    yearOfPractice: null,
    professionalMembership: null,
    mainHospital: null,
    secondaryHospital: null,
    privateHospital: null,
    procedureFocus: [],
    chooseCampaign: [],
    focusProduct: [],
    customerSegment: [],
    workshop: [],
    conference: [],
    notes: '',
    profilePic: null,
    businessCard: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = (field) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        updateField(field, response.assets[0].uri);
      }
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add Contact',
    });
  }, [navigation]);

  // Reusable components for consistent styling
  const renderInput = (label, key, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={keyboardType}
        value={formData[key]}
        onChangeText={(text) => updateField(key, text)}
      />
    </View>
  );

  const renderDropdown = (label, key, data, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <Dropdown
        style={[styles.dropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.textSecondary }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.text }]}
        itemTextStyle={[styles.itemTextStyle, { color: theme.colors.text }]}
        containerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={formData[key]}
        onChange={(item) => {
          updateField(key, item.value);
        }}
      />
    </View>
  );

  const renderMultiSelect = (label, key, data, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <MultiSelect
        style={[styles.dropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
        placeholderStyle={[styles.placeholderStyle, { color: theme.colors.textSecondary }]}
        selectedTextStyle={[styles.selectedTextStyle, { color: theme.colors.text }]}
        itemTextStyle={[styles.itemTextStyle, { color: theme.colors.text }]}
        containerStyle={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={formData[key]}
        onChange={(item) => {
          updateField(key, item);
        }}
        selectedStyle={[styles.selectedStyle, { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }]}
        renderItem={(item, selected) => (
          <View style={styles.multiSelectItem}>
            <Icon
              name={selected ? 'checkbox' : 'square-outline'}
              size={20}
              color={selected ? theme.colors.primary : theme.colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <Text style={[{ color: theme.colors.text }]}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Personal Information */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Personal Information</Text>
          {renderDropdown('Title', 'title', titles, 'Select Title')}
          {renderInput('Person Name', 'personName', 'Enter full name')}
          {renderDropdown('Gender', 'gender', genders, 'Select Gender')}
          {renderDropdown('Education', 'education', educationList, 'Select Education')}
        </View>

        {/* Contact Information */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Contact Information</Text>
          {renderInput('Personal Email', 'personalEmail', 'email@example.com', 'email-address')}
          {renderInput('Mobile No', 'mobileNo', '+92 300 1234567', 'phone-pad')}
          {renderDropdown('City', 'city', cities, 'Select City')}
          {renderInput('PA Name', 'paName', "Enter PA's Name")}
          {renderInput('PA No', 'paNo', "Enter PA's Number", 'phone-pad')}
          {renderInput('Facebook Profile', 'facebook', 'Profile URL')}
          {renderInput('LinkedIn Profile', 'linkedin', 'Profile URL')}
          {renderDropdown('WhatsApp Community', 'whatsappCommunity', genericList, 'Select Community')}
          {renderDropdown('Sales Person', 'salesPerson', genericList, 'Select Sales Person')}
        </View>

        {/* Personal Details */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Personal Details</Text>
          {renderDropdown('Community', 'community', genericList, 'Select Community')}
          {renderDropdown('Surgical Role', 'surgicalRole', genericList, 'Select Role')}
          {renderDropdown('Administrative Role', 'adminRole', genericList, 'Select Admin Role')}
          {renderDropdown('Department', 'department', genericList, 'Select Department')}
          {renderDropdown('Surgery Specialty', 'surgerySpecialty', genericList, 'Select Specialty')}
          {renderDropdown('Year of Practice', 'yearOfPractice', genericList, 'Select Years')}
          {renderDropdown('Professional Membership', 'professionalMembership', genericList, 'Select Membership')}
          {renderDropdown('Main Hospital', 'mainHospital', genericList, 'Select Main Hospital')}
          {renderDropdown('Secondary Hospital', 'secondaryHospital', genericList, 'Select Secondary Hospital')}
          {renderDropdown('Private Hospital', 'privateHospital', genericList, 'Select Private Hospital')}
        </View>

        {/* Multi-Select Dropdowns without specific section title */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {renderMultiSelect('Procedure Focus', 'procedureFocus', multiGenericList, 'Select Procedure Focus')}
          {renderMultiSelect('Choose Campaign', 'chooseCampaign', multiGenericList, 'Select Campaigns')}
          {renderMultiSelect('Choose Focus Product', 'focusProduct', multiGenericList, 'Select Focus Products')}
          {renderMultiSelect('Choose Customer Segment', 'customerSegment', multiGenericList, 'Select Segments')}
          {renderMultiSelect('Choose Workshop', 'workshop', multiGenericList, 'Select Workshops')}
          {renderMultiSelect('Choose Conference', 'conference', multiGenericList, 'Select Conferences')}
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Notes / Remarks</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Add any notes here..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(text) => updateField('notes', text)}
            />
          </View>
        </View>

        {/* Attachments Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Attachments</Text>
          
          <Text style={[styles.label, { color: theme.colors.text }]}>Profile Picture</Text>
          <TouchableOpacity 
            style={[styles.imageUploadBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            onPress={() => handleImagePick('profilePic')}
          >
            {formData.profilePic ? (
              <Image source={{ uri: formData.profilePic }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="camera-outline" size={28} color={theme.colors.primary} />
                <Text style={[styles.uploadText, { color: theme.colors.textSecondary }]}>Upload Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Business Card</Text>
          <TouchableOpacity 
            style={[styles.imageUploadBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            onPress={() => handleImagePick('businessCard')}
          >
            {formData.businessCard ? (
              <Image source={{ uri: formData.businessCard }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon name="id-card-outline" size={28} color={theme.colors.primary} />
                <Text style={[styles.uploadText, { color: theme.colors.textSecondary }]}>Upload Business Card</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveBtnText}>Save Contact</Text>
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
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 15,
  },
  itemTextStyle: {
    fontSize: 15,
  },
  selectedStyle: {
    borderRadius: 12,
    borderWidth: 1,
  },
  multiSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  imageUploadBtn: {
    height: 140,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
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

export default CRMAddLeadScreen;
