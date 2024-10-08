"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma"; // Assure-toi que l'importation de Prisma est correcte
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Mise à jour en fonction du chemin vers ton fichier NextAuth

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  // Définition du schéma de validation pour le formulaire
  const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  });

  // Validation des données envoyées via le formulaire
  const parse = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parse.success) {
    console.log(parse.error);
    return {
      message: "Failed to parse data",
    };
  }

  const data = parse.data;

  // Récupération de la session avec getServerSession dans l'App Directory
  const session = await getServerSession(authOptions);
  console.log("Session récupérée : ", session); // Log pour vérifier la session
  const userId = session?.user?.id;

  if (!userId) {
    console.log("User non authentifié");
    return {
      message: "User not authenticated",
    };
  }

  // Création du formulaire dans la base de données
  try {
    const form = await prisma.form.create({
      data: {
        name: data.title,
        description: data.description,
        userId: userId, // Utilisation de l'ID de l'utilisateur connecté
        published: false,
      },
    });

    console.log("Formulaire créé avec succès : ", form);

    return {
      message: "Form created successfully",
      form: {
        id: form.id.toString(), // Obtiens l'ID du formulaire créé
        title: data.title,
        description: data.description,
      },
    };
  } catch (error) {
    console.log("Erreur lors de la création du formulaire : ", error);
    return {
      message: "Failed to create form",
    };
  }
}
