import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin est correct

// Type pour le corps de la requête
interface CreateProductRequest {
  formId: number; // ou string selon votre modèle
  productId: string;
  name?: string; // optionnel
}

// Fonction pour gérer les requêtes POST
export async function POST(req: Request) {
  try {
    const { formId, productId, name }: CreateProductRequest = await req.json(); // Récupérer les données JSON de la requête

    // Vérifiez si le produit existe déjà dans la base de données
    const existingProduct = await prisma.product.findFirst({
      where: {
        formId,
        productId,
      },
    });

    if (existingProduct) {
      // Si le produit existe, retourner une réponse neutre
      return NextResponse.json(
        { message: 'Submission ignored, product already exists' },
        { status: 200 } // Code de statut 200 pour indiquer que la requête a été traitée sans erreur
      );
    }

    // Créer un nouveau produit lié au formulaire dans la base de données
    const product = await prisma.product.create({
      data: {
        formId,
        productId,
        ...(name && { name }), // N'incluez le champ que s'il a une valeur
      },
    });

    return NextResponse.json(product, { status: 201 }); // Retourner le produit créé avec un code de statut 201
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 } // Retourner une erreur
    );
  }
}
