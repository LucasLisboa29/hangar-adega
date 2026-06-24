# Requisitos / Funcionalidades — Nova Plataforma da Hangar Bebidas

> O que o projeto precisa ter. Prioridade no padrão MoSCoW
> (Must = obrigatório p/ o MVP, Should = importante, Could = desejável, Won't = fora agora).
> Status: **rascunho v1** · Data: 23/06/2026

---

## Recomendação de stack (e o porquê)

Você pediu que eu recomendasse. Considerando: projeto **solo**, **estudante de CC**,
orçamento enxuto, mobile-first, e a necessidade de um MVP bom o bastante pra **demonstrar
ao dono** — recomendo o seguinte:

| Camada | Escolha recomendada | Por quê |
|--------|---------------------|---------|
| **Framework web** | **Next.js (React + TypeScript)** | Um só projeto cobre a loja (front) e a API (rotas/server actions). SEO bom (importante p/ loja achável no Google), ótimo p/ mobile, comunidade enorme e muito material p/ aprender. Forte no currículo. |
| **Estilização** | **Tailwind CSS** + componentes (shadcn/ui) | Rápido de montar uma identidade dourado/preto bonita e responsiva sem reinventar CSS. |
| **Banco de dados** | **PostgreSQL** (via Supabase ou Neon) | Relacional combina com catálogo/pedidos. Camada gratuita generosa. |
| **ORM / acesso a dados** | **Prisma** | Modelagem tipada, migrations fáceis, integra perfeito com Next + TS. |
| **Autenticação (admin)** | **Auth.js (NextAuth)** ou auth do Supabase | Só o dono/atendente precisa logar no painel; cliente final não precisa de conta no MVP. |
| **Imagens** | **Supabase Storage / Cloudinary** | Hospedar fotos dos produtos com otimização automática. |
| **Hospedagem** | **Vercel** (app) + Supabase/Neon (banco) | Deploy automático via Git, HTTPS e domínio fáceis, camada gratuita p/ começar. |
| **Pedido / contato** | **Link `wa.me` com mensagem pré-formatada** | Gera o pedido estruturado no WhatsApp da loja sem custo de gateway. |

> **Alternativa mais simples** (se quiser reduzir ainda mais o escopo técnico inicial):
> Next.js + Supabase usando o próprio Supabase como banco + auth + storage, dispensando
> configurar Prisma/Auth.js separados. Decidimos isso na quebra de tarefas.

> **Observação:** essa stack vale para construir do zero. Existe um caminho alternativo
> de negócio (usar um e-commerce pronto tipo Nuvemshop/Loja Integrada e só personalizar).
> Trato isso como decisão estratégica no roadmap — aqui assumo o **desenvolvimento próprio**,
> que é o que faz sentido como projeto seu de CC.

---

## Requisitos funcionais

### Loja / cliente final

| ID | Funcionalidade | Descrição | Prioridade |
|----|----------------|-----------|------------|
| RF01 | Catálogo por categorias | Listar produtos agrupados por categoria (Palheiro, Energéticos, Vinhos, etc.), com foto, nome e preço | Must |
| RF02 | Página de produto | Tela de detalhe com imagem maior, descrição, preço e botão "adicionar ao carrinho" | Must |
| RF03 | Busca de produtos | Buscar por nome do produto | Must |
| RF04 | Filtro por categoria | Navegar/filtrar por categoria de forma clara (não só scroll horizontal) | Must |
| RF05 | Carrinho | Adicionar, remover, alterar quantidade e ver subtotal/total | Must |
| RF06 | Regra de pedido mínimo | Bloquear/avisar checkout abaixo do valor mínimo (hoje R$ 25,00) | Must |
| RF07 | Checkout + dados de entrega | Coletar nome, endereço/área e forma de pagamento (na entrega) | Must |
| RF08 | Envio do pedido por WhatsApp | Gerar pedido estruturado e abrir o WhatsApp da loja com a mensagem pronta | Must |
| RF09 | Confirmação de maioridade | Aviso/checkbox de +18 antes de finalizar (bebida e cigarro) | Must |
| RF10 | Página "Sobre / Informações da loja" | Endereço, telefone, horário, pedido mínimo, área de entrega | Must |
| RF11 | Identidade visual da Hangar | Tema dourado/preto, logo, tom premium | Must |
| RF12 | Responsivo / mobile-first | Boa experiência no celular (público acessa pelo celular) | Must |
| RF13 | Filtro por faixa de preço | Refinar a busca por preço | Should |
| RF14 | Combos / "leve junto" | Sugestão de itens relacionados na página de produto ou carrinho | Should |
| RF15 | Destaques / promoções | Seção de destaques na home e marcação de produto em promoção | Should |
| RF16 | Indicador de loja aberta/fechada | Mostrar status conforme horário de funcionamento | Should |
| RF17 | Repetir último pedido | Atalho para refazer um pedido anterior (depende de histórico) | Could |
| RF18 | Avaliações / nota de produto | Cliente avaliar produtos | Won't (agora) |

### Painel administrativo (operação da loja)

| ID | Funcionalidade | Descrição | Prioridade |
|----|----------------|-----------|------------|
| RF19 | Login do admin | Acesso protegido para dono/atendente | Must |
| RF20 | CRUD de produtos | Criar, editar, excluir produto (nome, preço, foto, descrição, categoria) | Must |
| RF21 | Disponibilidade do produto | Marcar produto como ativo/esgotado | Must |
| RF22 | CRUD de categorias | Gerenciar categorias do catálogo | Must |
| RF23 | Edição rápida de preço | Ajustar preço sem refazer o cadastro todo | Should |
| RF24 | Listagem de pedidos recebidos | Ver pedidos que chegaram (data, itens, total, cliente) | Should |
| RF25 | Configurações da loja | Editar endereço, horário, pedido mínimo, área de entrega | Should |
| RF26 | Upload em massa / importação | Importar catálogo via planilha | Could |

---

## Requisitos não-funcionais

- **Desempenho:** páginas da loja carregando em < 2s no 4G; catálogo paginado ou
  com lazy-load de imagens.
- **Segurança:** painel admin atrás de autenticação; senhas com hash; dados de
  pedido trafegando por HTTPS; sem armazenar dado de pagamento (não há gateway no MVP).
- **Usabilidade / Acessibilidade:** mobile-first; contraste adequado (texto sobre
  dourado/preto); poucos passos até finalizar o pedido; alvos de toque grandes.
- **Compatibilidade / Plataforma:** web responsiva (Chrome/Safari/Firefox, Android e
  iOS); pode ser PWA ("adicionar à tela inicial") em fase posterior.
- **Escalabilidade / Disponibilidade:** suficiente para uma loja única; hospedagem
  gerenciada (Vercel + Postgres gerenciado) com camada gratuita escalável se precisar.
- **Manutenibilidade:** código tipado (TypeScript), banco versionado por migrations,
  deploy automático por Git.
- **SEO:** páginas indexáveis, meta tags e título por produto/categoria, domínio próprio.
- **Legal/LGPD:** coletar só o necessário do cliente (nome, contato, endereço);
  aviso de maioridade; política simples de privacidade quando for ao ar.

---

## Regras de negócio

- **Pedido mínimo:** não é possível finalizar abaixo do valor mínimo configurado
  (padrão atual R$ 25,00); valor é editável no painel.
- **Maioridade:** itens alcoólicos e tabaco exigem confirmação de +18 antes de
  concluir o pedido; entrega sujeita a conferência pela loja.
- **Área de entrega:** atende Uberlândia e Araguari; pedidos fora da área não são
  aceitos (ou avisam indisponibilidade).
- **Horário de funcionamento:** pedidos só são finalizáveis (ou são sinalizados como
  "agendados") com a loja aberta, conforme tabela de horários.
- **Preço e disponibilidade:** o que vale é sempre o cadastrado no painel; produto
  esgotado não pode ser adicionado ao carrinho.
- **Pagamento:** no MVP, pagamento ocorre na entrega (dinheiro/maquininha/Pix manual);
  a plataforma não processa pagamento.

---

## Critérios de aceite (funcionalidades-chave)

- **Catálogo (RF01):** Dado que existem produtos cadastrados e ativos, quando o cliente
  abre a loja, então vê os produtos agrupados por categoria, cada um com foto, nome e
  preço correto (sem itens a R$ 0,00 indevidos).
- **Carrinho + pedido mínimo (RF05/RF06):** Dado um carrinho abaixo do mínimo, quando o
  cliente tenta avançar, então o sistema bloqueia e informa quanto falta para o mínimo.
- **Checkout por WhatsApp (RF07/RF08):** Dado um carrinho válido e os dados de entrega
  preenchidos, quando o cliente finaliza, então abre o WhatsApp da loja com uma mensagem
  contendo itens, quantidades, total, endereço e forma de pagamento.
- **Maioridade (RF09):** Dado um pedido com item alcoólico/tabaco, quando o cliente vai
  finalizar, então precisa confirmar +18 para concluir.
- **Admin – CRUD de produto (RF20):** Dado um admin logado, quando ele cadastra/edita um
  produto com foto, preço e categoria, então o produto aparece corretamente na loja.
- **Disponibilidade (RF21):** Dado um produto marcado como esgotado, quando o cliente o vê
  na loja, então não consegue adicioná-lo ao carrinho.
- **Responsivo (RF12):** Dado um celular, quando o cliente navega pela loja e finaliza um
  pedido, então todo o fluxo funciona sem quebra de layout.
