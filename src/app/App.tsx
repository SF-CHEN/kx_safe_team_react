import React from 'react';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </UserProvider>
  );
}
