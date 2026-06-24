$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$bookSource = Join-Path $root 'dist/moodle_ready/EELab1/Exp02/moodle_book_import_v2'
$bookZipDist = Join-Path $root 'dist/moodle_ready/EELab1/Exp02/Exp02_Moodle_Book_Import.zip'
$bookZipSrc = Join-Path $root 'src/content/EELab1/Exp02/Exp02_Moodle_Book_Import.zip'
$releaseRoot = Join-Path $root 'dist/release/Exp02_Moodle_Distribution'
$releaseH5p = Join-Path $releaseRoot 'H5P_Quiz'
$releaseZip = Join-Path $root 'dist/release/Exp02_Moodle_Distribution.zip'

$bookFiles = @(
    '00_Intro.html',
    '01_PreLab.html',
    '01_PreLab_00_LinearAlgebra_sub.html',
    '01_PreLab_01_Superposition_sub.html',
    '01_PreLab_02_Thevenin_sub.html',
    '01_PreLab_03_TransferFunction_sub.html',
    '01_PreLab_04_NonLinear_sub.html',
    '01_PreLab_05_JSXGraph_sub.html',
    '01_PreLab_05_WorkPlan_sub.html',
    '02_InLab.html',
    '02_InLab_00_PartA_Superposition_sub.html',
    '02_InLab_01_PartB_Thevenin_sub.html',
    '02_InLab_02_PartC_IV_sub.html',
    '03_PostLab.html',
    '04_References.html'
)

$h5pFiles = @(
    'Exp02_PreLab_00_LinearAlgebra_H5P.h5p',
    'Exp02_PreLab_01_Superposition_H5P.h5p',
    'Exp02_PreLab_02_Thevenin_H5P.h5p',
    'Exp02_PreLab_03_TransferFunction_H5P.h5p',
    'Exp02_PreLab_04_NonLinear_H5P.h5p',
    'Exp02_PreLab_05_JSXGraph_H5P.h5p',
    'Exp02_PreLab_06_WorkPlan_H5P.h5p'
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

$h5pSource = Join-Path $root 'dist/moodle_ready/EELab1/Exp02/00_PreLab/H5P_Quiz'
foreach ($file in $h5pFiles) {
    $path = Join-Path $h5pSource $file
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing H5P file: $path"
    }
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $bookZipDist), (Split-Path -Parent $bookZipSrc), $releaseRoot, $releaseH5p | Out-Null

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
Copy-Item -LiteralPath $bookZipDist -Destination (Join-Path $releaseRoot 'Exp02_Moodle_Book_Import.zip') -Force

foreach ($file in $h5pFiles) {
    Copy-Item -LiteralPath (Join-Path $h5pSource $file) -Destination (Join-Path $releaseH5p $file) -Force
}

$readme = @'
# Exp02 Moodle Upload Package

## 1. Moodle Book

Upload/import this file into the Moodle Book activity:

`Exp02_Moodle_Book_Import.zip`

The ZIP contains the ordered Moodle Book HTML chapters and subchapters.

## 2. H5P PreLab Quizzes

Upload each `.h5p` file from `H5P_Quiz/` as an H5P activity:

- Exp02_PreLab_00_LinearAlgebra_H5P.h5p
- Exp02_PreLab_01_Superposition_H5P.h5p
- Exp02_PreLab_02_Thevenin_H5P.h5p
- Exp02_PreLab_03_TransferFunction_H5P.h5p
- Exp02_PreLab_04_NonLinear_H5P.h5p
- Exp02_PreLab_05_JSXGraph_H5P.h5p
- Exp02_PreLab_06_WorkPlan_H5P.h5p

Each H5P package contains 6 PreLab questions.

## Notes

- Moodle Question XML blocks were removed from the PreLab book pages.
- The Moodle Book pages mention the H5P package that belongs to each chapter.
- Keep the H5P activities visible or linked according to the Moodle course policy.
'@

Set-Content -LiteralPath (Join-Path $releaseRoot 'README_UPLOAD_TO_MOODLE.md') -Value $readme -Encoding UTF8

Compress-Archive -Path (Join-Path $releaseRoot '*') -DestinationPath $releaseZip -Force

Write-Host "Created Moodle Book ZIP: $bookZipDist"
Write-Host "Updated source ZIP: $bookZipSrc"
Write-Host "Created release folder: $releaseRoot"
Write-Host "Created release ZIP: $releaseZip"
