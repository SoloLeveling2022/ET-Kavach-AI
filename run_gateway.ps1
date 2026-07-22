# Kavach-AI Gateway Launcher
# Run this from the project root: ET- Kavach AI\
Set-Location "$PSScriptRoot"
Write-Host "Starting Kavach-AI Ingestion Gateway on port 8080..." -ForegroundColor Cyan
python -m uvicorn kavach_gateway.main:app --host 0.0.0.0 --port 8080 --reload
