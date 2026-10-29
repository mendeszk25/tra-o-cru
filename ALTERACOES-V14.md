# Traço Cru Design — V14 (refinamento da V13)

Base: V13. Alterações orientadas pela auditoria V13→V14.

## Aplicado
- Hero: removido o `srcset` que selecionava o recorte HD com textura divergente; usa exclusivamente a fotografia do poster já disponível. O arquivo HD questionado foi retirado do pacote.
- Hero: regras de composição ajustadas para melhorar a leitura das letras do wordmark e encaixar o ponto, com ajustes especiais para mobile e celular deitado.
- Acessibilidade: contraste dos rótulos auxiliares elevado; áreas clicáveis no menu e slider ampliadas; foco inicial do menu mobile reforçado após transição.
- Modais: bloqueio de scroll do fundo enquanto um diálogo está aberto; foto no modal ajustada para `object-fit: contain`.
- Contato: ação “Copiar e abrir Instagram”, além de botão somente copiar e link direto independente. Nada é enviado automaticamente.
- Formulário: seta visual para o select.
- Matéria: ampliação máxima reduzida a 1,10x, imagem sem preenchimento por esticamento e remoção da vista inteira duplicada, até existir macro de alta resolução.
- Conteúdo: slogans exibidos como declarações, sem aspas que simulem depoimentos.
- Galeria: removida segunda imagem do vaso que era apenas outro recorte da mesma tomada.
- Compartilhamento: imagem OG substituída por uma composição simples criada com a imagem fiel e texto; definir URL absoluta após conhecer o domínio.

## Pendente por depender da marca / meios não disponíveis
- Novas fotografias, macros, dados verdadeiros das peças e dos cursos, domínio oficial e contato alternativo.
- Validar o `ig.me/m/traco.crudesign` na conta oficial.
- Revisão manual fina do Hero com as fontes reais, particularmente em 768, 1440 e 1920 px.
- Testes reais de Firefox, Safari, leitor de tela e Lighthouse de produção.
- Consolidar profundamente os blocos de CSS: preferimos preservar a cascata existente nesta versão para evitar regressões sem teste visual completo.

## Testes realizados
- Sintaxe JavaScript: `node --check main.js` sem erro.
- Arquivos presentes e links internos verificados estaticamente.
- O navegador de testes do ambiente recusou acesso a localhost (net::ERR_BLOCKED_BY_ADMINISTRATOR). Portanto não afirmamos validação visual ou de interação por navegador nesta rodada.
