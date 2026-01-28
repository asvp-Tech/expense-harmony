import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { useExpenses, useCategories } from '@/hooks/useExpenses';
import { Expense } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Expenses() {
  const {
    expenses,
    allExpenses,
    isLoading,
    filters,
    setFilters,
    pagination,
    setPagination,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const { categories } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSave = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
    }
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const toggleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');
  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Manage your expenses</p>
          </div>
          <Button onClick={() => { setEditingExpense(null); setModalOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden gap-1"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={cn('space-y-4', !showFilters && 'hidden md:block')}>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-9"
                  value={filters.search || ''}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Select 
                value={filters.category || 'all'} 
                onValueChange={value => setFilters({ ...filters, category: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Min amount"
                value={filters.amountMin || ''}
                onChange={e => setFilters({ ...filters, amountMin: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
              <Input
                type="number"
                placeholder="Max amount"
                value={filters.amountMax || ''}
                onChange={e => setFilters({ ...filters, amountMax: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>
                  Showing {expenses.length} of {pagination.total} expenses
                </CardDescription>
              </div>
              <Select 
                value={pagination.perPage.toString()} 
                onValueChange={value => setPagination({ ...pagination, page: 1, perPage: parseInt(value) })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No expenses found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { setEditingExpense(null); setModalOpen(true); }}
                >
                  Add your first expense
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleSort('category')}
                        >
                          <div className="flex items-center gap-1">
                            Category
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50 text-right"
                          onClick={() => toggleSort('amount')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            Amount
                            <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map(expense => {
                        const category = categories.find(c => c.name === expense.category);
                        return (
                          <TableRow key={expense.id}>
                            <TableCell className="font-medium">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: category?.color }}
                                />
                                {expense.category}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {expense.description}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ${expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEdit(expense)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setDeleteId(expense.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                        disabled={pagination.page === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        expense={editingExpense}
        categories={categories}
        onSave={handleSave}
        isLoading={isLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
