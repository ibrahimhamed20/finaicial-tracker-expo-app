import { Budget, FinancialSummary, Transaction } from '@/types/finance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = 'transactions';
const BUDGETS_KEY = 'budgets';

export const financeStorage = {
  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      console.log('Getting transactions from storage...');
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const result = data ? JSON.parse(data) : [];
      console.log('Retrieved transactions:', result.length);
      return result;
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  },

  saveTransactions: async (transactions: Transaction[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },

  addTransaction: async (transaction: Transaction): Promise<void> => {
    const transactions = await financeStorage.getTransactions();
    transactions.unshift(transaction); // Add to beginning for recent-first order
    await financeStorage.saveTransactions(transactions);
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const transactions = await financeStorage.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    await financeStorage.saveTransactions(filtered);
  },

  // Budgets
  getBudgets: async (): Promise<Budget[]> => {
    try {
      const data = await AsyncStorage.getItem(BUDGETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading budgets:', error);
      return [];
    }
  },

  saveBudgets: async (budgets: Budget[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  },

  addBudget: async (budget: Budget): Promise<void> => {
    const budgets = await financeStorage.getBudgets();
    budgets.push(budget);
    await financeStorage.saveBudgets(budgets);
  },

  deleteBudget: async (id: string): Promise<void> => {
    const budgets = await financeStorage.getBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    await financeStorage.saveBudgets(filtered);
  },
};

// Utility functions for calculations
export const financeUtils = {
  generateId: (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },

  calculateSummary: (transactions: Transaction[]): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      budgetStatus: [], // Will be calculated with budgets
    };
  },

  getTransactionsByDateRange: (
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): Transaction[] => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  },

  getTransactionsByCategory: (transactions: Transaction[]): Record<string, Transaction[]> => {
    return transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = [];
      }
      acc[transaction.category].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  },

  getCurrentMonthTransactions: (transactions: Transaction[]): Transaction[] => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    return financeUtils.getTransactionsByDateRange(transactions, startOfMonth, endOfMonth);
  },
};
