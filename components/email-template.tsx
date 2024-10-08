// components/email-template.tsx
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Thank you for signing up. We hope you enjoy our service!
       http://localhost:3000/forms/1
    </p>
  </div>
);
