import React from 'react';
import { prisma } from '@/lib/prisma'; // Chemin vers votre instance Prisma
import FormsPicker from './FormsPicker';
import ResultsDisplay from './ResultsDisplay';


type Props = {};


const page = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  // Récupérer les formulaires de l'utilisateur
  const userForms = await prisma.form.findMany({
    where: {
      userId: 'user-id-here', // Remplacez par l'ID de l'utilisateur actuel, par exemple via votre système d'authentification
    },
  });


  if (!userForms || userForms.length === 0) {
    return <div>No forms found</div>;
  }


  const selectOptions = userForms.map((form) => ({
    label: form.name,
    value: form.id,
  }));


  return (
    <div>
      <FormsPicker options={selectOptions} />
      <ResultsDisplay
        formId={searchParams?.formId ? parseInt(searchParams.formId as string) : userForms[0].id}
      />
    </div>
  );
};


export default page;
