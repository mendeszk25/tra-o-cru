# Pendências reais de publicação — V15

### Necessárias antes de considerar o site totalmente validado

1. **Domínio oficial:** definir o endereço e colocar `canonical`, `og:url` e `og:image` com URL absoluta; conferir a imagem de compartilhamento. Não há domínio confirmado nos materiais.
2. **Instagram:** verificar no próprio celular/conta se `https://ig.me/m/traco.crudesign` abre o canal correto e testar a cópia da mensagem em HTTPS, incluindo bloqueio de pop-ups. O link ao perfil `https://www.instagram.com/traco.crudesign/` é usado como caminho direto alternativo.
3. **Teste visual com fontes reais:** especialmente Hero em 360/390/430/768/1024/1440/1920 px, pois a auditoria automatizada usou fontes fallback.
4. **Navegadores/dispositivos:** Firefox, Safari/iOS, teclado completo e tecnologias assistivas; além de um teste manual do diálogo e campo de contato.
5. **Dados comerciais:** confirmar informações sobre as obras, canal de retorno, disponibilidade e cursos antes de publicá-las.

### Melhorias dependentes da marca (não inventadas)

- Fotos profissionais das esculturas com 4:5 frontal, 3/4, macro da textura e escala; preservar fielmente as peças reais.
- Macro >= 2400 px para a seção Matéria; o recorte atual tem 379×706 px.
- Medidas, acabamento, disponibilidade e eventual encomenda de cada peça.
- Nome, trajetória e região de atendimento da criadora, se desejado.
- Cursos: formato, local, duração, materiais, datas e política de inscrição, quando confirmados.
- Fotos de peças reais em ambientes e imagens de processo artesanal, com autorização de uso.

### Técnicas posteriores

- Consolidação estrutural completa da folha CSS após testes de regressão em browser real; a V15 já consolidou a camada recente, mas não removeu todas as regras históricas.
- Lighthouse e Core Web Vitals **no domínio hospedado**; ajustar carregamento de fontes e imagens conforme medições reais.
- `sitemap.xml` após definir domínio; verificar SEO/social com ferramentas da hospedagem.
