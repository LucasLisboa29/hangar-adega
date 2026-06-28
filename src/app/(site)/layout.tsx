import { CartProvider } from "@/components/cart/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Layout da loja pública: header/footer da marca + carrinho. O painel admin
// (/admin) vive fora deste grupo e tem o seu próprio layout, sem essa moldura.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <CartProvider>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </CartProvider>
    </div>
  );
}
