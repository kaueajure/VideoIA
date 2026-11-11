import path from 'node:path';
import { abrirProjeto } from '../../video/projeto-seguro.mjs';
import { listarVersoes, compararVersoes, videoVersao } from '../../video/versoes.mjs';
export function script(ctx,{req,res}) { return ctx.arquivo(req,res,path.join(ctx.raiz,'src/estudio/versoes-ui.js')); }
export function listar(ctx,{res,m}) {try{return ctx.json(res,{versoes:listarVersoes(abrirProjeto(ctx.raiz,m[1]))});}catch(e){return ctx.json(res,{erro:e.message},400);}}
export function comparar(ctx,{res,m}) {try{return ctx.json(res,compararVersoes(abrirProjeto(ctx.raiz,m[1]),m[2],m[3]));}catch(e){return ctx.json(res,{erro:e.message},400);}}
export function video(ctx,{req,res,m}) {try{return ctx.arquivo(req,res,videoVersao(abrirProjeto(ctx.raiz,m[1]),m[2]),{'Cache-Control':'private, no-cache'});}catch(e){return ctx.json(res,{erro:e.message},404);}}
