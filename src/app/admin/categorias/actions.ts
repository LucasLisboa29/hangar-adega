"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/auth/dal";
import { slugify } from "@/lib/format";

export type CategoriaState = { erro?: string };

// Mudança em categoria afeta a navegação por categoria na vitrine.
function revalidarCatalogo() {
  revalidatePath("/admin/categorias");
  revalidatePath("/");
  revalidatePath("/loja");
}

/** Slug único de categoria (anexa -2, -3… se já existir, ignorando o próprio id). */
async function slugUnico(base: string, ignorarId?: string): Promise<string> {
  const raiz = base || "categoria";
  let slug = raiz;
  let n = 2;
  while (true) {
    const existente = await prisma.categoria.findUnique({ where: { slug } });
    if (!existente || existente.id === ignorarId) return slug;
    slug = `${raiz}-${n++}`;
  }
}

export async function salvarCategoria(
  _state: CategoriaState,
  formData: FormData
): Promise<CategoriaState> {
  await verificarSessao();

  const id = String(formData.get("id") ?? "").trim() || null;
  const nome = String(formData.get("nome") ?? "").trim();
  const ordemRaw = String(formData.get("ordem") ?? "").trim();
  const ativa = formData.get("ativa") === "on";

  if (!nome) return { erro: "Informe o nome da categoria." };
  const ordem = Number.parseInt(ordemRaw, 10);
  if (Number.isNaN(ordem) || ordem < 0) {
    return { erro: "Ordem inválida (use um número inteiro ≥ 0)." };
  }

  // Slug gerado no cadastro; preservado na edição (evita quebrar o filtro ?categoria=).
  let slug: string;
  if (id) {
    const atual = await prisma.categoria.findUnique({ where: { id } });
    if (!atual) return { erro: "Categoria não encontrada." };
    slug = atual.slug;
    await prisma.categoria.update({
      where: { id },
      data: { nome, ordem, ativa },
    });
  } else {
    slug = await slugUnico(slugify(nome));
    await prisma.categoria.create({ data: { nome, ordem, ativa, slug } });
  }

  revalidarCatalogo();
  redirect("/admin/categorias");
}

export async function excluirCategoria(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  // Trava de segurança: não apaga categoria com produtos (a UI já esconde o botão,
  // mas a ação pode ser chamada direto).
  const qtd = await prisma.produto.count({ where: { categoriaId: id } });
  if (qtd > 0) return;
  await prisma.categoria.delete({ where: { id } });
  revalidarCatalogo();
}

export async function alternarAtiva(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) return;
  await prisma.categoria.update({
    where: { id },
    data: { ativa: !categoria.ativa },
  });
  revalidarCatalogo();
}

export async function atualizarOrdem(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  const ordem = Number.parseInt(String(formData.get("ordem") ?? ""), 10);
  if (!id || Number.isNaN(ordem) || ordem < 0) return;
  await prisma.categoria.update({ where: { id }, data: { ordem } });
  revalidarCatalogo();
}
