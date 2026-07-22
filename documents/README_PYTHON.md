# Kavach-AI — Python Backend

> Rust backend has been replaced with a Python stack (FastAPI + asyncio).
> The `Backend/` and `Agents/` Rust directories remain for reference only.

## Stack

| Component | Python implementation |
|---|---|
| Ingestion Gateway | `kavach_gateway/` — FastAPI + uvicorn |
| Agent Swarm Daemon | `kavach_agents/` — asyncio + redis pub/sub |
| Redis client | `redis-py[hiredis]` async |
| PostgreSQL | `asyncpg` |
| Neo4j | `neo4j` (official driver) |
| ONNX inference | `onnxruntime` (CPU) |
| Crypto | `cryptography` (P-256 ECDSA) |

## Setup

```powershell
# Install all dependencies (Python 3.11+)
python -m pip install -r requirements.txt
```

## Start Backend Services

> [!IMPORTANT]
> **Always run from the project root** (`ET- Kavach AI\`), NOT from inside the subdirectory.
> Python needs the project root on `sys.path` for package imports to resolve.

### Option A — Launcher scripts (recommended)

```powershell
# Terminal 1 — Gateway
cd "c:\Users\deven\Dev\ET- Kavach AI"
.\run_gateway.ps1

# Terminal 2 — Agent Daemon
cd "c:\Users\deven\Dev\ET- Kavach AI"
.\run_agents.ps1
```

### Option B — Direct commands (run from project root)

```powershell
# Terminal 1 — Ingestion Gateway (port 8080)
cd "c:\Users\deven\Dev\ET- Kavach AI"
python -m uvicorn kavach_gateway.main:app --host 0.0.0.0 --port 8080 --reload

# Terminal 2 — Agent Swarm Daemon
cd "c:\Users\deven\Dev\ET- Kavach AI"
python -m kavach_agents.main
```

### ❌ What NOT to do

```powershell
# WRONG — do not cd into the subdirectory
cd kavach_gateway
python -m uvicorn main:app ...   # fails: ModuleNotFoundError: kavach_gateway

cd kavach_agents
python main.py                   # fails: ModuleNotFoundError: kavach_agents
```

## Test Endpoints

```powershell
# Health check
curl http://localhost:8080/api/v1/health

# Init session
curl -X POST http://localhost:8080/api/v1/session/init `
  -H "Content-Type: application/json" `
  -d '{"user_agent":"Mozilla/5.0","platform":"windows"}'

# Get threat index (replace SESSION_ID)
curl http://localhost:8080/api/v1/session/SESSION_ID/threat

# Close session
curl -X POST http://localhost:8080/api/v1/session/SESSION_ID/close
```

## WebSocket Streams

```
ws://localhost:8080/api/v1/stream/audio?session_id=SESSION_ID
ws://localhost:8080/api/v1/stream/sensor?session_id=SESSION_ID
```

## Agent Pipeline (7.2s Budget)

| Wave | Agents | Timeout |
|---|---|---|
| Wave 1 | Phoneme + Hermes + Veritas + Aegis | 2.4s |
| Wave 2 | Nexus (Neo4j graph) | 1.4s |
| Wave 3+4 | Vanguard + Lumen | 1.4s |
| Wave 5 | Lex (evidence signing) | 0.7s |

## Environment Variables

Both `.env` files (`kavach_gateway/.env` and `kavach_agents/.env`) use:

| Variable | Description |
|---|---|
| `REDIS_URL` | Redis connection URL |
| `DATABASE_URL` | PostgreSQL connection URL |
| `NEO4J_URI` | Neo4j Aura bolt URI |
| `NEO4J_USER` | Neo4j username |
| `NEO4J_PASS` | Neo4j password |
| `NEO4J_DATABASE` | **`004a6827`** (Aura instance-specific) |
| `THREAT_FIRE_THRESHOLD` | Interdiction trigger (default: 0.75) |
| `INTERDICTION_BUDGET_MS` | Hard deadline (default: 7200ms) |

## Notes

- **Neo4j**: The Python `neo4j` driver correctly connects to Aura using `NEO4J_DATABASE=004a6827`. This was the root cause of the Rust failure.
- **ONNX Models**: Place `models/wav2vec2_int8.onnx` and `models/whisper_tiny_int8.onnx` in `kavach_agents/` for ML inference. Without them, agents use heuristic algorithms automatically.
- **PostgreSQL**: Tables `ip_blocklist`, `device_fingerprints`, `crime_incidents`, and `bsa_dockets` should exist in `kavach_db`. Missing tables cause graceful query fallbacks (score=0.0).
