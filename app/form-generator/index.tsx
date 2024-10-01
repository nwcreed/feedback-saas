"use client";

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"

import { generateForm } from "@/actions/generateForm"
import { useFormState, useFormStatus } from "react-dom";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";  // Importer useRouter pour la navigation

type Props = {}

// Mise à jour du type pour inclure l'ID du formulaire
const initialState: {
    message: string;
    form?: {
        id: string; // Ajout de l'ID du formulaire
        title: string;
        description: string;
    };
} = {
    message: "",
}

export function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Generating..." : "Generate"}
        </Button>
    );
}

const Index = (props: Props) => {
    const [state, formAction] = useFormState(generateForm, initialState);
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const session = useSession();
    const router = useRouter();  // Hook pour la navigation

    // Vérifie si la session est présente et redirige après la création du formulaire
    useEffect(() => {
        if (state.message === "Form created successfully" && state.form?.id) {
            setOpen(false);
            // Redirige vers /forms/edit/{formId} en utilisant l'ID du formulaire
            router.push(`/forms/edit/${state.form.id}`);
        }
    }, [state.message, state.form?.id, router]);

    const onFormCreate = () => {
        if (session.data?.user){
          setOpen(true);
        } else {
            signIn();
        }
    }

    return (
     <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={onFormCreate}>Create Form</Button>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Form</DialogTitle>
            </DialogHeader>
            <form action={formAction}>
                <div className="grid gap-4 py-4">
                    <Input id="title" name="title" placeholder="Your title" />
                    <Textarea id="description" name="description" placeholder="Describe your form..." />
                </div>
                <DialogFooter>
                    <SubmitButton />
                </DialogFooter>
            </form>
        </DialogContent>
     </Dialog>
    )
}

export default Index;
