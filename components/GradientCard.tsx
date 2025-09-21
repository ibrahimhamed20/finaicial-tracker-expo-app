import { Shadows } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface GradientCardProps {
  children: React.ReactNode;
  gradient?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: keyof typeof Shadows;
}

export function GradientCard({
  children,
  gradient = ['#ffffff', '#f8fafc'] as const,
  style,
  onPress,
  shadow = 'medium'
}: GradientCardProps) {

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, Shadows[shadow], style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gradient}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <LinearGradient
      colors={gradient}
      style={[styles.container, Shadows[shadow], style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
});
