# CLAUDE.md — Plataforma Hangar Bebidas

> Contexto-mestre do projeto, lido automaticamente a cada sessão. Mantenha curto e
> atualizado. A fonte da verdade dos documentos está nos `.md` referenciados abaixo;
> aqui fica o resumo e o **estado atual**.

## O que é

Plataforma de **vendas online própria** para a **Hangar Bebidas** (adega/conveniência
em Uberlândia–Araguari, "Desde 2009"), para **substituir** o cardápio digital genérico
que ela usa hoje (HeroDelivery — `hangarbebidas.herodelivery.com.br`).

A loja fica em ponto afastado, então **venda online e delivery são o canal central**.
O objetivo é uma loja com a **identidade da marca**, catálogo confiável, melhor UX de
compra e um **painel admin** para o dono ter controle — tudo construído **do zero**.

## Contexto importante

- Projeto é **iniciativa do Lucas** (estudante de Ciência da Computação): ainda **não há
  contrato/contato com o dono**. Por isso o MVP tem **duplo propósito**: produto real +
  **demo para conquistar o dono** como cliente.
- Vale mesmo se não vender: é **projeto de portfólio/currículo**.
- Desenvolvimento **solo, meio período**, sem prazo fixo (Lucas de férias da facul, mas
  trabalhando). Ritmo tranquilo.

## Stack (decidida)

- **Next.js + TypeScript** (loja + painel + API num projeto só)
- **Tailwind CSS** (+ shadcn/ui) — tema **dourado/preto** da Hangar
- **PostgreSQL** (Supabase ou Neon) + **Prisma**
- **Auth.js/NextAuth** ou auth do Supabase (só admin loga; cliente final **não** cria conta no MVP)
- **Supabase Storage / Cloudinary** (imagens)
- **Vercel** (deploy via Git)
- Pedido via **`wa.me`** (mensagem estruturada) — **sem gateway de pagamento no MVP**

## Decisões-chave

- **Sob medida** para a Hangar (não SaaS multi-loja — isso é futuro).
- **Pagamento online fora do MVP**: checkout via WhatsApp + pagamento na entrega.
- **Painel admin DENTRO do MVP**: versão funcional (não precisa estar perfeita), para o
  dono sentir que teria controle real (cadastrar produto, mexer preço, ver pedidos).
- **Cliente final não cria conta** no MVP.
- **Confirmação de maioridade (+18)** no checkout (bebida + tabaco).
- Construir **do zero** (decisão consciente vs. usar e-commerce pronto), pelo valor de currículo.

## Dados da loja (do site atual)

- Endereço: Avenida Minas Gerais 2625 · Tel: (34) 3512-1759
- Pedido mínimo: R$ 25,00 · Entrega: Uberlândia e Araguari
- Categorias: Palheiro, Energéticos, Isotônicos, Kids, Refrigerantes, Vinhos, Sucos,
  Licores, Cachaças, Cigarros…
- Prints do site atual em `Imagens do site atual/`

## Documentos do projeto

- [Visão e Escopo](visao-e-escopo.md) — objetivo, público, dentro/fora, riscos
- [Requisitos](requisitos.md) — funcionalidades (MoSCoW) + detalhe da stack
- [Roadmap](roadmap.md) — 5 fases até a demo
- [Quebra de Tarefas](quebra-de-tarefas.md) — **checklist; fonte da verdade do progresso**

## Estado atual do projeto

- **Fase atual:** 2 — Carrinho & Checkout **CONCLUÍDA** ✅ → próxima é a Fase 3 (Painel Admin)
- **No ar:** https://hangar-adega.vercel.app (deploy contínuo a cada push na `main`)
- **Concluído na Fase 2:** carrinho client-side (`CartProvider` — Context+reducer, persistido em
  `localStorage` `hangar.carrinho.v1`); adicionar pela página do produto (`AddToCartButton` vira
  stepper) e pelo "+" nos cards (`QuickAddButton`); **drawer** do carrinho (`ui/sheet.tsx` sobre
  radix `Dialog`) com badge no header, stepper, remover, subtotal e aviso de pedido mínimo;
  página `/checkout` (forma de pagamento Dinheiro/Cartão/Pix + troco condicional, observações,
  **+18 obrigatório**); Server Action `criarPedido` (`src/app/actions/checkout.ts`) que
  **revalida preços/total no servidor** (cliente não decide valor), checa mínimo/+18, cria
  `Pedido`+`ItemPedido` e devolve `{ numero, whatsappUrl }`; tela `/pedido/[numero]`; mensagem
  estruturada do WhatsApp em `src/lib/whatsapp.ts` (`montarMensagemPedido`/`linkWhatsApp`).
  Migration `add_pagamento_pedido` (campos nullable `formaPagamento`/`trocoParaCentavos`).
  Verificado fim-a-fim no preview + pedido confirmado no banco; `npm run build` limpo (SSG intacto).
- **⚠️ WhatsApp ainda é PLACEHOLDER** (`WHATSAPP_PLACEHOLDER` em `src/lib/loja.ts`;
  `ConfigLoja.whatsapp` vazio): o pedido salva, mas a mensagem cai em contato inexistente.
  Trocar pelo número real do dono é a pendência que "fecha a venda" (memória do projeto).
- **Concluído na Fase 1:** layout da marca (`SiteHeader` sticky com busca + `SiteFooter`),
  tema dourado/preto aplicado globalmente (dark); home com produtos agrupados por categoria;
  `ProductCard` (placeholder de taça quando sem foto, badges Destaque/Esgotado); página de
  produto `/produto/[slug]` (SSG via `generateStaticParams` + `generateMetadata`); filtro por
  categoria (pills `?categoria=`) e busca (form GET `?q=`); página `/loja`; `not-found`.
  Catálogo semeado com 10 categorias / 33 produtos. Build limpo, verificado no preview.
- **Camada de dados:** `src/lib/catalog.ts` (queries Prisma em Server Components) e
  `src/lib/format.ts` (`formatBRL`). Componentes novos em `src/components/`.
- **Stack confirmada nas versões reais:** Next 16.2.9, React 19.2.4, Tailwind v4,
  Prisma 7.8 (usa **driver adapters** — `@prisma/adapter-pg`; URL via `prisma.config.ts`,
  não mais no schema). Banco escolhido: **Supabase**.
- **Banco conectado:** Supabase (projeto sa-east-1) com migration `init` aplicada e seed
  rodado (10 categorias, 33 produtos). Runtime usa pooled `:6543`, migrations usam `:5432`.
- **Repositório:** github.com/LucasLisboa29/hangar-adega (branch `main`).
- **Imagens dos produtos:** pipeline em `scripts/produtos-imagens.ts` (`npm run db:imagens`):
  busca no Open Food Facts → remove o fundo (onnx num **processo `node` isolado** —
  `remove-bg-worker.mjs`, porque onnx+sharp conflitam no Windows) → padroniza num canvas
  quadrado → webp transparente que "flutua" no card dourado/preto. **19 produtos com foto
  real** (modo `--dry`, gravadas em `public/produtos/`, gitignored); o resto fica no
  placeholder de taça. Match ruim/tabaco/não-alimentos estão marcados `skip` no `OVERRIDES`.
  `next.config.ts` já tem `remotePatterns` do Supabase e `.env` tem a `NEXT_PUBLIC_SUPABASE_URL`.
- **⚠️ Antes de fazer deploy da Fase 1:** dev e prod usam o MESMO banco Supabase, e o `--dry`
  gravou caminhos LOCAIS (`/produtos/...`) na `imagemUrl` de 19 produtos. Esses arquivos NÃO
  vão pro Vercel → rodar o upload real (`npm run db:imagens`, sem `--dry`, com
  `SUPABASE_SERVICE_ROLE_KEY` + bucket público "produtos") ANTES de publicar, senão o site no
  ar fica com imagens quebradas.
- **Pendências conhecidas:** curadoria das ~14 fotos faltantes (EAN/manual) e upload pro
  Supabase Storage; WhatsApp placeholder (acima). Os pedidos da Fase 2 ficam no banco mas
  **ainda não há tela admin** para listá-los — é o coração da Fase 3.

### Para retomar na próxima sessão (Fase 3 — Painel Admin)

1. **Subir o ambiente:** `npm install` → `npm run dev` → http://localhost:3000 (`.env` já conecta ao Supabase).
2. **O que construir (ver Épico 3 em [quebra-de-tarefas.md](quebra-de-tarefas.md)):** login
   protegido do admin → layout da área autenticada → CRUD de produtos (incl. upload de imagem
   pro Supabase Storage) + ativo/esgotado + edição rápida de preço → CRUD de categorias →
   **listagem de pedidos recebidos** (já há dados: `Pedido`/`ItemPedido` com `formaPagamento`,
   `trocoParaCentavos`, `status`).
3. **Pontos de partida:** model `UsuarioAdmin` já existe (vazio — definir auth: Auth.js ou
   Supabase Auth); `getPedidoPorNumero` em `catalog.ts` é um exemplo de query de pedido;
   pipeline de imagens (`scripts/produtos-imagens.ts`) já fala com o Supabase Storage.
4. **Lembrete da stack:** Next 16 / Tailwind v4 / Prisma 7 têm breaking changes — antes de
   escrever código, consultar os guias em `node_modules/next/dist/docs/` (ver [AGENTS.md](AGENTS.md)).
   **Importante:** depois de `prisma migrate dev`, rode `npx prisma generate` e reinicie o dev
   server, senão o client em memória fica sem os campos novos (mordeu na Fase 2).

> **Como manter atualizado:** marque o progresso real nos checkboxes de
> `quebra-de-tarefas.md` (`[ ]` → `[~]` em andamento → `[x]` feito) e atualize só o bloco
> **"Estado atual do projeto"** acima a cada sessão. Não duplique a lista de tarefas aqui.
