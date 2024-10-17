 "use client";
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

type StripeProductsProps = {
  formId: number; // Ajout du formId
  onProductSelection: (selected: string[]) => void;
};

const StripeProducts: React.FC<StripeProductsProps> = ({ formId, onProductSelection }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]); // État pour les produits sélectionnés

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/stripe-products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        setProducts(data);

        // Vérifier si les produits doivent être cochés
        await checkProducts(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const checkProducts = async (products: any[]) => {
    const checkedProducts: string[] = [];
    for (const product of products) {
      const response = await fetch('/api/checkbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId, productId: product.id }), // Envoyer formId et productId
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checked) {
          checkedProducts.push(product.id); // Ajouter le produit à la sélection si coché
        }
      }
    }
    setSelectedProducts(checkedProducts);
    onProductSelection(checkedProducts); // Mettre à jour le parent avec les produits cochés
  };

  const toggleProductSelection = async (productId: string) => {
    setSelectedProducts(prevSelected => {
      const isSelected = prevSelected.includes(productId);
      let updatedSelection;

      if (isSelected) {
        // Si le produit est déjà sélectionné, le retirer du tableau
        updatedSelection = prevSelected.filter(id => id !== productId);
      } else {
        // Sinon, l'ajouter au tableau
        updatedSelection = [...prevSelected, productId];
      }

      onProductSelection(updatedSelection); // Mettre à jour le parent avec les produits sélectionnés
      return updatedSelection;
    });
  };

  // Fonction pour sélectionner ou désélectionner tous les produits
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      // Si tous les produits sont sélectionnés, les désélectionner
      setSelectedProducts([]);
      onProductSelection([]); // Vider la sélection
    } else {
      // Sinon, sélectionner tous les produits
      const allProductIds = products.map(product => product.id);
      setSelectedProducts(allProductIds);
      onProductSelection(allProductIds); // Sélectionner tous les produits
    }
  };

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md">
        {selectedProducts.length > 0 ? `${selectedProducts.length} produit(s) sélectionné(s)` : 'Sélectionner des produits'}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* Bouton pour sélectionner ou désélectionner tous les produits */}
        <DropdownMenuItem onClick={toggleSelectAll} className="font-bold">
          {selectedProducts.length === products.length ? 'Tout désélectionner' : 'Tout sélectionner'}
        </DropdownMenuItem>
        {products.map(product => (
          <DropdownMenuItem key={product.id} onClick={() => toggleProductSelection(product.id)}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              readOnly
              className="mr-2"
            />
            {product.name} (ID: {product.id})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StripeProducts;