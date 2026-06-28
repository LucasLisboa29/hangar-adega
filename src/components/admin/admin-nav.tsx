"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingBag,
  LayoutDashboard,
  Tags,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exato: true },
  { href: "/admin/produtos", label: "Produtos", icon: Package, exato: false },
  { href: "/admin/categorias", label: "Categorias", icon: Tags, exato: false },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag, exato: false },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, exato: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 sm:flex-col">
      {LINKS.map(({ href, label, icon: Icon, exato }) => {
        const ativo = exato ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              ativo
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
