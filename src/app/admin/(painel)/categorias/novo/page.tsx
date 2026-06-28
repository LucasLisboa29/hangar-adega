import { CategoriaForm } from "@/components/admin/categoria-form";

export const dynamic = "force-dynamic";

export default function NovaCategoriaPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Nova categoria</h1>
      <CategoriaForm />
    </div>
  );
}
