'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { createItemType, deleteItemType, updateItemType } from '@/actions/master';
import { ColumnDef } from '@tanstack/react-table';

type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

interface CategoriesClientPageProps {
  initialCategories: Category[];
}

const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters").max(100),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const CategoriesClientPage = ({ initialCategories }: CategoriesClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { addToast } = useToast();

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    }
  });

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    methods.reset({
      name: category.name,
      description: category.description || '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setCategoryToEdit(null);
    methods.reset({ name: '', description: '' });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      { accessorKey: 'name', header: 'Category Name' },
      { 
        accessorKey: 'description', 
        header: 'Description',
        cell: ({ row }) => <span className="opacity-70">{row.original.description || 'No description provided'}</span>
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" className="px-2 py-1" onClick={() => handleEditClick(row.original)} title="Edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Button>
            <Button variant="danger" className="px-2 py-1" onClick={() => setCategoryToDelete(row.original.id)} title="Delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const onSubmit = async (formData: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (categoryToEdit) {
        await updateItemType(categoryToEdit.id, {
          name: formData.name,
          description: formData.description || undefined,
        });
        addToast('Category has been updated successfully.', 'success');
      } else {
        await createItemType({
          name: formData.name,
          description: formData.description || undefined,
        });
        addToast('New category has been added successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setCategoryToEdit(null);
    } catch (error) {
      addToast(categoryToEdit ? 'Failed to update category.' : 'Failed to add new category.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteItemType(categoryToDelete);
      addToast('The category has been removed.', 'success');
    } catch (error) {
      addToast('Failed to delete the category. It might be in use by an item.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setCategoryToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    addToast(`Bulk delete not implemented yet for ${selectedRows.length} categories.`, 'warning');
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Master Data' },
              { label: 'Categories' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Master Categories</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Category
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <DataTable 
            columns={columns} 
            data={initialCategories} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setCategoryToEdit(null);
        }} 
        title={categoryToEdit ? "Edit Category" : "Register New Category"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setCategoryToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-category-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (categoryToEdit ? 'Update Category' : 'Save Category')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-category-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            <FormInput name="name" label="Category Name" placeholder="e.g. Electronics, Furniture" />
            <FormInput name="description" label="Description (Optional)" placeholder="Brief description of this category" />
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? If there are items using this category, the deletion might fail or the items will become uncategorized."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />
    </>
  );
};
