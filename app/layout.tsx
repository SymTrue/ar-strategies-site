import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arstrategists.com"),
  title: "AR Strategies — Advertising That Actually Makes Money",
  description:
    "AR Strategies builds advertising systems that convert. We audit, run, and scale campaigns for local businesses that are tired of wasting money on ads.",
  openGraph: {
    title: "AR Strategies — Advertising That Actually Makes Money",
    description:
      "We build advertising systems that convert. Audit, run, and scale — done for you.",
    type: "website",
    images: ["/og-cover.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Strategies — Advertising That Actually Makes Money",
    description: "We build advertising systems that convert.",
    images: ["/og-cover.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
