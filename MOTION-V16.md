# TRAÇO CRU — V16 / Immersive Editorial Motion

**Versão-base:** V15.5 com logo transparente. **Objetivo:** atualizar motion design do site inteiro preservando conteúdo, fotografia original, proporções e identidade visual.

## O que foi implementado

- **Hero:** coreografia de TRAÇO/CRU por máscaras direcionais, entrada do título por linhas, rótulos sincronizados e traço de luz no plano editorial. A fotografia do vaso não gira, não recebe parallax nem vídeo. A tipografia reage modestamente à rolagem nativa.
- **Manifesto:** transição por cortina de papel, revelação de texto em linhas, imagem com máscara vertical, desenho progressivo do traço SVG.
- **Criações:** aparição assimétrica da grade, máscaras sobre imagens, imagem e legendas responsivas a cursor, transição de abertura do modal mantida com View Transitions quando disponível.
- **Matéria:** revelação circular da imagem e entrada de controles, mantendo os limites do zoom original para evitar degradação de foto pequena.
- **Ateliê:** revelação da fotografia por máscara e texto por camadas, com assimetria entre imagens e narrativa.
- **Ambientes:** revelação de imagem direcional e composição textual em tempos distintos.
- **Cursos:** cortina cromática, tipografia monumental e desenho das nervuras SVG em sequência.
- **Contato:** revelação por linhas, campos em cascata, estados de foco e CTA com preenchimento dirigido.
- **Global:** nav mobile com entradas escalonadas, modais com entrada animada, rodapé editorial, indicadores/links magnéticos e microinterações.

## Arquitetura

- `motion.css` e `motion.js` são arquivos novos e independentes.
- `index.html` apenas importa os dois arquivos adicionais.
- `main.js` conserva funcionalidades (menu, formulários, diálogos, leitura); seu `IntersectionObserver` legado foi removido para não disputar transformações com o novo sistema.
- **Sem CDN, sem instalação de pacotes, sem dependências.** Web Animations API + IntersectionObserver + CSS e requestAnimationFrame, com verificação de suporte.
- Progressivo: o site permanece legível e interativo mesmo se `motion.js` falhar ou o usuário ativar `prefers-reduced-motion`.
- Sem scroll-jacking, sem animação da fotografia principal, sem mudar conteúdo/produtos, sem reconstrução 3D, sem alterar dados comerciais.

## Referências criativas consultadas

1. Codrops — [SVG Mask Transitions](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/): revelação em cortina e máscaras.
2. Codrops — [Dual Wave Typography](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/): direção de tipografia sincronizada.
3. Codrops — [Responsive Grid / Flip](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/): linguagem de galeria e continuidade espacial.
4. Codrops — [Images Within Type](https://tympanus.net/codrops/2024/04/02/on-scroll-expanding-image-animation-within-typography/): integração entre imagem e letras, adaptada para **não animar a escultura**.
5. [GSAP Highlights](https://tympanus.net/codrops/hub/gsap-highlights/): padrão de direção e movimento de alto nível.

As referências orientam os princípios, sem reutilizar código ou ativos de terceiros. Nesta versão as técnicas foram implementadas **nativamente**, não com GSAP.

## Como executar

Na pasta que contém `index.html`:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. A fonte original Cormorant Garamond / DM Sans depende de internet, como no projeto anterior.

## Verificações realizadas

- `node --check main.js` e `node --check motion.js` — sem erros de sintaxe.
- Chromium headless, com recursos incorporados em página temporária de teste (o ambiente bloqueia navegação para localhost/file): layout em 1440×900 e 390×844 sem overflow, efeitos ativados, sem exceções JS.
- Galeria abre modal nativo em Chromium; animação de View Transition pode adicionar pequeno intervalo antes do estado `open` ficar disponível.
- Menu mobile abre, com foco gerenciado por `main.js`.
- Com redução de movimento: a classe `motion-enabled` não é aplicada; conteúdo permanece visível.

## Limitações e próximo QA

- O **ambiente de renderização** não carrega Google Fonts; revisar tipografia em Firefox/Safari com fontes reais.
- Não foram medidos Core Web Vitals em produção nem desempenho de GPU em celulares físicos. Motion foi dimensionado para evitar reflow e rolagem artificial, mas dispositivos reais precisam validação.
- O Vimeo/CDN não é usado; todos os efeitos rodam sem dependências externas, exceto as fontes já existentes.
- Não houve alteração de domínio, links do Instagram ou informações comerciais.
- Os efeitos de entrada de cada seção são acionados uma vez; retorno de rolagem não reinicia todas as entradas. Os deslocamentos editoriais do Hero acompanham a rolagem de modo reversível.
