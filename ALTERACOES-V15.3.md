# Traço Cru Design — V15.3: responsividade refinada

## O que mudou

- **Hero no mobile (até 650 px):** composição editorial estruturada em grid, com áreas reservadas para a assinatura, a escultura, o título, o CTA e a faixa inferior. A fotografia original do Hero não foi modificada.
- **Título:** quebra em três linhas no celular para manter leitura e espaçamento, com *alma.* em destaque.
- **CTA:** deixou de competir com o título e não fica sob a faixa inferior. Áreas de toque preservadas.
- **Palavras monumentais:** TRAÇO e CRU permanecem como camadas de fundo, com escala adequada aos celulares.
- **Celular na horizontal:** layout em duas colunas, mais legível e com rolagem vertical natural quando a altura disponível é curta.
- **Tablet vertical (651–900 px):** enquadramento e hierarquia ajustados sem alterar a identidade.
- **Desktop:** a direção de arte e o layout do Hero aprovado na V14 foram mantidos; nenhuma nova animação/3D/vídeo foi adicionada.

## Validação de interface

O layout foi conferido em Chromium automatizado nos tamanhos: 320×568, 360×640, 360×740, 375×667, 390×844, 414×896, 430×932, 600×900, 650×900, 651×900, 768×1024, 820×1180, 844×390, 896×414, 900×900, 901×900, 1024×768, 1440×900 e 1879×1004.

Nos testes não houve overflow horizontal, erro JavaScript ou sobreposição do CTA com a faixa inferior. Menu, modal de obra, Escape e formulário também foram exercitados. **Os testes de navegador usam fontes substitutas**, pois fontes externas não estão disponíveis nesta execução. Antes de publicar, confirmar em Firefox e Safari com as fontes reais e em aparelhos físicos.

## O que não foi alterado

As outras seções, dados de obras e cursos, formulários, integrações, imagens, JS e contato ficaram preservados. Nenhum dado comercial foi inventado. O Hero continua estático, com a fotografia original.

## Como abrir

Na pasta do projeto, execute `python3 -m http.server 8000` e abra `http://localhost:8000`.
