# Shared schema package

This package centralises JSON Schemas and generated TypeScript types for flow nodes, flow definitions, execution traces, and connector payloads.

Guidelines:

- Author schemas in `/src/schemas` and export bundled versions for API, editor, and edge consumption.
- Generate TypeScript types (`zod-to-ts` or `json-schema-to-typescript`) and Python pydantic models during the build.
- Version schemas semantically to support backward-compatible migrations and template sharing.

> **Next steps:** Create the initial schema catalogue for core nodes (time window, price threshold, SoC guard, EVSE start/stop, wait, notify) and publish build scripts to sync consumers.
