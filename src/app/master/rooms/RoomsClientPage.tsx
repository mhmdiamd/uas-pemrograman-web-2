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
import { createRoom, deleteRoom, updateRoom } from '@/actions/master';
import { ColumnDef } from '@tanstack/react-table';

type Building = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  name: string;
  floor: string | null;
  building: Building | null;
  createdAt: Date;
};

interface RoomsClientPageProps {
  initialRooms: Room[];
  initialBuildings: Building[];
}

const roomSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters").max(100),
  floor: z.string().optional(),
  buildingId: z.string().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export const RoomsClientPage = ({ initialRooms, initialBuildings }: RoomsClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { addToast } = useToast();

  const methods = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: {
      name: '',
      floor: '',
      buildingId: '',
    }
  });

  const handleEditClick = (room: Room) => {
    setRoomToEdit(room);
    methods.reset({
      name: room.name,
      floor: room.floor || '',
      buildingId: room.building?.id || '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setRoomToEdit(null);
    methods.reset({ name: '', floor: '', buildingId: '' });
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Room>[]>(
    () => [
      { accessorKey: 'name', header: 'Room Name' },
      { 
        accessorKey: 'building', 
        header: 'Building',
        accessorFn: (row) => row.building?.name || 'No Building'
      },
      { accessorKey: 'floor', header: 'Floor' },
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
            <Button variant="danger" className="px-2 py-1" onClick={() => setRoomToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: RoomFormValues) => {
    setIsSubmitting(true);
    try {
      if (roomToEdit) {
        await updateRoom(roomToEdit.id, {
          name: formData.name,
          floor: formData.floor || undefined,
          buildingId: formData.buildingId || undefined,
        });
        addToast('Room has been updated successfully.', 'success');
      } else {
        await createRoom({
          name: formData.name,
          floor: formData.floor || undefined,
          buildingId: formData.buildingId as string,
        });
        addToast('New room has been added successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setRoomToEdit(null);
    } catch (error) {
      addToast(roomToEdit ? 'Failed to update room.' : 'Failed to add new room.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteRoom(roomToDelete);
      addToast('The room has been removed.', 'success');
    } catch (error) {
      addToast('Failed to delete the room. It might be assigned to inventory.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setRoomToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    addToast(`Bulk delete not implemented yet for ${selectedRows.length} rooms.`, 'warning');
  };

  const buildingOptions = initialBuildings.map(b => ({
    label: b.name,
    value: b.id
  }));

  const buildingFilterOptions = initialBuildings.map(b => ({
    label: b.name,
    value: b.name
  }));
  buildingFilterOptions.push({ label: 'No Building', value: 'No Building' });

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Master Data' },
              { label: 'Rooms' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Master Rooms</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedRows.length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Room
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <DataTable 
            columns={columns} 
            data={initialRooms} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
            filterOptions={[
              {
                columnId: 'building',
                placeholder: 'Filter Building',
                options: buildingFilterOptions
              }
            ]}
          />
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setRoomToEdit(null);
        }} 
        title={roomToEdit ? "Edit Room" : "Register New Room"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setRoomToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-room-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (roomToEdit ? 'Update Room' : 'Save Room')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-room-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            <FormInput name="name" label="Room Name" placeholder="e.g. Lab Komputer 1, Ruang Rapat" />
            <FormSelect 
              name="buildingId" 
              label="Building (Optional)" 
              options={[{label: '-- Select Building --', value: ''}, ...buildingOptions]} 
            />
            <FormInput name="floor" label="Floor (Optional)" placeholder="e.g. 1, 2, Ground" />
          </form>
        </FormProvider>
      </Modal>

      <AlertModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Room?"
        message="Are you sure you want to delete this room? If there is inventory assigned to this room, the deletion might fail."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />
    </>
  );
};
