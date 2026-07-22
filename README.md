# ET-Kavach AI

**Enterprise Digital Public Safety & Threat Intelligence Infrastructure**

ET-Kavach AI is an autonomous, multi-agent threat detection, synthesis, and response ecosystem built for enterprise digital public safety.

## System Architecture

- **Frontend (`/Client`)**: Next.js 14 glassmorphic dashboard with real-time WebSocket telemetry, interactive node graphs, and live threat alert feeds.
- **Gateway (`/kavach_gateway`)**: FastAPI microservice delivering REST endpoints and WebSocket channels for streaming threat metrics.
- **Multi-Agent Runtime (`/kavach_agents`)**: Autonomous swarm pipeline leveraging Model Context Protocol (MCP) for collaborative threat intelligence gathering and decision synthesis.
- **Tests (`/tests`)**: Automated test suites for multi-agent swarm orchestration and API routes.

## Quick Start

### Running Gateway & Agents
```powershell
./run_gateway.ps1
./run_agents.ps1
```

### Running Frontend
```bash
cd Client
pnpm install
pnpm dev
```
