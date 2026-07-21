# OPOAD Dashboard

A futuristic AI command center dashboard with a 3D globe, animated module cards, and a sci-fi dark theme.

## Stack

- **React 19** + **TanStack Start** (file-based routing via TanStack Router)
- **Vite 8** with `@lovable.dev/vite-tanstack-config`
- **Tailwind CSS v4**
- **Three.js / React Three Fiber** — 3D globe in the center panel
- **Radix UI** — full shadcn/ui component library
- **Framer Motion** — animations
- **Bun** — package manager and runtime

## Running the app

```bash
bun run dev
```

The dev workflow is configured to run on port 5000. Use the **Start application** workflow in Replit.

## Project structure

```
src/
  routes/         # File-based routes (TanStack Router)
  components/
    dashboard/    # Main dashboard components (TopNav, ModuleCard, Scene, etc.)
    ui/           # shadcn/ui component library
  lib/            # Utilities, settings context, error handling
  assets/         # Static assets (earth texture)
```

## Notes

- This project was originally built on [Lovable.dev](https://lovable.dev) — avoid force-pushing or rebasing published commits (see AGENTS.md).
- No backend or external API keys are required — it's a pure frontend app.

## User preferences

<!-- Add user preferences here -->
