"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { entrar, type LoginState } from "./actions";

const estadoInicial: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(entrar, estadoInicial);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-heading text-3xl font-bold uppercase tracking-tight text-primary">
            Hangar
          </span>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Painel administrativo
          </p>
        </div>

        <form
          action={action}
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="senha" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state?.erro && (
            <p className="text-sm text-destructive">{state.erro}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
