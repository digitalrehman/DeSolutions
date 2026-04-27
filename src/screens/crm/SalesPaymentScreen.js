import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useTheme } from '@config/useTheme';

const SalesPaymentScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const customer = route?.params?.customer || {};

  // Form State (Only Cheque)
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [date, setDate] = useState(new Date());

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatDisplayDate = (d) => {
    if (!d) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDone = () => {
    // Process Payment Logic here later
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Cheque Payment</Text>

          <View style={styles.formContainer}>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Bank name"
                placeholderTextColor={theme.colors.textSecondary}
                value={bankName}
                onChangeText={setBankName}
              />
            </View>

            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Cheque no"
                placeholderTextColor={theme.colors.textSecondary}
                value={chequeNo}
                onChangeText={setChequeNo}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10, backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Amount"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1, backgroundColor: theme.colors.surface, shadowColor: theme.colors.text }]}>
                <TouchableOpacity
                  style={[styles.input, styles.datePickerBtn]}
                  onPress={() => setDatePickerVisibility(true)}
                >
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>{formatDisplayDate(date)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(d) => {
          setDate(d);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

export default SalesPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  formContainer: {
    gap: 15,
  },
  inputWrapper: {
    borderRadius: 30,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerBtn: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginVertical: 35,
  },
  doneBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
