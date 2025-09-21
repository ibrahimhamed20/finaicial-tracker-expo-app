import { LoadingScreen } from '@/components/LoadingScreen';
import { ModernCard } from '@/components/ModernCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFinance } from '@/hooks/useFinance';
import { financeUtils } from '@/lib/financeStorage';
import { DEFAULT_CATEGORIES, Transaction } from '@/types/finance';
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

export default function TransactionsScreen() {
  const { transactions, loading, addTransaction, deleteTransaction } = useFinance();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

  const availableCategories = DEFAULT_CATEGORIES.filter(c => c.type === transactionType);

  const handleAddTransaction = async () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addTransaction({
        type: transactionType,
        amount: numAmount,
        category: selectedCategory,
        description,
        date: new Date().toISOString().split('T')[0],
      });

      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategory('');
      setModalVisible(false);
      
      Alert.alert('Success', 'Transaction added successfully!');
    } catch { 
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const openAddModal = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setSelectedCategory(DEFAULT_CATEGORIES.find(c => c.type === type)?.name || '');
    setModalVisible(true);
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };

  if (loading) {
    return (
      <LoadingScreen 
        title="Loading Transactions"
        subtitle="Preparing your transaction history..."
      />
    );
  }

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>💸 Transactions</ThemedText>
          <ThemedView style={styles.addButtons}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: Colors[colorScheme].income }]}
              onPress={() => openAddModal('income')}
            >
              <ThemedText style={styles.addButtonIcon}>💰</ThemedText>
              <ThemedText style={styles.addButtonText}>Income</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: Colors[colorScheme].expense }]}
              onPress={() => openAddModal('expense')}
            >
              <ThemedText style={styles.addButtonIcon}>💸</ThemedText>
              <ThemedText style={styles.addButtonText}>Expense</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Animated.View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {groupedTransactions.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(200)}>
            <ModernCard style={styles.emptyState}>
              <ThemedText style={styles.emptyStateIcon}>📝</ThemedText>
              <ThemedText style={styles.emptyStateText}>No transactions yet</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Tap the buttons above to add your first transaction
              </ThemedText>
            </ModernCard>
          </Animated.View>
        ) : (
          groupedTransactions.map(([date, dayTransactions], groupIndex) => (
            <Animated.View
              key={date}
              entering={FadeInDown.delay(groupIndex * 100)}
              style={styles.dateGroup}
            >
              <ThemedText style={styles.dateHeader}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </ThemedText>
              
              <ModernCard style={styles.transactionsCard}>
                {dayTransactions.map((transaction, index) => {
                  const category = DEFAULT_CATEGORIES.find(c => c.name === transaction.category);
                  return (
                    <Animated.View
                      key={transaction.id}
                      entering={FadeInRight.delay((groupIndex * dayTransactions.length + index) * 50)}
                    >
                      <TouchableOpacity
                        style={[
                          styles.transactionItem,
                          index < dayTransactions.length - 1 && styles.transactionItemBorder
                        ]}
                        onLongPress={() => handleDeleteTransaction(transaction)}
                        activeOpacity={0.7}
                      >
                        <ThemedView style={styles.transactionContent}>
                          <ThemedView style={styles.transactionLeft}>
                            <ThemedView style={[
                              styles.transactionIconContainer,
                              { backgroundColor: category?.color + '40' || Colors[colorScheme].primary + '40' }
                            ]}>
                              <ThemedText style={styles.transactionIcon}>
                                {category?.icon || '💰'}
                              </ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.transactionDetails}>
                              <ThemedText type="defaultSemiBold" style={styles.transactionDescription}>
                                {transaction.description}
                              </ThemedText>
                              <ThemedText style={styles.transactionCategory}>
                                {transaction.category}
                              </ThemedText>
                            </ThemedView>
                          </ThemedView>
                          <ThemedView style={styles.transactionRight}>
                            <ThemedText
                              style={[
                                styles.transactionAmount,
                                {
                                  color: transaction.type === 'income' 
                                    ? Colors[colorScheme].income 
                                    : Colors[colorScheme].expense,
                                },
                              ]}
                            >
                              {transaction.type === 'income' ? '+' : '-'}
                              {financeUtils.formatCurrency(transaction.amount)}
                            </ThemedText>
                            <ThemedView style={[
                              styles.transactionTypeTag,
                              {
                                backgroundColor: transaction.type === 'income' 
                                  ? Colors[colorScheme].income + '20'
                                  : Colors[colorScheme].expense + '20',
                              }
                            ]}>
                              <ThemedText style={[
                                styles.transactionTypeText,
                                {
                                  color: transaction.type === 'income' 
                                    ? Colors[colorScheme].income 
                                    : Colors[colorScheme].expense,
                                }
                              ]}>
                                {transaction.type}
                              </ThemedText>
                            </ThemedView>
                          </ThemedView>
                        </ThemedView>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </ModernCard>
            </Animated.View>
          ))
        )}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Transaction Modal */}
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
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Add {transactionType === 'income' ? 'Income' : 'Expense'}
            </ThemedText>
            <TouchableOpacity onPress={handleAddTransaction}>
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
                value={amount}
                onChangeText={setAmount}
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
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description..."
                placeholderTextColor={Colors[colorScheme].icon}
              />
            </ModernCard>

            {/* Category Selection */}
            <ModernCard style={styles.inputCard}>
              <ThemedText style={styles.inputLabel}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <ThemedView style={styles.categoryContainer}>
                  {availableCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: category.color + '20',
                          borderColor: selectedCategory === category.name ? category.color : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedCategory(category.name)}
                      activeOpacity={0.8}
                    >
                      <ThemedText style={styles.categoryEmoji}>{category.icon}</ThemedText>
                      <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
                    </TouchableOpacity>
                  ))}
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
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
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
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    opacity: 0.8,
  },
  transactionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  transactionItem: {
    padding: 16,
  },
  transactionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  transactionIcon: {
    fontSize: 22,
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
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionTypeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});