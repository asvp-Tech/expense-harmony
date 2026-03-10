import { useState, useCallback, useEffect } from 'react';
import { Expense, ExpenseFilters, PaginationState, Category } from '@/types';
import { expenseApi, categoryApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useExpenses() {
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, perPage: 10, total: 0 });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const expenses = await expenseApi.getAll();
      const mapped: Expense[] = (Array.isArray(expenses) ? expenses : []).map((e: any) => ({
        id: e.id?.toString() || e._id || '',
        amount: Number(e.amount) || 0,
        category: e.category || e.categoryName || '',
        categoryId: e.categoryId?.toString() || e.category_id?.toString() || '',
        description: e.description || '',
        date: e.date || '',
        createdAt: e.createdAt || e.created_at || '',
      }));
      setData(mapped);
      setPagination(prev => ({ ...prev, total: mapped.length }));
    } catch (error: any) {
      toast({ title: 'Error loading expenses', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // Client-side filtering & sorting
  const filteredData = (() => {
    let result = [...data];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(e => e.description.toLowerCase().includes(s) || e.category.toLowerCase().includes(s));
    }
    if (filters.category) result = result.filter(e => e.category === filters.category);
    if (filters.dateFrom) result = result.filter(e => e.date >= filters.dateFrom!);
    if (filters.dateTo) result = result.filter(e => e.date <= filters.dateTo!);
    if (filters.amountMin !== undefined) result = result.filter(e => e.amount >= filters.amountMin!);
    if (filters.amountMax !== undefined) result = result.filter(e => e.amount <= filters.amountMax!);

    result.sort((a, b) => {
      let c = 0;
      if (sortBy === 'date') c = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (sortBy === 'amount') c = a.amount - b.amount;
      else c = a.category.localeCompare(b.category);
      return sortOrder === 'asc' ? c : -c;
    });
    return result;
  })();

  const start = (pagination.page - 1) * pagination.perPage;
  const paginatedData = filteredData.slice(start, start + pagination.perPage);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      await expenseApi.create(expense);
      toast({ title: 'Expense added', description: `$${expense.amount.toFixed(2)} added to ${expense.category}` });
      await fetchExpenses();
    } catch (error: any) {
      toast({ title: 'Error adding expense', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    setIsLoading(true);
    try {
      await expenseApi.update(id, updates);
      toast({ title: 'Expense updated', description: 'Your changes have been saved' });
      await fetchExpenses();
    } catch (error: any) {
      toast({ title: 'Error updating expense', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await expenseApi.delete(id);
      toast({ title: 'Expense deleted', description: 'The expense has been removed' });
      await fetchExpenses();
    } catch (error: any) {
      toast({ title: 'Error deleting expense', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [fetchExpenses]);

  return {
    expenses: paginatedData,
    allExpenses: filteredData,
    isLoading,
    filters, setFilters,
    pagination: { ...pagination, total: filteredData.length },
    setPagination,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    addExpense, updateExpense, deleteExpense,
    refetch: fetchExpenses,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll();
      const mapped: Category[] = (Array.isArray(data) ? data : []).map((c: any) => ({
        id: c.id?.toString() || c._id || '',
        name: c.name || '',
        icon: c.icon || 'Tag',
        color: c.color || 'hsl(210, 50%, 50%)',
        isDefault: c.isDefault ?? c.is_default ?? false,
      }));
      setCategories(mapped);
    } catch (error: any) {
      toast({ title: 'Error loading categories', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const addCategory = useCallback(async (name: string, color: string, icon: string) => {
    setIsLoading(true);
    try {
      const result = await categoryApi.add({ name, color, icon });
      toast({ title: 'Category added', description: `${name} has been created` });
      await fetchCategories();
      return result;
    } catch (error: any) {
      toast({ title: 'Error adding category', description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await categoryApi.delete(id);
      toast({ title: 'Category deleted', description: 'The category has been removed' });
      await fetchCategories();
      return true;
    } catch (error: any) {
      toast({ title: 'Error deleting category', description: error.message, variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories]);

  return { categories, isLoading, addCategory, deleteCategory, refetch: fetchCategories };
}
