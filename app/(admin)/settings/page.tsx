// app/page.tsx

'use client';

import React from 'react';

const CheckoutPage: React.FC = () => {
    const handleCheckout = async () => {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: 1 }), // Quantité du produit
        });

        const session = await response.json();

        if (response.ok) {
            // Redirige vers Stripe Checkout
            window.location.href = session.id; // Remplacez avec l'URL de redirection Stripe
        } else {
            console.error('Erreur lors du démarrage du paiement:', session.error);
        }
    };

    return (
        <div>
            <h1>Paiement avec Stripe</h1>
            <button onClick={handleCheckout} className="text-white font-bold bg-purple-500 rounded-md p-2">Procéder au paiement</button>
        </div>
    );
};

export default CheckoutPage;
