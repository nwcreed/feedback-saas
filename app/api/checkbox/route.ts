// app/api/checkbox/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin est correct

// Type pour le corps de la requête
interface CheckBoxRequest {
  formId: number; // ou string selon votre modèle
  productId: string;
}

// Fonction pour gérer les requêtes POST
export async function POST(req: Request) {
  try {
    const { formId, productId }: CheckBoxRequest = await req.json(); // Récupérer les données JSON de la requête

    // Vérifiez si le produit existe dans la base de données
    const existingProduct = await prisma.product.findFirst({
      where: {
        formId,
        productId,
      },
    });

    // Si le produit existe, retourner une réponse avec une case cochée
    if (existingProduct) {
      return NextResponse.json(
        { checked: true, product: existingProduct },
        { status: 200 } // Code de statut 200 pour indiquer que la requête a été traitée sans erreur
      );
    } else {
      // Si le produit n'existe pas, retourner une réponse avec une case non cochée
      return NextResponse.json(
        { checked: false },
        { status: 200 } // Code de statut 200 pour indiquer que la requête a été traitée sans erreur
      );
    }
  } catch (error) {
    console.error('Error checking product:', error);
    return NextResponse.json(
      { error: 'Failed to check product' },
      { status: 500 } // Retourner une erreur
    );
  }
}