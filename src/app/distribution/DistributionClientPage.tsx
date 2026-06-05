'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { createDistribution, deleteDistribution, updateDistribution, deleteDistributions } from '@/actions/distribution';
import { ColumnDef } from '@tanstack/react-table';

type Room = { id: string; name: string; building?: { name: string } | null };
type Item = { id: string; name: string; itemType?: { name: string } | null };
type Inventory = { id: string; quantity: number; status: string; item: Item };

type Distribution = {
  id: string;
  quantity: number;
  status: string;
  inventoryDate: Date;
  room: Room;
  inventory: Inventory;
};

interface DistributionClientPageProps {
  initialDistributions: Distribution[];
  inventory: Inventory[];
  rooms: Room[];
}

const distributionSchema = z.object({
  inventoryId: z.string().min(1, "Asset is required"),
  roomId: z.string().min(1, "Room is required"),
  quantity: z.coerce.number().min(1, "Must be at least 1"),
  status: z.string().default('ACTIVE'),
});

type DistributionFormValues = z.infer<typeof distributionSchema>;

export const DistributionClientPage = ({ initialDistributions, inventory, rooms }: DistributionClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [distToDelete, setDistToDelete] = useState<string | null>(null);
  const [distToEdit, setDistToEdit] = useState<Distribution | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const { addToast } = useToast();

  const methods = useForm<DistributionFormValues>({
    resolver: zodResolver(distributionSchema) as any,
    defaultValues: {
      inventoryId: '',
      roomId: '',
      quantity: 1,
      status: 'ACTIVE',
    }
  });

  const handleEditClick = (dist: Distribution) => {
    setDistToEdit(dist);
    methods.reset({
      inventoryId: dist.inventory.id,
      roomId: dist.room.id,
      quantity: dist.quantity,
      status: dist.status,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setDistToEdit(null);
    methods.reset({
      inventoryId: '',
      roomId: '',
      quantity: 1,
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Distribution>[]>(
    () => [
      { accessorKey: 'inventory.item.name', header: 'Asset Name' },
      { 
        accessorKey: 'room.name', 
        header: 'Location',
        cell: ({ row }) => (
          <span>
            {row.original.room.name} 
            {row.original.room.building ? ` (${row.original.room.building.name})` : ''}
          </span>
        )
      },
      { accessorKey: 'quantity', header: 'Qty Assigned', cell: ({ row }) => <span className="font-bold">{row.original.quantity}</span> },
      { 
        accessorKey: 'inventoryDate', 
        header: 'Date Assigned',
        cell: ({ row }) => new Date(row.original.inventoryDate).toLocaleDateString()
      },
      { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let color = 'bg-blue-100 text-blue-800';
          if (status === 'ACTIVE') color = 'bg-green-100 text-green-800';
          if (status === 'RETURNED') color = 'bg-gray-100 text-gray-800';
          if (status === 'LOST') color = 'bg-red-100 text-red-800';
          return (
            <span className={`px-2 py-1 text-xs font-bold neo-border ${color}`}>
              {status}
            </span>
          );
        }
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setDistToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: DistributionFormValues) => {
    setIsSubmitting(true);
    try {
      if (distToEdit) {
        await updateDistribution(distToEdit.id, {
          quantity: formData.quantity,
          status: formData.status,
        });
        addToast('Distribution record has been updated.', 'success');
      } else {
        await createDistribution({
          inventoryId: formData.inventoryId,
          roomId: formData.roomId,
          quantity: formData.quantity,
          status: formData.status,
        });
        addToast('Asset has been assigned to the room.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setDistToEdit(null);
    } catch (error) {
      addToast(distToEdit ? 'Failed to update record.' : 'Failed to assign asset.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!distToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteDistribution(distToDelete);
      addToast('The distribution record has been removed.', 'success');
      setSelectedRows(selectedRows.filter(r => r.id !== distToDelete));
    } catch (error) {
      addToast('Failed to delete distribution.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setDistToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    setIsSubmitting(true);
    try {
      const ids = selectedRows.map(r => r.id);
      await deleteDistributions(ids);
      addToast(`${ids.length} assignments have been removed.`, 'success');
      setSelectedRows([]);
    } catch (error) {
      addToast('Failed to delete assignments.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const inventoryOptions = inventory.map(inv => ({
    label: `${inv.item.name} (Stock: ${inv.quantity} - ${inv.status})`,
    value: inv.id
  }));

  const roomOptions = rooms.map(r => ({
    label: `${r.name} ${r.building ? `(${r.building.name})` : ''}`,
    value: r.id
  }));

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Distribution' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Asset Distribution</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="primary" onClick={handleOpenAdd}>
            + Assign to Room
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
                Remove Selected
              </Button>
            </div>
          </div>
        )}

        <div>
          <DataTable 
            columns={columns} 
            data={initialDistributions} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setDistToEdit(null);
        }} 
        title={distToEdit ? "Edit Distribution" : "Assign Asset to Room"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setDistToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-dist-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (distToEdit ? 'Update' : 'Assign Asset')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-dist-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            
            {!distToEdit && (
              <div className="space-y-4">
                <FormSelect 
                  name="inventoryId" 
                  label="Select Asset from Inventory" 
                  options={[{label: '-- Select Asset --', value: ''}, ...inventoryOptions]} 
                />
                <FormSelect 
                  name="roomId" 
                  label="Destination Room" 
                  options={[{label: '-- Select Room --', value: ''}, ...roomOptions]} 
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput name="quantity" type="number" label="Quantity to Assign" />
              <FormSelect 
                name="status" 
                label="Assignment Status" 
                options={[
                  {label: 'ACTIVE', value: 'ACTIVE'},
                  {label: 'RETURNED', value: 'RETURNED'},
                  {label: 'LOST', value: 'LOST'},
                ]} 
              />
            </div>
            {distToEdit && <p className="text-sm italic opacity-70">Note: To change the Asset or Room, delete this record and create a new one.</p>}
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!distToDelete}
        onClose={() => setDistToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Assignment?"
        message="Are you sure you want to remove this asset from the room?"
        confirmText="Yes, Remove"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Remove ${selectedRows.length} Assignments?`}
        message="Are you sure you want to remove the selected assets from their rooms? This action cannot be undone."
        confirmText="Yes, Remove All"
        cancelText="Cancel"
      />
    </>
  );
};
