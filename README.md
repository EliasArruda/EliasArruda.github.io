# Portfolio — Elias Arruda

Personal portfolio showcasing my projects and web development services.

## Technologies

- Vue 3
- TypeScript
- Vite

## Run locally

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Deployment

The project is automatically deployed to GitHub Pages after every push to the `main` branch.

## GitHub activity

`npm run build` / `pnpm run build` refreshes `src/data/github.json` from EliasArruda's public GitHub contribution calendar before compiling the site. No account token is used or included in the frontend. The calendar displays the fetch date and falls back to the last saved snapshot if GitHub is unavailable. To refresh the local preview manually:

```bash
node scripts/update-github.mjs
```

The existing GitHub Pages build uses the same refresh step. The data is a build-time snapshot, not a live feed.

## Motion and appearance

Light/dark selection is stored locally. The site initially follows the system preference. The skill orb pauses outside the viewport, when the tab is hidden, when the pause button is selected, or when reduced motion is enabled. The hero uses the same pause and reduced-motion preferences.

## Vitrine de projetos

`src/data/projects.ts` centraliza os projetos e os textos em português/inglês. `ProjectGallery`, `ProjectTabs`, `ProjectCard` e `LandingPagePreview` compõem a seção. Os projetos profissionais existentes foram preservados; Landing Pages começa com estado vazio e contato real em `#contato`.

O visualizador usa um dialog nativo para foco e teclado, bloqueia o scroll do documento, restaura o foco ao fechar e desmonta o único iframe. Tablet e celular usam larguras reais de 768 e 390 px; telas menores permitem rolagem horizontal. A prévia tem indicador de carregamento e opção de abrir em nova aba.

Veja [demos/README.md](demos/README.md) para adicionar artefatos, configurar caminhos e entender o sandbox. `pnpm run build` atualiza a atividade GitHub, verifica tipos, gera o portfólio e monta as demos no mesmo `dist`. O workflow do Pages permanece único e publica após mudanças na `main`. `pnpm run check` verifica tipos; este projeto não possui lint configurado.

### Validação deste incremento

Build, tipos e `git diff --check` passaram. Testes Chromium com fixture temporária verificaram abas, teclado, interação e isolamento do iframe, larguras reais 768/390, Escape no modal e via bridge, foco restaurado, bloqueio de scroll, desmontagem, URLs e assets aninhados. Capturas foram inspecionadas em 1440/390/320 px. Após remover a fixture, o build final, o estado vazio, o contato e os dois projetos existentes foram verificados novamente. Não há lint configurado. A publicação remota fica para o workflow após merge; o próximo passo de conteúdo é adicionar uma demo real seguindo `demos/README.md`.
