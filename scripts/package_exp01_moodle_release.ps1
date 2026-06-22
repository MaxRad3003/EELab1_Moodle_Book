$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$bookSource = Join-Path $root 'dist/moodle_ready/EELab1/Exp01/moodle_book_import_v2'
$bookZipDist = Join-Path $root 'dist/moodle_ready/EELab1/Exp01/Exp01_Moodle_Book_Import.zip'
$bookZipSrc = Join-Path $root 'src/content/EELab1/Exp01/Exp01_Moodle_Book_Import.zip'
$releaseRoot = Join-Path $root 'dist/release/Exp01_Moodle_Distribution'
$releaseZip = Join-Path $root 'dist/release/Exp01_Moodle_Distribution.zip'

$bookFiles = @(
    '00_Intro.html',
    '01_PreLab.html',
    '01_PreLab_00_Safety_sub.html',
    '01_PreLab_00_Units_sub.html',
    '01_PreLab_01_ColorCode_sub.html',
    '01_PreLab_02_Equipment_sub.html',
    '01_PreLab_03_Breadboard_sub.html',
    '01_PreLab_04_Tinkercad_sub.html',
    '02_InLab.html',
    '02_InLab_00_PartA_sub.html',
    '02_InLab_01_PartB_sub.html',
    '02_InLab_02_PartC_sub.html',
    '03_PostLab.html'
)

if (-not (Test-Path -LiteralPath $bookSource)) {
    throw "Missing Moodle Book source folder: $bookSource"
}

foreach ($file in $bookFiles) {
    $path = Join-Path $bookSource $file
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing Moodle Book file: $path"
    }
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $bookZipDist), (Split-Path -Parent $bookZipSrc), $releaseRoot | Out-Null

if (Test-Path -LiteralPath $bookZipDist) {
    Remove-Item -LiteralPath $bookZipDist -Force
}
if (Test-Path -LiteralPath $bookZipSrc) {
    Remove-Item -LiteralPath $bookZipSrc -Force
}
if (Test-Path -LiteralPath $releaseZip) {
    Remove-Item -LiteralPath $releaseZip -Force
}

$bookPaths = $bookFiles | ForEach-Object { Join-Path $bookSource $_ }
Compress-Archive -Path $bookPaths -DestinationPath $bookZipDist -Force
Copy-Item -LiteralPath $bookZipDist -Destination $bookZipSrc -Force
Copy-Item -LiteralPath $bookZipDist -Destination (Join-Path $releaseRoot 'Exp01_Moodle_Book_Import.zip') -Force

$readme = @'
# Exp01 Moodle Upload Package

## 1. Moodle Book

Upload/import this file into the Moodle Book activity:

`Exp01_Moodle_Book_Import.zip`

The ZIP contains the ordered Moodle Book HTML chapters and subchapters.
'@

Set-Content -LiteralPath (Join-Path $releaseRoot 'README_UPLOAD_TO_MOODLE.md') -Value $readme -Encoding UTF8

Compress-Archive -Path (Join-Path $releaseRoot '*') -DestinationPath $releaseZip -Force

Write-Host "Created Moodle Book ZIP: $bookZipDist"
Write-Host "Updated source ZIP: $bookZipSrc"
Write-Host "Created release folder: $releaseRoot"
Write-Host "Created release ZIP: $releaseZip"
