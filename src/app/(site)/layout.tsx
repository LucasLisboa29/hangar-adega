import { Suspense } from "react";

import { CartProvider } from "@/components/cart/cart-provider";
import { CategoryPills } from "@/components/category-pills";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCategorias } from "@/lib/catalog";

// Layout da loja pública: header/footer da marca + carrinho. O painel admin
// (/admin) vive fora deste grupo e tem o seu próprio layout, sem essa moldura.
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categorias = await getCategorias();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <CartProvider>
        {/* Header + navegação de categorias pinados juntos: o usuário rola o
            catálogo e continua podendo trocar de categoria sem voltar ao topo. */}
        <div className="sticky top-0 z-40">
          <SiteHeader />
          <Suspense fallback={null}>
            <CategoryPills categorias={categorias} />
          </Suspense>
        </div>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </CartProvider>
    </div>
  );
}
