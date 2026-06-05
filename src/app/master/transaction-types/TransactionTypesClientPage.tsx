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
import { createTransactionType, deleteTransactionType, updateTransactionType } from '@/actions/master';
import { ColumnDef } from '@tanstack/react-table';

type TransactionType = {
  id: string;
  name: string;
  createdAt: Date;
};

interface TransactionTypesClientPageProps {
  initialTransactionTypes: TransactionType[];
}

const transactionTypeSchema = z.object({
  name: z.string().min(3, "Transaction type name must be at least 3 characters").max(100),
});

type TransactionTypeFormValues = z.infer<typeof transactionTypeSchema>;

export const TransactionTypesClientPage = ({ initialTransactionTypes }: TransactionTypesClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [typeToEdit, setTypeToEdit] = useState<TransactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { addToast } = useToast();

  const methods = useForm<TransactionTypeFormValues>({
    resolver: zodResolver(transactionTypeSchema) as any,
    defaultValues: {
      name: '',
    }
  });

  const handleEditClick = (type: TransactionType) => {
    setTypeToEdit(type);
    methods.reset({
      name: type.name,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setTypeToEdit(null);
    methods.reset({ name: '' });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<TransactionType>[]>(
    () => [
      { accessorKey: 'name', header: 'Transaction Type Name' },
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setTypeToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: TransactionTypeFormValues) => {
    setIsSubmitting(true);
    try {
      if (typeToEdit) {
        await updateTransactionType(typeToEdit.id, {
          name: formData.name,
        });
        addToast('Transaction type has been updated successfully.', 'success');
      } else {
        await createTransactionType({
          name: formData.name,
        });
        addToast('New transaction type has been added successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setTypeToEdit(null);
    } catch (error) {
      addToast(typeToEdit ? 'Failed to update transaction type.' : 'Failed to add new transaction type.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteTransactionType(typeToDelete);
      addToast('The transaction type has been removed.', 'success');
    } catch (error) {
      addToast('Failed to delete the transaction type. It might be in use.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTypeToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    addToast(`Bulk delete not implemented yet for ${selectedRows.length} transaction types.`, 'warning');
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Master Data' },
              { label: 'Transaction Types' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Master Transaction Types</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Type
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <DataTable 
            columns={columns} 
            data={initialTransactionTypes} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setTypeToEdit(null);
        }} 
        title={typeToEdit ? "Edit Transaction Type" : "Register New Transaction Type"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setTypeToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-type-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (typeToEdit ? 'Update Type' : 'Save Type')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-type-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            <FormInput name="name" label="Transaction Type Name" placeholder="e.g. Pembelian, Hibah, Mutasi" />
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!typeToDelete}
        onClose={() => setTypeToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Transaction Type?"
        message="Are you sure you want to delete this transaction type? If there are transactions of this type, the deletion might fail."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />
    </>
  );
};
