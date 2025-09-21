import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from 'react-native-reanimated';

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
}

export function AnimatedProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  style,
  animated = true,
  delay = 0,
}: AnimatedProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const progressWidth = useSharedValue(0);

  const defaultColor = color || Colors[colorScheme].primary;
  const defaultBackgroundColor = backgroundColor || Colors[colorScheme].border;

  useEffect(() => {
    if (animated) {
      progressWidth.value = withDelay(
        delay,
        withSpring(Math.min(Math.max(progress, 0), 100), {
          damping: 15,
          stiffness: 100,
        })
      );
    } else {
      progressWidth.value = Math.min(Math.max(progress, 0), 100);
    }
  }, [progress, animated, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  const getProgressColor = () => {
    if (color) return color;
    
    if (progress < 50) return Colors[colorScheme].success;
    if (progress < 80) return Colors[colorScheme].warning;
    return Colors[colorScheme].error;
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          height,
          backgroundColor: defaultBackgroundColor,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            height: height - 2,
            backgroundColor: getProgressColor(),
            borderRadius: (height - 2) / 2,
          },
          animatedStyle,
        ]}
      />
      
      {/* Shine effect */}
      <Animated.View
        style={[
          styles.shine,
          {
            height: height - 2,
            borderRadius: (height - 2) / 2,
          },
          animatedStyle,
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 1,
    top: 1,
  },
  shine: {
    position: 'absolute',
    left: 1,
    top: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
  },
});
