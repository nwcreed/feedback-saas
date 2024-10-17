// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Récupération de la session de l'utilisateur connecté
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Si l'utilisateur n'est pas connecté, renvoyer une erreur 401
    if (!userId) {
      return NextResponse.json({ error: 'Utilisateur non connecté' }, { status: 401 });
    }

    // Recherche du compte Stripe associé à l'utilisateur dans la base de données
    const stripeAccount = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'stripe',
      },
    });

    // Si aucun compte Stripe n'est trouvé, renvoyer une erreur 404
    if (!stripeAccount) {
      return NextResponse.json({ error: 'Aucun compte Stripe trouvé pour cet utilisateur' }, { status: 404 });
    }

    const stripeAccountId = stripeAccount.providerAccountId;

    // Récupération des produits associés au compte Stripe
    const products = await stripe.products.list({
      stripeAccount: stripeAccountId,
    });

    // Log pour voir la réponse brute des produits de Stripe
    console.log('Produits Stripe:', products);

    // Extraction des ID et noms des produits
    const productList = products.data.map(product => ({
      id: product.id,
      name: product.name,
    }));

    // Log pour voir la liste formatée des produits
    console.log('Liste des produits formatée:', productList);

    // Retourner la liste des produits sous forme JSON
    return NextResponse.json(productList, { status: 200 });

  } catch (error) {
    // Gestion des erreurs et renvoi d'un message d'erreur approprié
    let errorMessage = 'Erreur lors de la récupération des produits';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
