 
 # Abre o estúdio web (Windows). Quem chama: "Iniciar (Windows).cmd" e o atalho da área de trabalho.
$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}
try { $Host.UI.RawUI.WindowTitle = 'Estudio de videos' } catch {}
$studio = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
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
  if ($m -match 'Expand-Archive|ZipFile|archive|arquivo.*(zip|compactado)|End of Central Directory|corrupt') { return @{ causa = 'o arquivo baixado veio incompleto ou o antivírus o alterou.'; acao = 'Espere 1 minuto e dê dois cliques em Instalar de novo (ele baixa outra vez).'; codigo = 'zip-ruim' } }
  return @{ causa = $m; acao = 'Espere 1 minuto e dê dois cliques em Instalar de novo. Se repetir, clique em "Copiar diagnóstico" na página que vai abrir e mande no direct do Instagram @kaueajure.'; codigo = 'excecao' }
}


# o que um código de saída do Windows quer dizer (o PowerShell entrega com sinal: 0xC0000409 chega como -1073740791)
function Explicar-Saida($codigo) {
  $n = [int64]$codigo; if ($n -lt 0) { $n += 4294967296 }
  # 0.6.40: a queda não é "logo ao abrir" (a telemetria mostra de 7 s a horas depois) e só apareceu com a pasta em Downloads ou OneDrive
  if ($n -eq 3221226505) { return @{ causa = 'O Windows fechou o estúdio de repente (erro 0xC0000409). Isso costuma acontecer quando a pasta do estúdio está em Downloads ou no OneDrive.'; acao = 'Abra o estúdio de novo pelo "Iniciar" e aperte Enter quando ele pedir para ir para C:\ilustrando. Se ele não conseguir copiar sozinho, copie à mão: no Explorador de Arquivos, botão direito na pasta do estúdio, "Copiar"; abra o disco C:, botão direito num espaço vazio, "Colar"; entre na pasta colada e dê dois cliques em "Iniciar". Se ainda assim fechar, dê dois cliques em "Instalar (Windows)" e libere a pasta do estúdio no antivírus (Segurança do Windows > Proteção contra vírus > Exclusões).' } }
  if ($n -eq 3221225477) { return @{ causa = 'O programa que roda o estúdio fechou por erro de memória (0xC0000005).'; acao = 'Reinicie o computador e dê dois cliques em "Instalar (Windows)" para o estúdio testar o Node dele. Se repetir, libere a pasta do estúdio no antivírus.' } }
  if ($n -ge 3221225472) { return @{ causa = "O Windows derrubou o programa do estúdio (erro 0x$($n.ToString('X8')))."; acao = 'Reinicie o computador e dê dois cliques em "Instalar (Windows)". Se repetir, libere a pasta do estúdio no antivírus.' } }
  return @{ causa = "O estúdio fechou sozinho (código $codigo)."; acao = 'Abra de novo pelo "Iniciar". Se repetir, dê dois cliques em "Instalar (Windows)" para conferir a instalação.' }
}
function Node-Abre($p) {
  $antes = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'Continue'
    $o = & $p -p "process.versions.node" 2>$null
    return (($LASTEXITCODE -eq 0) -and $o)
  } catch { return $false } finally { $ErrorActionPreference = $antes }
}
trap {
  $msg = $_.Exception.Message
  $ex = Explicar-Excecao $msg
  Registrar ("EXCECAO ao abrir: $msg") 'estudio.log'
  Write-Host ''
  Write-Host "  O estúdio não abriu: $($ex.causa)"
  Tela-Ajuda "O estúdio não abriu: $($ex.causa)" 'Dê dois cliques em "Instalar (Windows)" para conferir a instalação e abra de novo.' 'abrir o estúdio'
  Write-Host '  Dê dois cliques em "Instalar (Windows)" para conferir a instalação. Se repetir, mande uma foto desta janela no direct do Instagram @kaueajure.'
  Write-Host ''
  Read-Host '  Aperte Enter para fechar esta janela' | Out-Null
  exit 10
}
$node = Join-Path $studio '.programas\node\node.exe'
if (-not (Test-Path -LiteralPath $node)) {
  $c = Get-Command node.exe -ErrorAction SilentlyContinue
  $node = $null
  if ($c) { try { if ([int](& $c.Source -p "process.versions.node.split('.')[0]") -ge 20 -and [int](& $c.Source -p "process.versions.node.split('.')[0]") -lt 24) { $node = $c.Source } } catch {} }  # 0.6.22: Node 24 ou mais cai no Windows (0xC0000409); usa o portátil 22
}
if (-not $node -or -not (Test-Path -LiteralPath (Join-Path $studio 'node_modules\playwright'))) {
  Write-Host ''
  Write-Host '  O estúdio ainda não foi instalado neste computador.'
  Write-Host '  Feche esta janela e dê dois cliques em "Instalar (Windows)", na pasta do estúdio.'
  Write-Host ''
  Tela-Ajuda 'O estúdio ainda não foi instalado neste computador.' 'Feche a janela preta e dê dois cliques em "Instalar (Windows)", na pasta do estúdio. Ele instala tudo sozinho.'
  Read-Host '  Aperte Enter para fechar esta janela' | Out-Null
  exit 10
}
if (-not (Node-Abre $node)) {
  Registrar "o Node ($node) não abre neste computador" 'estudio.log'
  Write-Host ''
  Write-Host '  O programa que roda o estúdio (o Node) não abre neste computador.'
  Tela-Ajuda 'O programa que roda o estúdio (o Node) não abre neste computador (arquivo corrompido ou segurado pelo antivírus).' 'Dê dois cliques em "Instalar (Windows)": ele testa o Node do estúdio e baixa outro se estiver quebrado. Se repetir, libere a pasta do estúdio no antivírus e reinicie o computador.' 'abrir o estúdio'
  Read-Host '  Aperte Enter para fechar esta janela' | Out-Null
  exit 10
}
if ($env:HTTPS_PROXY -or $env:https_proxy) { $env:NODE_USE_ENV_PROXY = '1'; $env:NODE_NO_WARNINGS = '1' }
Write-Host ''
Write-Host '  Estudio de videos'
Write-Host '  Abrindo no navegador. Deixe esta janela aberta enquanto usa o estúdio; para fechar o estúdio, feche esta janela.'
Write-Host ''
# 0.6.23: pasta em OneDrive/Downloads/nuvem derrubava o Node no Windows 11 novo (0xC0000409). Antes de ligar o servidor, o
# estúdio muda sozinho para C:\ilustrando (copia; a pasta atual não é apagada nem alterada) e abre de lá.
$mover = Join-Path $studio 'scripts\mover-estudio.mjs'
if ((Test-Path -LiteralPath $mover) -and $env:ILU_SEM_MUDANCA -ne '1') {
  $antesEap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  $chk = & $node $mover --checar 2>$null
  $precisa = ($LASTEXITCODE -eq 0)
  $ErrorActionPreference = $antesEap
  if ($precisa) {
    Write-Host '  Esta pasta fica num lugar que o Windows trava (como o OneDrive), e o estúdio pode fechar sozinho.'
    Write-Host '  Vou colocar o estúdio em C:\ilustrando, que é mais estável. Seus vídeos, sua marca e sua chave vão junto.'
    Write-Host '  A pasta atual não é apagada nem alterada.'
    Write-Host ''
    Read-Host '  Aperte Enter para continuar' | Out-Null
    $ErrorActionPreference = 'Continue'
    $saida = & $node $mover --mover
    $codMover = $LASTEXITCODE
    $okMover = ($codMover -eq 0)
    $ErrorActionPreference = $antesEap
    $linha = ($saida | Where-Object { $_ -match '^DESTINO=' } | Select-Object -Last 1)
    if ($okMover -and $linha) {
      $novo = ($linha -replace '^DESTINO=', '').Trim()
      Registrar "estúdio movido para $novo (pasta de origem em lugar que trava)" 'estudio.log'
      $nodeNovo = Join-Path $novo '.programas\node\node.exe'
      if (Test-Path -LiteralPath $nodeNovo) { $node = $nodeNovo }
      $studio = $novo
      try {
        $ws = New-Object -ComObject WScript.Shell
        $atalho = $ws.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'Estudio de videos.lnk'))
        $atalho.TargetPath = Join-Path $novo 'Iniciar (Windows).cmd'
        $atalho.WorkingDirectory = $novo
        $atalho.Save()
      } catch {}
      Write-Host ''
      Write-Host "  Pronto. Daqui para frente, abra o estúdio pelo atalho 'Estudio de videos' na área de trabalho (ou por $novo)."
      Write-Host ''
    } else {
      # 0.6.40: o motivo vai também para o instalacao.log, que entra no diagnóstico (o estudio.log recomeça quando o servidor liga
      # e perdia esta linha). Nas 14 quedas 0xC0000409 de 04 a 07/11 o estúdio rodava fora de C:\ilustrando sem dizer por quê.
      $fimMover = (($saida | Select-Object -Last 2) -join ' | ')
      Registrar "não consegui mover o estúdio para C:\ilustrando (código $codMover): $fimMover; segue na pasta atual" 'estudio.log'
      Registrar "mudança para C:\ilustrando falhou (código $codMover): $fimMover"
      Write-Host '  Não consegui copiar agora. Vou abrir o estúdio onde ele está.'
      Write-Host '  Se o estúdio fechar sozinho, copie a pasta à mão para o disco C: (botão direito, Copiar; no disco C:, botão direito, Colar).'
      Write-Host ''
    }
  }
}
& $node (Join-Path $studio 'src\estudio\servidor.mjs') --abrir
$codigo = $LASTEXITCODE
# 0.6.26 (telemetria: "saida-1073741510"): 0xC000013A é a pessoa fechando a janela preta ou apertando Ctrl+C, que é o jeito certo de
# fechar o estúdio. Não é queda: não abre página de ajuda nem manda aviso de falha.
$codigoSemSinal = [int64]$codigo; if ($codigoSemSinal -lt 0) { $codigoSemSinal += 4294967296 }
if ($codigoSemSinal -eq 3221225786) { Registrar 'o estúdio foi fechado pela pessoa (Ctrl+C ou a janela)' 'estudio.log'; exit 0 }
# 0.6.4: o estúdio caiu sem explicar (10 = ele mesmo já abriu a tela de ajuda): abre a tela de ajuda com o diagnóstico
if ($codigo -ne 0 -and $codigo -ne 10) {
  Registrar "o estúdio fechou com o código $codigo" 'estudio.log'
  $ex = Explicar-Saida $codigo
  & $node (Join-Path $studio 'src\estudio\socorro.mjs') --etapa=estudio-abrir "--codigo=saida-$codigo"
  # se nem o socorro abriu (o Node está quebrado), a página estática mostra a causa pelo código de saída
  if ($LASTEXITCODE -ne 0) { Tela-Ajuda $ex.causa $ex.acao 'abrir o estúdio' }
}
if ($codigo -ne 0) { Read-Host '  Aperte Enter para fechar esta janela' | Out-Null; exit 10 }
