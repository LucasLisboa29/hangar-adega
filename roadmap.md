# Roadmap / Cronograma — Nova Plataforma da Hangar Bebidas

> Organiza o desenvolvimento em fases e marcos. Tempo em **semanas relativas**,
> assumindo desenvolvimento **solo e em meio período** (faculdade em paralelo).
> Ajuste o ritmo conforme sua disponibilidade.
> Status: **rascunho v1** · Data: 23/06/2026

## Meta-norte

Chegar numa **demo pública e funcional** — loja com a cara da Hangar + painel admin
utilizável — boa o bastante para **apresentar ao dono** e propor a troca da HeroDelivery.
Tudo construído do zero (Next.js), servindo também de **projeto de portfólio**.

## Visão geral das fases

| Fase | Objetivo | Período estimado | Status |
|------|----------|------------------|--------|
| Fase 0 — Fundação | Setup do projeto, banco, deploy e identidade base | Semana 1 | Não iniciado |
| Fase 1 — Vitrine/Catálogo | Loja navegável com produtos, busca e identidade | Semanas 2–3 | Não iniciado |
| Fase 2 — Carrinho & Checkout | Fechar pedido fim-a-fim via WhatsApp | Semana 4 | Não iniciado |
| Fase 3 — Painel Admin | Dono gerencia produtos, preços e vê pedidos | Semanas 5–6 | Não iniciado |
| Fase 4 — Polimento & Demo | Dados reais, SEO, ajustes e demo no ar | Semana 7 | Não iniciado |
| Fase 5 — Pós-validação | Should/Could e evoluções após interesse do dono | Depois da demo | Não iniciado |

> **Estimativa total do MVP:** ~7 semanas em meio período. O ponto crítico é a **Fase 4**:
> é quando você tem algo apresentável. Fases 1–3 podem encurtar se você acelerar.

---

## Detalhamento por fase

### Fase 0 — Fundação (Semana 1)
- **Entregas:**
  - Repositório Git + projeto **Next.js + TypeScript + Tailwind** rodando.
  - Banco **PostgreSQL** (Supabase/Neon) conectado + **Prisma** com modelagem inicial
    (Produto, Categoria, Pedido, ItemPedido, Usuário-admin, ConfigLoja).
  - Deploy automático na **Vercel** ("hello world" no ar com domínio provisório).
  - Identidade visual base: paleta dourado/preto, fontes, logo, componentes base.
- **Marco:** projeto versionado, banco conectado e deploy contínuo funcionando.

### Fase 1 — Vitrine / Catálogo (Semanas 2–3)
- **Entregas:**
  - Home com categorias e listagem de produtos (foto, nome, preço).
  - Página de produto (imagem maior, descrição, preço, botão adicionar).
  - Busca por nome + filtro/navegação por categoria (melhor que o scroll atual).
  - Página "Informações da loja" (endereço, telefone, horário, pedido mínimo, área).
  - Layout **responsivo/mobile-first** com a identidade da Hangar aplicada.
  - Catálogo populado com um **subconjunto real** de produtos (p/ ficar convincente).
- **Marco:** loja navegável e bonita no celular — já dá pra mostrar pra alguém.

### Fase 2 — Carrinho & Checkout (Semana 4)
- **Entregas:**
  - Carrinho: adicionar/remover, quantidade, subtotal/total.
  - Regra de **pedido mínimo** (bloqueio + aviso de quanto falta).
  - Checkout: dados de entrega + forma de pagamento (na entrega).
  - **Confirmação de maioridade (+18)**.
  - Geração do pedido e envio via **WhatsApp** (`wa.me` com mensagem estruturada).
  - Persistência do pedido no banco (pra o admin listar depois).
- **Marco:** um cliente consegue montar e enviar um pedido **fim a fim** pelo celular.

### Fase 3 — Painel Admin (Semanas 5–6)
- **Entregas:**
  - **Login** protegido (dono/atendente).
  - **CRUD de produtos** (nome, preço, foto, descrição, categoria) + upload de imagem.
  - **CRUD de categorias**.
  - Marcar produto **ativo/esgotado** e **edição rápida de preço**.
  - **Listagem de pedidos** recebidos (data, itens, total, cliente).
  - (Se sobrar tempo) **Configurações da loja** (horário, mínimo, área).
- **Nota:** versão funcional, não precisa estar perfeita — objetivo é o dono **sentir
  que teria controle real** da loja.
- **Marco:** dono consegue cadastrar/editar produto e ver pedidos sem depender de ninguém.

### Fase 4 — Polimento & Demo (Semana 7)
- **Entregas:**
  - Mais produtos reais cadastrados (corrigindo erros do site atual: fotos faltando,
    preço R$ 0,00).
  - Destaques na home (mesmo que simples) e revisão de UX/UI.
  - SEO básico (títulos, meta tags), favicon, domínio provisório arrumado.
  - Testes manuais do fluxo completo (loja + admin) no celular.
  - **Roteiro de apresentação** pro dono (o que mostrar, ganhos vs. HeroDelivery).
- **Marco:** **DEMO no ar, pronta para apresentar ao dono da Hangar.**

### Fase 5 — Pós-validação (após interesse do dono)
- **Should:** combos/"leve junto", promoções, filtro por faixa de preço, indicador de
  loja aberta/fechada.
- **Could / evoluções:** pagamento online (Pix/cartão via gateway), conta do cliente +
  histórico + "repetir pedido", PWA ("adicionar à tela inicial"), importação de catálogo
  por planilha, domínio próprio definitivo, política de privacidade/LGPD formal.
- **Marco:** plataforma em produção real, operada pela loja.

---

## Dependências

- **Fase 1+ depende da Fase 0** (banco e modelagem prontos antes de telas com dados).
- **Fase 2 depende da Fase 1** (precisa de produtos/catálogo pra ter o que comprar).
- **Listagem de pedidos (Fase 3) depende da persistência de pedido (Fase 2).**
- **Fase 4 depende de catálogo real** — você vai precisar coletar **fotos e dados**
  corretos (recriados a partir do site atual ou pedidos ao dono). Comece a juntar isso já
  na Fase 1, pra não travar no fim.
- **Itens com gateway de pagamento (Fase 5)** dependem de decisão de negócio + cadastro
  em provedor (Pix/cartão) — fora do caminho crítico do MVP.

## Riscos de cronograma

- **Catálogo/fotos atrasarem a demo** → comece a coletar cedo; para a demo, basta um
  subconjunto bem-feito (não precisa do catálogo inteiro).
- **Painel admin crescer demais** → manter escopo "funcional, não perfeito" da Fase 3.
- **Ritmo solo + faculdade** → fases curtas e a meta única da demo ajudam a não dispersar;
  se apertar, a ordem de corte é: Fase 5 → itens "se sobrar tempo" da Fase 3 → destaques
  da Fase 4. Loja + checkout + admin básico são o núcleo inegociável.
