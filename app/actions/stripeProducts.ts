import { prisma } from "@/lib/prisma";

interface SelectedProduct {
  id: string;
  name: string;
}

// Fonction pour lier les produits sélectionnés à un formulaire
export async function linkProductsToForm(formId: number, selectedProducts: SelectedProduct[]) {
  try {
    // Boucle sur chaque produit sélectionné pour les lier au formulaire
    for (const product of selectedProducts) {
      // Insertion de chaque produit dans la base de données en lien avec le formulaire
      await prisma.product.create({
        data: {
          formId: formId, // ID du formulaire à lier
          productId: product.id, // ID du produit à associer
          name: product.name // Nom du produit à associer (facultatif)
        },
      });
    }

    return {
      message: "Produits liés au formulaire avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la liaison des produits au formulaire: ", error);
    return {
      message: "Erreur lors de la liaison des produits au formulaire",
    };
  }
}
