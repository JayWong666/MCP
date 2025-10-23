# Connectors package

Connector adapters encapsulate integrations with Home Assistant, EVSE/OCPP chargers, inverter/ESS APIs, tariff and forecast providers, and notification services.

Responsibilities:

- Provide unified interfaces (`HomeAssistantService`, `EvseService`, `InverterService`, etc.) for the engine and API.
- Manage protocol-specific details (WebSocket subscriptions, MQTT topics, Modbus registers, REST authentication).
- Expose simulators/mocks for local development and automated tests.

> **Next steps:** Document the minimum viable capabilities for each connector and prototype mock services that can be used in integration tests before connecting to real hardware.
