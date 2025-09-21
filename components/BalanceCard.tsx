import { ModernCard } from '@/components/ModernCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { financeUtils } from '@/lib/financeStorage';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface BalanceCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  icon?: string;
  variant?: 'income' | 'expense' | 'balance';
  onPress?: () => void;
  style?: ViewStyle;
  showTrend?: boolean;
  trendValue?: number;
}

export function BalanceCard({
  title,
  amount,
  subtitle,
  icon,
  variant = 'balance',
  onPress,
  style,
  showTrend = false,
  trendValue = 0,
}: BalanceCardProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const getVariantColor = () => {
    switch (variant) {
      case 'income':
        return Colors[colorScheme].income;
      case 'expense':
        return Colors[colorScheme].expense;
      default:
        return Colors[colorScheme].primary;
    }
  };

  const getVariantBackground = () => {
    switch (variant) {
      case 'income':
        return Colors[colorScheme].income + '15';
      case 'expense':
        return Colors[colorScheme].expense + '15';
      default:
        return Colors[colorScheme].primary + '15';
    }
  };

  const getTrendIcon = () => {
    if (!showTrend) return null;
    return trendValue > 0 ? '📈' : trendValue < 0 ? '📉' : '➡️';
  };

  const getTrendColor = () => {
    if (trendValue > 0) return Colors[colorScheme].success;
    if (trendValue < 0) return Colors[colorScheme].error;
    return Colors[colorScheme].icon;
  };

  return (
    <ModernCard onPress={onPress} style={[styles.container, style] as any}>
      <ThemedView style={[styles.header, { backgroundColor: getVariantBackground() }]}>
        {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
        <ThemedView style={styles.headerText}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.content}>
        <ThemedText style={[styles.amount, { color: getVariantColor() }]}>
          {financeUtils.formatCurrency(amount)}
        </ThemedText>
        
        {showTrend && (
          <ThemedView style={styles.trendContainer}>
            <ThemedText style={styles.trendIcon}>{getTrendIcon()}</ThemedText>
            <ThemedText style={[styles.trendText, { color: getTrendColor() }]}>
              {Math.abs(trendValue).toFixed(1)}%
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  trendIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
