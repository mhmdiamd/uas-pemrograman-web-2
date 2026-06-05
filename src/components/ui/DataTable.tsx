'use client';

import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';

export interface DataTableFilterOption {
  columnId: string;
  placeholder?: string;
  options: { label: string; value: string }[];
}

// Debounced Input Component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions?: DataTableFilterOption[];
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({ 
  columns, 
  data, 
  filterOptions, 
  enableSelection = false,
  onSelectionChange 
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Conditionally add selection column
  const tableColumns = React.useMemo(() => {
    if (!enableSelection) return columns;
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, TValue>,
      ...columns,
    ];
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
    },
  });

  // Call onSelectionChange when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      const selectedData = table.getSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedData);
    }
  }, [rowSelection, table, onSelectionChange]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 neo-border neo-shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Top Left: Rows per page & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Rows per page */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="font-bold text-neo-text/80 text-sm whitespace-nowrap">Rows per page:</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onChange={(val) => table.setPageSize(Number(val))}
              options={[
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '20', value: '20' },
                { label: '50', value: '50' },
              ]}
              className="w-24 min-w-0"
            />
          </div>

          {/* Column Filters */}
          {filterOptions && filterOptions.length > 0 && (
            <div className="flex gap-4 w-full sm:w-auto">
              {filterOptions.map((filter) => (
                <Select
                  key={filter.columnId}
                  options={[{ label: 'All', value: '' }, ...filter.options]}
                  value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? ''}
                  onChange={(value) => table.getColumn(filter.columnId)?.setFilterValue(value || undefined)}
                  placeholder={filter.placeholder ?? 'Filter...'}
                  className="w-full sm:min-w-[160px]"
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Right: Global Search */}
        <div className="flex items-center gap-3 w-full sm:w-64">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-neo-text shrink-0">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder="Search..."
            className="w-full !mb-0"
          />
        </div>
      </div>
      <div className="w-full bg-transparent md:bg-white md:overflow-x-auto md:border-[3px] md:border-[var(--color-neo-text)] md:shadow-[4px_4px_0px_0px_var(--color-neo-text)]">
        <table className="w-full text-left border-collapse block md:table">
          <thead className="hidden md:table-header-group bg-[var(--color-neo-secondary)] border-b-[3px] border-[var(--color-neo-text)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className={`px-6 py-4 font-bold border-r-[3px] border-[var(--color-neo-text)] last:border-r-0 ${header.column.id === 'actions' ? 'text-center' : ''}`}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? `cursor-pointer select-none flex items-center gap-2 hover:opacity-80 ${header.column.id === 'actions' ? 'justify-center' : ''}`
                              : `flex items-center gap-2 ${header.column.id === 'actions' ? 'justify-center' : ''}`,
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="text-sm">▲</span>,
                            desc: <span className="text-sm">▼</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="block md:table-row-group">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="block md:table-row bg-white border-[3px] border-[var(--color-neo-text)] mb-4 md:mb-0 md:border-t-0 md:border-l-0 md:border-r-0 md:border-b-[3px] md:last:border-b-0 hover:bg-gray-50 transition-colors p-4 md:p-0 shadow-[4px_4px_0px_0px_var(--color-neo-text)] md:shadow-none"
                >
                  {row.getVisibleCells().map((cell) => {
                    const headerContent = cell.column.columnDef.header;
                    const label = typeof headerContent === 'string' ? headerContent : (cell.column.id === 'select' ? '' : cell.column.id);
                    
                    return (
                      <td key={cell.id} className={`block md:table-cell px-0 py-3 md:px-6 md:py-4 border-b-2 border-dashed border-gray-200 md:border-b-0 md:border-solid md:border-r-[3px] md:border-[var(--color-neo-text)] last:border-r-0 md:last:border-b-0 ${cell.column.id === 'actions' ? 'md:text-center mt-2 md:mt-0 flex justify-end md:table-cell' : 'flex flex-col md:table-cell gap-1'}`}>
                        {label && (
                          <span className="md:hidden font-bold text-xs uppercase tracking-wider text-neo-text/60">
                            {label}
                          </span>
                        )}
                        <div className={cell.column.id === 'actions' ? '' : 'w-full'}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr className="block md:table-row bg-white neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)] md:shadow-none">
                <td colSpan={columns.length} className="block md:table-cell h-24 text-center font-bold p-4">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-2 bg-white neo-border neo-shadow-sm">
        <div className="font-bold px-2">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount() || 1}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
