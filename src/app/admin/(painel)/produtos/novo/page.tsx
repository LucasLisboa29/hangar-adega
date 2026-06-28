import { listarCategorias } from "@/lib/admin/produtos";
import { ProdutoForm } from "@/components/admin/produto-form";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const categorias = await listarCategorias();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Novo produto</h1>
      <ProdutoForm categorias={categorias} />
    </div>
  );
}
