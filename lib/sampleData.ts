import { financeStorage, financeUtils } from '@/lib/financeStorage';
import { Budget, Transaction } from '@/types/finance';

// Sample transactions for demonstration
const sampleTransactions: Omit<Transaction, 'id' | 'createdAt'>[] = [
  {
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly Salary',
    date: new Date().toISOString().split('T')[0],
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Food & Dining',
    description: 'Groceries and restaurants',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    type: 'expense',
    amount: 800,
    category: 'Transportation',
    description: 'Gas and car maintenance',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    type: 'expense',
    amount: 500,
    category: 'Shopping',
    description: 'Clothes and accessories',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    type: 'income',
    amount: 800,
    category: 'Freelance',
    description: 'Web development project',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
  {
    type: 'expense',
    amount: 300,
    category: 'Entertainment',
    description: 'Movies and games',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  },
];

// Sample budgets for demonstration
const sampleBudgets: Omit<Budget, 'id' | 'createdAt'>[] = [
  {
    category: 'Food & Dining',
    limit: 1500,
    period: 'monthly',
    color: '#FF6B6B',
  },
  {
    category: 'Transportation',
    limit: 1000,
    period: 'monthly',
    color: '#4ECDC4',
  },
  {
    category: 'Entertainment',
    limit: 400,
    period: 'monthly',
    color: '#96CEB4',
  },
];

export const initializeSampleData = async () => {
  try {
    console.log('Initializing sample data...');
    
    // Check if we already have data
    const existingTransactions = await financeStorage.getTransactions();
    const existingBudgets = await financeStorage.getBudgets();
    
    if (existingTransactions.length === 0) {
      console.log('Adding sample transactions...');
      // Add sample transactions
      for (const transactionData of sampleTransactions) {
        const transaction: Transaction = {
          ...transactionData,
          id: financeUtils.generateId(),
          createdAt: new Date().toISOString(),
        };
        await financeStorage.addTransaction(transaction);
      }
    }
    
    if (existingBudgets.length === 0) {
      console.log('Adding sample budgets...');
      // Add sample budgets
      for (const budgetData of sampleBudgets) {
        const budget: Budget = {
          ...budgetData,
          id: financeUtils.generateId(),
          createdAt: new Date().toISOString(),
        };
        await financeStorage.addBudget(budget);
      }
    }
    
    console.log('Sample data initialization complete');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};
