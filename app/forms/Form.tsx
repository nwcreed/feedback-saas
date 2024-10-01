"use client";
import React, { useState } from 'react';
import { Form as FormComponent } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import FormPublishSuccess from './FormPublishSuccess';
import { publishForm } from '../actions/mutateForm';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star as StarIcon } from 'lucide-react'; // Import de l'icône étoile

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const formRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem', // Espace entre les champs
};

type Props = {
  form: {
    id: number;
    name: string;
    description: string | null;
    userId: string;
    published: boolean;
  };
  editMode?: boolean;
};

const Form = (props: Props) => {
  const form = useForm();
  const router = useRouter();
  const { editMode } = props;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [rating, setRating] = useState(0); // État pour gérer la note

  const handleDialogChange = (open: boolean) => {
    setSuccessDialogOpen(open);
  };

  const onSelectStar = (index: number) => {
    setRating(index + 1); // Met à jour la note en fonction de l'étoile sélectionnée
  };

  const onSubmit = async (data: any) => {
    console.log("Form data: ", data);
    console.log("Rating: ", rating);
    if (editMode) {
      await publishForm(props.form.id);
      setSuccessDialogOpen(true);
    } else {
      const answers = {
        formId: props.form.id,
        userName: data.userName,
        userEmail: data.userEmail,
        message: data.message,
        rating: rating, // Utilisation de l'état pour la note
      };

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/form/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (response.status === 200) {
        router.push(`/forms/${props.form.id}/success`);
      } else {
        console.error('Error submitting form');
        alert('Error submitting form. Please try again later');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <Card>
        <CardHeader>
          <CardTitle>{props.form.name}</CardTitle>
          <CardDescription>{props.form.description || 'No description provided'}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormComponent {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full max-w-3xl items-center gap-6 my-4 text-left'>
              {/* Alignement des champs Nom et Email */}
              <div style={formRowStyle}>
                <div className='w-full'>
                  <label className='text-base mt-3'>Your Name</label>
                  <input
                    {...form.register('userName', { required: true })}
                    className='border rounded-md p-2 w-full'
                    placeholder='Enter your name'
                  />
                </div>
                <div className='w-full'>
                  <label className='text-base mt-3'>Your Email</label>
                  <input
                    {...form.register('userEmail', { required: true })}
                    type='email'
                    className='border rounded-md p-2 w-full'
                    placeholder='Enter your email'
                  />
                </div>
              </div>
              <div>
                <label className='text-base mt-3'>Feedback Message</label>
                <textarea
                  {...form.register('message', { required: true })}
                  className='border rounded-md p-2 w-full'
                  placeholder='Write your feedback'
                />
              </div>
              <div>
                <label className='text-base mt-3'>Rating</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`h-5 w-5 cursor-pointer ${
                          rating > index ? "fill-primary" : "fill-muted stroke-muted-foreground"
                        }`}
                        onClick={() => onSelectStar(index)}
                      />
                    ))}
                  </div>
                  <span>{rating} Star{rating !== 1 && 's'}</span> {/* Affiche le nombre d'étoiles sélectionnées */}
                </div>
              </div>
              <Button type='submit'>{editMode ? "Publish" : "Submit"}</Button>
            </form>
          </FormComponent>
        </CardContent>
        <CardFooter>
          <FormPublishSuccess formId={props.form.id} open={successDialogOpen} onOpenChange={handleDialogChange} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Form;
