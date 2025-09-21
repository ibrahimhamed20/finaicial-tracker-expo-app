import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FinanceCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  icon?: string;
}

export function FinanceCard({ 
  title, 
  amount, 
  subtitle, 
  color = '#4ECDC4', 
  onPress,
  icon 
}: FinanceCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CardComponent = onPress ? TouchableOpacity : ThemedView;

  return (
    <CardComponent 
      style={[styles.card, { backgroundColor: color + '20' }]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.amount, { color: color }]}>
        {formatCurrency(amount)}
      </ThemedText>
      {subtitle && (
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      )}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'center',
  },
});
