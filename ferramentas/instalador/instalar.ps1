 
 # Instalador do Estudio de videos para Windows. Quem chama: "Instalar (Windows).cmd".
# 1) garante um Node (o portátil, baixado de nodejs.org com SHA-256 conferido, ou o do computador se for 20+);
# 2) roda ferramentas\instalador\instalar.mjs, que instala o resto dentro da pasta (.programas\);
# 3) abre o estúdio no navegador.
# Opções: -Simular (só mostra o que faria), -NaoAbrir, -Assistente, e as de instalar.mjs depois de --.
# -Assistente: a rota sem os dois cliques. O Claude Code ou o Codex roda este mesmo script, sem esperar o Enter e sem abrir
# o navegador no fim (powershell -NoProfile -ExecutionPolicy Bypass -File ferramentas\instalador\instalar.ps1 -Assistente).
param([switch]$Simular, [switch]$NaoAbrir, [switch]$Assistente, [Parameter(ValueFromRemainingArguments = $true)][string[]]$Resto)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
if (-not $Assistente) { try { $Host.UI.RawUI.WindowTitle = 'Estudio de videos: instalação' } catch {} }
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}

# GetFullPath e não Resolve-Path: pasta com [ ] no nome ("Método [v0.3]") é curinga para o Resolve-Path e quebrava aqui
$studio = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$prog = Join-Path $studio '.programas'
$nodeVersao = 'v22.23.3'
if ($Assistente) { $NaoAbrir = $true }
$env:ILU_SEM_MUDANCA = '1'

# na janela dos dois cliques, espera o Enter para a pessoa ler; no assistente não há quem aperte Enter (travaria o comando)
function Esperar-Enter {
  if (-not $Assistente) { Read-Host '  Aperte Enter para fechar esta janela' | Out-Null }
}

# 0.6.4: aviso de falha (etapa, código, versão e sistema) e tela de ajuda no navegador com "Copiar diagnóstico" e "Abrir o
# direct". 0.6.12: com um relatório de erro curto (etapa, o que houve e o sistema; a pasta do estúdio, a pasta pessoal e
# e-mails saem antes; o servidor saneia de novo; sem o Node não vai log). Só no pacote vendido (MANIFESTO.json), respeita o
# desligado e nunca para nada.
function Aviso-Anonimo($etapa, $codigo, $texto = '') {
  try {
    if ($env:ILU_TELEMETRIA -eq '0') { return }
    if ($env:ILU_TELEMETRIA_PAI -eq '1') { return }  # 0.6.24: rodando por dentro do estúdio, é ele que manda o aviso (sem duplicar)
    if (-not (Test-Path -LiteralPath (Join-Path $studio 'MANIFESTO.json')) -and $env:ILU_TELEMETRIA -ne '1') { return }
    $f = Join-Path $studio '.estudio\telemetria.json'
    $j = $null
    if (Test-Path -LiteralPath $f) { try { $j = Get-Content -LiteralPath $f -Raw -Encoding UTF8 | ConvertFrom-Json } catch {} }
    if ($j -and $j.ligada -eq $false) { return }
    $inst = if ($j -and $j.instalacao -match '^[a-f0-9]{16,32}$') { $j.instalacao } else { $null }
    if (-not $inst) {
      $b = New-Object byte[] 8; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($b)
      $inst = -join ($b | ForEach-Object { $_.ToString('x2') })
      New-Item -ItemType Directory -Force -Path (Join-Path $studio '.estudio') | Out-Null
      [IO.File]::WriteAllText($f, "{`n `"instalacao`": `"$inst`",`n `"ligada`": true`n}`n")
    }
    $v = [Environment]::OSVersion.Version
    $sov = if ($v.Major -eq 10 -and $v.Build -ge 22000) { '11' } else { "$($v.Major)" }
    $ver = 'v0.0.0'; try { $ver = (Get-Content -LiteralPath (Join-Path $studio 'VERSAO') -Raw).Trim() } catch {}
    if ($ver -notmatch '^\d{1,3}\.\d{1,3}\.\d{1,3}$') { $ver = '0.0.0' }
    $corpo = "{`"etapa`":`"$etapa`",`"codigo`":`"$codigo`",`"versao`":`"$ver`",`"so`":`"windows`",`"soVersao`":`"$sov`",`"instalacao`":`"$inst`"}"
    $diag = Montar-Diagnostico $etapa $texto
    if ($diag.Length -gt 4000) { $diag = $diag.Substring(0, 1500) + "`n[... cortado ...]`n" + $diag.Substring($diag.Length - 2400) }
    $comDiag = $corpo.Substring(0, $corpo.Length - 1) + ',"diagnostico":' + (ConvertTo-Json -InputObject $diag -Compress) + '}'
    foreach ($u in @('https://licencas.ilustrandocuriosidades.com', 'https://licencas.ilustrandocuriosidadesbr.com')) {
      $foi = $false
      try { Invoke-WebRequest -UseBasicParsing -Method Post -Uri "$u/v1/falha" -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($comDiag)) -TimeoutSec 4 | Out-Null; $foi = $true } catch {
        # o servidor respondeu recusando (versão antiga): só o rótulo, como antes
        if ($_.Exception.Response) { try { Invoke-WebRequest -UseBasicParsing -Method Post -Uri "$u/v1/falha" -ContentType 'application/json' -Body $corpo -TimeoutSec 4 | Out-Null; $foi = $true } catch {} }
      }
      if ($foi) { Write-Host "  Mandamos o relatório desta falha (código $codigo) para a equipe corrigir: sem chaves, e-mail, roteiro nem dados pessoais."; return }
    }
  } catch {}
}
# 0.6.19: registro local e tela de ajuda ESTÁTICA (sem hash no endereço). O Windows tira o "#c=...&a=..." de um endereço file://
# aberto pelo Start-Process, e a pessoa via sempre o texto genérico da página, com o diagnóstico só no cabeçalho. Agora a causa,
# o que fazer e o diagnóstico (com o fim do registro da instalação) vão escritos dentro do próprio arquivo .estudio\ajuda.html.
function Registrar($t, $arq = 'instalacao.log') {
  try {
    $d = Join-Path $studio '.estudio'
    New-Item -ItemType Directory -Force -Path $d | Out-Null
    Add-Content -LiteralPath (Join-Path $d $arq) -Value ('{0} {1}' -f (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'), $t) -Encoding UTF8
  } catch {}
}
function Limpar-Texto($t) {
  try {
    if ($studio) { $t = $t.Replace([string]$studio, '[pasta do estúdio]') }
    if ($env:USERPROFILE -and $env:USERPROFILE.Length -gt 3) { $t = $t.Replace($env:USERPROFILE, '%USERPROFILE%') }
    $t = [regex]::Replace($t, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', '[e-mail]')
    $t = [regex]::Replace($t, '(?i)\b[A-Z]:[\\/]+Users[\\/]+[^\\/\r\n]+', '%USERPROFILE%')
  } catch {}
  return $t
}
function Montar-Diagnostico($etapa, $causa, $acao = '') {
  $v = [Environment]::OSVersion.Version
  $ver = '?'; try { $ver = (Get-Content -LiteralPath (Join-Path $studio 'VERSAO') -Raw).Trim() } catch {}
  $log = ''; try { $log = (Get-Content -LiteralPath (Join-Path $studio '.estudio\instalacao.log') -Tail 25 -Encoding UTF8) -join "`n" } catch {}
  $arq = $env:PROCESSOR_ARCHITEW6432; if (-not $arq) { $arq = $env:PROCESSOR_ARCHITECTURE }
  $d = "Diagnóstico do Estudio de videos (instalação, sem chaves, sem e-mail e sem dados pessoais)`nVersão do estúdio: $ver`nSistema: Windows $($v.Major).$($v.Minor).$($v.Build) ($arq)`nEtapa que falhou: $etapa`nO que houve: $causa"
  if ($acao) { $d += "`nO que fazer: $acao" }
  $nc = ([string]$studio).Length; $un = ([string]$studio).Substring(0, 1)
  $d += "`nPowerShell: $($PSVersionTable.PSVersion); caminho da pasta: $nc caracteres; unidade: $un"
  if ($log) { $d += "`n`nRegistro da instalação (instalacao.log):`n$log" } else { $d += "`n`n(sem registro da instalação)" }
  $le = ''; try { $le = (Get-Content -LiteralPath (Join-Path $studio '.estudio\estudio.log') -Tail 15 -Encoding UTF8) -join "`n" } catch {}
  if ($le) { $d += "`n`nRegistro do estúdio (estudio.log):`n$le" }
  $d = Limpar-Texto $d
  if ($d.Length -gt 6000) { $d = $d.Substring(0, 2500) + "`n[... cortado ...]`n" + $d.Substring($d.Length - 3000) }
  return $d
}
function Tela-Ajuda($causa, $acao, $etapa) {
  try {
    $dir = Join-Path $studio '.estudio'
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $enc = { param($x) [Net.WebUtility]::HtmlEncode([string]$x) }
    $diag = Montar-Diagnostico $etapa $causa $acao
    $html = @'
<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Estudio de videos: ajuda</title>
<style>
:root{color-scheme:dark;--fundo:#0f1014;--cartao:#181a21;--texto:#f2efe9;--suave:#b9b4ab;--erro:#ff8f6b;--linha:#2b2e38}
*{box-sizing:border-box}body{margin:0;background:var(--fundo);color:var(--texto);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px 16px}
main{max-width:680px;margin:0 auto}h1{font-size:24px;margin:0 0 6px}.sub{color:var(--suave);margin:0 0 18px}
.caixa{background:var(--cartao);border:1px solid var(--linha);border-left:4px solid var(--erro);border-radius:12px;padding:16px 18px;margin:12px 0}
.caixa b{display:block;font-size:18px;margin-bottom:6px}.acoes{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}
.btn{appearance:none;border:1px solid var(--linha);border-radius:10px;padding:12px 18px;font:600 16px system-ui,sans-serif;cursor:pointer;text-decoration:none;display:inline-block;background:transparent;color:var(--texto)}
textarea{width:100%;min-height:200px;background:#0a0b0e;color:var(--suave);border:1px solid var(--linha);border-radius:10px;padding:10px;font:12px/1.5 ui-monospace,Menlo,Consolas,monospace}
.aviso{color:var(--suave);font-size:14px}.ok{color:#7fd69b;font-weight:600}
</style></head><body><main>
<h1>O estúdio precisa de uma ajudinha</h1>
<p class="sub">Nada se perdeu: a pasta do estúdio continua como estava.</p>
<div class="caixa" role="alert"><b>{{CAUSA}}</b>O que fazer: {{ACAO}}<br><small class="aviso">Etapa: {{ETAPA}}</small></div>
<div class="acoes"><button class="btn" id="copiar">Copiar diagnóstico</button><a class="btn" href="https://ig.me/m/kaueajure" target="_blank" rel="noopener">Abrir o direct</a><span class="ok" id="copiado" aria-live="polite"></span></div>
<p class="aviso">Cole o diagnóstico no direct do Instagram @kaueajure. Ele não leva chave, e-mail nem o nome do seu computador. O mesmo texto fica salvo em .estudio\ajuda.html.</p>
<textarea id="diag" readonly aria-label="Diagnóstico">{{DIAG}}</textarea>
</main><script>
document.getElementById('copiar').onclick=function(){var t=document.getElementById('diag'),ok=false;var fim=function(){document.getElementById('copiado').textContent=ok?'Copiado. Agora cole no direct.':'Selecionei o texto: copie com Ctrl+C.';};
if(navigator.clipboard){navigator.clipboard.writeText(t.value).then(function(){ok=true;fim();},function(){t.focus();t.select();try{ok=document.execCommand('copy');}catch(e){}fim();});}else{t.focus();t.select();try{ok=document.execCommand('copy');}catch(e){}fim();}};
</script></body></html>
'@
    $html = $html.Replace('{{CAUSA}}', (& $enc (Limpar-Texto $causa))).Replace('{{ACAO}}', (& $enc (Limpar-Texto $acao))).Replace('{{ETAPA}}', (& $enc $etapa)).Replace('{{DIAG}}', (& $enc $diag))
    $f = Join-Path $dir 'ajuda.html'
    [IO.File]::WriteAllText($f, $html, (New-Object Text.UTF8Encoding($true)))
    Start-Process -FilePath $f
    Write-Host '  Abri uma página de ajuda no navegador, com "Copiar diagnóstico" e "Abrir o direct" (https://ig.me/m/kaueajure).'
    Write-Host '  Se ela não abrir, o mesmo texto está em .estudio\ajuda.html e .estudio\instalacao.log, dentro da pasta do estúdio.'
  } catch {
    Write-Host '  Mande uma foto desta janela no direct do Instagram @kaueajure (https://ig.me/m/kaueajure).'
  }
}
# o que a exceção do PowerShell quer dizer, em português simples: causa, o que fazer e um código curto para o aviso anônimo
function Explicar-Excecao($msg) {
  $m = [string]$msg
  if ($m -match 'PathTooLong|path.*too long|caminho.*(longo|extenso)') { return @{ causa = 'o caminho da pasta do estúdio é comprido demais para o Windows.'; acao = 'Mova a pasta "ilustrando" para C:\ilustrando (um caminho curto) e dê dois cliques em Instalar de novo.'; codigo = 'caminho-longo' } }
  if ($m -match 'not enough space|espaço insuficiente|disk is full|disco.*cheio') { return @{ causa = 'o disco está cheio.'; acao = 'Libere uns 5 GB (lixeira, downloads antigos) e dê dois cliques em Instalar de novo.'; codigo = 'disco-cheio' } }
  if ($m -match 'UnauthorizedAccess|Access to the path|Acesso negado|access is denied|being used by another process|usado por outro processo') { return @{ causa = 'o Windows (ou o antivírus) não deixou gravar ou mexer em um arquivo da pasta do estúdio.'; acao = 'Mova a pasta "ilustrando" para C:\ilustrando, libere essa pasta no antivírus (Segurança do Windows > Proteção contra vírus > Exclusões) e dê dois cliques em Instalar de novo.'; codigo = 'sem-permissao' } }
  if ($m -match 'secure channel|SSL|TLS|certificate|certificado|underlying connection|conexão subjacente|could not establish trust') { return @{ causa = 'a conexão segura com o site de download foi bloqueada (antivírus, proxy da empresa ou data e hora erradas no computador).'; acao = 'Confira a data e a hora do Windows, desligue por alguns minutos a "verificação de HTTPS" do antivírus, ou use outra rede (o roteiro do celular costuma funcionar), e dê dois cliques em Instalar de novo.'; codigo = 'https-bloqueado' } }
  if ($m -match 'remote name could not be resolved|nome remoto|unable to connect|não foi possível conectar|timed out|tempo.*esgotado|No such host|network|rede') { return @{ causa = 'sem internet (ou a conexão caiu) na hora de baixar.'; acao = 'Confira a internet (abra um site qualquer), desligue a VPN se usar, e dê dois cliques em Instalar de novo.'; codigo = 'sem-internet' } }
  if ($m -match 'execution polic|running scripts is disabled|PSSecurityException|não pode ser carregado') { return @{ causa = 'uma política do Windows está bloqueando scripts do PowerShell.'; acao = 'Se o computador é da empresa, peça ao suporte de TI para liberar. No seu computador: clique com o botão direito em Instalar (Windows) > Propriedades > marque "Desbloquear" > OK, e tente de novo.'; codigo = 'politica-powershell' } }
  if ($m -match 'ConstrainedLanguage|language mode|modo de linguagem|Cannot invoke method|Não é possível chamar o método') { return @{ causa = 'o PowerShell deste computador está em modo restrito (política da empresa ou do antivírus).'; acao = 'Use um computador pessoal, ou peça ao suporte de TI para liberar o PowerShell completo para a pasta do estúdio.'; codigo = 'powershell-restrito' } }
  # 0.6.44: parte do PowerShell que não carregou (módulo em script barrado pela política do Windows, pelo antivírus ou PowerShell incompleto)
  if ($m -match 'not recognized as (the )?name of a cmdlet|is not recognized as the name|não é reconhecido como nome de cmdlet|não é reconhecido como (um )?nome') { return @{ causa = 'uma parte do PowerShell deste computador não carregou (bloqueio da política do Windows, do antivírus ou PowerShell incompleto).'; acao = 'Passo 1: rode o Windows Update, reinicie o computador e dê dois cliques em Instalar de novo. Passo 2, se o computador for da empresa: peça ao suporte de TI para liberar o PowerShell completo para a pasta do estúdio.'; codigo = 'powershell-incompleto' } }
  if ($m -match 'Expand-Archive|ZipFile|archive|arquivo.*(zip|compactado)|End of Central Directory|corrupt') { return @{ causa = 'o arquivo baixado veio incompleto ou o antivírus o alterou.'; acao = 'Espere 1 minuto e dê dois cliques em Instalar de novo (ele baixa outra vez).'; codigo = 'zip-ruim' } }
  return @{ causa = $m; acao = 'Espere 1 minuto e dê dois cliques em Instalar de novo. Se repetir, clique em "Copiar diagnóstico" na página que vai abrir e mande no direct do Instagram @kaueajure.'; codigo = 'excecao' }
}

function Parar($oQue, $fazer, $codigo = 'node-inesperado') {
  Write-Host ''
  Write-Host '  A instalação parou.'
  Write-Host "  O que houve: $oQue"
  Write-Host "  O que fazer: $fazer"
  Write-Host ''
  Registrar "PAROU ($codigo): $oQue"
  Aviso-Anonimo 'instalador-node' $codigo $oQue
  if (-not $Assistente -and -not $Simular) { Tela-Ajuda "A instalação parou: $oQue" $fazer 'instalação (Node)' } else { Write-Host '  Ajuda: direct do Instagram @kaueajure (https://ig.me/m/kaueajure).' }
  Esperar-Enter
  exit 10
}

# qualquer erro não previsto (antivírus segurando um arquivo, política da empresa) explica e espera o Enter; antes a janela
# fechava sem mostrar nada. 10 avisa o .bat de que a mensagem já foi mostrada.
trap {
  $msg = $_.Exception.Message
  $ex = Explicar-Excecao $msg
  Registrar ("EXCECAO ($($ex.codigo)): $msg | em: $($_.InvocationInfo.ScriptLineNumber) $($_.InvocationInfo.Line.Trim())")
  Write-Host ''
  Write-Host '  A instalação parou.'
  Write-Host "  O que houve: $($ex.causa)"
  Write-Host "  O que fazer: $($ex.acao)"
  Write-Host ''
  Aviso-Anonimo 'instalador-ps1' $ex.codigo $msg
  if (-not $Assistente -and -not $Simular) { Tela-Ajuda "A instalação parou: $($ex.causa)" $ex.acao 'instalação (Windows)' }
  Esperar-Enter
  exit 10
}

# o Node abre de verdade? (antivírus que põe o node.exe em quarentena ou o deixa corrompido derruba o estúdio com o erro 0xC0000409)
function Node-Abre($p) {
  $antes = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $o = & $p -p "process.versions.node" 2>$null
    return (($LASTEXITCODE -eq 0) -and $o)
  } catch { return $false } finally { $ErrorActionPreference = $antes }
}
function Achar-Node {
  $p = Join-Path $prog 'node\node.exe'
  if (Test-Path -LiteralPath $p) {
    if ((Node-Abre $p) -and (Test-Path -LiteralPath (Join-Path (Split-Path -Parent $p) 'node_modules\npm\bin\npm-cli.js'))) { return $p }
    # Node do estúdio quebrado: apaga só a pasta dele (.programas\node) para baixar outro
    Registrar 'o Node do estúdio (.programas\node) não abre; apaguei a pasta para baixar de novo'
    Write-Host '  O Node do estúdio não abre neste computador (arquivo corrompido ou segurado pelo antivírus). Vou baixar outro.'
    try { Remove-Item -Recurse -Force -LiteralPath (Join-Path $prog 'node') } catch { Registrar "não consegui apagar .programas\node: $($_.Exception.Message)" }
  }
  $c = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($c) {
    try { $maior = [int](& $c.Source -p "process.versions.node.split('.')[0]") } catch { $maior = 0 }
    if ($maior -ge 20 -and $maior -lt 24 -and (Test-Path -LiteralPath (Join-Path (Split-Path -Parent $c.Source) 'node_modules\npm\bin\npm-cli.js'))) { return $c.Source }  # 0.6.22: Node 24 ou mais cai no Windows (0xC0000409); usa o portátil 22
  }
  return $null
}

# recomeça o registro local desta instalação (o instalar.mjs continua escrevendo no mesmo arquivo)
try { $rl = Join-Path $studio '.estudio\instalacao.log'; if (Test-Path -LiteralPath $rl) { Move-Item -Force -LiteralPath $rl -Destination ($rl + '.antigo') } } catch {}
Registrar "instalador iniciado; PowerShell $($PSVersionTable.PSVersion); Windows $([Environment]::OSVersion.Version); $($studio.Length) caracteres no caminho"

# caminho comprido: sem "caminhos longos" ligados, o Windows para em 260 caracteres, e o Node, o npm e o navegador do estúdio chegam a uns 130 dentro da pasta
if ($studio.Length -gt 110) {
  $longos = $false
  try { $longos = ((Get-ItemProperty -LiteralPath 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name LongPathsEnabled -ErrorAction Stop).LongPathsEnabled -eq 1) } catch {}
  if (-not $longos -and -not $Simular) { Parar "o caminho da pasta do estúdio tem $($studio.Length) caracteres, comprido demais para o Windows." 'Mova a pasta "ilustrando" para C:\ilustrando (um caminho curto, sem pastas dentro de pastas) e dê dois cliques em Instalar de novo.' 'caminho-longo' }
}

# arquivos baixados da internet levam uma marca que faz o Windows perguntar de novo a cada clique: tira dos arquivos do kit
if (-not $Simular) {
  Get-ChildItem -LiteralPath $studio -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(node_modules|\.programas|projetos)\\' } |
    Unblock-File -ErrorAction SilentlyContinue
}

if ($studio -match '\\AppData\\Local\\Temp\\') {
  Parar 'a pasta do estúdio ainda está dentro do .zip.' 'Feche esta janela. Clique com o botão direito no arquivo .zip, escolha "Extrair tudo" e dê dois cliques em Instalar dentro da pasta extraída.'
}

$arq = $env:PROCESSOR_ARCHITEW6432
if (-not $arq) { $arq = $env:PROCESSOR_ARCHITECTURE }
if ($arq -eq 'ARM64') {
  $alvo = 'win-arm64'; $sha = '33dad22e4cef5ee8f9fbb1b0d037fdacd0e56d12a4580f0d63f68b894deab535'
} elseif ($arq -eq 'AMD64') {
  $alvo = 'win-x64'; $sha = '2b0ff57b049cda1bbcea2240eec20467018713c1efe1f7360c2681859b90ed71'
} else {
  Parar "este Windows ($arq) é de 32 bits." 'O estúdio precisa do Windows 10 ou 11 de 64 bits.'
}
$url = "https://nodejs.org/dist/$nodeVersao/node-$nodeVersao-$alvo.zip"

Write-Host ''
$node = Achar-Node
if (-not $node) {
  if ($Simular) {
    Write-Host "  MODO SIMULAÇÃO: baixaria o Node $nodeVersao para .programas\node"
    Write-Host "    $url"
    Write-Host "    SHA-256 $sha"
    Write-Host '  (sem Node neste computador, a simulação para aqui)'
    exit 0
  }
  Registrar "baixando o Node $nodeVersao ($alvo)"
  Write-Host "  Preparando: baixando o Node $nodeVersao (o motor que roda o estúdio, cerca de 30 MB)..."
  try { New-Item -ItemType Directory -Force -Path (Join-Path $prog 'baixados') | Out-Null } catch { Parar 'não consigo gravar na pasta do estúdio.' 'Mova a pasta para C:\Users\seu-nome e dê dois cliques em Instalar de novo.' }
  $zip = Join-Path $prog 'baixados\node.zip'
  $ok = $false
  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  for ($i = 1; $i -le 3 -and -not $ok; $i++) {
    # curl com limite de tempo (conexão que trava não fica parada para sempre); se ele falhar (rede de empresa, antivírus
    # que inspeciona HTTPS, proxy do sistema), tenta o Invoke-WebRequest, que usa o proxy do Windows
    if ($curl) { try { & $curl.Source -fL --connect-timeout 20 --speed-limit 1024 --speed-time 60 --progress-bar -o $zip $url; $ok = ($LASTEXITCODE -eq 0) } catch { $ok = $false } }
    if (-not $ok) { try { Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing -TimeoutSec 600; $ok = $true } catch { $ok = $false } }
    if (-not $ok -and $i -lt 3) { Write-Host "  a internet falhou; tentando de novo ($($i + 1) de 3)..."; Start-Sleep -Seconds 3 }
  }
  if (-not $ok) { Parar 'não consegui baixar o Node de nodejs.org.' 'Confira a internet (abra um site qualquer) e dê dois cliques em Instalar de novo.' }
  # 0.6.44 (telemetria, Windows 10 com PowerShell 5.1): o Get-FileHash vem de um módulo em script (Utility.psm1) que a política do
  # Windows ou o antivírus pode impedir de carregar ("não é reconhecido como cmdlet"). O SHA-256 do .NET não depende de módulo.
  $fh = [IO.File]::OpenRead($zip)
  try { $h = ([BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash($fh)) -replace '-', '').ToLower() } finally { $fh.Dispose() }
  if ($h -ne $sha) { Remove-Item -Force -LiteralPath $zip; Parar 'o arquivo baixado não é o esperado (impressão digital diferente).' 'Por segurança, nada foi instalado. Tente de novo mais tarde; se repetir, fale com a gente no direct do Instagram @kaueajure.' }
  $dest = Join-Path $prog 'node'
  $dentro = Join-Path $prog "node-$nodeVersao-$alvo"
  foreach ($d in @($dest, $dentro)) { if (Test-Path -LiteralPath $d) { Remove-Item -Recurse -Force -LiteralPath $d } }
  # 0.6.42 (auditoria S-03, telemetria node-inesperado: 17 eventos, só Windows, 8 a 17 s depois do download): o antivírus
  # segura o zip recém-baixado e o tar.exe falha. Tenta o tar 3 vezes com espera e, se não der, o Expand-Archive, antes de parar.
  $tar = Get-Command tar.exe -ErrorAction SilentlyContinue
  $aberto = $false
  for ($t = 1; $t -le 3 -and $tar -and -not $aberto; $t++) {
    try { & $tar.Source -xf $zip -C $prog; $aberto = ($LASTEXITCODE -eq 0) } catch { $aberto = $false }
    if (-not $aberto) { if (Test-Path -LiteralPath $dentro) { Remove-Item -Recurse -Force -LiteralPath $dentro -ErrorAction SilentlyContinue }; Start-Sleep -Seconds 5 }
  }
  if (-not $aberto) {
    try { Expand-Archive -LiteralPath $zip -DestinationPath $prog -Force -ErrorAction Stop; $aberto = $true } catch { $aberto = $false }
  }
  if (-not $aberto) { Parar 'não consegui abrir o arquivo do Node.' 'Libere espaço no disco, espere 1 minuto e dê dois cliques em Instalar de novo.' }
  if (-not (Test-Path -LiteralPath $dentro)) { Parar 'não consegui abrir o arquivo do Node.' 'Dê dois cliques em Instalar de novo.' }
  # o antivírus costuma segurar o node.exe recém-extraído por alguns segundos: tenta de novo antes de desistir
  for ($t = 1; $t -le 10; $t++) {
    try { Rename-Item -LiteralPath $dentro -NewName 'node' -ErrorAction Stop; break }
    catch { if ($t -eq 10) { Parar 'o antivírus está segurando os arquivos do Node.' 'Espere 1 minuto e dê dois cliques em Instalar de novo.' }; Start-Sleep -Seconds 2 }
  }
  Remove-Item -Recurse -Force -LiteralPath (Join-Path $prog 'baixados')
  $node = Achar-Node
  if (-not $node) { Parar 'o Node baixado não abriu neste computador.' 'Reinicie o computador e dê dois cliques em Instalar de novo.' }
  Registrar 'Node pronto'
  Write-Host '  Node pronto.'
}

if ($env:HTTPS_PROXY -or $env:https_proxy) { $env:NODE_USE_ENV_PROXY = '1'; $env:NODE_NO_WARNINGS = '1' }
$argsNode = @()
if ($Assistente) { $argsNode += '--assistente' }
if ($Simular) { $argsNode += '--simular' }
if ($Resto) { $argsNode += $Resto }
& $node (Join-Path $studio 'ferramentas\instalador\instalar.mjs') @argsNode
$codigo = $LASTEXITCODE
Registrar "instalar.mjs terminou com o código $codigo"
if ($codigo -ne 0) { Esperar-Enter; exit 10 }
if ($Simular -or $NaoAbrir) { exit 0 }

Write-Host '  Abrindo o estúdio no navegador. Deixe esta janela aberta enquanto usa o estúdio.'
Write-Host '  Da próxima vez, use "Iniciar" (na pasta do estúdio).'
Write-Host ''
# 0.6.26 (telemetria de 02/11: o estúdio caía com 0xC0000409 logo depois do "Instalar" em pasta do OneDrive ou de Downloads): quem abre
# o estúdio é o abrir.ps1, que primeiro muda a pasta para C:\ilustrando quando ela fica num lugar que o Windows trava. Antes o
# instalador ligava o servidor direto, na pasta ruim, e pulava essa proteção.
$abrir = Join-Path $studio 'ferramentas\instalador\abrir.ps1'
if (Test-Path -LiteralPath $abrir) {
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $abrir
  $codigoAbrir = $LASTEXITCODE
  if ($codigoAbrir -ne 0) { Registrar "o estúdio fechou com o código $codigoAbrir"; exit 10 }  # o abrir.ps1 já mostrou o problema e esperou o Enter
  exit 0
}
& $node (Join-Path $studio 'src\estudio\servidor.mjs') --abrir
if ($LASTEXITCODE -ne 0) { Registrar "o estúdio fechou com o código $LASTEXITCODE"; Esperar-Enter; exit 10 }
