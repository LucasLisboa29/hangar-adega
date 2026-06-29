import { notFound } from "next/navigation";

import { getProdutoAdmin, listarCategorias } from "@/lib/admin/produtos";
import { ProdutoForm } from "@/components/admin/produto-form";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [produto, categorias] = await Promise.all([
    getProdutoAdmin(id),
    listarCategorias(),
  ]);

  if (!produto) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Editar produto</h1>
      <ProdutoForm
        categorias={categorias}
        produto={{
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          precoCentavos: produto.precoCentavos,
          precoPromoCentavos: produto.precoPromoCentavos,
          categoriaId: produto.categoriaId,
          imagemUrl: produto.imagemUrl,
          ativo: produto.ativo,
          esgotado: produto.esgotado,
          destaque: produto.destaque,
        }}
      />
    </div>
  );
}
