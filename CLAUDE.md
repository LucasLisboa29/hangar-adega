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

- **Fase atual:** 0 — Fundação (**em andamento**; parte local concluída)
- **Concluído nesta fase:** scaffold Next.js 16 + TS + Tailwind v4 + shadcn/ui; tema
  dourado/preto + fontes (Inter/Oswald); landing provisória; Prisma 7 com driver adapter
  e schema das 6 entidades modelado; `seed.ts`; `.env.example`; README. Build OK.
- **Stack confirmada nas versões reais:** Next 16.2.9, React 19.2.4, Tailwind v4,
  Prisma 7.8 (usa **driver adapters** — `@prisma/adapter-pg`; URL via `prisma.config.ts`,
  não mais no schema). Banco escolhido: **Supabase**.
- **Pendente (depende do Lucas):** provisionar Postgres no Supabase, criar repo no GitHub
  e deploy na Vercel. Aí roda a 1ª migration + seed.
- **Próxima tarefa:** criar projeto no Supabase, preencher `.env`, rodar `npm run db:migrate`
  e `npm run db:seed`.

> **Como manter atualizado:** marque o progresso real nos checkboxes de
> `quebra-de-tarefas.md` (`[ ]` → `[~]` em andamento → `[x]` feito) e atualize só o bloco
> **"Estado atual do projeto"** acima a cada sessão. Não duplique a lista de tarefas aqui.
