import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const FinanceScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="cash-outline" size={80} color={theme.colors.primary} />
        <Text style={styles.message}>Finance Module Screen</Text>
        <Text style={styles.subMessage}>Coming Soon...</Text>
      </View>
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    message: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.colors.text,
      marginTop: 20,
    },
    subMessage: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
  });

export default FinanceScreen;
