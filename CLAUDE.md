# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**cockpit-keylime-webtool** is a [Cockpit](https://cockpit-project.org/) plugin that provides the Keylime Webtool monitoring dashboard inside the Cockpit web console. It communicates with `keylime-webtool-backend` (Rust/Axum on `:8080`) — it does **not** talk to Keylime verifier/registrar directly.

## Architecture

```
Browser → Cockpit (:9090) → cockpit-bridge
    → cockpit.http({ port: 8080 }) → keylime-webtool-backend REST API
    → websocket-stream1 channel    → keylime-webtool-backend WebSocket (/ws/events)
```

- **REST**: All API calls go through `cockpit.http()` — the bridge proxies server-side. Never use `fetch()` or `XMLHttpRequest` (Cockpit CSP blocks them).
- **WebSocket**: Uses `cockpit.channel({ payload: "websocket-stream1" })` instead of browser `WebSocket`.
- **Auth**: Cockpit PAM session handles user authentication. Backend auth uses mTLS certs managed by cockpit-bridge.
- **Routing**: `cockpit.location` (hash-based) — no React Router.
- **Theming**: Inherited from Cockpit shell (OS-level dark/light).

## Build & Dev Commands

```bash
npm install                           # install dependencies
npm run build                         # production build (dist/)
npm run watch                         # dev build with file watching
npm run typecheck                     # TypeScript type check (tsc --noEmit)
npm run lint                          # ESLint
sudo ln -sfn $(pwd)/dist /usr/share/cockpit/keylime   # dev-install symlink
```

## Tech Stack

- **React 18** + **TypeScript** (strict, no `any`)
- **PatternFly 6** exclusively (visual consistency with Cockpit core)
- **esbuild** for bundling (not Vite/webpack)
- **Zustand** for client state, **TanStack React Query** for server state
- **cockpit.js** loaded as global via `<script>` tag; typed via `src/types/cockpit.d.ts`

## Key Constraints

- No `eval()`, `innerHTML`, or dynamic script injection
- No direct HTTP calls — always `cockpit.http()` or `websocket-stream1`
- No React Router — use `cockpit.location.go()` for navigation
- All domain types in `src/types/` mirror the standalone frontend types exactly (same backend contract)
- API modules in `src/api/` wrap `cockpit.http()` and unwrap the backend's `{ success, data, error, timestamp, request_id }` envelope
- RPM installs to `/usr/share/cockpit/keylime/`

## Related Repositories

| Repository | Role |
|------------|------|
| `keylime-webtool-backend` | REST + WebSocket API server; consumes Keylime APIs via mTLS |
| `keylime-webtool-frontend` | Standalone React SPA dashboard (shares types/API contract) |
| `keylime-webtool-doc` | SRS specification and architecture docs |

## License

Apache-2.0
