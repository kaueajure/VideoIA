import './runtime.js';
import { instalarTifo } from './estilo-tifo.js';
import { instalarRecursos } from './recursos-visuais.js';
import { instalarEnquadramentoBase } from './enquadramento-base.js';

instalarTifo(window.ilu);
instalarRecursos(window.ilu);
instalarEnquadramentoBase(window.ilu);
