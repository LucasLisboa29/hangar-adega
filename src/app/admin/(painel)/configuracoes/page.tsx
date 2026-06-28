import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/admin/config-form";

export const dynamic = "force-dynamic";

// Valores padrão caso ainda não exista um registro de ConfigLoja.
const PADRAO = {
  nome: "Hangar Bebidas",
  whatsapp: null,
  telefone: null,
  endereco: null,
  areaEntrega: null,
  pedidoMinimoCentavos: 2500,
  aberta: true,
};

export default async function ConfiguracoesPage() {
  const config = (await prisma.configLoja.findFirst()) ?? PADRAO;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Configurações da loja</h1>
        <p className="text-sm text-muted-foreground">
          Dados que aparecem na loja e regem o checkout (mínimo, WhatsApp).
        </p>
      </div>
      <ConfigForm
        config={{
          nome: config.nome,
          whatsapp: config.whatsapp,
          telefone: config.telefone,
          endereco: config.endereco,
          areaEntrega: config.areaEntrega,
          pedidoMinimoCentavos: config.pedidoMinimoCentavos,
          aberta: config.aberta,
        }}
      />
    </div>
  );
}
