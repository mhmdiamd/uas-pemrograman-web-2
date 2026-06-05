'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, InteractiveCard, ImageCard, DetailCard, ArticleCard, MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { AlertModal } from '@/components/ui/AlertModal';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { DatePicker } from '@/components/ui/DatePicker';
import { Tooltip } from '@/components/ui/Tooltip';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { FileUpload } from '@/components/ui/FileUpload';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Popover } from '@/components/ui/Popover';
import { useToast } from '@/contexts/ToastContext';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormInput } from '@/components/ui/FormInput';
import { FormSelect } from '@/components/ui/FormSelect';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';

const itemSchema = z.object({
  itemName: z.string().min(3, "Item name must be at least 3 characters").max(50),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Maintenance' | 'Damaged';
};

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Item Name' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'Active' ? 'success' : status === 'Maintenance' ? 'warning' : 'danger';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => <Button variant="secondary" size="sm">View</Button>,
  },
];

const tableData: InventoryItem[] = [
  { id: '#INV-001', name: 'MacBook Pro M2', category: 'Electronics', status: 'Active' },
  { id: '#INV-002', name: 'Office Chair', category: 'Furniture', status: 'Maintenance' },
  { id: '#INV-003', name: 'Projector 4K', category: 'Electronics', status: 'Damaged' },
  { id: '#INV-004', name: 'Ergonomic Desk', category: 'Furniture', status: 'Active' },
  { id: '#INV-005', name: 'Network Switch', category: 'Networking', status: 'Active' },
  { id: '#INV-006', name: 'Server Rack', category: 'Infrastructure', status: 'Active' },
];

export default function Home() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedInventoryRows, setSelectedInventoryRows] = useState<any[]>([]);

  const methods = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemName: '',
      category: '',
      status: '',
      quantity: 1,
    }
  });

  const onSubmit = (data: ItemFormValues) => {
    addToast('Item successfully added! Check console for data.', 'success');
    console.log("Form Submitted:", data);
    methods.reset();
  };

  const handleBulkDelete = () => {
    addToast(`Successfully deleted ${selectedInventoryRows.length} items.`, 'error');
    setSelectedInventoryRows([]);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-black uppercase mb-4 tracking-tighter text-neo-text">Dashboard Showcase</h1>
          <p className="text-lg font-bold bg-white inline-block px-3 py-1 neo-border neo-shadow-sm">
            Welcome to the Neobrutalist Inventory System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Total Items" 
            value="1,245" 
            className="bg-[var(--color-neo-primary)]" 
            trend={{ value: "+12.5%", isPositive: true }}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            }
          />
          <MetricCard 
            title="Active Locations" 
            value="18" 
            className="bg-[var(--color-neo-secondary)]" 
            trend={{ value: "-2 this month", isPositive: false }}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            }
          />
          <MetricCard 
            title="Recent Transactions" 
            value="42" 
            className="bg-[var(--color-neo-accent)] text-neo-text" 
            trend={{ value: "+8 since yesterday", isPositive: true }}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            }
          />
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-6 border-b-3 border-neo-text pb-2">Components Demo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Left Column */}
              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-secondary)] inline-block px-2 border-2 border-neo-text">Buttons & Tooltips</h3>
                <div className="flex flex-wrap gap-4 p-4 bg-white border-3 border-neo-text">
                  <Tooltip content="Primary Action" position="top">
                    <Button variant="primary">Primary</Button>
                  </Tooltip>
                  <Tooltip content="Warning!" position="bottom">
                    <Button variant="warning">Warning</Button>
                  </Tooltip>
                  <Button variant="danger">Danger</Button>
                  <Button variant="secondary">Secondary</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-primary)] inline-block px-2 border-2 border-neo-text">Interactive (Modals & Toast)</h3>
                <div className="flex flex-wrap gap-4 p-4 bg-white border-3 border-neo-text">
                  <Button onClick={() => addToast('Successfully loaded data!', 'success')} variant="primary">Show Success Toast</Button>
                  <Button onClick={() => addToast('Connection failed.', 'error')} variant="danger">Show Error Toast</Button>
                  <Button onClick={() => setIsModalOpen(true)} variant="warning">Open Modal</Button>
                  <Button onClick={() => setIsAlertOpen(true)} variant="secondary">Open Alert</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-white inline-block px-2 border-2 border-neo-text">Popover & Badges</h3>
                <div className="flex flex-wrap gap-4 p-4 bg-white border-3 border-neo-text items-center">
                  <Popover position="top" trigger={<Button variant="secondary">Click for Popover</Button>}>
                    <div className="text-center font-bold">
                      <p className="mb-2">Hello from Popover!</p>
                      <Badge variant="success">Neat!</Badge>
                    </div>
                  </Popover>

                  <Badge variant="info">New Item</Badge>
                  <Badge variant="warning">Low Stock</Badge>
                  <Badge variant="danger">Damaged</Badge>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-accent)] text-neo-text inline-block px-2 border-2 border-neo-text">Form Validation (Zod)</h3>
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6 bg-white border-3 border-neo-text neo-shadow">
                    <FormInput name="itemName" label="Item Name" placeholder="e.g. MacBook Pro M2" />
                    <FormSelect 
                      name="category" 
                      label="Category" 
                      placeholder="Select a category"
                      options={[
                        { label: 'Electronics', value: 'electronics' },
                        { label: 'Furniture', value: 'furniture' },
                        { label: 'Laboratory', value: 'laboratory' },
                        { label: 'ATK', value: 'atk' }
                      ]}
                    />
                    <FormSelect 
                      name="status" 
                      label="Status" 
                      placeholder="Select status"
                      options={[
                        { label: 'Active', value: 'active' },
                        { label: 'Maintenance', value: 'maintenance' },
                        { label: 'Damaged', value: 'damaged' }
                      ]}
                    />
                    <FormInput name="quantity" type="number" label="Quantity" />
                    <Button type="submit" variant="primary" className="mt-2 w-full">Add Item</Button>
                  </form>
                </FormProvider>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-accent)] text-neo-text inline-block px-2 border-2 border-neo-text">Date Picker</h3>
                <div className="p-6 bg-white border-3 border-neo-text neo-shadow">
                  <DatePicker label="Select Maintenance Date" placeholder="Choose a date..." />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[#E8D8C3] inline-block px-2 border-2 border-neo-text">File Uploaders</h3>
                <div className="space-y-6 p-6 bg-white border-3 border-neo-text neo-shadow">
                  <FileUpload label="General Document" accept=".pdf,.doc,.docx" />
                  <ImageUpload label="Product Image" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-secondary)] inline-block px-2 border-2 border-neo-text">Accordion & Breadcrumbs</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-white border-3 border-neo-text neo-shadow">
                    <Breadcrumb 
                      items={[
                        { label: 'Dashboard', href: '/' },
                        { label: 'Master Data', href: '#' },
                        { label: 'Inventory Items' }
                      ]} 
                    />
                  </div>
                  <Accordion>
                    <AccordionItem title="What is Neobrutalism?">
                    Neobrutalism is an aesthetic characterized by bold colors, hard shadows, thick borders, and a raw, unpolished look inspired by Brutalist architecture but modernized for web UI.
                  </AccordionItem>
                  <AccordionItem title="How do I use these components?">
                    Just import them from the `@/components/ui` directory. They are pre-styled to match the global theme variables.
                  </AccordionItem>
                  <AccordionItem title="Can I customize them?">
                    Absolutely! Every component accepts a `className` prop so you can override or append Tailwind classes as needed.
                  </AccordionItem>
                </Accordion>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-primary)] inline-block px-2 border-2 border-neo-text">Tabs Component</h3>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <h4 className="font-bold text-xl mb-2">System Overview</h4>
                    <p>This is the overview panel. Content can be placed inside these panels to group information cleanly.</p>
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <h4 className="font-bold text-xl mb-2">Configuration</h4>
                    <p>Update your system settings here. The active tab gets the accent color and pops up!</p>
                  </TabsContent>
                  
                  <TabsContent value="logs">
                    <h4 className="font-bold text-xl mb-2">Activity Logs</h4>
                    <p>No recent activity. Everything is running smoothly.</p>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-3 bg-[var(--color-neo-accent)] inline-block px-2 border-2 border-neo-text">Loading Skeletons</h3>
                <div className="grid grid-cols-1 gap-4">
                  <SkeletonCard />
                  <div className="flex gap-4 items-center bg-white p-4 neo-border">
                    <Skeleton className="w-16 h-16 circular" variant="circular" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card Variants Showcase */}
        <div>
          <h2 className="text-2xl font-bold mb-6 bg-white inline-block px-4 py-2 neo-border neo-shadow">Card Variants</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Interactive Card */}
            <InteractiveCard className="flex flex-col justify-center items-center text-center bg-[var(--color-neo-primary)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-4">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
              <h3 className="text-xl font-black">Interactive Card</h3>
              <p className="mt-2 font-medium opacity-80">Hover over me! I have a bouncy lift effect and a deeper shadow. Great for grid links.</p>
            </InteractiveCard>

            {/* Detail Card */}
            <DetailCard
              title="MacBook Pro M2"
              details={[
                { label: 'Asset ID', value: '#INV-001' },
                { label: 'Category', value: 'Electronics' },
                { label: 'Status', value: <Badge variant="success">Active</Badge> },
                { label: 'Location', value: 'Room 302' },
              ]}
            />

            {/* Article Card */}
            <ArticleCard
              badge="NEW UPDATE"
              date="June 5, 2026"
              title="System Maintenance Log"
              content="The main database was successfully migrated to the new schema without any downtime. All legacy inventory items have been mapped.&#10;&#10;Please report any missing assets to the IT department immediately."
            />

            {/* Image Card */}
            <ImageCard
              imageSrc="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
              imageAlt="MacBook Pro"
              title="Laptop Inventory Check"
              description="Reviewing the current state of all deployed developer machines in the engineering department."
            >
              <Button variant="secondary" className="w-full">View Details</Button>
            </ImageCard>

          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-white inline-block px-4 py-2 neo-border neo-shadow">Recent Inventory List</h2>
            {selectedInventoryRows.length > 0 && (
              <Button variant="danger" onClick={handleBulkDelete}>
                Delete Selected ({selectedInventoryRows.length})
              </Button>
            )}
          </div>
          <DataTable 
            columns={columns} 
            data={tableData} 
            enableSelection={true}
            onSelectionChange={setSelectedInventoryRows}
            filterOptions={[
              {
                columnId: 'status',
                placeholder: 'Filter Status',
                options: [
                  { label: 'Active', value: 'Active' },
                  { label: 'Maintenance', value: 'Maintenance' },
                  { label: 'Damaged', value: 'Damaged' }
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Render Modals */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Inventory Item"
        footer={<Button variant="primary" onClick={() => setIsModalOpen(false)}>Save Changes</Button>}
      >
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Item Name</label>
            <Input defaultValue="MacBook Pro M2" />
          </div>
          <div>
            <label className="block font-bold mb-1">Category</label>
            <Input defaultValue="Electronics" />
          </div>
        </div>
      </Modal>

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => {
          setIsAlertOpen(false);
          addToast('Item successfully deleted.', 'success');
        }}
        title="Delete Item"
        message="Are you sure you want to delete #INV-003 Projector 4K? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </MainLayout>
  );
}
