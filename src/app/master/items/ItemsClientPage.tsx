'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { createItem, deleteItem, updateItem } from '@/actions/master';
import { ColumnDef } from '@tanstack/react-table';
import { MetricCard } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

type ItemType = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  unit: string | null;
  usefulLifeMonths: number;
  itemType: ItemType | null;
};

interface ItemsClientPageProps {
  initialItems: Item[];
  initialItemTypes: ItemType[];
}

const itemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters").max(100),
  unit: z.string().min(1, "Unit is required"),
  itemTypeId: z.string().optional(),
  usefulLifeMonths: z.coerce.number().min(1, "Must be at least 1 month"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export const ItemsClientPage = ({ initialItems, initialItemTypes }: ItemsClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { addToast } = useToast();

  const methods = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      unit: 'Pcs',
      itemTypeId: '',
      usefulLifeMonths: 60,
    }
  });

  const handleEditClick = (item: Item) => {
    setItemToEdit(item);
    methods.reset({
      name: item.name,
      unit: item.unit || 'Pcs',
      itemTypeId: item.itemType?.id || '',
      usefulLifeMonths: item.usefulLifeMonths,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setItemToEdit(null);
    methods.reset({
      name: '',
      unit: 'Pcs',
      itemTypeId: '',
      usefulLifeMonths: 60,
    });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      { accessorKey: 'name', header: 'Item Name' },
      { 
        accessorKey: 'category', 
        header: 'Category',
        accessorFn: (row) => row.itemType?.name || 'Uncategorized'
      },
      { accessorKey: 'unit', header: 'Unit' },
      { accessorKey: 'usefulLifeMonths', header: 'Useful Life (Months)' },
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setItemToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (itemToEdit) {
        await updateItem(itemToEdit.id, {
          name: formData.name,
          unit: formData.unit,
          itemTypeId: formData.itemTypeId || undefined,
          usefulLifeMonths: formData.usefulLifeMonths || 60,
        });
        addToast('Item has been updated successfully.', 'success');
      } else {
        await createItem({
          name: formData.name,
          unit: formData.unit,
          itemTypeId: formData.itemTypeId || undefined,
          usefulLifeMonths: formData.usefulLifeMonths || 60,
        });
        addToast('New item has been added successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setItemToEdit(null);
    } catch (error) {
      addToast(itemToEdit ? 'Failed to update item.' : 'Failed to add new item.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteItem(itemToDelete);
      addToast('The item has been removed.', 'success');
    } catch (error) {
      addToast('Failed to delete the item.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    addToast(`Bulk delete not implemented yet for ${selectedRows.length} items.`, 'warning');
  };

  // Prepare category options for the FormSelect
  const categoryOptions = initialItemTypes.map(type => ({
    label: type.name,
    value: type.id
  }));

  // Prepare filter options for the DataTable
  const categoryFilterOptions = initialItemTypes.map(type => ({
    label: type.name,
    value: type.name // The DataTable filters based on the cell's value string
  }));
  categoryFilterOptions.push({ label: 'Uncategorized', value: 'Uncategorized' });

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Master Data' },
              { label: 'Items' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Master Items</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Item
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Total Registered Items" 
            value={initialItems.length.toString()} 
            className="bg-[var(--color-neo-primary)]" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            }
          />
          <MetricCard 
            title="Total Categories" 
            value={initialItemTypes.length.toString()} 
            className="bg-[var(--color-neo-secondary)]" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            }
          />
        </div>

        {/* Data Table Section */}
        <div>
          <DataTable 
            columns={columns} 
            data={initialItems} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
            filterOptions={[
              {
                columnId: 'category',
                placeholder: 'Filter Category',
                options: categoryFilterOptions
              }
            ]}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setItemToEdit(null);
        }} 
        title={itemToEdit ? "Edit Item" : "Register New Item"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setItemToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-item-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (itemToEdit ? 'Update Item' : 'Save Item')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-item-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            <FormInput name="name" label="Item Name" placeholder="e.g. MacBook Pro M2" />
            
            <FormSelect 
              name="itemTypeId" 
              label="Category / Type" 
              placeholder="Select Category..."
              options={categoryOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput name="unit" label="Unit Measure" placeholder="e.g. Pcs, Unit, Set" />
              <FormInput name="usefulLifeMonths" type="number" label="Useful Life (Months)" placeholder="60" />
            </div>
            
            <p className="text-xs font-bold opacity-60">
              * Useful Life is used to automatically calculate Straight-Line Depreciation.
            </p>
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="Are you sure you want to delete this master item? This action cannot be undone."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />
    </>
  );
};
