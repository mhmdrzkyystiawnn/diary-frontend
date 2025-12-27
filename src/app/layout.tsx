// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers"; // <--- Import ini

export const metadata: Metadata = {
  title: "Vault Memory",
  description: "Simpan kenanganmu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Bungkus children dengan Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}