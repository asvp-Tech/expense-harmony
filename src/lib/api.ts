const API_BASE = 'http://localhost:8081/pet/api/v1';
const STORAGE_KEY = 'expense_tracker_auth';

function getToken(): string | null {
  const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored).token;
    } catch {
      return null;
    }
  }
  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `Request failed (${res.status})`);
  }

  // Handle 204 No Content
  if (res.status === 204) return {} as T;

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user?: { id: string; name: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: { fullName: string; email: string; password: string; confirmPassword: string }) =>
    request<{ message?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Expenses
export const expenseApi = {
  getAll: () => request<any[]>('/expenses/get-all-expense'),
  getById: (id: string) => request<any>(`/expenses/getExpense/${id}`),
  create: (data: any) =>
    request<any>('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/expenses/updateExpense/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/expenses/deleteExpense/${id}`, { method: 'DELETE' }),
};

// Categories
export const categoryApi = {
  getAll: () => request<any[]>('/get-all/categories'),
  getUserCategories: () => request<any[]>('/getUserCategories'),
  add: (data: { name: string; color: string; icon: string }) =>
    request<any>('/add/category', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/update-category/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/delete-category/${id}`, { method: 'DELETE' }),
};

// Analytics
export const analyticsApi = {
  total: () => request<any>('/expenses/analytics/total'),
  monthly: () => request<any[]>('/expenses/analytics/monthly'),
  categoryWise: () => request<any[]>('/expenses/analytics/category-wise'),
};
