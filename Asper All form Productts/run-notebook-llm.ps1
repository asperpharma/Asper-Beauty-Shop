# Run Asper Notebook LLM
# Requires: Python 3.8+ and pip
# Get Gemini key: https://aistudio.google.com/apikey

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$notebookPath = Join-Path $scriptDir "notebooks\llm-asper.ipynb"

Write-Host "Asper Notebook LLM - Setup & Run" -ForegroundColor Cyan
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python not found. Install from https://www.python.org/downloads/ or 'winget install Python.Python.3.12'" -ForegroundColor Red
    exit 1
}

# Install deps
Write-Host "Installing dependencies..." -ForegroundColor Yellow
python -m pip install jupyter google-generativeai pandas python-dotenv -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Install failed. Try: pip install jupyter google-generativeai pandas python-dotenv" -ForegroundColor Red
    exit 1
}

# Check API key
if (-not $env:GOOGLE_API_KEY -and -not $env:GEMINI_API_KEY) {
    Write-Host ""
    Write-Host "Set your Gemini API key first:" -ForegroundColor Yellow
    Write-Host '  $env:GOOGLE_API_KEY = "your-key-from-aistudio.google.com"' -ForegroundColor White
    Write-Host ""
}

Write-Host "Starting Jupyter..." -ForegroundColor Green
Set-Location $scriptDir
jupyter notebook $notebookPath
