import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScaleWithMike — 2 à 5 RDV qualifiés par jour | Prospection externalisée",
  description:
    "Externalisez votre prospection téléphonique B2B et B2C. Agents dédiés, scripts sur-mesure, RDV qualifiés dans votre agenda. Opérationnel en 7 jours.",
  keywords: [
    "prospection téléphonique",
    "externalisation commerciale",
    "rendez-vous qualifiés",
    "call center",
    "téléprospection",
    "B2B",
    "B2C",
    "ScaleWithMike",
  ],
  openGraph: {
    title: "ScaleWithMike — 2 à 5 RDV qualifiés par jour",
    description:
      "Externalisez votre prospection téléphonique. Agents dédiés, scripts sur-mesure, RDV qualifiés. Opérationnel en 7 jours.",
    url: "https://scale-with-mike.vercel.app",
    siteName: "ScaleWithMike",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScaleWithMike — 2 à 5 RDV qualifiés par jour",
    description:
      "Externalisez votre prospection téléphonique. Agents dédiés, scripts sur-mesure, RDV qualifiés.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
