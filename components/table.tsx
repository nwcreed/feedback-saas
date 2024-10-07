"use client";
import React from 'react'
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react'
import Ratings from './ratings';

import {
  Column,
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { FormSubmission } from "@prisma/client";

type Submission = FormSubmission;

function Table(props: { data: Submission[] }) {
  const columns = React.useMemo<ColumnDef<Submission>[]>(
    () => [
      {
        accessorKey: 'userName',
        header: 'Name',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'userEmail',
        header: 'Email',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: info => info.getValue() === null ? <span>N/A</span> : <Ratings rating={info.getValue() as number} />,
        footer: props => props.column.id,
      },
      
      {
        accessorKey: 'message',
        header: 'Message',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted At',
        cell: info => new Date(info.getValue() as string).toLocaleString(),
        footer: props => props.column.id,
      },
    ],
    []
  );

  return (
    <>
      <MyTable
        {...{
          data: props.data,
          columns,
        }}
      />
      <hr />
    </>
  )
}

function MyTable({
  data,
  columns,
}: {
  data: Submission[]
  columns: ColumnDef<Submission>[]
}) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  return (
    <div className="p-2 mt-5">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b border-slate-300">
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} className="text-left bg-gray-50 rounded-t-md p-4" colSpan={header.colSpan}>
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id} className="p-4 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-4">
        <button
          className="border rounded p-1 bg-gray-50 cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </button>
        <button
          className="border rounded p-1 bg-gray-50 cursor-pointer"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Table;
