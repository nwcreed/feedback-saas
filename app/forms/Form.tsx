"use client";
import React, { useState } from 'react';
import { Form as FormComponent } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import FormPublishSuccess from './FormPublishSuccess';
import { publishForm } from '../actions/mutateForm';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star as StarIcon } from 'lucide-react';
import Link from 'next/link';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  gap: '1rem',
};

const formRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
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
  const [rating, setRating] = useState(0); 

  const handleDialogChange = (open: boolean) => {
    setSuccessDialogOpen(open);
  };

  const onSelectStar = (index: number) => {
    setRating(index + 1);
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
        rating: rating,
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

  // Mode édition
  if (editMode) {
    return (
      <div style={containerStyle}>
        <Card>
          <CardHeader>
            <CardTitle>Editing: {props.form.name}</CardTitle>
            <CardDescription>{props.form.description || 'No description available'}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormComponent {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full max-w-3xl items-center gap-6 my-4 text-left">
                <div>
                  <label className="text-base mt-3">Update Form Name</label>
                  <input
                    {...form.register('formName', { required: true })}
                    defaultValue={props.form.name}
                    className="border rounded-md p-2 w-full"
                    placeholder="Enter form name"
                  />
                </div>
                <div>
                  <label className="text-base mt-3">Update Description</label>
                  <textarea
                    {...form.register('description', { required: true })}
                    defaultValue={props.form.description || ''}
                    className="border rounded-md p-2 w-full"
                    placeholder="Update description"
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </FormComponent>
          </CardContent>
          <CardFooter>
            <FormPublishSuccess formId={props.form.id} open={successDialogOpen} onOpenChange={handleDialogChange} />
          </CardFooter>
        </Card>

        {/* Bouton de retour vers view-forms, visible uniquement en mode édition */}
        {editMode && (
          <Link href="/view-forms">
            <Button variant="outline">View All Forms</Button>
          </Link>
        )}
      </div>
    );
  }

  // Mode création
  return (
    <div style={containerStyle}>
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{props.form.name}</CardTitle>
        <CardDescription>{props.form.description || 'No description provided'}</CardDescription>
      </CardHeader>
      <CardContent>
        <FormComponent {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full max-w-3xl items-center gap-6 text-left">
            <div style={formRowStyle}>
              <div className="w-full">
                <label className="text-base mt-3">Your Name</label>
                <input
                  {...form.register('userName', { required: true })}
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter your name"
                />
              </div>
              <div className="w-full">
                <label className="text-base mt-3">Your Email</label>
                <input
                  {...form.register('userEmail', { required: true })}
                  type="email"
                  className="border rounded-md p-2 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="text-base mt-3">Feedback Message</label>
              <textarea
                {...form.register('message', { required: true })}
                className="border rounded-md p-2 w-full"
                placeholder="Write your feedback"
              />
            </div>
            {/* Conteneur pour aligner le rating et le bouton */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <label className="text-base mt-3">Rating</label>
                <div className="flex items-center gap-2 mt-1">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-5 w-5 cursor-pointer ${
                        rating > index ? 'fill-primary' : 'fill-muted stroke-muted-foreground'
                      }`}
                      onClick={() => onSelectStar(index)}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="mt-4">Submit</Button>
            </div>
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
