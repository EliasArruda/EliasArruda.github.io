# Landing pages estáticas

Quatro demonstrações fictícias em HTML/CSS/JS, sem backend:

| Caminho | Marca | Interações |
| --- | --- | --- |
| `/demos/barbearia/` | Barber & Co | Serviços, agendamento simulado, galeria, FAQ |
| `/demos/advocacia/` | Almeida & Associados | Áreas de atuação, contato simulado, FAQ |
| `/demos/culinaria/` | Sapore Cucina | Filtros do cardápio, reserva simulada, galeria |
| `/demos/pet/` | Paw & Care | Formulário em duas etapas, serviços, FAQ |

As demonstrações oferecem português e inglês, incluindo conteúdo, atributos acessíveis e feedback. Preços, equipes, endereços e horários são ilustrativos. Fotografias e fontes têm registros de origem e licença em `demo-kit/`. A página jurídica não apresenta resultados garantidos ou credenciais reais.

## Adicionar a quinta demo

1. Crie `demos/seu-slug/index.html` e `assets/style.css` com assets relativos. Use slug minúsculo com números/hífens; não use symlinks.
2. Crie `translations.json` com pares português → inglês, incluindo atributos acessíveis e metadados.
3. Inclua os scripts deferidos `assets/translations.js`, `assets/i18n.js` e `assets/interactions.js`, nessa ordem. Use as convenções de elementos `data-*` das demos existentes para reutilizar interações; acrescente CSS próprio.
4. Capture a página real e salve a imagem otimizada em `public/images/projects/seu-slug.webp`.
5. Registre em `src/data/projects.ts`: textos PT/EN, categoria `landing-page`, tipo `demo`, tecnologias, screenshot, `liveUrl: '/demos/seu-slug/'` e `embeddable: true`.
6. Execute build e testes; verifique URL direta e iframe nos dois idiomas, em desktop e tamanhos móveis.

`scripts/copy-demos.mjs` valida pastas/index, copia artefatos e kit compartilhado para `dist/demos/<slug>/assets` e incorpora fontes WOFF2 no CSS. Isso permite fontes locais no iframe de origem opaca. Não execute scripts de build provenientes dos dados cadastrados. Sites com gerador próprio devem gerar HTML estático antes da montagem ou adaptar o kit.

## Visualizador e formulários

Somente caminhos locais cadastrados entram no visualizador. O sandbox permite scripts, mas não acesso ao DOM/storage principal, submissões, popups ou navegação superior. Mantenha `allow-scripts` sem `allow-same-origin`.

Formulários validam campos e simulam feedback via JavaScript sem submissão ou requisição. Isso funciona dentro do sandbox e na URL direta. `interactions.js` fecha primeiro dialogs internos e encaminha Escape para o portfólio; o portfólio aceita mensagens somente do iframe ativo. O botão fechar e abertura em outra aba também estão disponíveis.

Publique somente o `dist` completo, em um artefato, pelo workflow existente. A URL direta compartilha a origem do portfólio; revise qualquer código novo antes de hospedá-lo.
