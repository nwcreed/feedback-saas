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
<<<<<<< HEAD
       http://localhost:3000/forms/1
=======
       http://localhost:3000/forms/9
>>>>>>> 451f6011d04af68a45d9bd9c38e259fa8e9be3ee
    </p>
  </div>
);
