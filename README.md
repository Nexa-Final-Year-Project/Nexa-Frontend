# Nexa (Frontend)

A TypeScript + Next.js frontend for NEXA — an AI-driven project management suite optimized for Agile teams. The app provides project/task management UI, sprints, team collaboration, realtime updates, and rich-text editing.

## Features
- Modern landing + dashboard UI built with Next.js (App Router)
- Componentized UI: projects, tasks, sprints, teams, notifications
- Rich-text editing (TipTap) and markdown rendering
- Realtime updates via socket.io-client
- Integrations: Firebase, Stripe (optional)
- Theming and keyboard shortcuts, global state with Redux/Zustand

## Quick start

1. Clone and install
```bash
git clone https://github.com/Nexa-Final-Year-Project/Nexa-Frontend.git
cd Nexa-Frontend
npm install
```

2. Environment variables

Create a .env.local (or export in your environment). Required (at minimum):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000    # or NEXT_PUBLIC_BACKEND_URL
```

If you enable Firebase/Stripe or other integrations, add their respective public environment variables (Firebase config, Stripe publishable key, etc.). The middleware checks a cookie named `token` for authentication and posts to `${NEXT_PUBLIC_API_URL}/api/auth/verify-token` for verification.

3. Run development server
```bash
npm run dev
# Open http://localhost:3000
```

4. Build & start (production)
```bash
npm run build
npm start
```

## Project structure (high level)
- src/app — Next.js App Router routes and root layout (layout.tsx, page.tsx, middleware.ts)
- src/components — feature-based UI components (tasks, projects, teams, shared UI)
- src/services — API calls and service wrappers
- src/store — application state (Redux/Zustand)
- src/hooks, src/lib, src/theme — utilities and shared code
- public — static assets

## Common commands
- npm run dev — start dev server
- npm run build — build production artifacts
- npm start — run production server
- npm run lint — run ESLint
- npm run clean — lint fix and reinstall (project cleanup)

## Troubleshooting
- Authentication redirects to /login: ensure NEXT_PUBLIC_API_URL points to your backend and the `token` cookie is present and valid.
- Missing Firebase or Stripe features: confirm the required env vars are set and the corresponding services are enabled in your Firebase/Stripe dashboard.
- CSS or Tailwind issues: verify Tailwind/PostCSS config (tailwind.config.mjs, postcss.config.mjs) and rebuild with `npm run build`.

## Contributing
Contributions are welcome. Open issues or PRs for bug fixes, component improvements, or new integrations. Please follow existing code patterns (components organized by feature, use the Providers in src/app/layout.tsx).

## License
Add your project's license here.

## Contact
For questions about this repository, open an issue or contact the maintainers via the repo.
