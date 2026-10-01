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
