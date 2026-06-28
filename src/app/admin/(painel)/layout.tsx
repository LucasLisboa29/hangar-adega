import Link from "next/link";
import { LogOut } from "lucide-react";

import { getAdminAtual } from "@/lib/auth/dal";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { sair } from "@/app/admin/login/actions";

// Shell autenticado do painel. getAdminAtual() é a checagem REAL de sessão
// (redireciona pro login se não houver) — o proxy é só a verificação rápida.
export default async function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminAtual();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex flex-col leading-none">
            <span className="font-heading text-xl font-bold uppercase tracking-tight text-primary">
              Hangar · Admin
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
              {admin.nome ?? admin.email}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver loja
            </Link>
            <form action={sair}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="size-4" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:flex-row">
        <aside className="sm:w-48 sm:shrink-0">
          <AdminNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
