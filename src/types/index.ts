export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  thisMonth: number;
  averageDaily: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
}
