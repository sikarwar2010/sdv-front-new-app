param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$ZipPath
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$resolved = Resolve-Path $ZipPath
Write-Host "Importing into PRODUCTION (replaces all data in snapshot tables): $resolved"
Write-Host "Press Ctrl+C within 5 seconds to abort ..."
Start-Sleep -Seconds 5
npx convex import $resolved --replace-all -y --prod
Write-Host "Production import complete."
