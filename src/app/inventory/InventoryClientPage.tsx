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
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { MetricCard } from '@/components/ui/Card';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/contexts/ToastContext';
import { createInventory, deleteInventory, updateInventory, deleteInventories } from '@/actions/inventory';
import { uploadImage } from '@/actions/upload';
import { ColumnDef } from '@tanstack/react-table';
import { QRCodeSVG } from 'qrcode.react';

// Types mapping to Prisma response
type ItemType = { id: string; name: string };
type Item = { id: string; name: string; itemTypeId?: string | null; itemType?: { name: string } | null; usefulLifeMonths: number };
type Room = { id: string; name: string; building?: { name: string } | null };

type Inventory = {
  id: string;
  quantity: number;
  price: any; 
  salvageValue: any;
  specification: string | null;
  status: string;
  photo: string | null;
  barcode: string | null;
  expiredDate: Date | null;
  purchaseDate: Date;
  item: Item;
  inventoryRooms: { room: Room; quantity: number }[];
};

interface InventoryClientPageProps {
  initialInventory: Inventory[];
  items: Item[];
  categories: ItemType[];
}

const inventorySchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.coerce.number().min(1, "Must be at least 1"),
  price: z.coerce.number().min(0, "Must be a positive number"),
  salvageValue: z.coerce.number().min(0, "Must be a positive number").optional(),
  specification: z.string().optional(),
  status: z.string().default('GOOD'),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

import { formatRupiah } from '@/lib/utils';

export const InventoryClientPage = ({ initialInventory, items, categories }: InventoryClientPageProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState<string | null>(null);
  const [inventoryToEdit, setInventoryToEdit] = useState<Inventory | null>(null);
  const [qrCodeData, setQrCodeData] = useState<Inventory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkQrModalOpen, setIsBulkQrModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [specsList, setSpecsList] = useState<string[]>(['']);
  const { addToast } = useToast();

  const methods = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      itemId: '',
      quantity: 1,
      price: 0,
      salvageValue: 0,
      specification: '',
      status: 'GOOD',
    }
  });

  const watchedPrice = methods.watch('price');
  const watchedItemId = methods.watch('itemId');
  const selectedItemLife = items.find(i => i.id === watchedItemId)?.usefulLifeMonths || 60;

  const handleEditClick = (inv: Inventory) => {
    setInventoryToEdit(inv);
    setSelectedCategoryId(inv.item.itemTypeId || '');
    methods.reset({
      itemId: inv.item.id,
      quantity: inv.quantity,
      price: Number(inv.price),
      salvageValue: Number(inv.salvageValue),
      specification: inv.specification || '',
      status: inv.status,
    });
    setSpecsList(inv.specification ? inv.specification.split('\n') : ['']);
    setPhotoFile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setInventoryToEdit(null);
    setSelectedCategoryId('');
    methods.reset({
      itemId: '',
      quantity: 1,
      price: 0,
      salvageValue: 0,
      specification: '',
      status: 'GOOD',
    });
    setSpecsList(['']);
    setPhotoFile(null);
    setIsAddModalOpen(true);
  };

  const columns = useMemo<ColumnDef<Inventory>[]>(
    () => [
      { 
        accessorKey: 'item.name', 
        header: 'Asset Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.photo ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={row.original.photo} alt={row.original.item.name} className="w-12 h-12 object-cover neo-border bg-white" />
            ) : (
              <div className="w-12 h-12 neo-border bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">NO IMG</span>
              </div>
            )}
            <div>
              <div className="font-bold">{row.original.item.name}</div>
              <div className="text-sm opacity-70">{row.original.item.itemType?.name || 'Uncategorized'}</div>
            </div>
          </div>
        )
      },
      { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => <span className="font-bold">{row.original.quantity}</span> },
      { 
        accessorKey: 'price', 
        header: 'Total Value',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-green-700">
              {formatRupiah(Number(row.original.price) * row.original.quantity)}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Depreciation: {formatRupiah(Number(row.original.price) / (row.original.item.usefulLifeMonths || 60))}/mo
            </span>
          </div>
        )
      },
      { 
        accessorKey: 'status', 
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let color = 'bg-green-100 text-green-800';
          if (status === 'BROKEN') color = 'bg-red-100 text-red-800';
          if (status === 'MAINTENANCE') color = 'bg-yellow-100 text-yellow-800';
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
            <Button variant="primary" className="px-2 py-1" onClick={() => setQrCodeData(row.original)} title="View QR Code">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Button>
            <Button variant="secondary" className="px-2 py-1" onClick={() => handleEditClick(row.original)} title="Edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </Button>
            <Button variant="danger" className="px-2 py-1" onClick={() => setInventoryToDelete(row.original.id)} title="Delete">
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

  const onSubmit = async (formData: InventoryFormValues) => {
    setIsSubmitting(true);
    try {
      let photoUrl = inventoryToEdit?.photo || undefined;
      
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append('file', photoFile);
        const uploadedUrl = await uploadImage(uploadData);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }

      const finalSpecs = specsList.filter(s => s.trim() !== '').join('\n');

      // Automatic calculation of salvage value (e.g. 0 by default, or could be 10% of price)
      // We will set it to 0 as it's automatically handled by DB default, or 0 if omitted from input
      const autoSalvageValue = 0; 

      const payload = {
        itemId: formData.itemId,
        quantity: formData.quantity,
        price: formData.price,
        salvageValue: autoSalvageValue,
        specification: finalSpecs || undefined,
        status: formData.status,
        photo: photoUrl,
      };

      if (inventoryToEdit) {
        await updateInventory(inventoryToEdit.id, payload);
        addToast('Asset has been updated successfully.', 'success');
      } else {
        await createInventory(payload);
        addToast('New asset has been registered successfully.', 'success');
      }
      setIsAddModalOpen(false);
      methods.reset();
      setInventoryToEdit(null);
      setPhotoFile(null);
    } catch (error) {
      addToast(inventoryToEdit ? 'Failed to update asset.' : 'Failed to register new asset.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!inventoryToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteInventory(inventoryToDelete);
      addToast('The asset has been removed.', 'success');
      setSelectedRows(selectedRows.filter(r => r.id !== inventoryToDelete));
    } catch (error) {
      addToast('Failed to delete the asset. It might have transaction history.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setInventoryToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    setIsSubmitting(true);
    try {
      const ids = selectedRows.map(r => r.id);
      await deleteInventories(ids);
      addToast(`${ids.length} assets have been removed.`, 'success');
      setSelectedRows([]);
    } catch (error) {
      addToast('Failed to delete assets. Some might have transaction history.', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...specsList];
    newSpecs[index] = value;
    setSpecsList(newSpecs);
  };

  const handleAddSpec = () => setSpecsList([...specsList, '']);
  const handleRemoveSpec = (index: number) => {
    if (specsList.length > 1) {
      setSpecsList(specsList.filter((_, i) => i !== index));
    }
  };

  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));

  const filteredItems = selectedCategoryId 
    ? items.filter(item => item.itemTypeId === selectedCategoryId)
    : items;

  const itemOptions = filteredItems.map(item => ({
    label: item.name,
    value: item.id
  }));

  // Render QR Code URL (pointing to a future public tracking page)
  const getQrCodeUrl = (id: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/public/asset/${id}`;
    }
    return `https://yoursystem.com/public/asset/${id}`;
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb 
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Inventory' }
            ]} 
            className="mb-2"
          />
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase">Inventory Database</h1>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="primary" onClick={handleOpenAdd}>
            + Register Stock
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Assets Registered" 
            value={initialInventory.length.toString()} 
            className="bg-[var(--color-neo-primary)]" 
          />
          <MetricCard 
            title="Good Condition" 
            value={initialInventory.filter(i => i.status === 'GOOD').length.toString()} 
            className="bg-green-300" 
          />
          <MetricCard 
            title="Under Maintenance" 
            value={initialInventory.filter(i => i.status === 'MAINTENANCE').length.toString()} 
            className="bg-yellow-300" 
          />
          <MetricCard 
            title="Broken Assets" 
            value={initialInventory.filter(i => i.status === 'BROKEN').length.toString()} 
            className="bg-red-300" 
          />
        </div>

        {selectedRows.length > 0 && (
          <div className="p-4 bg-[var(--color-neo-secondary)] neo-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_var(--color-neo-text)] mb-6">
            <div className="font-bold text-lg flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              {selectedRows.length} item(s) selected
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setIsBulkQrModalOpen(true)}>
                Print QR Codes
              </Button>
              <Button variant="danger" onClick={() => setIsBulkDeleteModalOpen(true)}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <div>
          <DataTable 
            columns={columns} 
            data={initialInventory} 
            enableSelection={true}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setInventoryToEdit(null);
        }} 
        title={inventoryToEdit ? "Edit Asset Details" : "Register New Asset"}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => {
              setIsAddModalOpen(false);
              setInventoryToEdit(null);
            }}>Cancel</Button>
            <Button type="submit" form="add-inventory-form" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (inventoryToEdit ? 'Update Asset' : 'Save Asset')}
            </Button>
          </>
        }
      >
        <FormProvider {...methods}>
          <form id="add-inventory-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 p-2">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neo-text mb-1">Select Category First</label>
                <Select
                  value={selectedCategoryId}
                  onChange={(value) => {
                    setSelectedCategoryId(value);
                    methods.setValue('itemId', ''); // reset item selection
                  }}
                  options={[{label: '-- All Categories --', value: ''}, ...categoryOptions]}
                />
              </div>
              <FormSelect 
                name="itemId" 
                label="Select Master Item" 
                options={[{label: '-- Select Item --', value: ''}, ...itemOptions]} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput name="quantity" type="number" label="Quantity" />
              <FormCurrencyInput name="price" label="Purchase Price" />
            </div>

            {watchedPrice > 0 && (
              <div className="p-4 bg-[var(--color-neo-accent)] text-white neo-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[4px_4px_0px_0px_var(--color-neo-text)]">
                <div className="flex items-center gap-2 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><polyline points="16 6 23 6 23 13"></polyline></svg>
                  <span className="font-bold text-base">Estimated Depreciation</span>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-black text-xl">{formatRupiah(watchedPrice / selectedItemLife)} / mo</div>
                  <div className="text-xs font-bold opacity-90">Based on useful life of {selectedItemLife} months ({selectedItemLife / 12} years)</div>
                </div>
              </div>
            )}

            <FormSelect 
              name="status" 
              label="Current Status" 
              options={[
                {label: 'GOOD', value: 'GOOD'},
                {label: 'MAINTENANCE', value: 'MAINTENANCE'},
                {label: 'BROKEN', value: 'BROKEN'},
              ]} 
            />

            <div className="space-y-2">
              <label className="block font-bold text-neo-text">Specifications (List Approach)</label>
              {specsList.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={spec}
                    onChange={(e) => handleSpecChange(index, e.target.value)}
                    placeholder={`Spec ${index + 1} (e.g. Core i7)`}
                    className="flex-1 p-2 bg-white neo-border outline-none focus:bg-[var(--color-neo-secondary)]"
                  />
                  <Button type="button" variant="danger" onClick={() => handleRemoveSpec(index)} className="px-3" disabled={specsList.length === 1}>
                    X
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddSpec} className="text-sm py-1">
                + Add Spec Line
              </Button>
            </div>
            
            <ImageUpload 
              label="Asset Photo (Optional)" 
              defaultUrl={inventoryToEdit?.photo}
              onClearDefault={() => {
                if (inventoryToEdit) {
                  setInventoryToEdit({ ...inventoryToEdit, photo: null });
                }
              }}
              onChange={(file) => setPhotoFile(file)} 
            />
          </form>
        </FormProvider>
      </Modal>

      {/* DELETE ALERT */}
      <AlertModal
        isOpen={!!inventoryToDelete}
        onClose={() => setInventoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Asset?"
        message="Are you sure you want to delete this asset record? All associated QR Codes will become invalid."
        confirmText="Yes, Delete It"
        cancelText="Cancel"
      />

      {/* QR CODE MODAL */}
      <Modal
        isOpen={!!qrCodeData}
        onClose={() => setQrCodeData(null)}
        title="Asset QR Code"
        footer={
          <Button variant="primary" onClick={() => setQrCodeData(null)} className="w-full">
            Done
          </Button>
        }
      >
        {qrCodeData && (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="bg-white p-4 neo-border neo-shadow">
              <QRCodeSVG 
                value={getQrCodeUrl(qrCodeData.id)} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
            <div className="text-center">
              <h3 className="font-black text-xl">{qrCodeData.item.name}</h3>
              <p className="font-medium opacity-70">ID: {qrCodeData.id}</p>
              <div className="mt-4 flex gap-2 justify-center">
                 <Button variant="secondary" onClick={() => {
                   navigator.clipboard.writeText(getQrCodeUrl(qrCodeData.id));
                   addToast('Tracking link copied to clipboard!', 'success');
                 }}>
                   Copy Link
                 </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* BULK DELETE ALERT */}
      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedRows.length} Assets?`}
        message="Are you sure you want to delete the selected assets? This action cannot be undone."
        confirmText="Yes, Delete All"
        cancelText="Cancel"
      />

      {/* BULK QR CODE MODAL */}
      <Modal
        isOpen={isBulkQrModalOpen}
        onClose={() => setIsBulkQrModalOpen(false)}
        title="Print Bulk QR Codes"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsBulkQrModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              const printContent = document.getElementById('bulk-qr-print-area');
              if (printContent) {
                const clone = printContent.cloneNode(true) as HTMLElement;
                // Remove scroll properties for print so everything renders
                clone.style.maxHeight = 'none';
                clone.style.overflow = 'visible';
                
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = clone.outerHTML;
                window.print();
                document.body.innerHTML = originalContents;
                window.location.reload();
              }
            }}>
              Print All QR Codes
            </Button>
          </>
        }
      >
        <div className="p-4 max-h-[60vh] overflow-y-auto bg-white" id="bulk-qr-print-area">
          <div 
            className="grid gap-6 p-4" 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
          >
            {selectedRows.map((row) => (
              <div 
                key={row.id} 
                className="bg-white p-4 flex flex-col items-center justify-center text-center"
                style={{ border: '4px solid black', breakInside: 'avoid', pageBreakInside: 'avoid' }}
              >
                <QRCodeSVG 
                  value={getQrCodeUrl(row.id)} 
                  size={140}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"M"}
                />
                <div className="mt-3 font-bold text-sm line-clamp-2 leading-tight min-h-[2.5rem]">
                  {row.item?.name}
                </div>
                <div className="mt-1 text-xs font-medium opacity-70 break-all w-full truncate">
                  ID: {row.id.split('-')[0]}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
