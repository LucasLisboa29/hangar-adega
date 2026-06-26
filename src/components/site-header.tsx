import Link from "next/link";
import { Suspense } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchBar } from "@/components/search-bar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-heading text-2xl font-bold uppercase tracking-tight text-primary">
              Hangar
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
              Bebidas · Desde 2009
            </span>
          </Link>

          {/* Ações no topo — só no mobile (no desktop ficam à direita) */}
          <div className="flex items-center gap-1 sm:hidden">
            <Link
              href="/loja"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              A loja
            </Link>
            <CartDrawer />
          </div>
        </div>

        {/* useSearchParams precisa de Suspense durante o prerender */}
        <Suspense fallback={null}>
          <SearchBar className="flex-1 sm:max-w-sm" />
        </Suspense>

        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/loja"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            A loja
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
