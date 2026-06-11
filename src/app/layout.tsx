import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MAJOR AUTO - Gestion Garage",
  description: "Logiciel de gestion pour garage automobile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>{children}</body>
    </html>
  );
}
