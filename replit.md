# OPOAD Nexus Core

Global AI News & Creator Platform — intelligence, automation & orchestration.

## Stack

- **React 19** + **TanStack Start** (SSR, file-based routing via TanStack Router)
- **Vite 8** with `@lovable.dev/vite-tanstack-config`
- **Tailwind CSS v4**
- **Supabase** — auth and database (`@supabase/supabase-js`)
- **Google Gemini AI** — `@google/genai` (server-side)
- **Three.js / React Three Fiber** — 3D globe
- **Radix UI** — full shadcn/ui component library
- **Framer Motion** — animations
- **Better Auth** — authentication layer

## Required environment secrets

Set these in Replit Secrets before running:

| Secret | Where to get it |
|---|---|
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |
| `VITE_SUPABASE_URL` | Supabase project → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase project → Settings → API |

## Running the app

```bash
npm install   # install dependencies
npm run dev   # start dev server on port 5000
```

The **Start application** workflow in Replit runs `bun run dev -- --port 5000 --host 0.0.0.0`.

## Project structure

```
src/
  routes/         # File-based routes (TanStack Router)
  components/
    dashboard/    # Main dashboard components (TopNav, ModuleCard, Scene, etc.)
    ui/           # shadcn/ui component library
  lib/            # Supabase client, AI functions, auth, settings context
  assets/         # Static assets (earth texture)
supabase/         # Supabase config
```

## Notes

- Originally built on [Lovable.dev](https://lovable.dev) — avoid force-pushing or rebasing published commits (see AGENTS.md).
- The app will error on startup if the three required secrets above are not set.

## User preferences

<!-- Add user preferences here -->
