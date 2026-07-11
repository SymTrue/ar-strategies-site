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
    images: ["https://www.arstrategists.com/logo.png"],
    url: "https://www.arstrategists.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Strategies — Advertising That Actually Makes Money",
    description: "We build advertising systems that convert.",
    images: ["https://www.arstrategists.com/logo.png"],
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
  priceRange: "$$",
  serviceType: ["Advertising Audit", "Campaign Management", "Growth & Scaling"],
  image: "https://www.arstrategists.com/logo.png",
  sameAs: ["https://instagram.com/ar_strats.aa"],
};

// FAQ Schema for AI search engine citability (ChatGPT, Perplexity, etc.)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much should I be spending on ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with businesses in my industry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with local and service businesses across many industries. If you sell something people want and need more customers, we can likely help.",
      },
    },
    {
      "@type": "Question",
      name: "How long until I see results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most campaigns show meaningful signal within the first few weeks. Real scaling happens once we have data to optimize against, usually inside the first 1-2 months.",
      },
    },
    {
      "@type": "Question",
      name: "Am I locked into a long contract?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We earn your business every month. If we are not making you money, you should not keep paying us.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
