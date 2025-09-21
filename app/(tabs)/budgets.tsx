import { AnimatedProgressBar } from '@/components/AnimatedProgressBar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ModernCard } from '@/components/ModernCard';
import { StatusBadge } from '@/components/StatusBadge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFinance } from '@/hooks/useFinance';
import { financeUtils } from '@/lib/financeStorage';
import { Budget, DEFAULT_CATEGORIES } from '@/types/finance';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function BudgetsScreen() {
  const { budgets, summary, loading, addBudget, deleteBudget } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const colorScheme = useColorScheme() ?? 'light';

  const expenseCategories = DEFAULT_CATEGORIES.filter(c => c.type === 'expense');

  const handleAddBudget = async () => {
    if (!budgetLimit || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numLimit = parseFloat(budgetLimit);
    if (isNaN(numLimit) || numLimit <= 0) {
      Alert.alert('Error', 'Please enter a valid budget limit');
      return;
    }

    // Check if budget already exists for this category
    const existingBudget = budgets.find(b => b.category === selectedCategory);
    if (existingBudget) {
      Alert.alert('Error', 'Budget already exists for this category');
      return;
    }

    try {
      const categoryData = DEFAULT_CATEGORIES.find(c => c.name === selectedCategory);
      await addBudget({
        category: selectedCategory,
        limit: numLimit,
        period: selectedPeriod,
        color: categoryData?.color || Colors[colorScheme].primary,
      });

      // Reset form
      setBudgetLimit('');
      setSelectedCategory('');
      setModalVisible(false);
      
      Alert.alert('Success', 'Budget created successfully!');
    } catch {
      Alert.alert('Error', 'Failed to create budget');
    }
  };

  const handleDeleteBudget = (budget: Budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for "${budget.category}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBudget(budget.id),
        },
      ]
    );
  };

  const getBudgetProgress = (budget: Budget) => {
    const budgetStatus = summary.budgetStatus.find(bs => bs.category === budget.category);
    return budgetStatus || { category: budget.category, spent: 0, limit: budget.limit, percentage: 0 };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return Colors[colorScheme].success;
    if (percentage < 80) return Colors[colorScheme].warning;
    return Colors[colorScheme].error;
  };

  if (loading) {
    return (
      <LoadingScreen 
        title="Loading Budgets"
        subtitle="Preparing your budget overview..."
      />
    );
  }

  const totalBudgets = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = summary.budgetStatus.reduce((sum, bs) => sum + bs.spent, 0);

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>🎯 Budgets</ThemedText>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors[colorScheme].primary }]}
            onPress={() => setModalVisible(true)}
          >
            <ThemedText style={styles.addButtonText}>+ Add Budget</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Budget Overview */}
        {budgets.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200)}>
            <ModernCard style={styles.overviewCard}>
              <ThemedText type="subtitle" style={styles.overviewTitle}>
                📊 This Month Overview
              </ThemedText>
              
              <ThemedView style={styles.overviewStats}>
                <ThemedView style={styles.overviewStat}>
                  <ThemedText style={styles.overviewLabel}>Total Budget</ThemedText>
                  <ThemedText style={[styles.overviewValue, { color: Colors[colorScheme].primary }]}>
                    {financeUtils.formatCurrency(totalBudgets)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.overviewStat}>
                  <ThemedText style={styles.overviewLabel}>Total Spent</ThemedText>
                  <ThemedText style={[styles.overviewValue, { color: Colors[colorScheme].expense }]}>
                    {financeUtils.formatCurrency(totalSpent)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.overviewProgress}>
                <AnimatedProgressBar
                  progress={(totalSpent / totalBudgets) * 100}
                  color={totalSpent > totalBudgets ? Colors[colorScheme].error : Colors[colorScheme].primary}
                  height={8}
                />
                <ThemedText style={styles.overviewPercentage}>
                  {((totalSpent / totalBudgets) * 100).toFixed(0)}% of total budget used
                </ThemedText>
              </ThemedView>
            </ModernCard>
          </Animated.View>
        )}

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(300)}>
            <ModernCard style={styles.emptyState}>
              <ThemedText style={styles.emptyStateIcon}>🎯</ThemedText>
              <ThemedText style={styles.emptyStateText}>No budgets set yet</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Create budgets to track your spending in different categories
              </ThemedText>
            </ModernCard>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(300)}>
            <ThemedView style={styles.budgetsList}>
              {budgets.map((budget, index) => {
                const category = DEFAULT_CATEGORIES.find(c => c.name === budget.category);
                const progress = getBudgetProgress(budget);
                const progressColor = getProgressColor(progress.percentage);
                
                return (
                  <Animated.View
                    key={budget.id}
                    entering={FadeInRight.delay(index * 100)}
                  >
                    <TouchableOpacity
                      style={styles.budgetItem}
                      onLongPress={() => handleDeleteBudget(budget)}
                      activeOpacity={0.8}
                    >
                      <ModernCard style={styles.budgetCard}>
                        <ThemedView style={styles.budgetHeader}>
                          <ThemedView style={styles.budgetLeft}>
                            <ThemedView style={[
                              styles.budgetIconContainer,
                              { backgroundColor: category?.color + '20' || Colors[colorScheme].primary + '20' }
                            ]}>
                              <ThemedText style={styles.budgetIcon}>
                                {category?.icon || '🎯'}
                              </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.budgetInfo}>
                              <ThemedText type="defaultSemiBold" style={styles.budgetCategory}>
                                {budget.category}
                              </ThemedText>
                              <ThemedText style={styles.budgetPeriod}>
                                {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget
                              </ThemedText>
                            </ThemedView>
                          </ThemedView>
                          
                          <ThemedView style={styles.budgetRight}>
                            <ThemedText style={styles.budgetAmount}>
                              {financeUtils.formatCurrency(progress.spent)}
                            </ThemedText>
                            <ThemedText style={styles.budgetLimit}>
                              of {financeUtils.formatCurrency(budget.limit)}
                            </ThemedText>
                          </ThemedView>
                        </ThemedView>
                        
                        {/* Progress Bar */}
                        <ThemedView style={styles.progressContainer}>
                          <AnimatedProgressBar
                            progress={Math.min(progress.percentage, 100)}
                            color={progressColor}
                            height={8}
                          />
                        </ThemedView>
                        
                        {/* Status */}
                        <ThemedView style={styles.budgetStatus}>
                          <ThemedText style={[styles.percentageText, { color: progressColor }]}>
                            {progress.percentage.toFixed(0)}% used
                          </ThemedText>
                          
                          {progress.percentage > 100 && (
                            <StatusBadge 
                              type="error" 
                              text={`Over by ${financeUtils.formatCurrency(progress.spent - budget.limit)}`}
                            />
                          )}
                          
                          {progress.percentage > 80 && progress.percentage <= 100 && (
                            <StatusBadge 
                              type="warning" 
                              text="Almost at limit"
                            />
                          )}
                          
                          {progress.percentage <= 50 && (
                            <StatusBadge 
                              type="success" 
                              text="On track"
                            />
                          )}
                        </ThemedView>
                      </ModernCard>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ThemedView>
          </Animated.View>
        )}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor: Colors[colorScheme].background }]}>
          <ThemedView style={[styles.modalHeader, { borderBottomColor: Colors[colorScheme].border }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <ThemedText style={[styles.cancelButton, { color: Colors[colorScheme].primary }]}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>Create Budget</ThemedText>
            <TouchableOpacity onPress={handleAddBudget}>
              <ThemedText style={[styles.saveButton, { color: Colors[colorScheme].primary }]}>Save</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Budget Limit Input */}
            <ModernCard style={styles.inputCard}>
              <ThemedText style={styles.inputLabel}>Budget Limit</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: Colors[colorScheme].border,
                    backgroundColor: Colors[colorScheme].cardSecondary,
                    color: Colors[colorScheme].text,
                  }
                ]}
                value={budgetLimit}
                onChangeText={setBudgetLimit}
                placeholder="0.00"
                placeholderTextColor={Colors[colorScheme].icon}
                keyboardType="decimal-pad"
              />
            </ModernCard>

            {/* Period Selection */}
            <ModernCard style={styles.inputCard}>
              <ThemedText style={styles.inputLabel}>Period</ThemedText>
              <ThemedView style={styles.periodContainer}>
                {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      selectedPeriod === period && styles.periodButtonSelected,
                      { borderColor: Colors[colorScheme].border }
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      style={[
                        styles.periodButtonText,
                        selectedPeriod === period && styles.periodButtonTextSelected,
                        { color: Colors[colorScheme].text }
                      ]}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            </ModernCard>

            {/* Category Selection */}
            <ModernCard style={styles.inputCard}>
              <ThemedText style={styles.inputLabel}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <ThemedView style={styles.categoryContainer}>
                  {expenseCategories.map(category => {
                    const hasExistingBudget = budgets.some(b => b.category === category.name);
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryButton,
                          {
                            backgroundColor: category.color + '20',
                            borderColor: selectedCategory === category.name ? category.color : 'transparent',
                            opacity: hasExistingBudget ? 0.5 : 1,
                          },
                        ]}
                        onPress={() => !hasExistingBudget && setSelectedCategory(category.name)}
                        disabled={hasExistingBudget}
                        activeOpacity={0.8}
                      >
                        <ThemedText style={styles.categoryEmoji}>{category.icon}</ThemedText>
                        <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                        {hasExistingBudget && (
                          <ThemedText style={styles.categoryExists}>✓</ThemedText>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ThemedView>
              </ScrollView>
            </ModernCard>
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  overviewCard: {
    marginBottom: 20,
  },
  overviewTitle: {
    marginBottom: 12,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overviewProgress: {
    marginTop: 8,
  },
  overviewPercentage: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  budgetsList: {
    gap: 16,
  },
  budgetItem: {
    marginBottom: 4,
  },
  budgetCard: {
    padding: 0,
    overflow: 'hidden',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  budgetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  budgetIcon: {
    fontSize: 20,
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
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  budgetLimit: {
    fontSize: 12,
    opacity: 0.6,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  budgetStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
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
  periodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  periodButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
  },
  periodButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
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
    position: 'relative',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryExists: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#00B894',
    color: 'white',
    fontSize: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});