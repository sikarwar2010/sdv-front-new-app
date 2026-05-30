# Export dev deployment (tables + file storage) into convex-backups/
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outDir = Join-Path $PSScriptRoot "."
$zip = Join-Path $outDir "convex-dev-export-with-storage-$stamp.zip"

Write-Host "Exporting dev deployment to $zip ..."
npx convex export --include-file-storage --path $zip
Write-Host "Done."
