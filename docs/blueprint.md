# HEMS Workflow Builder — Implementation Blueprint (v1)

This document consolidates the implementation blueprint for the Home Energy Management System (HEMS) Workflow Builder. It formalises the design goals, system architecture, execution semantics, and delivery roadmap that guide the initial build of the orchestration platform.

## 0. Design goals

- **Human-readable logic** so that flows translate to natural language (e.g. “06:00 → low price → charge battery to 80%”).
- **Safety first** by enforcing hard limits, VPP locks, and compile-time linting to prevent unsafe automations.
- **Deterministic and real-time** execution with sub-second reactions to events and explicit wait semantics.
- **Local-first option** that allows critical flows to run on an edge gateway (HA/CM4) when offline.
- **Auditability** through full execution traces, revertible versions, and approval workflows.

## 1. High-level architecture

```
[Browser UI (React/TS + React Flow)]
   │  REST/WebSocket
   ▼
[Orchestrator API (NestJS/FastAPI)] ———— [Safety Policy Gateway]
   │        │                              │
   │        ├— [Scheduler/Timer]           ├— Static Lints (compile-time)
   │        ├— [Event Bus] (MQTT/Redis)    └— Runtime Guards (SoC/Power/Time)
   │        ├— [Rule Engine / Flow VM]
   │        └— [Execution Tracer]
   │
   ├— [State Store] Postgres (flows, nodes, versions)
   ├— [TSDB] Timescale/Influx (telemetry: PV, load, SoC, tariff)
   ├— [Cache] Redis (debounce, tokens, variable store)
   └— [Connectors]
        ├— Home Assistant (WS/MQTT)
        ├— EVSE (OCPP 1.6J/2.0.1 + vendor REST)
        ├— Inverter/ESS (Modbus RTU/TCP, vendor APIs e.g., HaiPower)
        ├— Tariffs (EPEX-like), PV Forecast (Solcast/Forecast.Solar), Weather
        └— Notifier (App push/WeChat/HA persistent_notification)
```

### Edge mode

A lightweight Flow VM and Safety Gateway run on the CM4 gateway. The cloud compiler ships signed bundles to the edge for offline execution.

## 2. Data model and schemas

### 2.1 Flow object

```ts
interface Flow {
  id: string;
  name: string;
  version: number;
  enabled: boolean;
  priority: number;
  tags?: string[];
  createdBy: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
  variables?: VarDecl[];
  safetyProfileId?: string;
}
```

### 2.2 Common node shape

```ts
interface Node<TParams = any> {
  id: string;
  type: NodeType;
  label: string;
  params: TParams;
  io: { inputs: Port[]; outputs: Port[] };
  guards?: Guards;
  logging?: { enabled: boolean; level: 'info'|'audit'|'none' };
  ui?: { x: number; y: number; w?: number; h?: number; icon?: string; theme?: 'light'|'dark' };
}

interface Edge {
  id: string;
  from: { nodeId: string; port: string };
  to:   { nodeId: string; port: string };
  label?: string;
  kind?: 'default'|'conditional'|'error'|'timeout';
}

interface Guards {
  rateLimit?: { windowSec: number; maxExec: number };
  timeWindow?: { start: string; end: string; days?: number[] };
  requiresConfirm?: boolean;
}
```

### 2.3 Variable store scopes

The runtime exposes **global**, **flow**, **runtime**, and **device** scopes with atomic operations such as `get`, `set`, `incr`, `decr`, and `compareAndSwap`.

### 2.4 Node catalogue

Node types are grouped as:

- **Conditions**: time window, price threshold, weather, battery SoC/state, load status, device state, manual switches, VPP control state.
- **Actions**: EVSE start/stop, set battery targets, switch HEMS mode, device control, load prioritisation, generator control, notifications.
- **Flow control**: loop, wait, pause, jump.
- **Safety**: SoC min/max, frequency limits, charge/discharge power, allowed time windows, confirmation, VPP lock.
- **Variables**: declare, set, test variables, call external APIs/HA and store results.

Each node type ships with a JSON Schema leveraged by the UI, API validation, and the edge runtime.

## 3. Execution semantics

1. **Event-driven**: the engine subscribes to entity topics (price, SoC, PV, load, device states). Time nodes schedule triggers via a timer.
2. **Evaluation model**: supports level-triggered and edge-triggered conditions, hysteresis/debounce controls, wait-until semantics with timeout edges, and loop constructs that guarantee idempotency.
3. **Conflict and concurrency**: per-device exclusive tokens, optional preemption based on flow priority, and arbitration policies (e.g., last-writer-wins within a window unless blocked by safety).
4. **Traceability**: every node visit emits an `ExecutionTrace` with timestamps, inputs, outputs, and decisions.

## 4. Safety Policy Gateway

- **Static lints** check SoC bounds, power caps, time-window overlaps, potential infinite loops, missing terminal actions, ignored VPP locks, and missing confirmations before a flow is enabled.
- **Runtime guards** query live context (SoC, temperature, grid limits, VPP state). Violations block actions, emit `SAFETY_BLOCKED`, and direct execution to error edges or manual confirmations.
- **Approvals** allow high-impact actions to require in-app confirmation, SMS OTP, or Home Assistant acknowledgements.

## 5. UI and UX

Key interface regions:

- **Left palette** of node cards grouped by category with search.
- **Canvas** with pan/zoom, snap-to-grid, alignment guides, swimlanes, and minimap.
- **Inspector** that auto-generates forms from JSON Schema, performs live validation, tests sensor values, and previews evaluation hints.
- **Top bar** offering simulate, enable/disable, versioning, sharing, and lint warnings.
- **Bottom console** that shows execution logs, variable watches, and breakpoints.

Card visuals use rounded rectangles with status chips, inline parameter pills, and labelled ports (TRUE/FALSE, error, timeout). Config popovers provide tooltips, AI assistance, unit-aware inputs, and live test buttons.

Simulation supports time travel across historical telemetry, overlays PV/price charts, step-through execution, variable timelines, and exportable reports. Templates enable sharing common flows (e.g., “Night charge to 80%”, “PV pre-cooling”, “Storm prep reserve”).

## 6. Connectors

- **Home Assistant** via WebSocket subscriptions for updates and MQTT for commands.
- **EVSE/OCPP** abstraction with methods such as `start`, `stop`, and `setChargingProfile`.
- **Inverter/ESS** adapters for Modbus and vendor REST APIs to set battery targets and modes.
- **Tariffs & Forecasts** aggregating spot/day-ahead prices, PV forecasts, and weather data.
- **Notifications** using app push, WeChat, Home Assistant persistent notifications, or email.

## 7. API surface (sketch)

- `POST /flows`, `PUT /flows/:id`, `POST /flows/:id/lint`, `POST /flows/:id/simulate`
- `POST /exec/:id/enable|disable`, `GET /exec/:id/traces?since=`
- `GET /context`, `POST /variables`

## 8. Example node schemas

Example JSON Schemas:

```json
{
  "$id": "node.priceBelow",
  "type": "object",
  "properties": {
    "threshold": {"type": "number", "minimum": 0},
    "source": {"enum": ["current", "forecast"]},
    "holdMinutes": {"type": "integer", "minimum": 0}
  },
  "required": ["threshold", "source"]
}
```

```json
{
  "$id": "node.evseStart",
  "type": "object",
  "properties": {
    "stationId": {"type": "string"},
    "maxKW": {"type": "number", "minimum": 0},
    "limitMinutes": {"type": "integer", "minimum": 0},
    "requiresConfirm": {"type": "boolean"}
  },
  "required": ["stationId"]
}
```

```json
{
  "$id": "node.socGuard",
  "type": "object",
  "properties": {
    "min": {"type": "number", "minimum": 0, "maximum": 100},
    "max": {"type": "number", "minimum": 0, "maximum": 100}
  },
  "required": ["min"]
}
```

## 9. Example flows

### Night charge to 80%

```json
{
  "name": "Night charge to 80%",
  "priority": 5,
  "nodes": [
    {"id":"n1","type":"condition","label":"Time 23:00–06:00","params":{"window":{"start":"23:00","end":"06:00","days":[1,2,3,4,5,6,0]}}},
    {"id":"n2","type":"condition","label":"Price < 0.10","params":{"source":"current","threshold":0.10,"holdMinutes":5}},
    {"id":"n3","type":"action","label":"Start EVSE (max)","params":{"stationId":"garage","maxKW":7.0}},
    {"id":"n4","type":"wait","label":"Wait SoC ≥ 80%","params":{"until":{"signal":"battery.soc","op":">=","value":80},"timeoutMin":360}},
    {"id":"n5","type":"action","label":"Stop EVSE","params":{"stationId":"garage"}},
    {"id":"g1","type":"safety","label":"SoC ≥ 15% reserve","params":{"min":15}},
    {"id":"g2","type":"safety","label":"VPP lock","params":{"respectVppLock":true}}
  ],
  "edges": [
    {"id":"e1","from":{"nodeId":"n1","port":"true"},"to":{"nodeId":"n2","port":"in"}},
    {"id":"e2","from":{"nodeId":"n2","port":"true"},"to":{"nodeId":"n3","port":"in"}},
    {"id":"e3","from":{"nodeId":"n3","port":"out"},"to":{"nodeId":"n4","port":"in"}},
    {"id":"e4","from":{"nodeId":"n4","port":"done"},"to":{"nodeId":"n5","port":"in"}},
    {"id":"e5","from":{"nodeId":"g1","port":"guard"},"to":{"nodeId":"n3","port":"guard"}},
    {"id":"e6","from":{"nodeId":"g2","port":"guard"},"to":{"nodeId":"n3","port":"guard"}}
  ]
}
```

### PV pre-cooling

```json
{
  "name": "PV pre-cooling",
  "nodes": [
    {"id":"c1","type":"condition","label":"PV forecast > 5kW","params":{"signal":"pv.forecast","op":">","value":5}},
    {"id":"c2","type":"condition","label":"Temp > 28°C","params":{"signal":"weather.temp","op":">","value":28}},
    {"id":"a1","type":"action","label":"AC ON","params":{"deviceId":"ac.living","mode":"cool","powerKW":1.5}},
    {"id":"w1","type":"wait","label":"Wait 2h","params":{"durationMin":120}},
    {"id":"a2","type":"action","label":"AC OFF","params":{"deviceId":"ac.living"}}
  ],
  "edges": [
    {"id":"e1","from":{"nodeId":"c1","port":"true"},"to":{"nodeId":"c2","port":"in"}},
    {"id":"e2","from":{"nodeId":"c2","port":"true"},"to":{"nodeId":"a1","port":"in"}},
    {"id":"e3","from":{"nodeId":"a1","port":"out"},"to":{"nodeId":"w1","port":"in"}},
    {"id":"e4","from":{"nodeId":"w1","port":"done"},"to":{"nodeId":"a2","port":"in"}}
  ]
}
```

## 10. Starter stack and repo layout

```
apps/
  editor/ (Next.js + React Flow + shadcn/ui + Tailwind + Framer Motion)
  api/    (NestJS or FastAPI; Zod/JSONSchema; OpenAPI docs)
  edge/   (Python/Node Flow VM + Safety Gateway; HA/OCPP adapters)
packages/
  schema/ (shared JSONSchemas + TS types)
  engine/ (execution core, lints, simulator)
  connectors/ (ha, ocpp, modbus, tariffs, pv, notifier)
infra/
  docker-compose.yaml (Postgres+Timescale, Redis, MQTT, Influx optional)
```

## 11. Simulator

The simulator replays telemetry from the TSDB, feeds it into the engine with deterministic seeds, and exports simulation reports (CSV/JSON) containing node decisions and energy/cost deltas. It powers A/B testing of templates and investor demos.

## 12. MVP scope (6–8 weeks)

1. Editor alpha.
2. Core nodes (time window, price threshold, SoC guard, EVSE start/stop, device on/off, wait, notify).
3. Engine v1 (event bus, scheduler, guards, execution trace).
4. Safety v1 (static lints + SoC/power/time windows, VPP lock check).
5. Connectors v1 (HA, EVSE, tariffs + PV forecast).
6. Simulate v1 (replay last 24h, step-through UI).
7. Templates (Night charge, PV pre-cooling).

## 13. Next steps

- Generate the React editor skeleton with React Flow nodes and auto-forms from JSON Schema.
- Stand up the Orchestrator API and Edge VM stubs that execute against mock devices.
- Integrate Home Assistant and OCPP adapters in a sandbox with a fake home profile.
- Produce a Night-charge demo with live tracing and safety block examples.
