import { prisma } from "@/lib/prisma"; // Assure-toi que la connexion à Prisma est bien importée
import { NextResponse } from "next/server"; // Utilisation de NextResponse pour les API routes Next.js

export async function POST(request: Request): Promise<Response> {
  const data = await request.json();

  try {
    // Insertion de la soumission de formulaire dans la table `FormSubmission`
    const newFormSubmission = await prisma.formSubmission.create({
      data: {
        formId: data.formId, // ID du formulaire
        userName: data.userName, // Nom de l'utilisateur
        userEmail: data.userEmail, // Email de l'utilisateur
        message: data.message, // Message du feedback
        rating: data.rating, // Note (étoiles)
      },
    });

    // Pas besoin de gérer les réponses si tu utilises uniquement FormSubmission
    // Il n'y a pas de besoin de transaction pour la création d'objets Answer

    // Retourne la réponse JSON avec l'ID de la soumission et le statut 200
    return NextResponse.json(
      { formSubmissionId: newFormSubmission.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating form submission:", error);
    return NextResponse.json(
      { error: "Error creating form submission" },
      { status: 500 }
    );
  }
}
