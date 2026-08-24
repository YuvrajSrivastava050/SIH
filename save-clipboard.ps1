$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName PresentationCore

$img = [System.Windows.Clipboard]::GetImage()
if ($img -eq $null) {
  Write-Output 'NO IMAGE IN CLIPBOARD'
  exit 0
}

Write-Output ("CLIPBOARD IMAGE: " + $img.Width + "x" + $img.Height)

$encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
$encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($img))
$out = "c:\Users\harle\OneDrive\Desktop\SIH\nirikshan\public\terrain-bg.png"
$fs = [System.IO.File]::Create($out)
$encoder.Save($fs)
$fs.Close()
Write-Output ("SAVED: " + $out)