// O limite vale para a trajetória resultante, incluindo a mistura entre beats.
// Limitar só a amplitude de cada curva não limita a velocidade da soma delas.
const trajetorias = new WeakMap();
const FPS = 120;
const limitar = (valor, anterior, passo) => Math.max(anterior - passo, Math.min(anterior + passo, valor));

export function cameraComRitmo(plano, tempo, original) {
  const pose = original(plano, tempo);
  if (!plano?.beats?.length || tempo < 0 || tempo > plano.dur) return pose;
  let amostras = trajetorias.get(plano);
  if (!amostras) {
    amostras = [];
    let bi = 0;
    for (let i = 0; i <= Math.ceil(plano.dur * FPS); i++) {
      const t = i / FPS, atual = original(plano, t), anterior = amostras[i - 1];
      while (bi + 1 < plano.beats.length && t >= plano.beats[bi + 1].de) bi++;
      const beat = plano.beats[bi];
      const corte = Math.abs(t - beat.de) < .4 || (plano.beats[bi + 1] && Math.abs(t - plano.beats[bi + 1].de) < .4);
      const enfaseBrusca = beat.P.brusco && beat.te != null && t >= beat.te && t < beat.te + .4;
      amostras.push(!anterior || corte || enfaseBrusca
        ? { z: atual.z, rot: atual.rot }
        : { z: limitar(atual.z, anterior.z, .075 / FPS), rot: limitar(atual.rot, anterior.rot, 4.5 / FPS) });
    }
    trajetorias.set(plano, amostras);
  }
  const frame = tempo * FPS, inicio = Math.floor(frame), a = amostras[inicio], b = amostras[inicio + 1] || a;
  return { ...pose, z: a.z + (b.z - a.z) * (frame - inicio), rot: a.rot + (b.rot - a.rot) * (frame - inicio) };
}
