# Roteiro de Apresentação — Nova Plataforma da Hangar Bebidas

> Guia para apresentar a demo ao dono da Hangar. Objetivo: mostrar uma loja online
> própria, com a cara da marca, melhor que o cardápio genérico atual (HeroDelivery),
> e um painel que dá controle total a ele. Tom: parceria, não venda agressiva.
> **Demo no ar:** https://hangar-adega.vercel.app · Painel: `/admin`

---

## 0. Antes de começar (preparação)

- [ ] Preencher o **WhatsApp real** da loja em `/admin/configuracoes` (sem isso o
      pedido salva mas a mensagem cai em contato inexistente).
- [ ] Subir as **fotos reais** dos produtos (`npm run db:imagens` sem `--dry`) e curar
      as faltantes — quanto mais foto real, mais convincente.
- [ ] Conferir alguns **preços** contra o site atual (corrigir R$ 0,00 herdados).
- [ ] Testar o fluxo completo **no celular** (loja → carrinho → checkout → WhatsApp).
- [ ] Deixar o painel logado num aparelho e a loja em outro, pra alternar rápido.

---

## 1. Abertura (1 min) — o problema

> "Hoje a Hangar vende pelo cardápio do HeroDelivery. Funciona, mas é um sistema
> genérico, igual ao de centenas de lojas: não tem a cara da Hangar, o cliente não
> sente que está comprando *na sua loja*, e quem manda no catálogo, no visual e nas
> regras é a plataforma — não você."

Pontos a tocar (sem falar mal demais, só contrastar):
- Visual genérico, sem identidade da marca.
- Pouco controle real sobre como a loja aparece.
- A loja fica em ponto afastado → **a vitrine online é o canal central de venda**.

## 2. A proposta (1 min)

> "Eu construí, do zero, uma loja online **só da Hangar** — com o dourado e o preto da
> marca — e um painel onde **você** controla tudo: produtos, preços, fotos, pedidos.
> Os pedidos chegam direto no seu WhatsApp, já organizados. Sem mensalidade de
> plataforma, sem depender de ninguém pra mexer."

## 3. Demo da LOJA (3–4 min) — o que o cliente vê

Mostrar no **celular**, que é como o cliente vai usar:

1. **Home com a marca** — banner, identidade dourado/preto, seção de **Destaques** no topo.
2. **Catálogo por categoria** + **filtro por categoria** (pills) e **busca por nome**.
3. **Página do produto** — foto, descrição, preço, botão de adicionar.
4. **Carrinho** — abrir o drawer, mostrar somar/remover, subtotal e o aviso de **pedido
   mínimo (R$ 25)**.
5. **Checkout** — forma de pagamento (Dinheiro/Cartão/Pix), troco, **confirmação +18**.
6. **Finalizar** → abre o **WhatsApp** com a mensagem do pedido já montada e organizada
   (itens, quantidades, total, forma de pagamento, observações).

> Frase-chave: "O pedido já chega pronto no seu WhatsApp — é só ler e separar."

## 4. Demo do PAINEL (3–4 min) — o que o dono controla

> "Essa é a parte que mais importa pra você: o controle."

1. **Login** próprio e seguro (`/admin`).
2. **Visão geral** — contagem de produtos, pedidos.
3. **Produtos** — criar/editar (nome, preço, descrição, categoria), **upload de foto**,
   marcar **esgotado**, **edição rápida de preço** na lista, excluir.
4. **Categorias** — criar, reordenar, ativar/desativar.
5. **Pedidos** — lista dos pedidos recebidos, detalhe e mudança de **status**.
6. **Configurações** — endereço, telefone, **número do WhatsApp que recebe os pedidos**,
   pedido mínimo, área de entrega.

> Frase-chave: "Mudou de preço, acabou o estoque, entrou produto novo — você mesmo
> resolve em segundos, do celular, sem pedir pra ninguém."

## 5. Ganhos vs. HeroDelivery (1–2 min)

| Tema | HeroDelivery (hoje) | Nova plataforma da Hangar |
|---|---|---|
| Identidade | Genérica, padrão da plataforma | **Cara da Hangar** (dourado/preto, logo) |
| Controle | Limitado ao que a plataforma deixa | **Painel próprio**, controle total |
| Pedidos | Pelo fluxo da plataforma | Direto no **seu WhatsApp**, organizados |
| Catálogo | Amarrado ao sistema | Você cadastra/edita à vontade |
| Custo | Modelo da plataforma | Sem mensalidade de plataforma de terceiro |
| Evolução | Depende deles | Dá pra crescer (Pix online, promoções, etc.) |

## 6. Fechamento (1 min)

> "Isso já está **no ar e funcionando**. O que eu preciso de você pra deixar 100%:
> o **WhatsApp oficial**, a **logo em alta**, **fotos** (ou autorização pra usar) e o
> **catálogo com preços certos**. A partir daí, a loja é sua."

Próximos passos possíveis (mostrar visão de futuro, sem prometer demais):
- Pagamento online (Pix/cartão) no futuro.
- Promoções / combos.
- Domínio próprio (ex.: `hangarbebidas.com.br`).

---

## Perguntas que o dono pode fazer (e respostas)

- **"Quanto custa?"** → Hoje roda em infraestrutura gratuita/barata; sem mensalidade de
  plataforma. Combinar o modelo de trabalho à parte.
- **"E se eu quiser mudar um preço às 22h?"** → Você mesmo muda no painel, na hora.
- **"Os pedidos somem se eu fechar o WhatsApp?"** → Não — todo pedido fica **salvo no
  sistema** e aparece no painel, além de chegar no WhatsApp.
- **"Preciso saber de computador?"** → Não. O painel funciona no celular e é simples.
- **"E o pagamento?"** → No começo, na entrega (dinheiro/cartão/Pix). Pix/cartão online
  dá pra adicionar depois.

## Lembretes de demo (não esquecer)

- Tudo testado **no celular** antes de mostrar.
- WhatsApp real configurado, senão o "finalizar" frustra a demonstração.
- Ter um pedido de exemplo já no painel pra mostrar a tela de pedidos cheia.
- Falar de **parceria**: isto resolve um problema real da loja afastada — vender online bem.
