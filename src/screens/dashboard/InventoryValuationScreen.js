import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { useSelector } from 'react-redux';
import {
  useGetDashCategoryWiseValutionMutation,
  useGetDashLocationWiseValutionMutation,
  useGetDashItemWiseValutionMutation,
} from '@api/dashboardApi';
import { LoadingSpinner } from '@components/common';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_CATEGORY = 'category';
const TAB_LOCATION = 'location';
const TAB_ITEM = 'item';

const InventoryValuationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const company = useSelector(state => state.auth.company);
  const [activeTab, setActiveTab] = useState(TAB_CATEGORY);
  const [categoryData, setCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [categoryFetched, setCategoryFetched] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const [itemFetched, setItemFetched] = useState(false);

  const [getCategoryWise, { isLoading: categoryLoading }] =
    useGetDashCategoryWiseValutionMutation();
  const [getLocationWise, { isLoading: locationLoading }] =
    useGetDashLocationWiseValutionMutation();
  const [getItemWise, { isLoading: itemLoading }] =
    useGetDashItemWiseValutionMutation();

  const isLoading = categoryLoading || locationLoading || itemLoading;

  // Fetch category data only once
  const fetchCategoryData = useCallback(async () => {
    if (categoryFetched) return;
    try {
      const response = await getCategoryWise({ company }).unwrap();
      if (response.status_cate_wise_valutions === 'true') {
        setCategoryData(response.data_cate_wise_valutions || []);
        setCategoryFetched(true);
      }
    } catch (error) {
      console.log('Category fetch error:', error);
    }
  }, [company, getCategoryWise, categoryFetched]);

  // Fetch location data only once
  const fetchLocationData = useCallback(async () => {
    if (locationFetched) return;
    try {
      const response = await getLocationWise({ company }).unwrap();
      if (response.status_loc_wise_valutions === 'true') {
        setLocationData(response.data_loc_wise_valutions || []);
        setLocationFetched(true);
      }
    } catch (error) {
      console.log('Location fetch error:', error);
    }
  }, [company, getLocationWise, locationFetched]);

  // Fetch item data only once
  const fetchItemData = useCallback(async () => {
    if (itemFetched) return;
    try {
      const response = await getItemWise({ company }).unwrap();
      if (response.status_item_wise_valutions === 'true') {
        setItemData(response.data_item_wise_valutions || []);
        setItemFetched(true);
      }
    } catch (error) {
      console.log('Item fetch error:', error);
    }
  }, [company, getItemWise, itemFetched]);

  useEffect(() => {
    navigation.setOptions({ title: 'Inventory Valuation' });
    // Fetch category data on mount (default tab)
    fetchCategoryData();
  }, [navigation, fetchCategoryData]);

  const handleTabChange = tab => {
    setActiveTab(tab);
    if (tab === TAB_LOCATION && !locationFetched) {
      fetchLocationData();
    } else if (tab === TAB_ITEM && !itemFetched) {
      fetchItemData();
    }
  };

  const currentData =
    activeTab === TAB_CATEGORY
      ? categoryData
      : activeTab === TAB_LOCATION
      ? locationData
      : itemData;

  const totalValue = currentData.reduce((acc, item) => {
    const value = parseFloat(item.total || '0');
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  const renderItem = ({ item, index }) => {
    const name = item.description || item.category_name || item.location_name;
    const value = parseFloat(item.total || '0');
    const isNegative = value < 0;

    return (
      <View
        key={index}
        style={[
          s.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={s.cardLeft}>
          <View
            style={[
              s.iconBox,
              { backgroundColor: (isNegative ? '#EF4444' : '#10B981') + '15' },
            ]}
          >
            <Icon
              name={
                activeTab === TAB_CATEGORY
                  ? 'cube-outline'
                  : activeTab === TAB_LOCATION
                  ? 'location-outline'
                  : 'pricetag-outline'
              }
              size={22}
              color={isNegative ? '#EF4444' : '#10B981'}
            />
          </View>
          <View style={s.textCont}>
            <Text
              style={[s.itemName, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {name}
            </Text>

          </View>
        </View>
        <View style={s.cardRight}>
          <Text
            style={[
              s.itemAmount,
              { color: isNegative ? '#EF4444' : theme.colors.text },
            ]}
          >
            {Math.abs(value).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      </View>
    );
  };

  const s = getStyles(theme);

  return (
    <View style={s.container}>
      {isLoading && !categoryFetched && !locationFetched && !itemFetched ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            activeTab === TAB_CATEGORY
              ? `cat-${item.category_id || index}`
              : activeTab === TAB_LOCATION
              ? `loc-${item.loc_code || index}`
              : `item-${item.item_id || item.item_code || index}`
          }
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          removeClippedSubviews={Platform.OS === 'android'}
          ListHeaderComponent={
            <View>
              {/* Tab Switcher */}
              <View style={[s.tabContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <TouchableOpacity
                  style={[
                    s.tabButton,
                    activeTab === TAB_CATEGORY && { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => handleTabChange(TAB_CATEGORY)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      s.tabText,
                      { color: activeTab === TAB_CATEGORY ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    Category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    s.tabButton,
                    activeTab === TAB_LOCATION && { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => handleTabChange(TAB_LOCATION)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      s.tabText,
                      { color: activeTab === TAB_LOCATION ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    s.tabButton,
                    activeTab === TAB_ITEM && { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => handleTabChange(TAB_ITEM)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      s.tabText,
                      { color: activeTab === TAB_ITEM ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    Item
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Summary Card */}
              {currentData.length > 0 && (
                <View
                  style={[
                    s.summaryCard,
                    {
                      backgroundColor: theme.colors.primary + '10',
                      borderColor: theme.colors.primary + '30',
                    },
                  ]}
                >
                  <View style={s.summaryLeft}>
                    <View
                      style={[
                        s.summaryIconBox,
                        { backgroundColor: theme.colors.primary + '20' },
                      ]}
                    >
                      <Icon
                        name="calculator-outline"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View>
                      <Text
                        style={[
                          s.summaryTitle,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        Total {activeTab === TAB_CATEGORY ? 'Category' : activeTab === TAB_LOCATION ? 'Location' : 'Item'} Value
                      </Text>
                      <Text
                        style={[
                          s.summaryAmount,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {totalValue.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Section Title */}
              <Text style={[s.sectionTitle, { color: theme.colors.text }]}>
                {activeTab === TAB_CATEGORY ? 'Categories' : activeTab === TAB_LOCATION ? 'Locations' : 'Items'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={{ color: theme.colors.textSecondary }}>
                No data found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      borderRadius: 12,
      borderWidth: 1,
      padding: 4,
      marginBottom: 20,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabText: {
      fontSize: 14,
      fontWeight: '700',
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 20,
    },
    summaryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    summaryIconBox: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 4,
    },
    summaryAmount: {
      fontSize: 22,
      fontWeight: '800',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 16,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 12,
      ...theme.shadows?.sm,
    },
    cardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textCont: {
      flex: 1,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '700',
    },
    itemCode: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 2,
    },
    cardRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemAmount: {
      fontSize: 15,
      fontWeight: '800',
    },
    empty: {
      padding: 40,
      alignItems: 'center',
    },
  });

export default InventoryValuationScreen;
