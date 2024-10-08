"use server";
import { prisma } from "@/lib/prisma"; // Assurez-vous que le chemin vers votre client Prisma est correct
import { getServerSession } from "next-auth"; // Importer getServerSession pour récupérer la session
import { authOptions } from "@/auth"; // Importer authOptions pour les options d'authentification

export async function getUserForms() {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Si l'utilisateur n'est pas authentifié, retourner un tableau vide
  if (!userId) {
    return [];
  }

  // Récupérer les formulaires de l'utilisateur
  const userForms = await prisma.form.findMany({
    where: {
      userId: userId, // Filtrer par l'ID de l'utilisateur
    },
  });

  // Retourner les formulaires trouvés
  return userForms;
}
