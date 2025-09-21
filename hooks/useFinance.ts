import { financeStorage, financeUtils } from '@/lib/financeStorage';
import { initializeSampleData } from '@/lib/sampleData';
import { Budget, FinancialSummary, Transaction } from '@/types/finance';
import { useEffect, useState } from 'react';

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budgetStatus: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Recalculate summary when transactions or budgets change
    const calculateBudgetStatus = () => {
      const currentMonthTransactions = financeUtils.getCurrentMonthTransactions(transactions);
      const expensesByCategory = financeUtils.getTransactionsByCategory(
        currentMonthTransactions.filter(t => t.type === 'expense')
      );

      return budgets.map(budget => {
        const categoryTransactions = expensesByCategory[budget.category] || [];
        const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        return {
          category: budget.category,
          spent,
          limit: budget.limit,
          percentage: Math.min(percentage, 100),
        };
      });
    };

    const newSummary = financeUtils.calculateSummary(transactions);
    const budgetStatus = calculateBudgetStatus();
    setSummary({ ...newSummary, budgetStatus });
  }, [transactions, budgets]);

  const loadData = async () => {
    console.log('Loading finance data...');
    setLoading(true);
    try {
      // Initialize sample data if needed
      await initializeSampleData();
      
      const [transactionsData, budgetsData] = await Promise.all([
        financeStorage.getTransactions(),
        financeStorage.getBudgets(),
      ]);
      console.log('Loaded data:', { transactions: transactionsData.length, budgets: budgetsData.length });
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      // Add minimum loading time to ensure loading screen is visible on Android
      setTimeout(() => {
        setLoading(false);
        console.log('Loading complete');
      }, 1500); // 1.5 seconds minimum loading time
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: financeUtils.generateId(),
      createdAt: new Date().toISOString(),
    };

    await financeStorage.addTransaction(newTransaction);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = async (id: string) => {
    await financeStorage.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: financeUtils.generateId(),
      createdAt: new Date().toISOString(),
    };

    await financeStorage.addBudget(newBudget);
    setBudgets(prev => [...prev, newBudget]);
  };

  const deleteBudget = async (id: string) => {
    await financeStorage.deleteBudget(id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };


  const getTransactionsByPeriod = (period: 'week' | 'month' | 'year') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const getCategoryTotals = (type: 'income' | 'expense', period: 'week' | 'month' | 'year' = 'month') => {
    const periodTransactions = getTransactionsByPeriod(period).filter(t => t.type === type);
    const categoryTotals: Record<string, number> = {};

    periodTransactions.forEach(transaction => {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  return {
    transactions,
    budgets,
    loading,
    summary,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    getTransactionsByPeriod,
    getCategoryTotals,
    refreshData: loadData,
  };
};
