import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hangar-adega.vercel.app"),
  title: {
    default: "Hangar Bebidas — Adega e Conveniência em Araguari-MG",
    template: "%s · Hangar Bebidas",
  },
  description:
    "Bebidas, cigarros e conveniência com entrega em Uberlândia e Araguari. Peça pelo nosso catálogo online. Desde 2009.",
  keywords: [
    "adega",
    "bebidas",
    "delivery de bebidas",
    "Araguari",
    "Uberlândia",
    "cervejas",
    "vinhos",
    "destilados",
    "conveniência",
    "Hangar Bebidas",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Hangar Bebidas",
    title: "Hangar Bebidas — Adega e Conveniência em Araguari-MG",
    description:
      "Bebidas, cigarros e conveniência com entrega em Uberlândia e Araguari. Peça pelo nosso catálogo online. Desde 2009.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
