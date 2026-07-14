import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./providers";
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

const themeInitializationScript = `(() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : 'dark';
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = 'dark';
  }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arstrategists.com"),
  title: "AR Strategies \u2014 Be the Business Your City Finds First",
  description:
    "AR Strategies helps local businesses rank at the top of Google, run Meta ads that bring real customers, and publish content people remember. Get a free visibility audit.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://www.arstrategists.com",
  },
  openGraph: {
    title: "AR Strategies \u2014 Be the Business Your City Finds First",
    description:
      "Top of Google. Meta ads that bring customers. Content people remember. Done for you.",
    type: "website",
    images: ["https://www.arstrategists.com/logo.png"],
    url: "https://www.arstrategists.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Strategies \u2014 Be the Business Your City Finds First",
    description: "Top of Google. Meta ads that bring customers. Content people remember.",
    images: ["https://www.arstrategists.com/logo.png"],
  },
};

// JSON-LD Structured Data for ProfessionalService
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AR Strategies",
  description:
    "Marketing agency for local businesses: top-of-Google rankings, Meta ads management, and content strategy \u2014 done for you.",
  url: "https://www.arstrategists.com",
  email: "hello@arstrategists.com",
  priceRange: "$$",
  serviceType: ["Local SEO & Google Rankings", "Meta Ads Management", "Content Strategy & Audit"],
  areaServed: [
    { "@type": "City", name: "New York" },
    { "@type": "City", name: "Los Angeles" },
    { "@type": "City", name: "Austin" },
    { "@type": "City", name: "Chicago" },
    { "@type": "City", name: "Miami" },
    { "@type": "AdministrativeArea", name: "United States" }
  ],
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
      name: "How long until I rank at the top of Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your area and competition. Most clients see movement within the first 30 days; competitive searches take longer. That's why we run Meta ads alongside\u2014customers now, rankings compounding behind them.",
      },
    },
    {
      "@type": "Question",
      name: "What if you already work with my competitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Then we can't take you on\u2014and if you sign with us, we can't take them. We work with one business per industry per area, so everything we build works for you alone.",
      },
    },
    {
      "@type": "Question",
      name: "Do you work with businesses in my industry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your customers search Google or scroll social media before they buy\u2014and they do\u2014we can help. We work with local and service businesses across most industries.",
      },
    },
    {
      "@type": "Question",
      name: "How much should I be spending on marketing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your margins and goals, but we help you start lean, prove what works, then scale. No one should be lighting money on fire hoping something sticks.",
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}