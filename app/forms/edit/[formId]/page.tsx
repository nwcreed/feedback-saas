import React from 'react';
import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin est correct
import { getServerSession } from 'next-auth'; // Importer getServerSession
import { authOptions } from '@/auth'; // Importer authOptions
import Form from '../../Form'; // Remplacez par le chemin correct si nécessaire

const Page = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;

  // Vérification que l'ID du formulaire est bien fourni
  if (!formId) {
    return <div>Form not found</div>;
  }

  // Récupération de la session de l'utilisateur
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  // Vérification des autorisations
  if (!userId || userId !== form?.userId) {
    return <div>You are not authorized to view this page</div>;
  }

  // Vérification que le formulaire existe
  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <Form form={form} editMode={true} />
  );
};

export default Page;
