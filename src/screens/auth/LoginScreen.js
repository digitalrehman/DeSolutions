import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomInput, CustomButton } from '@components/common';
import { useLoginMutation } from '@api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@store/slices/authSlice';
import { useTheme } from '@config/useTheme';

/**
 * LoginScreen - Professional login screen with dynamic theme and "Desolutions" branding
 */
const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const dynamicStyles = getStyles(theme);

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        username: formData.username,
        password: formData.password,
      }).unwrap();

      // Save user data to Redux store
      dispatch(setCredentials({ user: result.user, token: null }));
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={dynamicStyles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={dynamicStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={dynamicStyles.header}>
              <View style={dynamicStyles.logoContainer}>
                <Text style={dynamicStyles.logoText}>Desolutions</Text>
                <View
                  style={[
                    dynamicStyles.logoBar,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              </View>
              <Text
                style={[
                  dynamicStyles.subtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Sign in to continue to your account
              </Text>
            </View>

            {/* Form Section */}
            <View style={dynamicStyles.formContainer}>
              <CustomInput
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChangeText={value => handleInputChange('username', value)}
                error={errors.username}
                leftIcon="person-outline"
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                error={errors.password}
                leftIcon="lock-closed-outline"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={dynamicStyles.loginButton}
                icon="log-in-outline"
                iconPosition="right"
              />

              {/* Footer Links */}
              <View style={dynamicStyles.footer}>
                <Text
                  style={[
                    dynamicStyles.footerText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Powered by Desolutions
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    header: {
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 40,
    },
    logoContainer: {
      marginBottom: 24,
      alignItems: 'center',
    },
    logoText: {
      fontSize: 36,
      fontWeight: '700',
      color: theme.colors.primary,
      letterSpacing: 1,
    },
    logoBar: {
      width: 40,
      height: 4,
      marginTop: 4,
      borderRadius: 2,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
    },
    formContainer: {
      flex: 1,
    },
    loginButton: {
      marginTop: 24,
    },
    footer: {
      marginTop: 'auto',
      paddingVertical: 32,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
    },
  });

export default LoginScreen;
