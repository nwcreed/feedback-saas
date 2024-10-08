import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import FormGenerator from "./form-generator";
import Header from "@/components/ui/header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import FormsList from "./forms/FormList";

// Initialisation de Prisma Client côté serveur
const prisma = new PrismaClient();

// Fonction serveur pour récupérer les formulaires
export default async function Home() {
  const forms = await prisma.form.findMany();

  return (
    <SessionProviderWrapper>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <FormGenerator />
        {/* Affichage des formulaires récupérés */}
        <FormsList forms={forms} />
      </main>
    </SessionProviderWrapper>
  );
}