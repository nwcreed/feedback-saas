"use server";

import { prisma } from "@/lib/prisma"; // Assurez-vous que le chemin est correct
import { getServerSession } from "next-auth"; // Importer getServerSession
import { authOptions } from "@/auth"; // Importer authOptions


interface SaveFormData {
  name: string;
  description?: string;
  questions: Array<{
    text: string;
    fieldType: string;
    fieldOptions?: Array<{ text: string; value: string }>;
  }>;
}

export async function saveForm(data: SaveFormData) {
  const { name, description, questions } = data;
  
  // Récupération de la session de l'utilisateur
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Vérification que l'utilisateur est authentifié
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Création du formulaire associé à l'utilisateur
  const newForm = await prisma.form.create({
    data: {
      name,
      description,
      userId,
      published: false,
    },
  });

  // Ajout des questions et des options pour chaque question
  for (const question of questions) {
    const newQuestion = await prisma.formSubmission.create({
      data: {
        formId: newForm.id,
        userName: question.text, // Utilisez le texte comme nom d'utilisateur si nécessaire
        userEmail: "", // Remplir selon les besoins
        message: "",   // Remplir selon les besoins
        rating: 0,     // Vous devez fournir un `rating`, utilisez une valeur par défaut si nécessaire
      },
    });

    // Si des options de champ existent, elles sont ajoutées
    if (question.fieldOptions && question.fieldOptions.length > 0) {
      for (const option of question.fieldOptions) {
        await prisma.formSubmission.create({
          data: {
            formId: newForm.id,
            userName: option.text, // Enregistrement des options
            userEmail: option.value,
            message: "", // Remplir selon les besoins
            rating: 0,   // Assurez-vous d'ajouter une note ici également
          },
        });
      }
    }
  }

  return newForm.id;
}

export async function publishForm(formId: number) {
  // Mise à jour pour publier le formulaire
  await prisma.form.update({
    where: { id: formId },
    data: { published: true },
  });
}
