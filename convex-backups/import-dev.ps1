param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$ZipPath
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$resolved = Resolve-Path $ZipPath
Write-Host "Importing into DEV (replaces all data in snapshot tables): $resolved"
npx convex import $resolved --replace-all -y
Write-Host "Dev import complete."
