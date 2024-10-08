import React from 'react'
import FormsList from '@/forms/FormList'
import { getUserForms } from '@/app/actions/getUserForms'
import { Form } from '@prisma/client' // Importer le modèle Form généré par Prisma

type Props = {}

const Page = async (props: Props) => {
  // Appel à getUserForms pour obtenir les formulaires de l'utilisateur
  const forms: Form[] = await getUserForms();

  return (
    <>
      <FormsList forms={forms} />
    </>
  )
}

export default Page
