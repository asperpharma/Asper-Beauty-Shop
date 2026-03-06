# Asper Beauty Shop — Setup Verification
# Run from project root: .\scripts\setup-verify.ps1
# Checks tools, env, and Supabase connections.

$ErrorActionPreference = "Continue"
$script:AnyFailed = $false

function Write-Check { param($Name, $Pass, $Detail)
  if (-not $Pass) { $script:AnyFailed = $true }
  $icon = if ($Pass) { "✅" } else { "❌" }
  Write-Host "  $icon " -NoNewline
  Write-Host $Name -ForegroundColor $(if ($Pass) { "DarkGreen" } else { "DarkRed" })
  if ($Detail) { Write-Host "     $Detail" -ForegroundColor Gray }
}

Write-Host "`n=== Asper Beauty Shop — Setup Verification ===`n" -ForegroundColor DarkMagenta

# 1. Tools
Write-Host "TOOLS" -ForegroundColor Maroon
$nodeOk = Get-Command node -ErrorAction SilentlyContinue
Write-Check "Node.js" $nodeOk $(if ($nodeOk) { "v$(node -v 2>$null)" } else { "Install from nodejs.org" })
$npmOk = Get-Command npm -ErrorAction SilentlyContinue
Write-Check "npm" $npmOk $(if ($npmOk) { "v$(npm -v 2>$null)" } else { "Comes with Node.js" })
$gitOk = Get-Command git -ErrorAction SilentlyContinue
Write-Check "Git" $gitOk $(if ($gitOk) { "v$(git --version 2>$null)" } else { "Install from git-scm.com" })
$supOk = Get-Command supabase -ErrorAction SilentlyContinue
Write-Check "Supabase CLI" $supOk $(if ($supOk) { "v$(supabase --version 2>$null)" } else { "npm install -g supabase" })
Write-Host ""

# 2. Project
Write-Host "PROJECT" -ForegroundColor Maroon
$pkgExists = Test-Path "package.json"
Write-Check "package.json" $pkgExists ""
if ($pkgExists) {
  $nodeModules = Test-Path "node_modules"
  Write-Check "node_modules" $nodeModules $(if (-not $nodeModules) { "Run: npm install" } else { "" })
}
$envExists = Test-Path ".env"
Write-Check ".env file" $envExists $(if (-not $envExists) { "Copy .env.example to .env" } else { "" })
Write-Host ""

# 3. NPM scripts (if npm exists)
if ($npmOk) {
  Write-Host "BUILD" -ForegroundColor Maroon
  Push-Location $PSScriptRoot\.. 2>$null
  $lintOut = npm run lint 2>&1
  $lintOk = $LASTEXITCODE -eq 0
  Write-Check "Lint" $lintOk ""
  $testOut = npm test 2>&1
  $testOk = $LASTEXITCODE -eq 0
  Write-Check "Test" $testOk ""
  $buildOut = npm run build 2>&1
  $buildOk = $LASTEXITCODE -eq 0
  Write-Check "Build" $buildOk ""
  Pop-Location 2>$null
  Write-Host ""
}

# 4. Supabase URLs (from .env or default)
$projectId = "rgehleqcubtmcwyipyvi"
if ($envExists) {
  $envContent = Get-Content ".env" -Raw
  if ($envContent -match "VITE_SUPABASE_PROJECT_ID=(\S+)") { $projectId = $matches[1].Trim() }
  if ($envContent -match "VITE_SUPABASE_URL=https://([^.]+)\.supabase\.co") { $projectId = $matches[1] }
}
$baseUrl = "https://$projectId.supabase.co"

Write-Host "SUPABASE EDGE FUNCTIONS" -ForegroundColor Maroon
$functions = @("beauty-assistant", "generate-prescription", "tray", "get-products-by-concern", "audit-24h", "health-checks-ingest", "shopify-discovery")
foreach ($fn in $functions) {
  $url = "$baseUrl/functions/v1/$fn"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 8
    $ok = $r.StatusCode -in 200, 405  # 405 = method not allowed (GET) but endpoint exists
    Write-Check $fn $ok "Status: $($r.StatusCode)"
  } catch {
    Write-Check $fn $false "Error: $($_.Exception.Message)"
  }
}
Write-Host ""

Write-Host "=== End of Setup Verification ===`n" -ForegroundColor DarkMagenta
if ($script:AnyFailed) {
  Write-Host "Fix failing checks. See docs/SETUP_COMPLETE.md" -ForegroundColor Yellow
  exit 1
}
Write-Host "All checks passed." -ForegroundColor Green
exit 0
