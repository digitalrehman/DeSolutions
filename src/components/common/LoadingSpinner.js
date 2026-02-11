import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '@config/theme';

/**
 * LoadingSpinner - Reusable loading indicator
 * @param {string} size - Spinner size: 'small', 'large'
 * @param {string} color - Spinner color
 * @param {object} style - Container style override
 */
const LoadingSpinner = ({
  size = 'large',
  color = theme.colors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default LoadingSpinner;
