import React from 'react';
import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin est correct
import Form from '@/forms/Form'; // Remplacez par le chemin correct si nécessaire

const Page = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;

  // Vérification que l'ID du formulaire est bien fourni
  if (!formId) {
    return <div>Form not found</div>;
  }

  // Récupération du formulaire avec Prisma
  const form = await prisma.form.findUnique({
    where: { id: parseInt(formId) },
    include: {
      submissions: {
        select: {
          message: true, // Sélectionne le champ "message" au lieu de "answer"
          rating: true,  // Sélectionne aussi la note si tu en as besoin
          userName: true, // Sélectionne le nom de l'utilisateur
          userEmail: true, // Sélectionne l'e-mail de l'utilisateur
        },
      },
    },
  });

  // Vérification que le formulaire existe
  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <Form form={form} /> 
  );
};

export default Page;
