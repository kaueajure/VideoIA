// Leitura das chamadas quando(...) no código das cenas (usada pelo npm run checar).

// Chamadas quando(...) / quandoTermina(...) do código, com os argumentos em texto cru (respeitando
// parênteses, colchetes e strings dentro deles).
export const chamadasDeQuando = (codigo: string): Array<{nome: string; argumentos: string[]}> => {
  const chamadas: Array<{nome: string; argumentos: string[]}> = [];
  for (const m of codigo.matchAll(/(?<![\w$])(quando(?:Termina)?)\s*\(/g)) {
    const argumentos: string[] = [];
    let atual = '';
    let nivel = 0;
    let aspas: string | null = null;
    let i = (m.index ?? 0) + m[0].length;
    for (; i < codigo.length; i++) {
      const c = codigo[i];
      if (aspas) {
        atual += c;
        if (c === '\\') {
          atual += codigo[++i] ?? '';
        } else if (c === aspas) {
          aspas = null;
        }
        continue;
      }
      if (c === "'" || c === '"' || c === '`') {
        aspas = c;
        atual += c;
      } else if (c === '(' || c === '[' || c === '{') {
        nivel++;
        atual += c;
      } else if ((c === ')' || c === ']' || c === '}') && nivel > 0) {
        nivel--;
        atual += c;
      } else if (c === ')') {
        break;
      } else if (c === ',' && nivel === 0) {
        argumentos.push(atual.trim());
        atual = '';
      } else {
        atual += c;
      }
    }
    if (atual.trim()) {
      argumentos.push(atual.trim());
    }
    chamadas.push({nome: m[1], argumentos});
  }
  return chamadas;
};

// 'texto' / "texto" / `texto` (sem ${...}) → o texto; qualquer outra expressão → null.
export const textoLiteral = (argumento: string | undefined): string | null | undefined => {
  if (argumento === undefined) {
    return undefined;
  }
  const m = /^(['"`])([\s\S]*)\1$/.exec(argumento);
  return m && !(m[1] === '`' && m[2].includes('${')) ? m[2] : null;
};
