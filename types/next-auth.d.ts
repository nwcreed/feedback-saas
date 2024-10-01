// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Assurez-vous que ce champ correspond à la structure de votre modèle User
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: User;
  }
}
