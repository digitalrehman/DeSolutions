import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@config/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';

// Dummy data using keys matching Hospital Form
const DUMMY_HOSPITALS = [
  {
    id: '1',
    hospitalName: 'Aga Khan University Hospital',
    address: 'Stadium Road, P.O. Box 3500',
    city: 'Karachi',
    website: 'www.akuh.edu',
    type1: 'Private',
    segment: 'A Class',
    noOfOts: '14',
    noOfBeds: '560',
    status: 'Active',
    customersType: 'Corporate',
  },
  {
    id: '2',
    hospitalName: 'Shaukat Khanum Memorial',
    address: '7A Block R-3, Johar Town',
    city: 'Lahore',
    website: 'www.shaukatkhanum.org.pk',
    type1: 'Trust',
    segment: 'A Class',
    noOfOts: '10',
    noOfBeds: '400',
    status: 'Active',
    customersType: 'Non-Profit',
  },
];

const CRMHospitalListScreen = ({ navigation }) => {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Hospitals',
      hideHomeIcon: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('CRMAddHospital')}
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

  const renderHospitalCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      
      {/* Header section */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
            {item.hospitalName.charAt(0)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.nameText, { color: theme.colors.text }]}>
            {item.hospitalName}
          </Text>
          <Text style={[styles.specialtyText, { color: theme.colors.primary }]}>
            {item.type1} - {item.segment}
          </Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      
      {/* Detail Section */}
      <View style={styles.cardBody}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderKeyValue('City', item.city)}
          {renderKeyValue('Status', item.status)}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderKeyValue('No. of Beds', item.noOfBeds)}
          {renderKeyValue('No. of OTs', item.noOfOts)}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderKeyValue('Customer Type', item.customersType)}
          {renderKeyValue('Website', item.website)}
        </View>

        {/* Full Width Keys */}
        <View style={styles.fullWidthCol}>
          <Text style={[styles.keyText, { color: theme.colors.textSecondary }]}>Address</Text>
          <Text style={[styles.valueText, { color: theme.colors.text }]}>{item.address}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={DUMMY_HOSPITALS}
        keyExtractor={item => item.id}
        renderItem={renderHospitalCard}
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
});

export default CRMHospitalListScreen;
