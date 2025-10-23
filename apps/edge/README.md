# Edge runtime

The edge runtime executes compiled flows on the local CM4 gateway to guarantee deterministic, low-latency control even when the cloud is unavailable.

Responsibilities include:

- Running the lightweight Flow VM with deterministic scheduling and WAIT semantics.
- Applying the Safety Gateway policies locally (SoC/power/time guards, VPP lock).
- Maintaining a variable store cache and syncing context updates from the cloud when connectivity resumes.
- Providing a local API/CLI for diagnostics, approvals, and firmware updates.

> **Next steps:** Establish the runtime language (Node.js vs Python), define the bundle format received from the cloud compiler, and implement mocks for Home Assistant, OCPP, and inverter connectors.
