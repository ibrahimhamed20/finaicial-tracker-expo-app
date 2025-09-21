export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string format
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'weekly' | 'monthly' | 'yearly';
  color: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetStatus: {
    category: string;
    spent: number;
    limit: number;
    percentage: number;
  }[];
}

// Predefined categories
export const DEFAULT_CATEGORIES: Category[] = [
  // Expense categories
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: '🛍️', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: '🎬', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', type: 'expense' },
  { id: '6', name: 'Healthcare', icon: '🏥', color: '#DDA0DD', type: 'expense' },
  { id: '7', name: 'Education', icon: '📚', color: '#98D8C8', type: 'expense' },
  { id: '8', name: 'Other', icon: '📦', color: '#A8A8A8', type: 'expense' },
  
  // Income categories
  { id: '9', name: 'Salary', icon: '💰', color: '#00B894', type: 'income' },
  { id: '10', name: 'Freelance', icon: '💻', color: '#00A085', type: 'income' },
  { id: '11', name: 'Investment', icon: '📈', color: '#00B894', type: 'income' },
  { id: '12', name: 'Gift', icon: '🎁', color: '#55A3FF', type: 'income' },
  { id: '13', name: 'Other Income', icon: '💎', color: '#6C5CE7', type: 'income' },
];
