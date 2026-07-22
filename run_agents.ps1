# Kavach-AI Agent Daemon Launcher
# Run this from the project root: ET- Kavach AI\
Set-Location "$PSScriptRoot"
Write-Host "Starting Kavach-AI Agent Swarm Daemon..." -ForegroundColor Cyan
python -m kavach_agents.main
