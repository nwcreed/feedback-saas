"use client";

import React from 'react';
import { prisma } from '@/lib/prisma'; // Chemin vers votre instance Prisma
import { useQuery } from 'react-query'; // Pour la gestion des données
import { Table } from './Table'; // Assurez-vous que le chemin d'importation est correct

type Props = {
  formId: number;
};

const ResultsDisplay = ({ formId }: Props) => {
  // Récupérer le formulaire avec ses soumissions
  const { data: form, isLoading, error } = useQuery(['form', formId], async () => {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        submissions: true, // Inclure toutes les soumissions
      },
    });
    return form;
  });

  // Gestion de l'état de chargement et des erreurs
  if (isLoading) return <div>Loading form...</div>;
  if (error) return <div>Error loading form</div>;
  if (!form) return <p>No form found.</p>;

  return (
    <div>
      <h2>{form.name}</h2>
      <p>{form.description}</p>
      <Table formId={formId} /> {/* Passer l'ID du formulaire à Table */}
    </div>
  );
};

export default ResultsDisplay;
