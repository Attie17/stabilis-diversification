Add-Type -AssemblyName System.Drawing
$iconsDir = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'web/icons'
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
}
$sizes = @(192, 512)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $primary = [System.Drawing.Color]::FromArgb(11, 23, 39)
    $accent = [System.Drawing.Color]::FromArgb(80, 176, 255)
    $graphics.Clear($primary)

    $margin = [int]($size * 0.12)
    $rectSize = $size - (2 * $margin)
    $brush = New-Object System.Drawing.SolidBrush $accent

    # Rounded rectangle helper
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $radius = [int]($size * 0.2)
    $diameter = 2 * $radius
    $path.AddArc($margin, $margin, $diameter, $diameter, 180, 90)
    $path.AddArc($margin + $rectSize - $diameter, $margin, $diameter, $diameter, 270, 90)
    $path.AddArc($margin + $rectSize - $diameter, $margin + $rectSize - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($margin, $margin + $rectSize - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()

    $graphics.FillPath($brush, $path)

    $output = Join-Path $iconsDir "icon-$size.png"
    $bmp.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $brush.Dispose()
    $bmp.Dispose()
    $path.Dispose()
}
Write-Output "Icons written to $iconsDir"
