'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { FormCurrencyInput } from '@/components/ui/FormCurrencyInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { FormDatePicker } from '@/components/ui/FormDatePicker';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { createTransaction, deleteTransaction, updateTransaction, deleteTransactions } from '@/actions/transaction';
import { uploadImage } from '@/actions/upload';
import { ColumnDef } from '@tanstack/react-table';
import { formatRupiah } from '@/lib/utils';

type TransactionType = { id: string; name: string };

type Transaction = {
  id: string;
  transactionNumber: string;
  transactionDate: Date;
  status: string;
  sourceOfFunds: string | null;
  totalBudget: any;
  budgetRealization: any;
  evidenceFile: string | null;
  transactionType: TransactionType;
};

interface TransactionsClientPageProps {
  initialTransactions: Transaction[];
  transactionTypes: TransactionType[];
}

const transactionSchema = z.object({
  transactionNumber: z.string().min(3, "Transaction number must be at least 3 characters"),
  transactionDate: z.string().min(1, "Date is required"),
  transactionTypeId: z.string().min(1, "Transaction Type is required"),
  status: z.string().default('COMPLETED'),
  sourceOfFunds: z.string().optional(),
  totalBudget: z.coerce.number().min(0).optional(),
  budgetRealization: z.coerce.number().min(0).optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const TransactionsClientPage = ({ initialTransactions, transactionTypes }: TransactionsClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      transactionNumber: '',
      transactionDate: new Date().toISOString().split('T')[0],
      transactionTypeId: '',
      status: 'COMPLETED',
      sourceOfFunds: '',
      totalBudget: 0,
      budgetRealization: 0,
    }
  });

  const handleEditClick = (txn: Transaction) => {
    setTransactionToEdit(txn);
    methods.reset({
      transactionNumber: txn.transactionNumber,
      transactionDate: new Date(txn.transactionDate).toISOString().split('T')[0],
      transactionTypeId: txn.transactionType.id,
      status: txn.status,
      sourceOfFunds: txn.sourceOfFunds || '',
      totalBudget: Number(txn.totalBudget || 0),
      budgetRealization: Number(txn.budgetRealization || 0),
    });
    setEvidenceFile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setTransactionToEdit(null);
    methods.reset({
      transactionNumber: `TRX-${Date.now()}`,
      transactionDate: new Date().toISOString().split('T')[0],
      transactionTypeId: '',
      status: 'COMPLETED',
      sourceOfFunds: '',
      totalBudget: 0,
      budgetRealization: 0,
    });
    setEvidenceFile(null);
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      { accessorKey: 'transactionNumber', header: 'Trx Number' },
      { 
        accessorKey: 'transactionDate', 
        header: 'Date',
        cell: ({ row }) => new Date(row.original.transactionDate).toLocaleDateString()
      },
      { accessorKey: 'transactionType.name', header: 'Type' },
      { 
        accessorKey: 'totalBudget', 
        header: 'Budget',
        cell: ({ row }) => formatRupiah(row.original.totalBudget)
      },
      { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let color = 'bg-blue-100 text-blue-800';
          if (status === 'COMPLETED') color = 'bg-green-100 text-green-800';
          if (status === 'PENDING') color = 'bg-yellow-100 text-yellow-800';
          if (status === 'CANCELLED') color = 'bg-red-100 text-red-800';
          return (
            <span className={`px-2 py-1 text-xs font-bold neo-border ${color}`}>
              {status}
            </span>
          );
        }
      },
      {
        id: 'evidence',
        header: 'Evidence',
        cell: ({ row }) => (
          row.original.evidenceFile ? (
            <a href={row.original.evidenceFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold text-sm">View File</a>
          ) : (
            <span className="text-gray-400 text-sm italic">None</span>
          )
        )
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setTransactionToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      let fileUrl = transactionToEdit?.evidenceFile || undefined;
      
      if (evidenceFile) {
        const uploadData = new FormData();
        uploadData.append('file', evidenceFile);
        const uploadedUrl = await uploadImage(uploadData);
        if (uploadedUrl) {
          fileUrl = uploadedUrl;
        }
      }

      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id, {
          status: formData.status,
          evidenceFile: fileUrl,
          budgetRealization: formData.budgetRealization,
        });
        addToast('Transaction has been updated successfully.', 'success');
      } else {
        await createTransaction({
          transactionNumber: formData.transactionNumber,
          transactionDate: new Date(formData.transactionDate),
          status: formData.status,
          sourceOfFunds: formData.sourceOfFunds || undefined,
          totalBudget: formData.totalBudget,
          budgetRealization: formData.budgetRealization,
          transactionTypeId: formData.transactionTypeId,
          evidenceFile: fileUrl,
        });
        addToast('New transaction has been registered successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setTransactionToEdit(null);
      setEvidenceFile(null);
    } catch (error) {
      addToast(transactionToEdit ? 'Failed to update transaction.' : 'Failed to register new transaction.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteTransaction(transactionToDelete);
      addToast('The transaction has been removed.', 'success');
      setSelectedRows(selectedRows.filter(r => r.id !== transactionToDelete));
    } catch (error) {
      addToast('Failed to delete transaction.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTransactionToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    setIsSubmitting(true);
    try {
      const ids = selectedRows.map(r => r.id);
      await deleteTransactions(ids);
      addToast(`${ids.length} transactions have been removed.`, 'success');
      setSelectedRows([]);
    } catch (error) {
      addToast('Failed to delete transactions.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const typeOptions = transactionTypes.map(t => ({
    label: t.name,
    value: t.id
  }));

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Transactions' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Transactions Data</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="primary" onClick={handleOpenAdd}>
            + New Transaction
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {selectedRows.length > 0 && (
          <div className="p-4 bg-[var(--color-neo-secondary)] neo-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_var(--color-neo-text)] mb-6">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              {selectedRows.length} item(s) selected
            </div>
            <div className="flex gap-3">
              <Button variant="danger" onClick={() => setIsBulkDeleteModalOpen(true)}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <div>
          <DataTable 
            columns={columns} 
            data={initialTransactions} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setTransactionToEdit(null);
        }} 
        title={transactionToEdit ? "Edit Transaction" : "Register New Transaction"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setTransactionToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-trx-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (transactionToEdit ? 'Update Transaction' : 'Save Transaction')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-trx-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            
            {!transactionToEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="transactionNumber" label="Transaction Number" placeholder="e.g. TRX-12345" />
                <FormSelect 
                  name="transactionTypeId" 
                  label="Transaction Type" 
                  options={[{label: '-- Select Type --', value: ''}, ...typeOptions]} 
                />
              </div>
            )}

            {!transactionToEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormDatePicker name="transactionDate" label="Transaction Date" placeholder="Select Date" />
                <FormInput name="sourceOfFunds" label="Source of Funds" placeholder="e.g. Dana BOS, Hibah Yayasan" />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!transactionToEdit && <FormCurrencyInput name="totalBudget" label="Total Budget" />}
              <FormCurrencyInput name="budgetRealization" label="Budget Realization" />
            </div>

            <FormSelect 
              name="status" 
              label="Transaction Status" 
              options={[
                {label: 'PENDING', value: 'PENDING'},
                {label: 'COMPLETED', value: 'COMPLETED'},
                {label: 'CANCELLED', value: 'CANCELLED'},
              ]} 
            />
            
            <FileUpload 
              label="Evidence Document (Optional)" 
              accept="image/*,application/pdf"
              defaultUrl={transactionToEdit?.evidenceFile}
              onClearDefault={() => {
                if (transactionToEdit) {
                  setTransactionToEdit({ ...transactionToEdit, evidenceFile: null });
                }
              }}
              onChange={(file) => setEvidenceFile(file)} 
            />
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction record? This cannot be undone."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedRows.length} Transactions?`}
        message="Are you sure you want to delete the selected transactions? This action cannot be undone."
        confirmText="Yes, Delete All"
        cancelText="Cancel"
      />
    </>
  );
};
