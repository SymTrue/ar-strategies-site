import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./providers";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
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
  title: "AR Strategies: Be the Business Your City Finds First",
  description:
    "AR Strategies helps local businesses rank at the top of Google, run Meta ads that bring real customers, and publish content people remember. One business per market, done for you.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://www.arstrategists.com",
  },
  openGraph: {
    title: "AR Strategies: Be the Business Your City Finds First",
    description:
      "Top of Google. Meta ads that bring customers. Content people remember. Done for you.",
    type: "website",
    images: ["https://www.arstrategists.com/logo.png"],
    url: "https://www.arstrategists.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Strategies: Be the Business Your City Finds First",
    description: "Top of Google. Meta ads that bring customers. Content people remember.",
    images: ["https://www.arstrategists.com/logo.png"],
  },
};

// JSON-LD Structured Data for ProfessionalService
// areaServed is intentionally omitted: the target market has not been
// decided yet. Add it back (City/AdministrativeArea entries) once it has.
// An unspecified areaServed is valid schema; a wrong one actively misleads
// both search engines and prospects.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AR Strategies",
  description:
    "Marketing agency for local businesses: top-of-Google rankings, Meta ads management, and content strategy, done for you.",
  url: "https://www.arstrategists.com",
  email: "hello@arstrategists.com",
  priceRange: "$$",
  serviceType: ["Local SEO & Google Rankings", "Meta Ads Management", "Content Strategy & Audit"],
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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeProvider>
          {children}
          <ScrollToTopButton />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}