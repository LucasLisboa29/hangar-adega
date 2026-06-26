"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Busca por GET: ao enviar, navega para /?q=<termo>. Como é um <form> nativo,
// funciona mesmo sem JS; o "use client" serve só para preencher o valor atual.
export function SearchBar({ className }: { className?: string }) {
  const q = useSearchParams().get("q") ?? "";

  return (
    <form action="/" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Buscar produto..."
        aria-label="Buscar produto"
        className="pl-9"
      />
    </form>
  );
}
