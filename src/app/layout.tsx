import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Watchpedia - The Watch Encyclopedia",
    template: "%s | Watchpedia",
  },
  description:
    "Watchpedia is the free encyclopedia of watches. Browse every watch brand, reference, and collection from around the world. Detailed specifications, history, and more.",
  keywords: [
    "watches",
    "watch encyclopedia",
    "watch database",
    "watch brands",
    "watch specifications",
    "horology",
    "luxury watches",
    "Rolex",
    "Omega",
    "Seiko",
    "Patek Philippe",
  ],
  openGraph: {
    type: "website",
    siteName: "Watchpedia",
    title: "Watchpedia - The Watch Encyclopedia",
    description:
      "The free encyclopedia of watches. Browse every brand, reference, and collection from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watchpedia - The Watch Encyclopedia",
    description:
      "The free encyclopedia of watches. Browse every brand, reference, and collection from around the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Watchpedia",
    description: "The free encyclopedia of watches",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900">
        <JsonLd data={websiteJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
