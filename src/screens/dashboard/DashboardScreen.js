import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButton, ThemeDropdown } from '@components/common';
import { logout, selectCurrentUser } from '@store/slices/authSlice';
import { useTheme } from '@config/useTheme';

/**
 * DashboardScreen - Main app screen with theme switcher and logout
 */
const DashboardScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const dynamicStyles = getStyles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.logoText}>Desolutions</Text>
          <Text style={dynamicStyles.title}>Dashboard</Text>
        </View>

        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.cardTitle}>Account Info</Text>
          {user && (
            <View style={dynamicStyles.userInfoRow}>
              <Text style={dynamicStyles.userLabel}>Logged in as:</Text>
              <Text style={dynamicStyles.userValue}>
                {user.user_id || 'User'}
              </Text>
            </View>
          )}
          <Text style={dynamicStyles.welcomeText}>
            Welcome to the new professional theme-able dashboard.
          </Text>
        </View>

        <View style={dynamicStyles.themeSection}>
          <Text style={dynamicStyles.sectionTitle}>App Theme</Text>
          <Text style={dynamicStyles.sectionDescription}>
            Choose from 20 professional themes to customize your experience.
          </Text>
          <ThemeDropdown style={dynamicStyles.dropdown} />
        </View>

        <View style={dynamicStyles.footer}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
            iconPosition="right"
            style={dynamicStyles.logoutButton}
          />
        </View>
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
    scrollContent: {
      padding: 20,
      flexGrow: 1,
    },
    header: {
      marginTop: 20,
      marginBottom: 30,
      alignItems: 'center',
    },
    logoText: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 4,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.text,
    },
    card: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      ...theme.shadows.md,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    userInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    userLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    userValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    welcomeText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    themeSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    dropdown: {
      marginTop: 8,
    },
    footer: {
      marginTop: 'auto',
      paddingVertical: 20,
    },
    logoutButton: {
      width: '100%',
    },
  });

export default DashboardScreen;
