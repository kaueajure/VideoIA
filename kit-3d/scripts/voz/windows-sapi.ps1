# Narra um texto (arquivo UTF-8) com uma voz SAPI do Windows e grava um WAV.
# Chamado por scripts/voz/windows.ts. Os eventos de palavra do SAPI saem com o
# tempo errado para a voz Maria, por isso o alinhamento e feito pelas pausas do audio.
# (Arquivo so com ASCII: o PowerShell 5.1 le .ps1 sem BOM como ANSI.)
param(
  [Parameter(Mandatory = $true)][string]$Entrada,
  [Parameter(Mandatory = $true)][string]$Saida,
  [string]$Voz = 'Microsoft Maria Desktop',
  [int]$Velocidade = 0
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$texto = [IO.File]::ReadAllText($Entrada, [Text.Encoding]::UTF8)
$sintetizador = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $sintetizador.SelectVoice($Voz)
  $sintetizador.Rate = $Velocidade
  $sintetizador.SetOutputToWaveFile($Saida)
  $sintetizador.Speak($texto)
  $sintetizador.SetOutputToNull()
} finally {
  $sintetizador.Dispose()
}
