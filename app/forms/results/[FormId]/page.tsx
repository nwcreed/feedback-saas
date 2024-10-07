import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin d'importation est correct
import Link from 'next/link';
import { Globe, ChevronLeft, Code } from 'lucide-react';
import Header from '@/components/ui/header';
import Table from '@/components/table'; // Importer le composant Table

const page = async ({ params }: { params: { FormId: string } }) => {
  if (!params.FormId) return (<div>Invalid Form ID</div>); // On vérifie params.FormId avec la bonne casse

  // Récupérer le formulaire avec Prisma
  const form = await prisma.form.findUnique({
    where: { id: Number(params.FormId) }, // On utilise FormId pour identifier le formulaire
    include: {
      submissions: true, // Inclure les soumissions (feedbacks) associées au formulaire
    },
  });

  // Si le formulaire n'est pas trouvé, renvoyer un message ou une page d'erreur
  if (!form) {
    return (<div>Form not found</div>);
  }

  return (
    <div>
       <Header />
      <div className=''>
        <Link href="/view-forms" className="flex items-center text-indigo-700 mb-5 w-fit">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span className="text-lg">Back to forms</span>
        </Link>
      </div>
      <div className="flex justify-between items-start px-24">
        <div className="form-info">
          <h1 className="text-3xl font-bold mb-3">{form.name}</h1>
          <h2 className="text-primary-background text-xl mb-2">{form.description}</h2>
        </div>
      </div>
      <div>
        {/* Afficher les soumissions sous forme de tableau en utilisant le composant Table */}
        <Table
          data={form.submissions} // Passer les soumissions au tableau
        />
      </div>
    </div>
  );
};

export default page;
