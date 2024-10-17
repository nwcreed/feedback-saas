import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    productId: string;
    formId: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    productId,
    formId,
}) => (
    <div>
        <h1>Merci pour votre achat, {firstName}!</h1>
        <p>Vous avez acheté le produit avec l'ID : {productId}.</p>
        <p>http://localhost:3000/forms/{formId}</p>
    </div>
);
