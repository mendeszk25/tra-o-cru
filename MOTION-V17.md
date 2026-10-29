# TRAÇO CRU DESIGN — V17 / MOTION DIRECTOR’S CUT

Base: V16. Preservados o layout aprovado, a imagem **estática e fiel** da escultura, a marca transparente, as funcionalidades comerciais e todas as seções.

## O que mudou

1. **Correção fundamental de tempo:** entradas V16 agora começam quando o conteúdo realmente chega à tela (o observador anterior disparava até 35% da altura da viewport antes). Isso torna as animações visíveis e evita que se esgotem antes de o usuário chegar.
2. **Dois cortes cinematográficos de papel:** painéis inclinados abrem o Manifesto e Cursos, com ritmos diferentes por desktop/mobile. São transitórios, não cobrem o site permanentemente.
3. **Trilhos editoriais de capítulos no desktop:** indicador lateral discreto e não interativo mostra seção atual e progresso narrativo. Desaparece em telas pequenas.
4. **Galeria com molduras cinematográficas:** em desktop, bordas aparecem, a legenda OBSERVAR entra e uma luz fotográfica suave acompanha o cursor sobre o enquadramento, sem mudar a textura dos objetos. Em touch, resposta de pressão física.
5. **Linhas desenhadas:** dois traços SVG artesanais surgem quando os títulos de Criações e Contato entram na viewport.
6. **Motion scroll:** deslocamentos tipográficos mais expressivos no Hero e detalhes em Matéria, Ateliê e Cursos, sem mover a foto do produto.
7. **Fotografias editoriais:** a moldura (não a escultura do Hero) ganha uma revelação de câmera nas seções de Manifesto, Ateliê e Ambientes no desktop.
8. **Acessibilidade:** reduzido/desativado com `prefers-reduced-motion`; não há pinning, scroll-jacking ou movimento do produto principal.

## Arquivos

- `motion.js`: coreografias da V16, com trigger corrigido.
- `motion.css`: animações da V16.
- `motion-v17.js`, `motion-v17.css`: melhorias V17 separadas e opcionais.
- `main.js`, `styles.css`, imagens e conteúdo originais permanecem preservados.

## Testes realizados

- Chromium headless com recursos incorporados (ambiente bloqueia navegação para localhost).
- Geometria e principais interações confirmadas em 1440×900, 414×896, 390×844, 768×1024, 844×390; sem overflow horizontal.
- Verificação adicional de 320×568, 360×740, 430×932 e 600×900: sem overflow ou exceções JS, menu e modais OK.
- Captura animada de desktop e mobile fornecida separadamente.
- São testes de laboratório. Firefox real, Safari, aparelhos físicos e performance em produção continuam pendentes.

## Execução local

Extraia o ZIP e execute na pasta `traco-cru-design-site`:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

## Acessibilidade e fallback

Se o JS falhar, todos os textos e imagens continuam presentes. Para ver o estado estático, use o navegador com preferência por movimento reduzido. Nenhuma animação representa envio bem-sucedido de mensagem.

## Próximos testes recomendados

Validar no Firefox e Safari reais (fontes externas, suavização de masks, comportamento ao alternar preferências de movimento); confirmar fluidez em celular intermediário antes de publicar.
