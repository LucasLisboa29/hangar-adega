import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

import { CartProvider } from "@/components/cart/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  title: {
    default: "Hangar Bebidas — Adega e Conveniência em Araguari-MG",
    template: "%s · Hangar Bebidas",
  },
  description:
    "Bebidas, cigarros e conveniência com entrega em Uberlândia e Araguari. Peça pelo nosso catálogo online. Desde 2009.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
