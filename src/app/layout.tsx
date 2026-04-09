import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScaleWithMike CRM",
  description: "Plateforme CRM Call Center pour piloter votre acquisition commerciale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
