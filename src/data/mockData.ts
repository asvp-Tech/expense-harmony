import { Category, Expense, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

export const defaultCategories: Category[] = [
  { id: '1', name: 'Food', icon: 'Utensils', color: 'hsl(24, 80%, 55%)', isDefault: true },
  { id: '2', name: 'Transport', icon: 'Car', color: 'hsl(210, 80%, 55%)', isDefault: true },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(280, 70%, 55%)', isDefault: true },
  { id: '4', name: 'Entertainment', icon: 'Gamepad2', color: 'hsl(330, 70%, 55%)', isDefault: true },
  { id: '5', name: 'Bills', icon: 'Receipt', color: 'hsl(45, 80%, 50%)', isDefault: true },
  { id: '6', name: 'Healthcare', icon: 'Heart', color: 'hsl(0, 70%, 55%)', isDefault: true },
  { id: '7', name: 'Education', icon: 'GraduationCap', color: 'hsl(160, 60%, 45%)', isDefault: true },
];

export const mockExpenses: Expense[] = [
  { id: '1', amount: 45.50, category: 'Food', categoryId: '1', description: 'Grocery shopping at Walmart', date: '2026-01-28', createdAt: '2026-01-28T10:00:00Z' },
  { id: '2', amount: 30.00, category: 'Transport', categoryId: '2', description: 'Gas fill up', date: '2026-01-27', createdAt: '2026-01-27T14:30:00Z' },
  { id: '3', amount: 120.00, category: 'Shopping', categoryId: '3', description: 'New shoes', date: '2026-01-26', createdAt: '2026-01-26T16:00:00Z' },
  { id: '4', amount: 15.99, category: 'Entertainment', categoryId: '4', description: 'Netflix subscription', date: '2026-01-25', createdAt: '2026-01-25T09:00:00Z' },
  { id: '5', amount: 85.00, category: 'Bills', categoryId: '5', description: 'Electricity bill', date: '2026-01-24', createdAt: '2026-01-24T11:00:00Z' },
  { id: '6', amount: 50.00, category: 'Healthcare', categoryId: '6', description: 'Pharmacy', date: '2026-01-23', createdAt: '2026-01-23T13:00:00Z' },
  { id: '7', amount: 200.00, category: 'Education', categoryId: '7', description: 'Online course', date: '2026-01-22', createdAt: '2026-01-22T08:00:00Z' },
  { id: '8', amount: 25.00, category: 'Food', categoryId: '1', description: 'Restaurant dinner', date: '2026-01-21', createdAt: '2026-01-21T19:00:00Z' },
  { id: '9', amount: 60.00, category: 'Transport', categoryId: '2', description: 'Uber rides', date: '2026-01-20', createdAt: '2026-01-20T22:00:00Z' },
  { id: '10', amount: 35.00, category: 'Food', categoryId: '1', description: 'Coffee and snacks', date: '2026-01-19', createdAt: '2026-01-19T15:00:00Z' },
  { id: '11', amount: 250.00, category: 'Shopping', categoryId: '3', description: 'Winter jacket', date: '2026-01-18', createdAt: '2026-01-18T12:00:00Z' },
  { id: '12', amount: 40.00, category: 'Entertainment', categoryId: '4', description: 'Movie tickets', date: '2026-01-17', createdAt: '2026-01-17T20:00:00Z' },
  { id: '13', amount: 150.00, category: 'Bills', categoryId: '5', description: 'Internet bill', date: '2026-01-15', createdAt: '2026-01-15T10:00:00Z' },
  { id: '14', amount: 75.00, category: 'Healthcare', categoryId: '6', description: 'Doctor visit copay', date: '2026-01-10', createdAt: '2026-01-10T09:00:00Z' },
  { id: '15', amount: 500.00, category: 'Education', categoryId: '7', description: 'Textbooks', date: '2026-01-05', createdAt: '2026-01-05T14:00:00Z' },
];

export const mockMonthlyData = [
  { month: 'Aug', amount: 1250 },
  { month: 'Sep', amount: 1480 },
  { month: 'Oct', amount: 1320 },
  { month: 'Nov', amount: 1650 },
  { month: 'Dec', amount: 1890 },
  { month: 'Jan', amount: 1681.49 },
];
