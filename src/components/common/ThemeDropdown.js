import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@config/useTheme';
import { themeList } from '@config/themes';

/**
 * ThemeDropdown - Professional theme selector with dropdown
 */
const ThemeDropdown = ({ style, compact = false }) => {
  const { theme, themeName, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = selectedThemeId => {
    setTheme(selectedThemeId);
    setIsOpen(false);
  };

  const renderThemeItem = ({ item }) => {
    const isSelected = item.id === themeName;

    return (
      <TouchableOpacity
        style={[
          styles.themeItem,
          {
            backgroundColor: isSelected
              ? theme.colors.primary + '20'
              : theme.colors.surface,
            borderColor: isSelected
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
        onPress={() => handleThemeSelect(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.themeInfo}>
          {/* Color Preview */}
          <View style={styles.colorPreview}>
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: item.colors.primary },
              ]}
            />
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: item.colors.background },
              ]}
            />
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: item.colors.surface },
              ]}
            />
          </View>

          {/* Theme Name */}
          <Text style={[styles.themeName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
        </View>

        {/* Selected Indicator */}
        {isSelected && (
          <Icon
            name="checkmark-circle"
            size={24}
            color={theme.colors.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        style={[
          styles.trigger,
          compact && styles.compactTrigger,
          {
            backgroundColor: compact ? 'transparent' : theme.colors.surface,
            borderColor: compact ? 'transparent' : theme.colors.border,
            borderWidth: compact ? 0 : 1,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Icon
          name="color-palette"
          size={compact ? 24 : 20}
          color={compact ? '#FFFFFF' : theme.colors.primary}
        />
        {!compact && (
          <>
            <Text style={[styles.triggerText, { color: theme.colors.text }]}>
              {themeList.find(t => t.id === themeName)?.name || 'Select Theme'}
            </Text>
            <Icon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </>
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.background },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Choose Theme
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Theme List */}
            <FlatList
              data={themeList}
              renderItem={renderThemeItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  compactContainer: {
    width: 'auto',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  compactTrigger: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  themeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemeDropdown;
