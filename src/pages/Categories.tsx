import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCategories } from '@/hooks/useExpenses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Lock, Loader2, Utensils, Car, ShoppingBag, Gamepad2, Receipt, Heart, GraduationCap, Tag } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils, Car, ShoppingBag, Gamepad2, Receipt, Heart, GraduationCap, Tag,
};

const colorOptions = [
  'hsl(0, 70%, 55%)', 'hsl(24, 80%, 55%)', 'hsl(45, 80%, 50%)', 'hsl(120, 50%, 45%)',
  'hsl(160, 60%, 45%)', 'hsl(210, 80%, 55%)', 'hsl(280, 70%, 55%)', 'hsl(330, 70%, 55%)',
];

export default function Categories() {
  const { categories, isLoading, addCategory, deleteCategory } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: colorOptions[0] });
  const [error, setError] = useState('');

  const defaultCats = categories.filter(c => c.isDefault);
  const customCats = categories.filter(c => !c.isDefault);

  const handleAdd = async () => {
    setError('');
    if (!newCategory.name.trim()) { setError('Category name is required'); return; }
    const result = await addCategory(newCategory.name.trim(), newCategory.color, 'Tag');
    if (result) { setModalOpen(false); setNewCategory({ name: '', color: colorOptions[0] }); }
  };

  const handleDelete = async () => {
    if (deleteId) { await deleteCategory(deleteId); setDeleteId(null); }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage expense categories</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Add Category</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground" />Default Categories</CardTitle>
            <CardDescription>These categories are protected and cannot be modified</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : defaultCats.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No default categories found</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {defaultCats.map(category => {
                  const Icon = iconMap[category.icon] || Tag;
                  return (
                    <div key={category.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                        <Icon className="h-5 w-5" style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">Default</p>
                      </div>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Categories</CardTitle>
            <CardDescription>Create your own categories to better organize expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1,2].map(i => <Skeleton key={i} className="h-16" />)}</div>
            ) : customCats.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No custom categories yet</p>
                <Button variant="outline" className="mt-4" onClick={() => setModalOpen(true)}>Create your first category</Button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {customCats.map(category => (
                  <div key={category.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                      <Tag className="h-5 w-5" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">Custom</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(category.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Category</DialogTitle>
            <DialogDescription>Create a new category to organize your expenses</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="e.g., Subscriptions" value={newCategory.name} onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))} className={error ? 'border-destructive' : ''} />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button key={color} type="button" className={`h-8 w-8 rounded-full transition-all ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-primary' : 'hover:scale-110'}`} style={{ backgroundColor: color }} onClick={() => setNewCategory(prev => ({ ...prev, color }))} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: newCategory.color + '20' }}>
                <Tag className="h-5 w-5" style={{ color: newCategory.color }} />
              </div>
              <div>
                <p className="font-medium">{newCategory.name || 'Category Name'}</p>
                <p className="text-xs text-muted-foreground">Preview</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this category? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
