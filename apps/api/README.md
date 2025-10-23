# Orchestrator API

The orchestrator exposes REST and WebSocket endpoints for flow management, linting, simulation, and runtime tracing. The MVP stack targets NestJS (TypeScript) or FastAPI (Python) with OpenAPI documentation generated automatically.

Core responsibilities:

- Flow CRUD (`/flows`), linting, simulation, enable/disable endpoints.
- Event bus integration (Redis Streams or MQTT) to dispatch execution tokens.
- Safety gateway coordination for static and runtime policy enforcement.
- Persistence into Postgres/Timescale for flows, versions, telemetry, and traces.

> **Next steps:** Decide on NestJS vs FastAPI, scaffold the service with modular architecture (flows, safety, simulation), and implement JSON Schema validation shared from `packages/schema`.
