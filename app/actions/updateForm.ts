import { prisma } from "@/lib/prisma"; // Assure-toi que le chemin de `prisma` est correct
import { NextResponse } from 'next/server';

// Interface pour les données du formulaire
interface UpdateFormData {
  id: number;
  name: string;
  description: string | null;
}

export async function updateForm(data: UpdateFormData) {
  try {
    const updatedForm = await prisma.form.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return NextResponse.json({ updatedForm });
  } catch (error) {
    console.error("Error updating form: ", error);
    return NextResponse.json({ error: "Failed to update the form." }, { status: 500 });
  }
}
