# TRAÇO CRU DESIGN V17.1 — Motion refinado

Versão baseada na V17, preservando HTML, fotografia original da escultura, logo, cores, conteúdo, posição das camadas do Hero e fluxos de navegação.

## Ajustes realizados

- Removidos os **dois painéis opacos diagonais** que encobriam Manifesto e Cursos. No lugar, há uma linha luminosa estreita no topo das seções, ativada quando o título entra no campo visual. Ela não bloqueia a leitura, não captura cliques e não interfere no scroll.
- Desativada a cortina de papel opaca herdada da V16, para evitar conflitos entre camadas.
- Retirado o `filter: blur()` da entrada da tipografia e da marca monumental; reduzi deslocamentos e intensidades excessivas, mantendo máscaras, escalas, stagger e personalidade do motion.
- Encurtados atrasos/durações para impedir a sensação de conteúdo que demora a aparecer. `fill: backwards` mantém a entrada estável durante atrasos, evitando o piscar antes do início.
- O gatilho principal passa a observar **o conteúdo real** de cada seção (título/bloco editorial), não apenas os primeiros 3% de seções altas. Imagens, cards e o estudo de materialidade mantêm observadores independentes.
- Ao rolar rapidamente, animações cujos elementos já saíram da tela são finalizadas em seu estado normal. Isso evita a sobreposição temporal de várias cenas quando o usuário percorre o site rapidamente.
- Coreografia de desktop e mobile preservada, com layout sem novas alterações e fotografia do produto sempre estática.

## Como executar

Abra um terminal na pasta `traco-cru-design-site` e rode:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000` no navegador. Não é necessário instalar bibliotecas externas de animação.

## Testes realizados

- Verificação de sintaxe: `node --check` para `main.js`, `motion.js` e `motion-v17.js`.
- Chromium automatizado, via página temporária com CSS/JS/imagens incorporados devido ao bloqueio de URLs locais no ambiente.
- Nove viewports: 320×568, 360×740, 390×844, 414×896, 768×1024, 844×390, 1024×768, 1440×900, 1920×1080. Nenhum overflow horizontal observado.
- Sem erros JavaScript observados na bateria de testes.
- Abertura e Escape de modal de peça, abertura e Escape do menu móvel.
- `prefers-reduced-motion: reduce`: sistema cinematográfico não é ativado.
- Verificação dos elementos antigos `.tc-scene-gate`: zero presentes. A nova linha tem até 7 px de altura.

## Limites

- Testes automatizados não substituem teste com fontes carregadas no Firefox do usuário, Safari/iOS e dispositivos físicos.
- Não foram medidas métricas reais de Core Web Vitals em hospedagem.
- Não se alterou o conteúdo comercial nem os canais de contato.
