"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { verificarSessao } from "@/lib/auth/dal";
import { parseReaisParaCentavos, slugify } from "@/lib/format";
import { uploadImagemProduto } from "@/lib/storage";

export type ProdutoState = { erro?: string };

// Revalida as rotas públicas afetadas por uma mudança no catálogo + a lista admin.
function revalidarCatalogo(slug?: string) {
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  revalidatePath("/loja");
  if (slug) revalidatePath(`/produto/${slug}`);
}

/** Garante slug único: anexa -2, -3… se já existir (ignorando o próprio id). */
async function slugUnico(base: string, ignorarId?: string): Promise<string> {
  const raiz = base || "produto";
  let slug = raiz;
  let n = 2;
  while (true) {
    const existente = await prisma.produto.findUnique({ where: { slug } });
    if (!existente || existente.id === ignorarId) return slug;
    slug = `${raiz}-${n++}`;
  }
}

// Cria ou atualiza um produto (id no formData decide). Usado via useActionState.
export async function salvarProduto(
  _state: ProdutoState,
  formData: FormData
): Promise<ProdutoState> {
  await verificarSessao();

  const id = String(formData.get("id") ?? "").trim() || null;
  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const categoriaId = String(formData.get("categoriaId") ?? "").trim();
  const precoStr = String(formData.get("preco") ?? "");
  const ativo = formData.get("ativo") === "on";
  const esgotado = formData.get("esgotado") === "on";
  const destaque = formData.get("destaque") === "on";

  if (!nome) return { erro: "Informe o nome do produto." };
  if (!categoriaId) return { erro: "Escolha uma categoria." };

  const precoCentavos = parseReaisParaCentavos(precoStr);
  if (precoCentavos === null) {
    return { erro: "Preço inválido. Use o formato 19,90." };
  }

  // Preço de oferta: opcional. Em branco = sem oferta (null). Se preenchido,
  // precisa ser válido e MENOR que o preço cheio.
  const precoPromoStr = String(formData.get("precoPromo") ?? "").trim();
  let precoPromoCentavos: number | null = null;
  if (precoPromoStr) {
    precoPromoCentavos = parseReaisParaCentavos(precoPromoStr);
    if (precoPromoCentavos === null) {
      return { erro: "Preço em oferta inválido. Use o formato 14,90." };
    }
    if (precoPromoCentavos >= precoCentavos) {
      return { erro: "O preço em oferta precisa ser menor que o preço normal." };
    }
  }

  // Slug: gerado no cadastro; preservado na edição (evita quebrar links/SSG).
  let slug: string;
  if (id) {
    const atual = await prisma.produto.findUnique({ where: { id } });
    if (!atual) return { erro: "Produto não encontrado." };
    slug = atual.slug;
  } else {
    slug = await slugUnico(slugify(nome));
  }

  // Upload de imagem (opcional). Mantém a atual se nenhum arquivo for enviado.
  let imagemUrl: string | undefined;
  const arquivo = formData.get("imagem");
  if (arquivo instanceof File && arquivo.size > 0) {
    const res = await uploadImagemProduto(arquivo, slug);
    if (!res.ok) return { erro: res.erro };
    imagemUrl = res.url;
  }

  const dados = {
    nome,
    descricao,
    categoriaId,
    precoCentavos,
    precoPromoCentavos,
    ativo,
    esgotado,
    destaque,
    ...(imagemUrl ? { imagemUrl } : {}),
  };

  if (id) {
    await prisma.produto.update({ where: { id }, data: dados });
  } else {
    await prisma.produto.create({ data: { ...dados, slug } });
  }

  revalidarCatalogo(slug);
  redirect("/admin/produtos");
}

export async function excluirProduto(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const produto = await prisma.produto.findUnique({ where: { id } });
  await prisma.produto.delete({ where: { id } });
  revalidarCatalogo(produto?.slug);
}

export async function alternarAtivo(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) return;
  await prisma.produto.update({
    where: { id },
    data: { ativo: !produto.ativo },
  });
  revalidarCatalogo(produto.slug);
}

export async function alternarEsgotado(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  const produto = await prisma.produto.findUnique({ where: { id } });
  if (!produto) return;
  await prisma.produto.update({
    where: { id },
    data: { esgotado: !produto.esgotado },
  });
  revalidarCatalogo(produto.slug);
}

export async function atualizarPreco(formData: FormData): Promise<void> {
  await verificarSessao();
  const id = String(formData.get("id") ?? "").trim();
  const precoCentavos = parseReaisParaCentavos(String(formData.get("preco") ?? ""));
  if (!id || precoCentavos === null) return;
  const produto = await prisma.produto.update({
    where: { id },
    data: { precoCentavos },
  });
  revalidarCatalogo(produto.slug);
}
