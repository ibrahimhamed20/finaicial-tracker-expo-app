import { ThemedView } from '@/components/themed-view';
import { Colors, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: keyof typeof Shadows;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function ModernCard({ 
  children, 
  style, 
  onPress,
  shadow = 'medium',
  variant = 'default'
}: ModernCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: Colors[colorScheme].card,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].primary + '10',
          borderColor: Colors[colorScheme].primary + '30',
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].success + '10',
          borderColor: Colors[colorScheme].success + '30',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].warning + '10',
          borderColor: Colors[colorScheme].warning + '30',
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].error + '10',
          borderColor: Colors[colorScheme].error + '30',
        };
      default:
        return baseStyle;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : ThemedView;
  
  return (
    <CardComponent 
      style={[
        styles.container, 
        Shadows[shadow], 
        getCardStyle(),
        style
      ]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
});
