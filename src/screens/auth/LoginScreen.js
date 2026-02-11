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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { CustomInput, CustomButton } from '@components/common';
import { useLoginMutation } from '@api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@store/slices/authSlice';
import theme from '@config/theme';

/**
 * LoginScreen - Professional login screen with validation
 */
const LoginScreen = ({ navigation }) => {
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
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
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

      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      // Error is already handled in authApi with Toast
      console.log('Login error:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <LinearGradient
      colors={[
        theme.colors.background,
        theme.colors.darkNavy,
        theme.colors.mediumBlue,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Section */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>D</Text>
                  </View>
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in to continue to Desolution
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
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
                  style={styles.loginButton}
                  icon="log-in-outline"
                  iconPosition="right"
                />

                {/* Footer Links */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Powered by Desolution</Text>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing['3xl'],
    marginBottom: theme.spacing['2xl'],
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  logoText: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    marginTop: theme.spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default LoginScreen;
