# Demonstrações estáticas

Esta pasta contém somente artefatos estáticos prontos para publicação, nunca código-fonte Nuxt.
Não há demonstrações comerciais cadastradas atualmente.

## Adicionar uma landing page

1. Gere o site estático. Para Nuxt, configure `app.baseURL: '/demos/seu-slug/'` e execute `nuxt generate`.
2. Copie o conteúdo gerado de `.output/public/` para `demos/seu-slug/`. Para HTML simples, coloque `index.html` e assets relativos nessa pasta.
3. Inclua um screenshot otimizado em `public/images/projects/seu-slug.webp`.
4. Cadastre o projeto em `src/data/projects.ts`, com título e descrição em `pt` e `en`, `category: 'landing-page'`, tipo `demo` ou `client`, tecnologias, imagem, `liveUrl: '/demos/seu-slug/'` e `embeddable: true`.
5. Execute `pnpm run build` e teste a URL direta e o visualizador em `pnpm run preview`.

O build copia `demos/<slug>/` para `dist/demos/<slug>/`, exige `index.html`, rejeita symlinks e não altera o restante do portfólio. Use slugs com letras minúsculas, números e hífens. Assets e links precisam ser relativos ou incluir `/demos/<slug>/`; URLs absolutas na raiz não ganham prefixo automaticamente. Não dependa de fallback SPA: cada rota precisa de HTML estático gerado.

O pipeline existente publica apenas `dist`, em um único artefato. Não publique demos separadamente sobre o mesmo site. Projetos com build próprio devem gerar seus artefatos antes da etapa de montagem, sem instalar dependências ou executar scripts arbitrários a partir dos dados cadastrados.

## Permissões da prévia

Somente URLs locais registradas no formato `/demos/<slug>/` entram no visualizador. O sandbox permite scripts, mas mantém origem opaca: não libera acesso ao DOM/storage do portfólio, formulários, popups ou navegação do documento principal. Não adicione `allow-same-origin` junto de `allow-scripts` para conteúdo da mesma origem.

Recursos que dependem dessas permissões podem precisar de adaptação ou da opção “Abrir em nova aba”. Escape fecha o modal quando o foco está no documento principal. Eventos de teclado dentro do iframe não atravessam a fronteira do documento; o botão fechar continua acessível por Tab. Não contorne políticas de incorporação externas. Audite todo artefato antes de hospedá-lo: a URL direta compartilha a origem do portfólio.

Para Escape também funcionar quando o foco está dentro da demo, inclua este bridge no HTML gerado. O portfólio aceita a mensagem somente do iframe ativo. Isso não concede permissões de origem.

```html
<script>
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && window.parent !== window) {
    window.parent.postMessage('portfolio-preview:close', location.origin);
  }
});
</script>
```
