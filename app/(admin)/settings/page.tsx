// app/connect/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch'; // Assurez-vous que le chemin d'importation est correct

const ConnectToStripe = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  // Fonction pour vérifier si le compte Stripe est déjà lié
  const checkStripeConnection = async () => {
    try {
      const response = await fetch('/api/check-stripe-connection'); // Créez une API pour vérifier la connexion
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.isConnected); // Assurez-vous que votre API renvoie { isConnected: true/false }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la connexion Stripe:', error);
    }
  };

  useEffect(() => {
    checkStripeConnection(); // Vérifiez la connexion lors du chargement du composant
  }, []);

  const handleConnect = () => {
    const stripeClientId = process.env.STRIPE_CLIENT_ID; // Utilisez la clé client publique
    const redirectUri = encodeURIComponent('http://localhost:3000/api/stripe-callback'); // Mettez l'URI de redirection

    // Redirige l'utilisateur vers la page d'autorisation Stripe
    window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_Qylm9Czsh8cfagU6jegnjb82zd5ZNRce&scope=read_write`;
  };

  return (
    <div>
      <h1>Connectez votre compte Stripe</h1>
      <button 
        onClick={handleConnect} 
        className="text-white font-bold bg-purple-500 rounded-md p-2 mb-4"
      >
        Connecter à Stripe
      </button>
      <div className="flex items-center">
        <label htmlFor="stripe-switch" className="mr-2">
          Compte Stripe lié
        </label>
        <Switch 
          id="stripe-switch" 
          checked={isConnected} 
          onCheckedChange={() => {}} // Ne fait rien lorsque l'utilisateur essaie de changer l'état
          disabled={true} // Vous pouvez également le rendre désactivé si vous ne voulez pas que l'utilisateur puisse interagir avec le switch
        />
      </div>
    </div>
  );
};

export default ConnectToStripe;
