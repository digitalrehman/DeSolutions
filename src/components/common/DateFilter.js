import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@config/useTheme';

const DateFilter = ({
  fromDate,
  toDate,
  onFromDate,
  onToDate,
  onClear,
  onFilter,
}) => {
  const { theme } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const formatDate = (date, placeholder) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const hasFilter = fromDate || toDate;

  const handleAndroidChange = (event, selected) => {
    setPickerVisible(null);
    if (event.type === 'dismissed' || !selected) return;

    if (pickerVisible === 'from') {
      onFromDate(selected);
    } else if (pickerVisible === 'to') {
      onToDate(selected);
    }
  };

  const handleIOSChange = (event, selected) => {
    if (selected) {
      setTempDate(selected);
    }
  };

  const confirmIOSDate = () => {
    if (pickerVisible === 'from') {
      onFromDate(tempDate);
    } else if (pickerVisible === 'to') {
      onToDate(tempDate);
    }
    setPickerVisible(null);
  };

  const openPicker = type => {
    const currentDate = type === 'from' ? fromDate : toDate;
    const initialDate = currentDate || new Date();
    setTempDate(initialDate);
    setPickerVisible(type);
  };

  const s = getStyles(theme);

  return (
    <View style={s.container}>
      <View style={s.row}>
        <TouchableOpacity
          style={[s.dateBox, fromDate && { borderColor: theme.colors.primary }]}
          onPress={() => openPicker('from')}
          activeOpacity={0.75}
        >
          <Icon
            name="calendar-outline"
            size={16}
            color={fromDate ? theme.colors.primary : theme.colors.textSecondary}
            style={s.calIcon}
          />
          <View style={s.dateTextWrapper}>
            <Text
              style={[
                s.dateText,
                {
                  color: fromDate
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {formatDate(fromDate, 'From Date')}
            </Text>
          </View>
        </TouchableOpacity>

        <Icon
          name="arrow-forward"
          size={14}
          color={theme.colors.border}
          style={s.arrow}
        />

        <TouchableOpacity
          style={[s.dateBox, toDate && { borderColor: theme.colors.primary }]}
          onPress={() => openPicker('to')}
          activeOpacity={0.75}
        >
          <Icon
            name="calendar-outline"
            size={16}
            color={toDate ? theme.colors.primary : theme.colors.textSecondary}
            style={s.calIcon}
          />
          <View style={s.dateTextWrapper}>
            <Text
              style={[
                s.dateText,
                {
                  color: toDate
                    ? theme.colors.text
                    : theme.colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {formatDate(toDate, 'To Date')}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={s.actionsWrapper}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: theme.colors.primary }]}
            onPress={onFilter}
            activeOpacity={0.8}
          >
            <Icon name="filter" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {hasFilter && (
            <TouchableOpacity
              style={[
                s.actionBtn,
                s.clearBtn,
                {
                  borderColor: theme.colors.error,
                  backgroundColor: theme.colors.error + '15',
                },
              ]}
              onPress={onClear}
              activeOpacity={0.8}
            >
              <Icon name="close" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {pickerVisible && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
          maximumDate={pickerVisible === 'from' && toDate ? toDate : undefined}
          minimumDate={
            pickerVisible === 'to' && fromDate ? fromDate : undefined
          }
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={pickerVisible !== null}
          transparent
          animationType="slide"
        >
          <TouchableOpacity
            style={s.modalOverlay}
            activeOpacity={1}
            onPress={() => setPickerVisible(null)}
          >
            <View
              style={[
                s.iosPickerContainer,
                { backgroundColor: theme.colors.surface },
              ]}
              onStartShouldSetResponder={() => true}
            >
              <View
                style={[
                  s.iosPickerHeader,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <TouchableOpacity onPress={() => setPickerVisible(null)}>
                  <Text
                    style={[
                      s.iosPickerBtnText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <Text style={[s.iosPickerTitle, { color: theme.colors.text }]}>
                  {pickerVisible === 'from' ? 'From Date' : 'To Date'}
                </Text>
                <TouchableOpacity onPress={confirmIOSDate}>
                  <Text
                    style={[
                      s.iosPickerBtnText,
                      { color: theme.colors.primary, fontWeight: '700' },
                    ]}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleIOSChange}
                textColor={theme.colors.text}
                maximumDate={
                  pickerVisible === 'from' && toDate ? toDate : undefined
                }
                minimumDate={
                  pickerVisible === 'to' && fromDate ? fromDate : undefined
                }
                style={s.iosPicker}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      height: 38,
      paddingHorizontal: 8,
      maxWidth: '38%',
    },
    calIcon: {
      marginRight: 6,
    },
    dateTextWrapper: {
      flex: 1,
    },
    label: {
      fontSize: 9,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dateText: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 1,
    },
    arrow: {
      marginHorizontal: 4,
    },
    actionsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 6,
      gap: 6,
    },
    actionBtn: {
      width: 38,
      height: 38,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    clearBtn: {
      borderWidth: 1,
    },

    // iOS Picker Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iosPickerContainer: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
    },
    iosPickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
    },
    iosPickerTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    iosPickerBtnText: {
      fontSize: 16,
    },
    iosPicker: {
      height: 250,
      width: '100%',
    },
  });

export default DateFilter;
