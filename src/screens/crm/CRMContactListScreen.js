import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@config/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

// Dummy data using the keys from the CRM Add Lead Form
const DUMMY_CONTACTS = [
  {
    id: '1',
    title: 'Dr.',
    personName: 'Ahmed Khan',
    gender: 'Male',
    education: 'MBBS, FCPS',
    personalEmail: 'ahmed.khan@example.com',
    mobileNo: '+92 300 1234567',
    city: 'Karachi',
    community: 'Medical Assoc',
    surgicalRole: 'Surgeon',
    department: 'Cardiology',
    surgerySpecialty: 'Heart Transplant',
    yearOfPractice: '10 Years',
    mainHospital: 'Aga Khan Hospital',
    profilePic: 'https://i.pravatar.cc/150?u=ahmed',
    businessCard: 'https://picsum.photos/seed/card1/400/200',
  },
  {
    id: '2',
    title: 'Prof.',
    personName: 'Sara Ali',
    gender: 'Female',
    education: 'FRCS',
    personalEmail: 'sara.ali@example.com',
    mobileNo: '+92 321 7654321',
    city: 'Lahore',
    community: 'Neuro Society',
    surgicalRole: 'Consultant',
    department: 'Neurology',
    surgerySpecialty: 'Brain Surgery',
    yearOfPractice: '15 Years',
    mainHospital: 'Shaukat Khanum',
    profilePic: 'https://i.pravatar.cc/150?u=sara',
    businessCard: 'https://picsum.photos/seed/card2/400/200',
  },
  {
    id: '3',
    title: 'Mr.',
    personName: 'Usman Tariq',
    gender: 'Male',
    education: 'MBA',
    personalEmail: 'usman.tariq@example.com',
    mobileNo: '+92 333 9876543',
    city: 'Islamabad',
    community: 'Health Admin',
    surgicalRole: 'N/A',
    department: 'Administration',
    surgerySpecialty: 'N/A',
    yearOfPractice: '5 Years',
    mainHospital: 'Shifa International',
    profilePic: 'https://i.pravatar.cc/150?u=usman',
    businessCard: 'https://picsum.photos/seed/card3/400/200',
  },
];

const CRMContactListScreen = ({ navigation }) => {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Contacts',
      hideHomeIcon: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CRMAddLead')}
          style={{ paddingRight: 10 }}
        >
          <Icon name="add" color="#FFF" size={28} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderKeyValue = (label, value) => (
    <View style={styles.keyValueCol}>
      <Text style={[styles.keyText, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.valueText, { color: theme.colors.text }]} numberOfLines={1}>
        {value || '-'}
      </Text>
    </View>
  );

  const renderContactCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      
      {/* Header section with Name and Title */}
      <View style={styles.cardHeader}>
        {item.profilePic ? (
          <Image source={{ uri: item.profilePic }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
              {item.personName.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={[styles.nameText, { color: theme.colors.text }]}>
            {item.title} {item.personName}
          </Text>
          <Text style={[styles.specialtyText, { color: theme.colors.primary }]}>
            {item.department} {item.surgerySpecialty !== 'N/A' && `- ${item.surgerySpecialty}`}
          </Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
      {/* Detail Section */}
      <View style={styles.cardBody}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderKeyValue('Mobile No', item.mobileNo)}
          {renderKeyValue('City', item.city)}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderKeyValue('Gender', item.gender)}
          {renderKeyValue('Education', item.education)}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderKeyValue('Surgical Role', item.surgicalRole)}
          {renderKeyValue('Experience', item.yearOfPractice)}
        </View>

        {/* Full Width Keys */}
        <View style={styles.fullWidthCol}>
          <Text style={[styles.keyText, { color: theme.colors.textSecondary }]}>Email</Text>
          <Text style={[styles.valueText, { color: theme.colors.text }]}>{item.personalEmail}</Text>
        </View>

        <View style={styles.fullWidthCol}>
          <Text style={[styles.keyText, { color: theme.colors.textSecondary }]}>Main Hospital</Text>
          <Text style={[styles.valueText, { color: theme.colors.text }]}>{item.mainHospital}</Text>
        </View>

        {/* Business Card Section */}
        {item.businessCard && (
          <View style={styles.businessCardContainer}>
            <Text style={[styles.keyText, { color: theme.colors.textSecondary, marginBottom: 8 }]}>Business Card</Text>
            <Image source={{ uri: item.businessCard }} style={styles.businessCardImage} />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={DUMMY_CONTACTS}
        keyExtractor={item => item.id}
        renderItem={renderContactCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16 },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  cardBody: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  keyValueCol: {
    flex: 1,
  },
  fullWidthCol: {
    width: '100%',
  },
  keyText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
  },
  businessCardContainer: {
    marginTop: 8,
  },
  businessCardImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default CRMContactListScreen;
