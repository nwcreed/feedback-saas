import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma'; // Assurez-vous d'importer votre instance Prisma
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template'; // Chemin vers votre template d'e-mail

const endpointSecret = process.env.WEBHOOK_SECRET_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY!); // Instanciation de Resend

export async function POST(req: Request) {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!sig) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    // Créez une instance de Stripe ici
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Gérer l'événement checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const connectedAccountId = session?.metadata?.connected_account_id;
        const email = session.customer_details?.email;
        const name = session.customer_details?.name;
        const productId = session?.metadata?.product_id;
        const productName = session?.metadata?.product_name;

        console.log(`Session terminée : ${session.id}`);
        console.log(`Connected Account ID : ${connectedAccountId}`);
        console.log(`Email : ${email}`);
        console.log(`Nom du client : ${name}`);
        console.log(`ID du produit : ${productId}`);

        // Vérifiez si un produit avec le productId existe
        const productData = await checkProductExists(productId);

        if (productData) {
            console.log(`Oui, un produit avec ce productId existe dans la base de données. ${productData.productId} form : ${productData.formId}`);
            // Envoyer l'e-mail après avoir trouvé le produit
            await sendEmail(name || 'Client', email || '', productData.productId, productData.formId);
        } else {
            console.log('Non, aucun produit avec ce productId trouvé.');
        }

        // Vérifiez si toutes les informations sont présentes avant de traiter
        if (connectedAccountId && email && name && productId) {
            await handleCheckoutSessionCompleted(session, connectedAccountId, email, name, productId);
        } else {
            console.log(`Informations manquantes dans la session ${session.id}`);
        }
    } else {
        console.log(`Événement non traité : ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function checkProductExists(productId: string | undefined): Promise<{ productId: string; formId: number } | null> {
    if (!productId) {
        return null; // Retourne null si le productId est indéfini
    }

    // Requête pour vérifier si le produit existe dans la base de données
    const products = await prisma.product.findMany({
        where: {
            productId: productId, // Utilise le champ productId
        },
    });

    // Retourne le premier produit trouvé avec son productId et formId, ou null si aucun produit n'est trouvé
    if (products.length > 0) {
        const product = products[0]; // Récupérer le premier produit
        return { productId: product.productId, formId: product.formId }; // Retourner le productId et le formId
    }

    return null; // Aucun produit trouvé
}

async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
    connectedAccountId: string,
    email: string,
    name: string,
    productId: string
) {
    // Traitement de la session terminée
    console.log(`Traitement de la session terminée pour ${session.id}`);
    console.log(`ID du compte connecté : ${connectedAccountId}`);
    console.log(`Envoyer un e-mail à : ${email} pour ${name}`);
    console.log(`Produit acheté : ${productId}`);
}

async function sendEmail(firstName: string, recipientEmail: string, productId: string, formId: number) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Remplacez par votre adresse e-mail
            to: [recipientEmail],
            subject: 'Produit trouvé',
            react: EmailTemplate({ firstName, productId, formId }), // Passez toutes les propriétés requises
        });

        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', JSON.stringify(error));
        } else {
            console.log(`E-mail envoyé à ${recipientEmail} pour le produit ${productId}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', JSON.stringify(error, null, 2));
    }
}
