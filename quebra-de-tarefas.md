# Quebra de Tarefas — Nova Plataforma da Hangar Bebidas

> Decomposição do projeto em tarefas acionáveis, agrupadas por épico (= fase do roadmap).
> Marque com `[x]` o que estiver concluído. Esforço: **P** (pequeno) / **M** (médio) / **G** (grande).
> Status: **rascunho v1** · Data: 23/06/2026

**Legenda de progresso:** `[ ]` a fazer · `[~]` em andamento · `[x]` concluído

---

## Épico 0 — Fundação (Fase 0)

- [x] Criar repositório Git (GitHub) e definir README inicial · P — _repo: github.com/LucasLisboa29/hangar-adega_
- [x] Inicializar projeto **Next.js + TypeScript** · P — _Next.js 16 + Turbopack_
- [x] Configurar **Tailwind CSS** + base de componentes (ex.: shadcn/ui) · P — _Tailwind v4 + shadcn/ui (radix)_
- [x] Definir paleta/identidade base (dourado/preto), fontes e logo da Hangar · M — _tema dourado/preto; fontes Inter + Oswald (falta aplicar a logo)_
- [ ] Criar conta e provisionar **PostgreSQL** (Supabase) · P — _decidido Supabase; depende de conta do Lucas_
- [x] Configurar **Prisma** e conexão com o banco · M — _Prisma 7 + driver adapter `@prisma/adapter-pg`; singleton em `src/lib/prisma.ts`_
- [x] Modelar entidades: `Categoria`, `Produto`, `Pedido`, `ItemPedido`, `UsuarioAdmin`, `ConfigLoja` · M
- [~] Rodar primeira **migration** e seed mínimo de teste · P — _`seed.ts` pronto; rodar quando o banco existir_
- [ ] Configurar deploy automático na **Vercel** (CI via Git) · M — _depende do GitHub + conta Vercel_
- [x] Variáveis de ambiente (.env) e segredos no provedor · P — _`.env.example` criado (falta preencher no provedor)_
- [ ] **Marco:** app no ar (deploy contínuo) + banco conectado

## Épico 1 — Vitrine / Catálogo (Fase 1)

- [ ] Layout base do site (header, footer, navegação) responsivo · M
- [ ] Aplicar identidade visual da Hangar ao layout · M
- [ ] Home com listagem de produtos agrupados por categoria · M
- [ ] Componente de card de produto (foto, nome, preço) · P
- [ ] Página de produto (imagem maior, descrição, preço, botão adicionar) · M
- [ ] Navegação/filtro por categoria (melhor que scroll horizontal) · M
- [ ] Busca por nome do produto · M
- [ ] Página "Informações da loja" (endereço, telefone, horário, mínimo, área) · P
- [ ] Lazy-load / otimização de imagens dos produtos · P
- [ ] Popular catálogo com subconjunto **real** de produtos para parecer convincente · M
- [ ] **Marco:** loja navegável e bonita no celular

## Épico 2 — Carrinho & Checkout (Fase 2)

- [ ] Estado do carrinho (adicionar, remover, quantidade) · M
- [ ] Persistência do carrinho (localStorage ou sessão) · P
- [ ] Tela/painel do carrinho com subtotal e total · M
- [ ] Regra de **pedido mínimo** (bloqueio + aviso de quanto falta) · P
- [ ] Tela de checkout: dados de entrega + forma de pagamento (na entrega) · M
- [ ] Confirmação de **maioridade (+18)** antes de finalizar · P
- [ ] Montar mensagem estruturada do pedido e abrir **WhatsApp** (`wa.me`) · M
- [ ] Salvar pedido no banco (para o admin listar depois) · M
- [ ] Validações de formulário (campos obrigatórios, área de entrega) · P
- [ ] **Marco:** cliente fecha um pedido fim a fim pelo celular

## Épico 3 — Painel Admin (Fase 3)

- [ ] **Login** protegido do admin (Auth.js/NextAuth ou auth do Supabase) · M
- [ ] Layout do painel (área autenticada, navegação) · M
- [ ] Listagem de produtos no admin · P
- [ ] Criar/editar produto (nome, preço, descrição, categoria) · M
- [ ] **Upload de imagem** do produto (Supabase Storage/Cloudinary) · M
- [ ] Excluir produto · P
- [ ] Marcar produto **ativo/esgotado** · P
- [ ] **Edição rápida de preço** · P
- [ ] CRUD de **categorias** · M
- [ ] **Listagem de pedidos** recebidos (data, itens, total, cliente) · M
- [ ] (Se sobrar tempo) Configurações da loja (horário, mínimo, área) · M
- [ ] **Marco:** dono cadastra/edita produto e vê pedidos sem depender de ninguém

## Épico 4 — Polimento & Demo (Fase 4)

- [ ] Cadastrar mais produtos reais (corrigir fotos faltando e preços R$ 0,00 do site atual) · M
- [ ] Seção de destaques na home · P
- [ ] Revisão geral de UX/UI e responsividade · M
- [ ] SEO básico (títulos, meta tags por produto/categoria), favicon · P
- [ ] Teste manual do fluxo completo (loja + admin) no celular · P
- [ ] Ajustar domínio provisório / URL apresentável · P
- [ ] Escrever **roteiro de apresentação** pro dono (ganhos vs. HeroDelivery) · P
- [ ] **Marco:** DEMO no ar, pronta para apresentar ao dono da Hangar

---

## Backlog / Ideias futuras (Fase 5 — pós-validação)

- Combos / "leve junto" e sugestões de itens relacionados
- Promoções e marcação de produto em oferta
- Filtro por faixa de preço
- Indicador de loja aberta/fechada conforme horário
- Pagamento online (Pix/cartão via gateway)
- Conta do cliente + histórico + "repetir último pedido"
- PWA ("adicionar à tela inicial")
- Importação de catálogo por planilha
- Domínio próprio definitivo + política de privacidade/LGPD formal
- (Estratégico) Evoluir para SaaS multi-loja, atendendo outras adegas

---

## Dados/insumos a coletar do dono (quando houver contato)

- Logo da Hangar em alta resolução + cores oficiais
- Fotos reais dos produtos (ou autorização para usar/recriar)
- Catálogo atualizado com preços corretos
- Número de WhatsApp oficial para receber pedidos
- Confirmação de área de entrega e taxas (se houver)
