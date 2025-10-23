# MCP — HEMS Workflow Builder

This repository hosts the implementation blueprint and project skeleton for the Home Energy Management System (HEMS) Workflow Builder. The platform enables drag-and-connect automation for residential energy orchestration with a strong emphasis on safety, determinism, and edge compatibility. The editor workspace is now scaffolded with a runnable Next.js + React Flow experience so you can begin implementing real features immediately.

## Repository structure

```
apps/
  editor/        # React Flow-based visual editor (Next.js)
  api/           # Orchestrator API (NestJS/FastAPI)
  edge/          # Edge runtime + Safety Gateway
packages/
  schema/        # Shared JSON Schemas and generated types
  engine/        # Flow engine, lints, simulator core
  connectors/    # Integrations (Home Assistant, OCPP, Modbus, tariffs, notifications)
docs/
  blueprint.md   # Detailed architecture and delivery plan
infra/
  docker-compose.yaml  # Data plane services (Postgres, Redis, MQTT, Timescale/Influx)
```

Each directory contains either documentation or starter code to guide subsequent implementation work. Refer to [`docs/blueprint.md`](docs/blueprint.md) for the authoritative design document that drives the build.

## Getting started

1. Install dependencies from the repository root:

   ```bash
   npm install
   ```

2. Launch the visual editor workspace (runs `apps/editor`):

   ```bash
   npm run dev
   ```

   The development server starts on [http://localhost:3000](http://localhost:3000) with a pre-configured React Flow canvas, hero section, and navigation towards the workbench and blueprint reference.

3. Review the [implementation blueprint](docs/blueprint.md) to understand the end-to-end architecture, execution semantics, and MVP scope.
4. Use the provided `docker-compose.yaml` skeleton to provision the supporting data services for local development once the orchestrator API and engine pieces are in progress.
5. Track progress against the MVP checklist to deliver the editor alpha, engine, safety gateway, connectors, and simulator in the first iteration.

## Contributing

- Keep JSON Schemas as the single source of truth for node configurations across editor, API, and edge runtimes.
- Enforce safety linting in CI to prevent deployment of unsafe flows.
- Ensure audit trails remain immutable and exportable for compliance needs.

The project is in its initial planning phase; contributions should focus on establishing the scaffolding, automated checks, and integration test harnesses that will keep the system reliable as functionality is added.
