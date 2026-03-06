# Prometheus (optional local monitoring)

Config from the
[Prometheus Getting Started](https://prometheus.io/docs/introduction/first_steps/)
tutorial. Use this to run Prometheus locally for learning or to scrape custom
metrics.

**This repo’s production monitoring** uses **Datadog Synthetics** (see
`.github/workflows/datadog-synthetics.yml`). Prometheus here is optional and
local-only.

---

## Quick start

1. **Download Prometheus** for your OS:\
   https://prometheus.io/download/

2. **Extract and run** (from the extracted folder):
   ```bash
   ./prometheus --config.file=/path/to/Asper-Beauty-Shop/prometheus/prometheus.yml
   ```
   Or copy `prometheus.yml` and `prometheus.rules.yml` into the Prometheus
   directory and run:
   ```bash
   ./prometheus --config.file=prometheus.yml
   ```

3. **Open**
   - Status: http://localhost:9090
   - Metrics: http://localhost:9090/metrics
   - Query / Graph: http://localhost:9090/query

---

## What this config does

- **Job `prometheus`**: scrapes Prometheus itself at `localhost:9090`.
- **Job `node`**: scrapes Node Exporter targets at `localhost:8080`, `8081`,
  `8082` (you must run Node Exporter separately; see official docs).
- **Rules**: `prometheus.rules.yml` records
  `job_instance_mode:node_cpu_seconds:avg_rate5m` (avg CPU rate per
  job/instance/mode over 5m).

---

## Example queries (in Expression browser)

- `prometheus_target_interval_length_seconds`
- `prometheus_target_interval_length_seconds{quantile="0.99"}`
- `count(prometheus_target_interval_length_seconds)`
- `rate(prometheus_tsdb_head_chunks_created_total[1m])`
- `job_instance_mode:node_cpu_seconds:avg_rate5m` (after Node Exporters are
  running)

---

## Files

| File                   | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `prometheus.yml`       | Main config: scrape targets, rule file. |
| `prometheus.rules.yml` | Recording rule for CPU rate.            |
| `README.md`            | This file.                              |
