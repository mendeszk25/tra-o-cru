# Traço Cru Design — V15
**Data:** 28 de outubro de 2026

## Alterações implementadas

- **Hero desktop:** composição ótica ajustada para permitir a leitura integral de "TRAÇO" sem sobrepor letras à escultura; preservada a fotografia original `assets/hero-produto-poster.webp`, sem vídeo/3D/upscaling.
- **Hero mobile:** CTA "Descubra as criações" reposicionado acima da faixa inferior do palco (testado em 360, 390 e 430 px); headline recebeu respiro adicional; variante paisagem compacta e sem elementos encobertos.
- **Header mobile:** link de contato do topo oculto em telas estreitas para liberar espaço; o canal continua acessível no menu.
- **Acessibilidade:** mantidos foco visível, `inert` ao abrir o menu, suporte a Escape e reduced motion; preservado bloqueio de rolagem de fundo com diálogos abertos.
- **Contato:** novo atalho visível para o Instagram oficial já presente no projeto, sem obrigar a preencher o formulário; tentativa de cópia da mensagem passa a iniciar antes de abrir o Instagram; estado orienta quando é preciso copiar manualmente.
- **Peças:** suporte a campos opcionais de ficha (medidas, acabamento, disponibilidade, encomendas). Não são exibidos até o ateliê inserir dados reais no objeto `pieces` do `main.js`.
- **Matéria:** removidos controle de uma única escolha e lógica residual da vista "Peça inteira"; preservado detalhe e zoom modesto, compatível com o arquivo disponível.
- **CSS:** substituídos os últimos blocos cumulativos de ajustes V13/V14 por uma camada V15 organizada, removidas algumas regras mortas. A folha original ainda possui regras históricas; não foi reescrita integralmente para evitar regressões.
- **Assets:** removidos `og-traco-cru.jpg` e `vaso-ambar-editorial.webp` após verificar que não eram referenciados no HTML, JS ou CSS atuais. Criados ícones simplificados (favicon e apple-touch-icon).

## Validação feita

- `node --check main.js`: OK.
- CSS analisado sintaticamente: sem erros de parsing.
- Teste de UI em Chromium headless com HTML/CSS/JS e recursos incorporados: 360×740, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080 e 844×390.
- Sem overflow horizontal nem exceções JS nesses cenários.
- CTA do Hero não intersectou o rodapé nas telas testadas.
- Menu mobile: foco no primeiro link, fundo inerte, Escape fecha.
- Modal de peça: abertura, Escape, scroll de fundo bloqueado; formulário: mensagem preparada.

**Limitação dos testes:** Chromium usa fontes alternativas no ambiente local de teste. Não equivale a homologação em navegador real com Cormorant Garamond e DM Sans carregadas, Safari, Firefox ou aparelhos físicos. Não foram medidos Lighthouse nem Core Web Vitals de produção. O link externo `ig.me` não foi validado na conta real.

## Como executar

Dentro da pasta `traco-cru-design-site`:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

O projeto não precisa de build nem de Node para funcionar; Node foi usado apenas para verificação sintática.
