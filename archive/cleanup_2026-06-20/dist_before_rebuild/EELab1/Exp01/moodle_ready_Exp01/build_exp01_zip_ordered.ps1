$ErrorActionPreference = 'Stop'
$zipPath = Join-Path $PSScriptRoot 'Exp01_Moodle_Book_Import.zip'
$distSrc = Join-Path $PSScriptRoot '..\..\..\..\dist\moodle_ready\EELab1\Exp01\moodle_book_import_v2'
$src = if (Test-Path $distSrc) { $distSrc } else { Join-Path $PSScriptRoot 'moodle_book_import_v2' }
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    $ordered = @(
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
    foreach ($name in $ordered) {
        $path = Join-Path $src $name
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $path, $name) | Out-Null
    }
}
finally {
    $zip.Dispose()
}
