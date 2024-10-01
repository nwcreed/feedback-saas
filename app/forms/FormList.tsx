import React from 'react';
import { PrismaClient } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil } from 'lucide-react'; // Importer l'icône de crayon

const prisma = new PrismaClient();

type Form = {
  id: number;
  name: string;
  description: string | null;
};

type Props = {
  forms: Form[];
};

const FormsList = (props: Props) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 m-5 p-4 gap-4'>
      {props.forms.map((form: Form) => (
        <Card key={form.id} className='max-w-[350px] flex flex-col'>
          <CardHeader className='flex-1'>
            <CardTitle>
              {form.name}
            </CardTitle>
            <CardDescription>
              {form.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2"> {/* Pour aligner les boutons */}
            <Link className="w-full" href={`/forms/edit/${form.id}`}>
              <Button className='w-full flex items-center justify-center'> {/* Utiliser flex pour aligner l'icône et le texte */}
                <Pencil className="mr-2" /> {/* Ajouter l'icône avec une marge à droite */}
                Edit
              </Button>
            </Link>
            <Link className="w-full" href={`/forms/results/${form.id}`}>
              <Button className='w-full bg-purple-500 hover:bg-purple-400'>View</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

// Fonction pour récupérer les formulaires depuis la base de données
export async function getServerSideProps() {
  const forms = await prisma.form.findMany(); // Assurez-vous que 'form' correspond au nom de votre modèle dans schema.prisma
  return {
    props: {
      forms,
    },
  };
}

export default FormsList;
