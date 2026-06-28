"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verificarSenha } from "@/lib/auth/password";
import { criarSessao, encerrarSessao } from "@/lib/auth/session";

export type LoginState = { erro?: string };

export async function entrar(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const admin = await prisma.usuarioAdmin.findUnique({ where: { email } });
  // Mensagem genérica de propósito: não revela se o e-mail existe.
  const senhaOk =
    admin?.senhaHash && (await verificarSenha(senha, admin.senhaHash));
  if (!admin || !senhaOk) {
    return { erro: "E-mail ou senha inválidos." };
  }

  await criarSessao(admin.id);
  // redirect() lança internamente — fica fora de try/catch de propósito.
  redirect("/admin");
}

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/admin/login");
}
