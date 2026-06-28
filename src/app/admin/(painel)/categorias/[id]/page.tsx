import { notFound } from "next/navigation";

import { getCategoriaAdmin } from "@/lib/admin/categorias";
import { CategoriaForm } from "@/components/admin/categoria-form";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoria = await getCategoriaAdmin(id);
  if (!categoria) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Editar categoria</h1>
      <CategoriaForm
        categoria={{
          id: categoria.id,
          nome: categoria.nome,
          ordem: categoria.ordem,
          ativa: categoria.ativa,
        }}
      />
    </div>
  );
}
