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
import { createBuilding, deleteBuilding, updateBuilding } from '@/actions/master';
import { ColumnDef } from '@tanstack/react-table';

type Building = {
  id: string;
  name: string;
  createdAt: Date;
};

interface BuildingsClientPageProps {
  initialBuildings: Building[];
}

const buildingSchema = z.object({
  name: z.string().min(3, "Building name must be at least 3 characters").max(100),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

export const BuildingsClientPage = ({ initialBuildings }: BuildingsClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null);
  const [buildingToEdit, setBuildingToEdit] = useState<Building | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { addToast } = useToast();

  const methods = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema) as any,
    defaultValues: {
      name: '',
    }
  });

  const handleEditClick = (building: Building) => {
    setBuildingToEdit(building);
    methods.reset({
      name: building.name,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setBuildingToEdit(null);
    methods.reset({ name: '' });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Building>[]>(
    () => [
      { accessorKey: 'name', header: 'Building Name' },
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setBuildingToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: BuildingFormValues) => {
    setIsSubmitting(true);
    try {
      if (buildingToEdit) {
        await updateBuilding(buildingToEdit.id, {
          name: formData.name,
        });
        addToast('Building has been updated successfully.', 'success');
      } else {
        await createBuilding({
          name: formData.name,
        });
        addToast('New building has been added successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setBuildingToEdit(null);
    } catch (error) {
      addToast(buildingToEdit ? 'Failed to update building.' : 'Failed to add new building.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!buildingToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBuilding(buildingToDelete);
      addToast('The building has been removed.', 'success');
    } catch (error) {
      addToast('Failed to delete the building. It might be in use by a room.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setBuildingToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    addToast(`Bulk delete not implemented yet for ${selectedRows.length} buildings.`, 'warning');
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Master Data' },
              { label: 'Buildings' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Master Buildings</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Building
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <DataTable 
            columns={columns} 
            data={initialBuildings} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setBuildingToEdit(null);
        }} 
        title={buildingToEdit ? "Edit Building" : "Register New Building"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setBuildingToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-building-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (buildingToEdit ? 'Update Building' : 'Save Building')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-building-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            <FormInput name="name" label="Building Name" placeholder="e.g. Gedung Utama, Lab A" />
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!buildingToDelete}
        onClose={() => setBuildingToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Building?"
        message="Are you sure you want to delete this building? If there are rooms assigned to this building, the deletion might fail."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />
    </>
  );
};
