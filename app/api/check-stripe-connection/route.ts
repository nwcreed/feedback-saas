// app/api/check-stripe-connection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // Obtenez la session de l'utilisateur
  const session = await getServerSession(authOptions);
  
  // Vérifiez si la session est valide et contient l'ID de l'utilisateur
  if (!session || !session.user?.id) {
    console.log('Unauthorized access: No session or user ID found.');
    return NextResponse.json({ isConnected: false }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('User ID:', userId);

  try {
    // Vérifiez si l'utilisateur a un compte Stripe lié
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'stripe',
      },
    });

    const isConnected = !!account; // true si un compte est trouvé, false sinon
    return NextResponse.json({ isConnected });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
