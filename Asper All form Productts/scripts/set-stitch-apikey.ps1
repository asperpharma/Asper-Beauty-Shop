# Set Stitch/Gemini API key in .cursor/mcp.json (local only, never committed).
# Usage: .\scripts\set-stitch-apikey.ps1
# Or:    $env:API_KEY = "your-key"; .\scripts\set-stitch-apikey.ps1
# Run from repo root (Asper All form Productts).

param(
  [string]$ApiKey = $env:API_KEY
)

$projectRoot = Split-Path $PSScriptRoot -Parent
$cursorDir = Join-Path $projectRoot ".cursor"
$mcpPath = Join-Path $cursorDir "mcp.json"

if (-not $ApiKey) {
  Write-Host "Set API_KEY or pass -ApiKey 'your-key'" -ForegroundColor Yellow
  $ApiKey = Read-Host "Enter your API key"
}

if (-not (Test-Path $cursorDir)) {
  New-Item -ItemType Directory -Path $cursorDir -Force | Out-Null
}

$examplePath = Join-Path $projectRoot "docs\cursor-mcp-stitch-example.json"
if (-not (Test-Path $mcpPath) -and (Test-Path $examplePath)) {
  Copy-Item $examplePath $mcpPath
  Write-Host "Created .cursor/mcp.json from example." -ForegroundColor Cyan
}

if (-not (Test-Path $mcpPath)) {
  @{ mcpServers = @{ stitch = @{ url = "https://stitch.googleapis.com/mcp"; headers = @{ "X-Goog-Api-Key" = "" } } } } | ConvertTo-Json -Depth 5 | Set-Content $mcpPath -Encoding UTF8
}

$json = Get-Content $mcpPath -Raw | ConvertFrom-Json
$json.mcpServers.stitch.headers."X-Goog-Api-Key" = $ApiKey
$json | ConvertTo-Json -Depth 5 | Set-Content $mcpPath -Encoding UTF8
Write-Host "Updated .cursor/mcp.json with API key (local only, not committed)." -ForegroundColor Green
