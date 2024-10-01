"use client";

import React from 'react';
import { useSession, signOut } from "next-auth/react"; // Utilisez useSession ici
import { Button } from './button';
import Image from 'next/image';
import Link from 'next/link';
import SessionProviderWrapper from '@/components/SessionProviderWrapper'; // Importez votre SessionProvider

type Props = {};

const Header: React.FC<Props> = () => {
  return (
    <SessionProviderWrapper>
      <HeaderContent />
    </SessionProviderWrapper>
  );
};

// Composant contenu du Header
const HeaderContent: React.FC = () => {
  const { data: session } = useSession(); // Récupérer la session avec useSession

  return (
    <header className="border-b">
      <nav className="bg-white border-gray-200 px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1>AI Form Feedback</h1>
          <div className="flex items-center gap-4">
            {session?.user ? ( // Vérifier si l'utilisateur est connecté
              <>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                )}
                <Button onClick={() => signOut()}>Sign out</Button> {/* Utiliser signOut ici */}
              </>
            ) : (
              <Link href="/api/auth/signin">
                <Button variant="link">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
