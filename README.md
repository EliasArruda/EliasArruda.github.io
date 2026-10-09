# Portfólio — Elias Arruda

Portfólio Vue 3 + TypeScript + Vite com apresentação, **Built by me**, serviços e contato. O layout original foi preservado, com Feitos por mim imediatamente abaixo de Me. Idiomas português/inglês, temas claro/escuro e tecnologias representadas por ícones acessíveis.

A vitrine preserva os dois projetos profissionais (Voxen e VeyraScreen) e reúne quatro marcas fictícias: Barber & Co, Almeida & Associados, Sapore Cucina e Paw & Care. Cada demonstração tem composição própria com PT/EN, navegação responsiva e interações locais. Formulários simulam respostas; não enviam dados nem realizam reservas.

## Executar e verificar

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run preview --host 127.0.0.1
pnpm exec playwright install chromium
pnpm test
```

Com Chromium instalado no sistema: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm test`.

`pnpm run check` verifica tipos. Não há lint configurado. Os testes verificam formulários, filtros, galeria, menus, responsividade em 1440/768/390/320 px, hierarquia e isolamento do visualizador, Escape, foco e scroll. As capturas dos cards vêm das páginas renderizadas.

## Estrutura e publicação

`src/data/projects.ts` centraliza os projetos; `src/components/projects/` implementa a vitrine e o dialog. [demos/README.md](demos/README.md) explica artefatos e extensões. `demo-kit/` reúne comportamento compartilhado, fontes e registros de origem/licença das fotografias Unsplash.

O build atualiza `src/data/github.json` usando o calendário público, com fallback ao último snapshot; nenhum token é incluído no frontend. Depois verifica tipos, compila Vue e monta as quatro demos em um único `dist`. O workflow verifica PRs e publica no GitHub Pages após push na `main`. Não há publicação por abertura do PR.

O visualizador carrega um único iframe sob demanda, com sandbox `allow-scripts`, fonte incorporada, tamanhos reais desktop/tablet/celular . Ao fechar, desmonta o iframe e restaura foco e scroll. A seleção de idioma e tema do portfólio é armazenada localmente. As demos herdam o idioma via `?lang=pt` ou `?lang=en` e também oferecem seleção própria.

Os cards de serviços usam superfícies na paleta existente. O fundo estrelado das tecnologias respeita pausa, visibilidade da página e reduced motion. GitHub Activity exibe calendário sem números nas células, total e dias ativos calculados do snapshot público. O contato mantém o formulário e o link de e-mail com rótulo, sem endereço exposto no texto.
