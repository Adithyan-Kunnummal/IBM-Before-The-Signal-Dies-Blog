# Before the Signal Dies: project site

Website for **Before the Signal Dies**, an AI-assisted disaster communications planning prototype that identifies Western Australian communities most vulnerable to mobile network outages during natural disasters. 2nd place at the IBM Z Datathon 2026 in Australia.

Built by Adi, Meer Daiyan Ahmed, Sanal Mehra and Sanika Rahman.

Built with [Astro](https://astro.build) and Tailwind CSS. Static output with no client-side JavaScript, deployed on Vercel.

## Pages

| Route | Source | What it is |
|---|---|---|
| `/` | `src/pages/index.astro` | Landing page: the problem, how it works, the index, scenario results (chart + table), the model, LinuxONE, data sources, limitations, the team |
| `/story` | `src/content/story/before-the-signal-dies.md` | The long-form write-up |
| `/404` | `src/pages/404.astro` | Not-found page |

Shared details (project name, event, team, repo and slides links) live in `src/site.config.ts`. Project figures (scenarios, model comparison, benchmark, data sources) live in `src/data/project.ts`, so the page, chart and tables stay in sync.

## Run locally

Requires Node 20+.

```sh
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check + build to dist/
npm run preview      # serve the built site
npm run check:links  # after a build: find broken internal links
npm run todos        # list every remaining [TODO: ...] placeholder
```

## Editing content

- **Write-up:** edit `src/content/story/before-the-signal-dies.md`. It's plain Markdown; the frontmatter fields are documented in `src/content.config.ts`.
- **Landing page:** the copy is in `src/pages/index.astro`; the numbers come from `src/data/project.ts`.
- **Repo or slides link:** set `repo` / `slides` in `src/site.config.ts` (the repo link appears in the hero, the closing section and the footer).
- **Images:** put images next to the write-up (e.g. `src/content/story/map.png`) and reference them in Markdown with alt text: `![Map of flagged localities](./map.png)`. Astro optimises them at build time.

## Placeholders

Any text written as `[TODO: something]`, whether in Markdown, frontmatter or a page, renders as a highlighted yellow marker, so unknown details are never mistaken for real ones. Run `npm run todos` to list them all, and replace each with the real detail (or remove it) before sharing the site widely.

## Social preview image

`public/og-default.png` is generated. Regenerate it after changing the name or event:

```sh
node scripts/make-og.mjs "Before the Signal Dies" "2nd place · IBM Z Datathon 2026"
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo, and accept the detected Astro settings (build `npm run build`, output `dist`).
3. Each push to `main` deploys to production. Other branches get preview URLs.

The canonical URL (used by the sitemap and Open Graph tags) is picked up from Vercel's production domain automatically. For a custom domain, add it in Vercel and set the environment variable `SITE_URL=https://your-domain`.

## Design notes

- One accent colour (teal), light and dark mode following the system setting, Geist font (self-hosted).
- Hover states: linked cards lift 2px, links draw an underline, buttons step up and press. All motion is disabled under `prefers-reduced-motion`.
- No IBM, Optus or Shooting Stars Foundation logos are used; names appear as plain text only.
- The scenario chart's two colours were checked for colour-blind separation and contrast in both light and dark mode; the full figures are also in a table beneath it.
