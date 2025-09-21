import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface StatusBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  text: string;
  icon?: string;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({ 
  type, 
  text, 
  icon, 
  style, 
  size = 'medium' 
}: StatusBadgeProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const getStatusColor = () => {
    switch (type) {
      case 'success':
        return Colors[colorScheme].success;
      case 'warning':
        return Colors[colorScheme].warning;
      case 'error':
        return Colors[colorScheme].error;
      default:
        return Colors[colorScheme].primary;
    }
  };

  const getStatusIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          iconSize: 12,
          textSize: 10,
        };
      case 'large':
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          iconSize: 18,
          textSize: 16,
        };
      default:
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          iconSize: 14,
          textSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const statusColor = getStatusColor();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: statusColor + '20',
          borderColor: statusColor + '40',
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <ThemedText style={[styles.icon, { fontSize: sizeStyles.iconSize }]}>
        {getStatusIcon()}
      </ThemedText>
      <ThemedText
        style={[
          styles.text,
          {
            color: statusColor,
            fontSize: sizeStyles.textSize,
          },
        ]}
      >
        {text}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
});
