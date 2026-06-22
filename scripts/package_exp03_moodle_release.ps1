$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$bookSource = Join-Path $root 'dist/moodle_ready/EELab1/Exp03/moodle_book_import_v2'
$bookZipDist = Join-Path $root 'dist/moodle_ready/EELab1/Exp03/Exp03_Moodle_Book_Import.zip'
$bookZipSrc = Join-Path $root 'src/content/EELab1/Exp03/Exp03_Moodle_Book_Import.zip'
$releaseRoot = Join-Path $root 'dist/release/Exp03_Moodle_Distribution'
$releaseH5p = Join-Path $releaseRoot 'H5P_Quiz'
$releaseZip = Join-Path $root 'dist/release/Exp03_Moodle_Distribution.zip'
$questionBank = Join-Path $bookSource 'Exp03_PreLab_Question_Bank.xml'

$bookFiles = @(
    '00_Intro.html',
    '01_PreLab.html',
    '01_PreLab_01_Definitions_sub.html',
    '01_PreLab_02_OscilloscopeGuide_sub.html',
    '01_PreLab_02_RMS_sub.html',
    '01_PreLab_03_Conversions_sub.html',
    '01_PreLab_04_DMM_sub.html',
    '01_PreLab_05_WorkPlan_sub.html',
    '01_PreLab_06_Simulation_sub.html',
    '01_PreLab_07_Mistakes_sub.html',
    '01_PreLab_08_Readiness_sub.html',
    '02_InLab.html',
    '02_InLab_01_VoltageScope_sub.html',
    '02_InLab_02_FrequencyScope_sub.html',
    '02_InLab_03_PhaseMeasurement_sub.html',
    '02_InLab_04_Applications_sub.html',
    '03_PostLab.html',
    '03_PostLab_01_Analysis_Template_sub.html',
    '04_References.html'
)

$h5pFiles = @(
    'Exp03_PreLab_01_Definitions_H5P.h5p',
    'Exp03_PreLab_02_Oscilloscope_H5P.h5p',
    'Exp03_PreLab_03_RMS_H5P.h5p',
    'Exp03_PreLab_04_Conversions_H5P.h5p',
    'Exp03_PreLab_05_DMM_H5P.h5p',
    'Exp03_PreLab_06_WorkPlan_H5P.h5p',
    'Exp03_PreLab_07_Simulation_H5P.h5p',
    'Exp03_PreLab_08_Mistakes_H5P.h5p',
    'Exp03_PreLab_09_Readiness_H5P.h5p'
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

$h5pSource = Join-Path $bookSource 'H5P_Quiz'
foreach ($file in $h5pFiles) {
    $path = Join-Path $h5pSource $file
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Missing H5P file: $path"
    }
}

if (-not (Test-Path -LiteralPath $questionBank)) {
    throw "Missing Moodle Question Bank XML: $questionBank"
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
Copy-Item -LiteralPath $bookZipDist -Destination (Join-Path $releaseRoot 'Exp03_Moodle_Book_Import.zip') -Force

foreach ($file in $h5pFiles) {
    Copy-Item -LiteralPath (Join-Path $h5pSource $file) -Destination (Join-Path $releaseH5p $file) -Force
}

Copy-Item -LiteralPath $questionBank -Destination (Join-Path $releaseRoot 'Exp03_PreLab_Question_Bank.xml') -Force

$readme = @'
# Exp03 Moodle Upload Package

## 1. Moodle Book

Upload/import this file into the Moodle Book activity:

`Exp03_Moodle_Book_Import.zip`

## 2. H5P PreLab Quizzes

Upload each `.h5p` file from `H5P_Quiz/` as a separate H5P activity.

Each PreLab subchapter has one matching H5P quiz with 5 questions.

## 3. Moodle Question Bank

Import this XML file into Moodle Question Bank:

`Exp03_PreLab_Question_Bank.xml`

It contains 45 multiple-choice questions for final PreLab checking.

## Notes

- The Moodle Book pages include a reminder block naming the matching H5P package.
- The H5P packages and the XML bank are generated from `scripts/generate_exp03_prelab_assessments.js`.
- Re-run `node scripts\generate_exp03_prelab_assessments.js` after editing questions.
'@

Set-Content -LiteralPath (Join-Path $releaseRoot 'README_UPLOAD_TO_MOODLE.md') -Value $readme -Encoding UTF8

Compress-Archive -Path (Join-Path $releaseRoot '*') -DestinationPath $releaseZip -Force

Write-Host "Created Moodle Book ZIP: $bookZipDist"
Write-Host "Updated source ZIP: $bookZipSrc"
Write-Host "Created release folder: $releaseRoot"
Write-Host "Created release ZIP: $releaseZip"
