import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeDropdown } from '@components/common';
import { logout, selectCurrentUser } from '@store/slices/authSlice';
import { useTheme } from '@config/useTheme';
import DailyActivitiesSlider from '@components/dashboard/DailyActivitiesSlider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.25;

/**
 * MainScreen - Professional ERP Dashboard with Grid Navigation
 */
const MainScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      id: 'Dashboard',
      name: 'Dashboard',
      icon: 'grid-outline',
      screen: 'Dashboard',
    },
    {
      id: 'Approvals',
      name: 'Approvals',
      icon: 'checkmark-circle-outline',
      screen: 'Approvals',
    },
    { id: 'Sales', name: 'Sales', icon: 'cart-outline', screen: 'Sales' },
    {
      id: 'Purchase',
      name: 'Purchase',
      icon: 'bag-handle-outline',
      screen: 'Purchase',
    },
    {
      id: 'Inventory',
      name: 'Inventory',
      icon: 'cube-outline',
      screen: 'Inventory',
    },
    { id: 'HCM', name: 'HCM', icon: 'people-outline', screen: 'HCM' },
    {
      id: 'Manufacturing',
      name: 'Manufacturing',
      icon: 'settings-outline',
      screen: 'Manufacturing',
    },
    { id: 'CRM', name: 'CRM', icon: 'business-outline', screen: 'CRM' },
    { id: 'Finance', name: 'Finance', icon: 'cash-outline', screen: 'Finance' },
  ];

  const dynamicStyles = getStyles(theme);

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Grid Section */}
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.gridContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={dynamicStyles.gridBox}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View
                style={[
                  dynamicStyles.iconContainer,
                  { backgroundColor: theme.colors.primary + '15' },
                ]}
              >
                <Icon name={item.icon} size={30} color={theme.colors.primary} />
              </View>
              <Text style={dynamicStyles.boxName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Activities Slider */}
        <DailyActivitiesSlider />
      </ScrollView>
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
      height: HEADER_HEIGHT,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      ...theme.shadows.lg,
    },
    headerContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 20,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    userName: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      padding: 8,
      marginLeft: 4,
    },
    themeIcon: {
      width: 'auto',
      marginLeft: 4,
    },
    logoutBtn: {
      marginLeft: 8,
    },
    headerBranding: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    dashboardText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      marginTop: 8,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 30,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridBox: {
      width: '31%', // Roughly 3 in a line with spacing
      aspectRatio: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    boxName: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
    },
  });

export default MainScreen;
