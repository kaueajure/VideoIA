$ErrorActionPreference = 'Stop'
$raiz = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$env:PATH = (Join-Path $raiz '.programas\node') + ';' + (Join-Path $raiz '.programas\ffmpeg') + ';' + $env:PATH
Set-Location -LiteralPath $raiz
if ($args.Count -eq 0) { Write-Host 'Uso: ferramentas\rodar.ps1 <comando>'; exit 1 }
$comando = $args[0]
$resto = @($args | Select-Object -Skip 1)
& $comando @resto
exit $LASTEXITCODE
