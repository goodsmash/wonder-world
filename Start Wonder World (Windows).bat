@echo off
rem Wonder World on a Windows PC with no internet: serves this folder at http://localhost:8787 and opens it.
rem Keep this window open while playing. Close it to stop.
cd /d "%~dp0"
start "" http://localhost:8787/
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
 "$l=New-Object Net.HttpListener; $l.Prefixes.Add('http://localhost:8787/'); $l.Start(); Write-Host 'Wonder World is running at http://localhost:8787 - keep this window open.';" ^
 "$t=@{'.html'='text/html; charset=utf-8';'.js'='text/javascript';'.css'='text/css';'.json'='application/json';'.webmanifest'='application/manifest+json';'.mp3'='audio/mpeg';'.png'='image/png';'.webp'='image/webp';'.woff2'='font/woff2';'.txt'='text/plain'};" ^
 "$root=(Get-Location).Path; while($l.IsListening){ $c=$l.GetContext(); $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/'); if($p -eq ''){$p='index.html'};" ^
 "$f=[IO.Path]::GetFullPath((Join-Path $root $p)); if($f.StartsWith($root) -and (Test-Path $f -PathType Leaf)){ $b=[IO.File]::ReadAllBytes($f); $e=[IO.Path]::GetExtension($f).ToLower(); if($t[$e]){$c.Response.ContentType=$t[$e]}; $c.Response.ContentLength64=$b.Length; $c.Response.OutputStream.Write($b,0,$b.Length) } else { $c.Response.StatusCode=404 }; $c.Response.Close() }"
