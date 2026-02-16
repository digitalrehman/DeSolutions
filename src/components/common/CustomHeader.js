import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';

const CustomHeader = ({ navigation, route, options, back }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const title = options.title || route.name;

  const isMainScreen = route.name === 'MainScreen';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          paddingTop: insets.top,
          height: Platform.OS === 'ios' ? 90 + insets.top : 70 + insets.top,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Left: Back Button */}
        <View style={styles.leftContainer}>
          {back && !isMainScreen ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Center: Title */}
        <View style={styles.centerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right: Home Button */}
        <View style={styles.rightContainer}>
          {!isMainScreen ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('MainScreen')}
              style={styles.iconBtn}
            >
              <Icon name="home-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} /> // Spacer to keep title centered on MainScreen if needed
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  iconBtn: {
    padding: 8,
  },
});

export default CustomHeader;
