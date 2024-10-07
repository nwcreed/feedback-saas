// profile/page.tsx

import React from 'react';
import { TabsDemo } from '@/components/TabsDemo'; // Assurez-vous que le chemin est correct

const ProfilePage = () => {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <TabsDemo />
    </div>
  );
};

export default ProfilePage;
