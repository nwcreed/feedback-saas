// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template'; // Assurez-vous que le chemin est correct

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });
const resend = new Resend(process.env.RESEND_API_KEY!);
<<<<<<< HEAD
const endpointSecret = process.env.WEBHOOK_SECRET_KEY!;

export async function POST(req: Request) {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();
=======
const endpointSecret = process.env.WEBHOOK_SECRET_KEY!; // Utilisation de la clé secrète du webhook

export async function POST(req: Request) {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text(); // Récupérez le corps brut
>>>>>>> 451f6011d04af68a45d9bd9c38e259fa8e9be3ee

    if (!sig) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

<<<<<<< HEAD
    // Gérer l'événement `checkout.session.completed`
    if (event.type === 'checkout.session.completed') {
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    } else {
        console.log(`Événement non traité : ${event.type}`);
=======
    // Gérer les événements
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const customerEmail = paymentIntent.receipt_email; // Récupérer l'email du client
            const customerName = paymentIntent.metadata?.name; // Assurez-vous d'ajouter le nom dans les métadonnées

            if (customerEmail && customerName) {
                console.log(`Paiement réussi pour : ${paymentIntent.id}`);
                console.log(`Envoyer un e-mail de feedback à : ${customerEmail}`);

                // Envoyer l'e-mail
                await sendEmail(customerEmail, customerName);
            } else {
                console.log(`Paiement réussi pour : ${paymentIntent.id}, mais aucun e-mail ou nom client n'a été fourni.`);
            }
            break;

        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            const email = session.customer_details?.email; // Récupérer l'email du client
            const name = session.customer_details?.name; // Récupérer le nom du client

            if (email && name) {
                console.log(`Session terminée avec succès pour : ${session.id}`);
                console.log(`Envoyer un e-mail de feedback à : ${email}`);

                // Envoyer l'e-mail
                await sendEmail(email, name);
            } else {
                console.log(`Session terminée pour : ${session.id}, mais aucun e-mail ou nom client n'a été fourni.`);
            }
            break;

        default:
            console.log(`Événement non traité : ${event.type}`);
>>>>>>> 451f6011d04af68a45d9bd9c38e259fa8e9be3ee
    }

    return NextResponse.json({ received: true });
}

<<<<<<< HEAD
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const email = session.customer_details?.email;
    const name = session.customer_details?.name;

    if (email && name) {
        console.log(`Session terminée avec succès pour : ${session.id}`);
        console.log(`Envoyer un e-mail de feedback à : ${email}`);
        await sendEmail(email, name);
    } else {
        console.log(`Session terminée pour : ${session.id}, mais aucun e-mail ou nom client n'a été fourni.`);
    }
}

=======
>>>>>>> 451f6011d04af68a45d9bd9c38e259fa8e9be3ee
async function sendEmail(email: string, firstName: string) {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>', // Remplacez par votre adresse e-mail
            to: [email],
            subject: 'Merci pour votre achat !',
<<<<<<< HEAD
            react: EmailTemplate({ firstName }),
        });
        console.log(`E-mail envoyé à : ${email}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error instanceof Error ? error.message : String(error));
=======
            react: EmailTemplate({ firstName }), // Utiliser le modèle d'e-mail
        });
        console.log(`E-mail envoyé à : ${email}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
>>>>>>> 451f6011d04af68a45d9bd9c38e259fa8e9be3ee
    }
}
