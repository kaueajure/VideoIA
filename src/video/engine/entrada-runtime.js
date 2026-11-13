import './runtime.js';
import { instalarTifo } from './estilo-tifo.js';
import { instalarRecursos } from './recursos-visuais.js';
import { instalarEnquadramentoBase } from './enquadramento-base.js';

instalarTifo(window.ilu);
instalarRecursos(window.ilu);
instalarEnquadramentoBase(window.ilu);

// Também cobre consumidores do motor que entregam uma spec diretamente.
import { aplicarMarcaOpcional } from './marca-opcional.js';
const carregarComMarcaOpcional = window.ilu.carregar.bind(window.ilu);
window.ilu.carregar = (spec, ...args) => carregarComMarcaOpcional(aplicarMarcaOpcional(spec), ...args);
