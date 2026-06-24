# Hangar Bebidas — Loja Online

Plataforma de **vendas online e delivery** própria para a **Hangar Bebidas** (adega e
conveniência em Araguari/Uberlândia-MG, "Desde 2009"). Substitui o cardápio digital
genérico atual por uma loja com a **identidade da marca**, catálogo confiável e um
**painel admin** para o dono ter controle — tudo construído do zero.

Checkout é via **WhatsApp** (mensagem estruturada), com pagamento na entrega — sem
gateway de pagamento no MVP.

> Documentação do projeto: [`visao-e-escopo.md`](visao-e-escopo.md) ·
> [`requisitos.md`](requisitos.md) · [`roadmap.md`](roadmap.md) ·
> [`quebra-de-tarefas.md`](quebra-de-tarefas.md) (fonte da verdade do progresso).

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Turbopack**
- **Tailwind CSS v4** + **shadcn/ui** — tema dourado/preto da Hangar
- **PostgreSQL** (Supabase) + **Prisma 7** (driver adapter `@prisma/adapter-pg`)
- Deploy na **Vercel**

## Como rodar localmente

Pré-requisitos: Node 20+ e um banco PostgreSQL (Supabase).

```bash
# 1. Instalar dependências (roda `prisma generate` automaticamente)
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env   # depois preencha DATABASE_URL e DIRECT_URL

# 3. Criar as tabelas e popular dados de teste
npm run db:migrate     # aplica as migrations
npm run db:seed        # popula categorias/produtos de exemplo

# 4. Subir o servidor de desenvolvimento
npm run dev            # http://localhost:3000
```

## Scripts úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:migrate` | Cria/aplica migrations (dev) |
| `npm run db:deploy` | Aplica migrations em produção |
| `npm run db:seed` | Popula dados de exemplo |
| `npm run db:studio` | Abre o Prisma Studio (GUI do banco) |
| `npm run db:reset` | Reseta o banco e re-semeia |

## Estrutura

```
prisma/
  schema.prisma     # modelos: Categoria, Produto, Pedido, ItemPedido, UsuarioAdmin, ConfigLoja
  seed.ts           # dados de exemplo
src/
  app/              # rotas (App Router)
  components/ui/    # componentes shadcn/ui
  lib/prisma.ts     # singleton do Prisma Client
  generated/prisma/ # client gerado (não versionado)
prisma.config.ts    # config do Prisma 7 (datasource, migrations, seed)
```

## Banco de dados (Supabase)

- `DATABASE_URL` → conexão **pooled** (porta 6543), usada pelo app em runtime.
- `DIRECT_URL` → conexão **direta** (porta 5432), usada por migrations e seed.

Ambas saem de **Supabase → Project Settings → Database → Connection string**.
