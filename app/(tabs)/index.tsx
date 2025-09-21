import { AnimatedProgressBar } from '@/components/AnimatedProgressBar';
import { BalanceCard } from '@/components/BalanceCard';
import { GradientCard } from '@/components/GradientCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ModernCard } from '@/components/ModernCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFinance } from '@/hooks/useFinance';
import { financeUtils } from '@/lib/financeStorage';
import { DEFAULT_CATEGORIES } from '@/types/finance';
import { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, { Easing, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { summary, transactions, loading, addTransaction } = useFinance();
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();
  
  // Debug safe area values
  console.log('Safe area values:', {
    platform: Platform.OS,
    statusBarHeight: StatusBar.currentHeight,
    insetsTop: insets.top,
    calculatedHeight: Platform.OS === 'android' 
      ? (StatusBar.currentHeight || 24) + 40 
      : insets.top + 20
  });
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense'>('expense');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDescription, setQuickDescription] = useState('');
  const [quickCategory, setQuickCategory] = useState('');

  if (loading) {
    return (
      <LoadingScreen 
        title="Loading Dashboard"
        subtitle="Preparing your financial overview..."
      />
    );
  }

  const handleQuickAdd = (type: 'income' | 'expense') => {
    setQuickAddType(type);
    setQuickCategory(DEFAULT_CATEGORIES.find(c => c.type === type)?.name || '');
    setQuickAmount('');
    setQuickDescription('');
    setQuickAddModal(true);
  };

  const handleQuickAddSubmit = async () => {
    if (!quickAmount || !quickDescription || !quickCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(quickAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addTransaction({
        type: quickAddType,
        amount: numAmount,
        category: quickCategory,
        description: quickDescription,
        date: new Date().toISOString().split('T')[0],
      });

      setQuickAddModal(false);
      setQuickAmount('');
      setQuickDescription('');
      setQuickCategory('');

      Alert.alert('Success', 'Transaction added successfully!');
    } catch {
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const getTopExpenseCategories = () => {
    const categoryTotals: Record<string, number> = {};

    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / summary.totalExpenses) * 100,
        icon: DEFAULT_CATEGORIES.find(c => c.name === category)?.icon || '💰',
        color: DEFAULT_CATEGORIES.find(c => c.name === category)?.color || Colors[colorScheme].primary,
      }));
  };

  const topCategories = getTopExpenseCategories();

  return (
    <Animated.View 
      entering={FadeInDown.duration(800).easing(Easing.out(Easing.cubic))}
      style={[
        styles.container, 
        { 
          backgroundColor: Colors[colorScheme].background,
          paddingTop: Platform.OS === 'android'
            ? (StatusBar.currentHeight || 24) + 40
            : insets.top + 20
        }
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <GradientCard
            gradient={['#6366f1', '#8b5cf6'] as const}
            style={styles.headerCard}
          >
            <ThemedText type="title" style={styles.greeting}>
              💰 Finance Tracker 💰
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Your beautiful financial dashboard
        </ThemedText>
            <StatusBadge
              type={summary.balance >= 0 ? 'success' : 'warning'}
              text={summary.balance >= 0 ? 'Great job!' : 'Watch spending'}
            />
          </GradientCard>
        </Animated.View>

        {/* Balance Cards */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.balanceSection}>
          <BalanceCard
            title="Total Income"
            amount={summary.totalIncome}
            icon="💰"
            variant="income"
            showTrend={true}
            trendValue={5.2}
          />

          <BalanceCard
            title="Total Expenses"
            amount={summary.totalExpenses}
            icon="💸"
            variant="expense"
            showTrend={true}
            trendValue={-2.1}
          />

          <BalanceCard
            title="Net Balance"
            amount={summary.balance}
            icon="🏦"
            variant="balance"
            showTrend={true}
            trendValue={summary.balance >= 0 ? 3.1 : -1.5}
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <ModernCard style={styles.section} variant="primary">
            <ThemedText type="subtitle" style={styles.sectionTitle}>⚡ Quick Actions</ThemedText>
            <ThemedView style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors[colorScheme].income }]}
                onPress={() => handleQuickAdd('income')}
              >
                <ThemedText style={styles.actionButtonIcon}>💰</ThemedText>
                <ThemedText style={styles.actionButtonText}>Add Income</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors[colorScheme].expense }]}
                onPress={() => handleQuickAdd('expense')}
              >
                <ThemedText style={styles.actionButtonIcon}>💸</ThemedText>
                <ThemedText style={styles.actionButtonText}>Add Expense</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ModernCard>
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <ModernCard style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📝 Recent Transactions</ThemedText>

            {transactions.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyStateIcon}>📝</ThemedText>
                <ThemedText style={styles.emptyStateText}>No transactions yet</ThemedText>
                <ThemedText style={styles.emptyStateSubtext}>
                  Add your first transaction to get started!
                </ThemedText>
              </ThemedView>
            ) : (
              <ThemedView style={styles.transactionsList}>
                {transactions.slice(0, 5).map((transaction, index) => {
                  const category = DEFAULT_CATEGORIES.find(c => c.name === transaction.category);
                  return (
                    <Animated.View
                      key={transaction.id}
                      entering={FadeInRight.delay(index * 100)}
                    >
                      <ThemedView style={[styles.transactionItem, { backgroundColor: Colors[colorScheme].cardSecondary }]}>
                        <ThemedView style={styles.transactionLeft}>
                          <ThemedView style={[
                            styles.transactionIconContainer,
                            { backgroundColor: category?.color + '40' || Colors[colorScheme].primary + '40' }
                          ]}>
                            <ThemedText style={styles.transactionIcon}>{category?.icon || '💰'}</ThemedText>
                          </ThemedView>
                          <ThemedView style={styles.transactionDetails}>
                            <ThemedText type="defaultSemiBold" style={styles.transactionDescription}>
                              {transaction.description}
                            </ThemedText>
                            <ThemedText style={styles.transactionCategory}>{transaction.category}</ThemedText>
                            <ThemedText style={styles.transactionDate}>
                              {new Date(transaction.date).toLocaleDateString()}
                            </ThemedText>
                          </ThemedView>
                        </ThemedView>
                        <ThemedText style={[
                          styles.transactionAmount,
                          { color: transaction.type === 'income' ? Colors[colorScheme].income : Colors[colorScheme].expense }
                        ]}>
                          {transaction.type === 'income' ? '+' : '-'}{financeUtils.formatCurrency(transaction.amount)}
        </ThemedText>
      </ThemedView>
                    </Animated.View>
                  );
                })}
              </ThemedView>
            )}
          </ModernCard>
        </Animated.View>

        {/* Top Expense Categories */}
        {topCategories.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)}>
            <ModernCard style={styles.section}>
              <ThemedView style={styles.categoriesHeader}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>📊 Top Expense Categories</ThemedText>
                <ThemedText style={styles.categoriesSubtitle}>Your biggest spending areas this month</ThemedText>
              </ThemedView>
              <ThemedView style={styles.categoriesList}>
                {topCategories.map((category, index) => (
                  <Animated.View
                    key={category.category}
                    entering={FadeInRight.delay(index * 150)}
                  >
                    <TouchableOpacity
                      style={[styles.categoryCard, { backgroundColor: Colors[colorScheme].cardSecondary }]}
                      activeOpacity={0.8}
                    >
                      <ThemedView style={styles.categoryItem}>
                        <ThemedView style={styles.categoryLeft}>
                          <ThemedView style={[styles.categoryIconContainer, { backgroundColor: category.color + '40' }]}>
                            <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                          </ThemedView>
                          <ThemedView style={styles.categoryInfo}>
                            <ThemedText type="defaultSemiBold" style={styles.categoryName}>
                              {category.category}
                            </ThemedText>
                            <ThemedText style={styles.categoryPercentage}>
                              {category.percentage.toFixed(1)}% of total expenses
        </ThemedText>
      </ThemedView>
                        </ThemedView>
                        <ThemedView style={styles.categoryRight}>
                          <ThemedText style={[styles.categoryAmount, { color: category.color }]}>
                            {financeUtils.formatCurrency(category.amount)}
                          </ThemedText>
                          <ThemedView style={styles.progressContainer}>
                            <AnimatedProgressBar
                              progress={category.percentage}
                              color={category.color}
                              height={8}
                            />
                          </ThemedView>
                        </ThemedView>
                      </ThemedView>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ThemedView>
            </ModernCard>
          </Animated.View>
        )}

        {/* Budget Status */}
        {summary.budgetStatus.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600)}>
            <ModernCard style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>🎯 Budget Status</ThemedText>
              <ThemedView style={styles.budgetsList}>
                {summary.budgetStatus.slice(0, 3).map((budget, index) => (
                  <Animated.View
                    key={budget.category}
                    entering={FadeInRight.delay(index * 100)}
                  >
                    <ThemedView style={[styles.budgetItem, { backgroundColor: Colors[colorScheme].cardSecondary }]}>
                      <ThemedView style={styles.budgetLeft}>
                        <ThemedView style={[
                          styles.budgetIconContainer,
                          { backgroundColor: Colors[colorScheme].primary + '40' }
                        ]}>
                          <ThemedText style={styles.budgetIcon}>🎯</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.budgetInfo}>
                          <ThemedText type="defaultSemiBold" style={styles.budgetCategory}>
                            {budget.category}
                          </ThemedText>
                          <ThemedText style={styles.budgetPeriod}>Monthly Budget</ThemedText>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView style={styles.budgetRight}>
                        <ThemedText style={styles.budgetAmount}>
                          {financeUtils.formatCurrency(budget.spent)}
                        </ThemedText>
                        <ThemedText style={styles.budgetLimit}>
                          of {financeUtils.formatCurrency(budget.limit)}
                        </ThemedText>
                        <AnimatedProgressBar
                          progress={budget.percentage}
                          color={budget.percentage > 100 ? Colors[colorScheme].error : Colors[colorScheme].primary}
                          height={6}
                        />
                      </ThemedView>
                    </ThemedView>
                  </Animated.View>
                ))}
              </ThemedView>
            </ModernCard>
          </Animated.View>
        )}

        {/* <ThemedView style={styles.bottomSpacing} /> */}

        {/* Quick Add Modal */}
        <Modal
          visible={quickAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setQuickAddModal(false)}
        >
          <ThemedView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme].background }]}>
            <ThemedView style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme].border }]}>
              <TouchableOpacity onPress={() => setQuickAddModal(false)}>
                <ThemedText style={[styles.cancelButton, { color: Colors[colorScheme].primary }]}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                Quick Add {quickAddType === 'income' ? 'Income' : 'Expense'}
              </ThemedText>
              <TouchableOpacity onPress={handleQuickAddSubmit}>
                <ThemedText style={[styles.saveButton, { color: Colors[colorScheme].primary }]}>Save</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Amount Input */}
              <ModernCard style={styles.inputCard}>
                <ThemedText style={styles.inputLabel}>Amount</ThemedText>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: Colors[colorScheme].border,
                      backgroundColor: Colors[colorScheme].cardSecondary,
                      color: Colors[colorScheme].text,
                    }
                  ]}
                  value={quickAmount}
                  onChangeText={setQuickAmount}
                  placeholder="0.00"
                  placeholderTextColor={Colors[colorScheme].icon}
                  keyboardType="decimal-pad"
                />
              </ModernCard>

              {/* Description Input */}
              <ModernCard style={styles.inputCard}>
                <ThemedText style={styles.inputLabel}>Description</ThemedText>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: Colors[colorScheme].border,
                      backgroundColor: Colors[colorScheme].cardSecondary,
                      color: Colors[colorScheme].text,
                    }
                  ]}
                  value={quickDescription}
                  onChangeText={setQuickDescription}
                  placeholder="Enter description..."
                  placeholderTextColor={Colors[colorScheme].icon}
                />
              </ModernCard>

              {/* Category Selection */}
              <ModernCard style={styles.inputCard}>
                <ThemedText style={styles.inputLabel}>Category</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  <ThemedView style={styles.categoryContainer}>
                    {DEFAULT_CATEGORIES.filter(c => c.type === quickAddType).map(category => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryButton,
                          {
                            backgroundColor: category.color + '20',
                            borderColor: quickCategory === category.name ? category.color : 'transparent',
                          },
                        ]}
                        onPress={() => setQuickCategory(category.name)}
                        activeOpacity={0.8}
                      >
                        <ThemedText style={styles.categoryEmoji}>{category.icon}</ThemedText>
                        <ThemedText style={styles.categoryButtonText}>{category.name}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </ScrollView>
              </ModernCard>
            </ScrollView>
          </ThemedView>
        </Modal>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    padding: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: 'white',
  },
  subtitle: {
    opacity: 0.9,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 16,
  },
  balanceSection: {
    padding: 16,
    gap: 16,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 6,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    opacity: 0.6,
    textAlign: 'center',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.12)',
    elevation: 2,
  },
  transactionIcon: {
    fontSize: 24,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    opacity: 0.5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoriesHeader: {
    marginBottom: 20,
  },
  categoriesSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 26,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    marginBottom: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    opacity: 0.6,
  },
  categoryRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
  },
  budgetsList: {
    gap: 16,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.12)',
    elevation: 2,
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetCategory: {
    fontSize: 16,
    marginBottom: 2,
  },
  budgetPeriod: {
    fontSize: 12,
    opacity: 0.6,
  },
  budgetRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  budgetLimit: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  topSpacing: {
    height: 100,
  },
  bottomSpacing: {
    height: 100,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputCard: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  categoryButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 2,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08)',
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryButtonText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});