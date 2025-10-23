# Infrastructure

The `docker-compose.yaml` file provisions the supporting data services required for local development and simulation.

| Service     | Purpose                                      | Notes |
|-------------|----------------------------------------------|-------|
| `postgres`  | Stores flows, node definitions, versions     | Default credentials `hems`/`hems` |
| `timescaledb` | Timeseries telemetry (PV, load, SoC, tariff) | Runs alongside Postgres 15 |
| `redis`     | Caching, debouncing, execution tokens        | Consider enabling persistence |
| `mqtt`      | Event bus for device telemetry and commands  | Eclipse Mosquitto 2 |
| `influxdb`  | Optional telemetry store for simulator/A/B   | Disable if not needed |

> **Usage:** `docker compose up -d` from the `infra/` directory to launch services. Configure environment variables in the API and edge runtime to match the exposed ports and credentials.
