// app/forms/results/[FormId]/page.tsx

import { prisma } from '@/lib/prisma'; // Assurez-vous que le chemin d'importation est correct
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Ajustez le chemin d'importation
import StarRating from '@/components/ratings'; // Importer le composant d'étoiles

const FormResultsPage = async ({ params }: { params: { FormId: string } }) => {
  const formId = Number(params.FormId);

  // Récupérer les soumissions pour le formulaire spécifique
  const submissions = await prisma.formSubmission.findMany({
    where: { formId },
    include: { user: true }, // Inclure les informations de l'utilisateur si nécessaire
  });

  // Si aucune soumission n'est trouvée, retourner une page 404
  if (!submissions) {
    return notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Résultats des Soumissions</h1>
      <div className="grid grid-cols-1 gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex-grow">{submission.userName}</CardTitle>
                <span className="text-gray-500">{submission.userEmail}</span>
                <div className="ml-4">
                  <StarRating rating={submission.rating} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mt-2">{submission.message}</p> {/* Message en dessous des autres éléments */}
              <p className="mt-1 text-sm text-gray-500">
                Date de soumission: {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormResultsPage;
