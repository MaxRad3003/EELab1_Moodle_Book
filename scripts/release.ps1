$ErrorActionPreference = 'Stop'

# 1. Run build
Write-Host "Running build..." -ForegroundColor Cyan
npm run build

# 2. Setup release directory
$rootDir = Resolve-Path "$PSScriptRoot\.."
$releaseDir = Join-Path $rootDir "release"
if (Test-Path $releaseDir) {
    Remove-Item -Path $releaseDir -Recurse -Force
}
New-Item -ItemType Directory -Path $releaseDir | Out-Null

# Load compression assembly
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# 3. Zip Measuring Equipment
Write-Host "Packaging Measuring Equipment..." -ForegroundColor Cyan
$equipZipPath = Join-Path $releaseDir "EELab_Measuring_equipment.zip"
$equipSrcDir = Join-Path $rootDir "Measuring equipment\EELab_Measuring_equipment"

if (Test-Path $equipSrcDir) {
    $zip = [System.IO.Compression.ZipFile]::Open($equipZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        # Add HTML files at root (sorted alphabetically)
        $files = Get-ChildItem -Path $equipSrcDir -Filter *.html | Sort-Object Name
        foreach ($file in $files) {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $file.Name) | Out-Null
        }
        # Add Figure directory files
        $figureDir = Join-Path $equipSrcDir "Figure"
        if (Test-Path $figureDir) {
            $figFiles = Get-ChildItem -Path $figureDir -File -Recurse
            foreach ($fig in $figFiles) {
                $relPath = "Figure/" + $fig.Name
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $fig.FullName, $relPath) | Out-Null
            }
        }
    }
    finally {
        $zip.Dispose()
    }
    Write-Host "✅ Measuring Equipment packaged: release\EELab_Measuring_equipment.zip" -ForegroundColor Green
} else {
    Write-Warning "Measuring equipment source folder not found!"
}

# 4. Zip Experiments
Write-Host "Packaging Experiments..." -ForegroundColor Cyan
$distDir = Join-Path $rootDir "dist\moodle_ready\EELab1"

if (Test-Path $distDir) {
    $expDirs = Get-ChildItem -Path $distDir -Directory | Where-Object { $_.Name -like "Exp*" }
    foreach ($expDir in $expDirs) {
        $expName = $expDir.Name
        Write-Host "Packaging $expName..." -ForegroundColor Gray
        
        $moodleBookDir = Join-Path $expDir.FullName "moodle_book_import_v2"
        if (-not (Test-Path $moodleBookDir)) {
            $moodleBookDir = $expDir.FullName
        }
        
        $zipPath = Join-Path $releaseDir "${expName}_Moodle_Book_Import.zip"
        $zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
        try {
            # Add HTML files sorted alphabetically at root
            $htmlFiles = Get-ChildItem -Path $moodleBookDir -Filter *.html | Sort-Object Name
            foreach ($file in $htmlFiles) {
                [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $file.Name) | Out-Null
            }
            
            # Add subdirectories (like Figure, assets, H5P_Quiz, interactive)
            $subDirs = Get-ChildItem -Path $moodleBookDir -Directory
            foreach ($subDir in $subDirs) {
                $subDirFiles = Get-ChildItem -Path $subDir.FullName -File -Recurse
                foreach ($file in $subDirFiles) {
                    $relPath = ($file.FullName.Substring($moodleBookDir.Length + 1)).Replace('\', '/')
                    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relPath) | Out-Null
                }
            }
        }
        finally {
            $zip.Dispose()
        }
        Write-Host "✅ $expName packaged: release\${expName}_Moodle_Book_Import.zip" -ForegroundColor Green
    }
} else {
    Write-Warning "Dist directory not found!"
}

Write-Host "`n✨ All Moodle packages are ready in the 'release' folder!" -ForegroundColor Green
