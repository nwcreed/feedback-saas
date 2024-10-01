"use client";
import * as React from 'react';
import { useQuery } from 'react-query'; // Pour la gestion des données
import { prisma } from '@/lib/prisma'; // Chemin vers votre instance Prisma
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Types pour les données Prisma
type FormSubmission = {
  id: number;
  userId: string | null;
  userName: string;
  userEmail: string;
  message: string;
  rating: number;
  submittedAt: Date;
};

interface TableProps {
  formId: number; // ID du formulaire pour récupérer les soumissions
}

const columnHelper = createColumnHelper<FormSubmission>();

export function Table({ formId }: TableProps) {
  // Utiliser react-query pour récupérer les soumissions de formulaire
  const { data: submissions, isLoading, error } = useQuery<FormSubmission[]>(['formSubmissions', formId], async () => {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        submissions: true, // Inclure toutes les soumissions
      },
    });

    return form?.submissions || []; // Retourner les soumissions ou un tableau vide
  });

  // Gestion de l'état de chargement et des erreurs
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading submissions</div>;

  // Définition des colonnes de la table
  const columns = [
    columnHelper.accessor('id', {
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('userName', {
      header: () => 'User Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('userEmail', {
      header: () => 'User Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('message', {
      header: () => 'Message',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('rating', {
      header: () => 'Rating',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('submittedAt', {
      header: () => 'Submitted At',
      cell: info => new Date(info.getValue()).toLocaleString(), // Formatage de la date
    }),
  ];

  const table = useReactTable({
    data: submissions || [], // Utiliser un tableau vide si data est undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2 mt-4">
      <div className='shadow overflow-hidden border border-gray-200 sm:rounded-lg'>
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='border-b'>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className='text-left p-3'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='py-2'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='p-3'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
