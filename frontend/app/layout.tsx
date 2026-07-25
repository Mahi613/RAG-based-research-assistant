import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Archive — AI Research Assistant",
  description:
    "A premium editorial interface for deep academic research. Discover, annotate, and synthesise scholarly literature through an intelligent research assistant.",
  keywords: ["research", "academic", "AI", "literature review", "papers"],
  openGraph: {
    title: "The Archive — AI Research Assistant",
    description: "Premium editorial research interface",
    type: "website",
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
      className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
