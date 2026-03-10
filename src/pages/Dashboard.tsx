import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react';
import { analyticsApi, expenseApi, categoryApi } from '@/lib/api';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [totalRes, monthlyRes, catWiseRes, expensesRes, catsRes] = await Promise.all([
          analyticsApi.total().catch(() => null),
          analyticsApi.monthly().catch(() => []),
          analyticsApi.categoryWise().catch(() => []),
          expenseApi.getAll().catch(() => []),
          categoryApi.getAll().catch(() => []),
        ]);

        setSummary(totalRes);
        setMonthlyData(Array.isArray(monthlyRes) ? monthlyRes : []);
        setCategoryData(Array.isArray(catWiseRes) ? catWiseRes : []);
        setCategories(Array.isArray(catsRes) ? catsRes : []);

        const expenses = Array.isArray(expensesRes) ? expensesRes : [];
        const sorted = [...expenses].sort((a, b) => 
          new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
        );
        setRecentExpenses(sorted.slice(0, 5));
      } catch (error: any) {
        toast({ title: 'Error loading dashboard', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const totalExpenses = summary?.totalExpenses ?? summary?.total ?? 0;
  const thisMonth = summary?.thisMonth ?? summary?.monthly ?? 0;
  const averageDaily = summary?.averageDaily ?? summary?.dailyAverage ?? 0;

  const chartConfig = { amount: { label: 'Amount', color: 'hsl(210, 80%, 55%)' } };

  const getCategoryColor = (catName: string) => {
    const cat = categories.find((c: any) => c.name === catName);
    return cat?.color || 'hsl(210, 50%, 50%)';
  };

  const categorySpending = categoryData.map((item: any) => ({
    name: item.category || item.name || '',
    value: Number(item.amount) || Number(item.total) || 0,
    color: item.color || getCategoryColor(item.category || item.name),
    percentage: Number(item.percentage) || 0,
  }));

  // Compute percentages if not provided
  const catTotal = categorySpending.reduce((s, c) => s + c.value, 0);
  if (catTotal > 0 && categorySpending.every(c => c.percentage === 0)) {
    categorySpending.forEach(c => { c.percentage = Math.round((c.value / catTotal) * 1000) / 10; });
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your expenses</p>
          </div>
          <Link to="/expenses">
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Expense</Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Total Expenses', value: totalExpenses, icon: DollarSign, sub: 'All time spending' },
            { title: 'This Month', value: thisMonth, icon: Calendar, sub: format(new Date(), 'MMMM yyyy') },
            { title: 'Daily Average', value: averageDaily, icon: TrendingUp, sub: 'This month' },
          ].map(card => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-24" /> : (
                  <div className="text-2xl font-bold">${Number(card.value).toFixed(2)}</div>
                )}
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Category-wise expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px]" /> : categorySpending.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">No category data available</p>
              ) : (
                <>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <PieChart>
                      <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                        {categorySpending.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <ChartTooltip content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="font-medium">{d.name}</div>
                              <div className="text-sm text-muted-foreground">${d.value.toFixed(2)} ({d.percentage}%)</div>
                            </div>
                          );
                        }
                        return null;
                      }} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {categorySpending.slice(0, 6).map(cat => (
                      <div key={cat.name} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="truncate">{cat.name}</span>
                        <span className="ml-auto text-muted-foreground">{cat.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Expense trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px]" /> : monthlyData.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">No monthly data available</p>
              ) : (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                    <ChartTooltip content={({ active, payload, label }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-muted-foreground">${Number(payload[0].value).toLocaleString()}</div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Line type="monotone" dataKey="amount" stroke="hsl(210, 80%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(210, 80%, 55%)', strokeWidth: 2 }} />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </div>
            <Link to="/expenses">
              <Button variant="ghost" size="sm" className="gap-1">View all<ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : recentExpenses.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No expenses yet</p>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense: any) => {
                  const color = getCategoryColor(expense.category || expense.categoryName);
                  return (
                    <div key={expense.id || expense._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category || expense.categoryName} • {expense.date ? format(new Date(expense.date), 'MMM d, yyyy') : ''}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">-${Number(expense.amount).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
