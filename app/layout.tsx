import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arstrategists.com"),
  title: "AR Strategies — Advertising That Actually Makes Money",
  description:
    "AR Strategies builds advertising systems that convert. We audit, run, and scale campaigns for local businesses that are tired of wasting money on ads.",
  alternates: {
    canonical: "https://www.arstrategists.com",
  },
  openGraph: {
    title: "AR Strategies — Advertising That Actually Makes Money",
    description:
      "We build advertising systems that convert. Audit, run, and scale — done for you.",
    type: "website",
    images: ["/og-cover.png"],
    url: "https://www.arstrategists.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Strategies — Advertising That Actually Makes Money",
    description: "We build advertising systems that convert.",
    images: ["/og-cover.png"],
  },
};

// JSON-LD Structured Data for ProfessionalService
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AR Strategies",
  description:
    "Advertising systems that convert. We audit, run, and scale campaigns for local businesses.",
  url: "https://www.arstrategists.com",
  email: "hello@arstrategists.com",
  areaServed: "US",
  priceRange: "$$",
  serviceType: ["Advertising Audit", "Campaign Management", "Growth & Scaling"],
  image: "https://www.arstrategists.com/logo.png",
  sameAs: ["https://instagram.com/ar_strats.aa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
