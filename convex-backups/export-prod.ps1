# Export production deployment (tables + file storage) into convex-backups/
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outDir = Join-Path $PSScriptRoot "."
$zip = Join-Path $outDir "convex-prod-export-with-storage-$stamp.zip"

Write-Host "Exporting production deployment to $zip ..."
npx convex export --include-file-storage --prod --path $zip
Write-Host "Done."
