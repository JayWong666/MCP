# Engine package

The engine hosts the flow execution virtual machine, static lint rules, simulator, and trace emitters shared between the cloud orchestrator and the edge runtime.

Primary components:

- **Runtime core** that evaluates nodes, manages execution tokens, and coordinates WAIT/loop semantics.
- **Safety adapters** that interface with the Safety Policy Gateway for compile-time and runtime guards.
- **Simulator** capable of replaying telemetry and emitting detailed reports for time-travel debugging.
- **Testing utilities** to assert determinism, concurrency guarantees, and safety rule enforcement.

> **Next steps:** Define the runtime state machine abstractions, implement lint scaffolding for SoC/power/time checks, and create simulator inputs for the reference templates.
