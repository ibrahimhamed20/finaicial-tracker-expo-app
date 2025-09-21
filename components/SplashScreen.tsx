import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const progressOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  // Simple floating elements - just for visual effect
  const floatingOpacity = useSharedValue(0);

  const startAnimation = useCallback(() => {
    // Start immediately - no delay
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 150 })
    );
    logoOpacity.value = withTiming(1, { duration: 300 });

    // Floating elements animation
    floatingOpacity.value = withDelay(200, withTiming(0.3, { duration: 500 }));

    // Title animation
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    titleTranslateY.value = withDelay(
      100,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    // Subtitle animation
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    subtitleTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) })
    );

    // Progress bar animation
    progressOpacity.value = withDelay(300, withTiming(1, { duration: 150 }));
    progressWidth.value = withDelay(
      300,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) })
    );

    // Finish animation and call callback
    setTimeout(() => {
      runOnJS(onAnimationFinish)();
    }, 2000);
  }, [floatingOpacity, logoOpacity, logoScale, onAnimationFinish, progressOpacity, progressWidth, subtitleOpacity, subtitleTranslateY, titleOpacity, titleTranslateY]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
    width: `${progressWidth.value * 100}%`,
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    opacity: floatingOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#6366f1', '#8b5cf6', '#a855f7']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Floating elements */}
      <Animated.View style={[styles.floatingContainer, floatingStyle]}>
        <ThemedText style={styles.floatingText}>💰 💰 💰</ThemedText>
      </Animated.View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoCircle}>
            <View style={styles.emojiContainer}>
              <ThemedText style={styles.logoText}>💵</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={titleAnimatedStyle}>
          <ThemedText style={styles.title}>Finance Tracker</ThemedText>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleAnimatedStyle}>
          <ThemedText style={styles.subtitle}>
            Your Personal Financial Assistant
          </ThemedText>
        </Animated.View>

        {/* Progress bar */}
        <Animated.View style={[styles.progressContainer, progressAnimatedStyle]}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
        </Animated.View>

        {/* Loading text */}
        <Animated.View style={subtitleAnimatedStyle}>
          <ThemedText style={styles.loadingText}>
            Preparing your dashboard...
          </ThemedText>
        </Animated.View>
      </View>

      {/* Bottom branding */}
      <Animated.View style={[styles.bottomBrand, subtitleAnimatedStyle]}>
        <ThemedText style={styles.brandText}>Made with ❤️</ThemedText>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  floatingContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  floatingText: {
    fontSize: 24,
    opacity: 0.6,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
    elevation: 8,
    padding: 15,
  },
  emojiContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 70,
    textAlign: 'center',
    lineHeight: 70,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  progressContainer: {
    width: 200,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  bottomBrand: {
    position: 'absolute',
    bottom: 50,
  },
  brandText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});
