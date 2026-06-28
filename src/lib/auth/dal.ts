import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { lerSessao } from "@/lib/auth/session";

// Data Access Layer da autenticação. É a defesa REAL (o proxy é só verificação
// otimista). Todo page/Server Action protegido chama verificarSessao() — se não
// houver sessão válida, redireciona pro login. `cache` memoiza por render.

export const verificarSessao = cache(async () => {
  const sessao = await lerSessao();
  if (!sessao?.adminId) {
    redirect("/admin/login");
  }
  return { adminId: sessao.adminId };
});

export const getAdminAtual = cache(async () => {
  const sessao = await verificarSessao();
  const admin = await prisma.usuarioAdmin.findUnique({
    where: { id: sessao.adminId },
    select: { id: true, nome: true, email: true },
  });
  // Sessão válida mas usuário sumiu do banco — trata como não autenticado.
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
});
