'use client';

import { SessionProvider } from "next-auth/react";
// 1. Import Toaster
import { Toaster } from 'react-hot-toast'; 

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      {/* 2. Pasang Toaster disini */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </SessionProvider>
  );
}