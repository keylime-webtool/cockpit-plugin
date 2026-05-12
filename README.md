# cockpit-keylime-webtool

A [Cockpit](https://cockpit-project.org/) plugin that provides the Keylime Webtool monitoring dashboard inside the Cockpit web console.

## Overview

This plugin integrates the [Keylime Monitoring Dashboard](https://github.com/keylime-webtool) into Cockpit, providing a native system administration experience for monitoring Keylime remote attestation infrastructure. It communicates with `keylime-webtool-backend` (Rust/Axum) for all data.

## Architecture

```
Browser → Cockpit (:9090) → cockpit-bridge
    → cockpit.http() → keylime-webtool-backend (:8080)
    → websocket-stream1 → backend WebSocket (/ws/events)
```

## Prerequisites

- Cockpit >= 300
- `keylime-webtool-backend` running on localhost:8080
- Keylime installed (`/etc/keylime` must exist for the plugin to appear)

## Installation

### RPM (Fedora/RHEL)

```bash
sudo dnf install cockpit-keylime-webtool
```

### Development

```bash
npm install
npm run build
sudo ln -sfn $(pwd)/dist /usr/share/cockpit/keylime
```

Then open Cockpit at `https://localhost:9090` and look for "Keylime Webtool" in the sidebar.

## Development

```bash
npm run watch    # rebuild on file changes
npm run lint     # ESLint
npm run typecheck # TypeScript check
```

## Features

- Fleet dashboard with KPI overview
- Agent list with filtering, search, and detail views
- Attestation analytics (timeline, failures, incidents)
- Policy management (CRUD, versioning, impact analysis, two-person approval)
- Certificate monitoring (expiry tracking, chain validation)
- Alert management (severity, SLA, investigation workflow)
- Performance monitoring
- Audit log with hash chain verification
- Integration status monitoring
- Settings management

## Tech Stack

- React 18 + TypeScript (strict)
- PatternFly 6 (Cockpit-native UI)
- esbuild (Cockpit standard bundler)
- Zustand (client state) + TanStack React Query (server state)
- cockpit.http() + websocket-stream1 (Cockpit-native transport)

## License

Apache-2.0
