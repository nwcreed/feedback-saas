// app/api/send/route.ts
import { NextResponse } from 'next/server';
import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { firstName, email } = await req.json(); // Récupérer le nom et l'email du corps de la requête

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Remplacez par votre adresse e-mail
      to: [email], // L'adresse e-mail du destinataire
      subject: 'Hello world',
      react: EmailTemplate({ firstName }), // Utiliser le modèle d'e-mail
    });

    if (error) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
