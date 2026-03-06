# Asper Beauty Shop - Health Checks (Step 2)
# Master Deployment validation: Git, NPM, Supabase (Edge Functions + DB)
# Run from project root: .\scripts\health-checks.ps1

$ErrorActionPreference = "Continue"
$SUPABASE_PROJECT = "rgehleqcubtmcwyipyvi"
$BULK_UPLOAD_URL = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/bulk-product-upload"
$AUDIT_24H_URL = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/audit-24h"
$script:AnyFailed = $false

function Write-Check { param($Name, $Pass, $Detail)
  if (-not $Pass) { $script:AnyFailed = $true }
  $icon = if ($Pass) { "✅" } else { "❌" }
  Write-Host "  $icon " -NoNewline
  Write-Host $Name -ForegroundColor $(if ($Pass) { "DarkGreen" } else { "DarkRed" })
  if ($Detail) { Write-Host "     $Detail" -ForegroundColor Gray }
}

Write-Host "`n=== Asper Beauty Shop - Health Checks ===`n" -ForegroundColor DarkMagenta

# 1. Git Branch Status
Write-Host "GIT" -ForegroundColor DarkRed
$branch = git rev-parse --abbrev-ref HEAD 2>$null
$branchOk = $branch -eq "docs/deployment-flow-and-health-check" -or $branch -eq "main"
Write-Check "Branch" $branchOk "Current: $branch"
$status = git status --short 2>$null
$clean = [string]::IsNullOrWhiteSpace($status)
Write-Check "Working tree" $clean $(if ($clean) { "clean" } else { "uncommitted changes" })
Write-Host ""

# 2. NPM Checks (if npm exists)
$npmExists = Get-Command npm -ErrorAction SilentlyContinue
if ($npmExists) {
  Write-Host "NPM" -ForegroundColor DarkRed
  # Lint
  $lintOut = npm run lint 2>&1
  $lintOk = $LASTEXITCODE -eq 0
  Write-Check "Lint" $lintOk ""

  # Test
  $testOut = npm test 2>&1
  $testOk = $LASTEXITCODE -eq 0
  Write-Check "Test" $testOk ""

  # Build
  $buildOut = npm run build 2>&1
  $buildOk = $LASTEXITCODE -eq 0
  Write-Check "Build" $buildOk ""
  Write-Host ""
} else {
  Write-Host "NPM" -ForegroundColor DarkRed
  Write-Check "npm" $false "npm not found - run from a terminal with Node installed"
  Write-Host ""
}

# 3. DB (PostgREST) - skip if env not set
$baseUrl = if ($env:SUPABASE_URL) { $env:SUPABASE_URL.TrimEnd('/') } else { "https://$SUPABASE_PROJECT.supabase.co" }
if ($env:SUPABASE_ANON_KEY -and $baseUrl) {
  Write-Host "SUPABASE DB" -ForegroundColor DarkRed
  $dbUrl = "$baseUrl/rest/v1/checklist_items?select=id&limit=1"
  $dbHeaders = @{ apikey = $env:SUPABASE_ANON_KEY; Authorization = "Bearer $env:SUPABASE_ANON_KEY" }
  try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $dbRes = Invoke-WebRequest -Uri $dbUrl -Headers $dbHeaders -UseBasicParsing -TimeoutSec 10
    $sw.Stop()
    $dbOk = $dbRes.StatusCode -eq 200
    Write-Check "DB (PostgREST)" $dbOk "$($sw.ElapsedMilliseconds) ms"
  } catch {
    Write-Check "DB (PostgREST)" $false "Error: $($_.Exception.Message)"
  }
  Write-Host ""
} else {
  Write-Host "SUPABASE DB" -ForegroundColor DarkRed
  Write-Host "  (skipped - SUPABASE_ANON_KEY or SUPABASE_URL not set)" -ForegroundColor Gray
  Write-Host ""
}

# 4. Supabase Edge Functions
Write-Host "SUPABASE EDGE FUNCTIONS" -ForegroundColor DarkRed
$fnUrls = @(
  @{ Name = "bulk-product-upload"; Url = $BULK_UPLOAD_URL },
  @{ Name = "beauty-assistant"; Url = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/beauty-assistant" },
  @{ Name = "audit-24h"; Url = $AUDIT_24H_URL },
  @{ Name = "generate-prescription"; Url = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/generate-prescription" },
  @{ Name = "tray"; Url = "https://$SUPABASE_PROJECT.supabase.co/functions/v1/tray" }
)
foreach ($fn in $fnUrls) {
  try {
    $r = Invoke-WebRequest -Uri $fn.Url -UseBasicParsing -TimeoutSec 10
    $ok = $r.StatusCode -in 200, 405
    Write-Check $fn.Name $ok "Status: $($r.StatusCode)"
  } catch {
    Write-Check $fn.Name $false "Error: $($_.Exception.Message)"
  }
}
Write-Host ""

# Optional: POST results to health-checks-ingest (set $IngestUrl + $IngestKey to enable)
# $IngestUrl = "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/health-checks-ingest"
# $IngestKey = $env:SUPABASE_ANON_KEY
# if ($IngestUrl -and $IngestKey -and $npmExists) {
#   $body = @{ branch = $branch; source = "script"; checks = @(
#     @{ check_type = "lint"; status = if ($lintOk) { "pass" } else { "fail" } },
#     @{ check_type = "test"; status = if ($testOk) { "pass" } else { "fail" } },
#     @{ check_type = "build"; status = if ($buildOk) { "pass" } else { "fail" } },
#     @{ check_type = "git_branch"; status = if ($branchOk) { "pass" } else { "fail" } },
#     @{ check_type = "git_clean"; status = if ($clean) { "pass" } else { "fail" } }
#   ) } | ConvertTo-Json -Depth 4
#   Invoke-RestMethod -Uri $IngestUrl -Method Post -Headers @{ Authorization = "Bearer $IngestKey"; "Content-Type" = "application/json" } -Body $body
# }

Write-Host "=== End of Health Checks ===`n" -ForegroundColor DarkMagenta
if ($script:AnyFailed) { exit 1 }
