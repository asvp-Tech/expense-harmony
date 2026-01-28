import { useState, useCallback, useMemo } from 'react';
import { Expense, ExpenseFilters, PaginationState } from '@/types';
import { mockExpenses, defaultCategories } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

let expenses = [...mockExpenses];
let customCategories = [...defaultCategories];

export function useExpenses() {
  const [data, setData] = useState<Expense[]>(expenses);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    perPage: 10,
    total: expenses.length,
  });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(e => 
        e.description.toLowerCase().includes(search) ||
        e.category.toLowerCase().includes(search)
      );
    }

    if (filters.category) {
      result = result.filter(e => e.category === filters.category);
    }

    if (filters.dateFrom) {
      result = result.filter(e => e.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      result = result.filter(e => e.date <= filters.dateTo!);
    }

    if (filters.amountMin !== undefined) {
      result = result.filter(e => e.amount >= filters.amountMin!);
    }

    if (filters.amountMax !== undefined) {
      result = result.filter(e => e.amount <= filters.amountMax!);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, filters, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.perPage;
    const end = start + pagination.perPage;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.page, pagination.perPage]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    expenses = [newExpense, ...expenses];
    setData(expenses);
    setPagination(prev => ({ ...prev, total: expenses.length }));
    setIsLoading(false);

    toast({
      title: 'Expense added',
      description: `$${expense.amount.toFixed(2)} added to ${expense.category}`,
    });

    return newExpense;
  }, []);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    expenses = expenses.map(e => e.id === id ? { ...e, ...updates } : e);
    setData(expenses);
    setIsLoading(false);

    toast({
      title: 'Expense updated',
      description: 'Your changes have been saved',
    });
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    expenses = expenses.filter(e => e.id !== id);
    setData(expenses);
    setPagination(prev => ({ ...prev, total: expenses.length }));
    setIsLoading(false);

    toast({
      title: 'Expense deleted',
      description: 'The expense has been removed',
    });
  }, []);

  return {
    expenses: paginatedData,
    allExpenses: filteredData,
    isLoading,
    filters,
    setFilters,
    pagination: { ...pagination, total: filteredData.length },
    setPagination,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState(customCategories);
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = useCallback(async (name: string, color: string, icon: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: 'Category exists',
        description: 'A category with this name already exists',
        variant: 'destructive',
      });
      setIsLoading(false);
      return null;
    }

    const newCategory = {
      id: Date.now().toString(),
      name,
      color,
      icon,
      isDefault: false,
    };

    customCategories = [...customCategories, newCategory];
    setCategories(customCategories);
    setIsLoading(false);

    toast({
      title: 'Category added',
      description: `${name} has been created`,
    });

    return newCategory;
  }, [categories]);

  const deleteCategory = useCallback(async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category?.isDefault) {
      toast({
        title: 'Cannot delete',
        description: 'Default categories cannot be deleted',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    customCategories = customCategories.filter(c => c.id !== id);
    setCategories(customCategories);
    setIsLoading(false);

    toast({
      title: 'Category deleted',
      description: 'The category has been removed',
    });

    return true;
  }, [categories]);

  return {
    categories,
    isLoading,
    addCategory,
    deleteCategory,
  };
}
