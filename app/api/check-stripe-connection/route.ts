// app/api/check-stripe-connection/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; 
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ isConnected: false }, { status: 401 });
  }

  // Vérifiez si l'utilisateur a un compte Stripe lié
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'stripe',
    },
  });

  const isConnected = !!account; // true si un compte est trouvé, false sinon
  return NextResponse.json({ isConnected });
}
