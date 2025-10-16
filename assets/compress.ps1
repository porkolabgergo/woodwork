# Compress-Webp.ps1
# Compress all .webp images in a folder using ffmpeg while keeping aspect ratio and high visual quality.

param (
    [string]$InputFolder = ".",
    [string]$OutputFolder = ".\compressed",
    [int]$MaxDimension = 2400,   # Maximum width or height, keeps aspect ratio
    [int]$Quality = 85           # WebP quality (0-100)
)

if (!(Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder | Out-Null
}

Get-ChildItem -Path $InputFolder -Filter *.webp | ForEach-Object {
    $input = $_.FullName
    $output = Join-Path $OutputFolder $_.Name

    Write-Host "Compressing $($_.Name)..."

    # ffmpeg scaling and compression
    ffmpeg -y -i "$input" `
        -vf "scale='if(gt(iw,ih),min($MaxDimension,iw),-2)':'if(gt(ih,iw),min($MaxDimension,ih),-2)'" `
        -compression_level 6 -qscale:v $Quality "$output"

    if ($LASTEXITCODE -eq 0) {
        Write-Host " → Done: $($_.Name)" -ForegroundColor Green
    } else {
        Write-Host " → Failed: $($_.Name)" -ForegroundColor Red
    }
}

Write-Host "✅ Compression completed. Files saved to: $OutputFolder"
