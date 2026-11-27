/* =====================================================================
   7entidos · A FICHA ÚNICA (o "guarda-chuva")  ·  V5 (27/11), só na prévia
   É a inteligência por trás do app. A pessoa NUNCA vê a ficha.
   Fica guardada só no celular dela (localStorage "7e_ficha"; no modo teste, "7e_ficha_teste").

   Bloco 4 · a ficha: 7 gavetas, pistas, número de versão
   ---------------------------------------------------------------------
   As 7 gavetas:
     gostos     · Fase 1 (o que ela escolheu nas fotos)
     jogo       · Fase 2 (como ela jogou)
     regua      · Fase 3 (régua e motivos)
     fase4      · Fase 4 (nasce vazia)
     fase5      · Fase 5 (nasce vazia)
     naos       · Os "nãos" ("Nenhuma dessas", novidade recusada, sugestão recusada)
     correcoes  · Correções (quando ela corrige um palpite do app)
   Regra de ouro: cada fase ESCREVE só na sua gaveta e LÊ todas as gavetas das fases anteriores.
   (Os "nãos" e as Correções são de todas as fases: qualquer fase anota ali.)
   As Fases 1 a 3 podem testar coisas novas.

   Cada anotação é uma PISTA:
     { id, tipo, item, rotulo, pecas:{quem, onde, quando, sentidos, motivo}, forca, fase, data, extra }
     - item/rotulo: o nome da opção do APP que ela escolheu (ex.: "Pôr do sol na praia"). Nunca o texto dela.
     - pecas: o resumo em peças. Nunca o nome da pessoa, nunca o texto cru.
     - forca: "forte", "media" ou "fraca" (Bloco 5).
   ===================================================================== */
(function(){
if(typeof PREVIA==="undefined") return;
const LIGADA = !!PREVIA;                 /* só na prévia: no app oficial nada disso roda */
if(!LIGADA) return;

const TESTE = !!(PREVIA && (/[?&#]teste/i.test(location.search+location.hash) || window.F3_TESTE));
const CHAVE = TESTE ? "7e_ficha_teste" : "7e_ficha";
const VERSAO = 1;                         /* sobe quando a ficha ganhar coisas novas; "atualiza" leva a antiga para a nova sem perder nada */
const GAVETAS = ["gostos","jogo","regua","fase4","fase5","naos","correcoes"];
const DA_FASE = {1:"gostos",2:"jogo",3:"regua",4:"fase4",5:"fase5"};
const FASE_DA = {gostos:1,jogo:2,regua:3,fase4:4,fase5:5};
const FORCAS = ["fraca","media","forte"];
const MOTIVOS_OK = ["soc","pau","sen","con","jei"];
const SENTIDOS_OK = ["visao","audicao","tato","olfato","paladar","equilibrio","corpo"];

const hoje = () => { if(typeof window.rgHojeStr==="function"){ try{ return window.rgHojeStr(); }catch(e){} }
  const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const slug = t => String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const copia = o => JSON.parse(JSON.stringify(o));

/* ---------- nunca o nome, o e-mail ou o telefone ---------- */
function semDados(v){ let t=String(v==null?"":v);
  let nm=""; try{ nm=(typeof NOME==="function"?NOME():"")||""; }catch(e){}
  if(nm.length>=2) t=t.replace(new RegExp(nm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),"");
  return t.replace(/[^\s@]+@[^\s@]+/g,"").replace(/\+?\d[\d\s().-]{6,}\d/g,"").replace(/\s+/g," ").trim().slice(0,80); }
/* o "extra" só guarda números, sim/não e rótulos curtos do app. Campos de texto livre são jogados fora. */
const PROIBIDOS = /^(texto|frase|fala|nome|email|e-mail|telefone|celular|escrito)$/i;
function limpaExtra(x){ if(x==null||typeof x!=="object") return undefined; const o={};
  Object.keys(x).forEach(k=>{ if(PROIBIDOS.test(k)) return; const v=x[k];
    if(v==null||typeof v==="number"||typeof v==="boolean") o[k]=v;
    else if(typeof v==="string") o[k]=semDados(v);
    else if(Array.isArray(v)) o[k]=v.slice(0,12).map(y=>typeof y==="string"?semDados(y):(typeof y==="number"||typeof y==="boolean")?y:null).filter(y=>y!=null);
    else if(typeof v==="object") o[k]=limpaExtra(v); });
  return o; }
function limpaPecas(p){ p=p||{};
  const s=(Array.isArray(p.sentidos)?p.sentidos:[p.sentidos]).filter(x=>SENTIDOS_OK.includes(x));
  return { quem:p.quem?semDados(p.quem):null, onde:p.onde?semDados(p.onde):null, quando:p.quando?semDados(p.quando):null,
           sentidos:[...new Set(s)], motivo:MOTIVOS_OK.includes(p.motivo)?p.motivo:null }; }

/* ---------- guardar e carregar ---------- */
function nova(){ const g={}; GAVETAS.forEach(k=>g[k]=[]);
  return {versao:VERSAO, criada:hoje(), gavetas:g, marcos:{}, planta:{max:0,visto:0,plantou:false,folhas:{}}, migrou:{}}; }
/* versão: a ficha pode crescer depois sem perder o que já está guardado */
function atualiza(f){
  if(!f||typeof f!=="object"||!f.gavetas) return nova();
  const n=nova();
  GAVETAS.forEach(k=>{ if(!Array.isArray(f.gavetas[k])) f.gavetas[k]=[]; });
  f.marcos=f.marcos||{}; f.migrou=f.migrou||{}; f.planta=Object.assign(n.planta,f.planta||{});
  /* aqui entram as passagens de uma versão para a outra, quando existirem. Ex.: if((f.versao||0)<2){ ... } */
  f.versao=VERSAO; return f; }
let F=null;
function carrega(){ if(F) return F; try{ F=JSON.parse(localStorage.getItem(CHAVE)||"null"); }catch(e){ F=null; } F=atualiza(F); return F; }
function salva(){ try{ localStorage.setItem(CHAVE,JSON.stringify(F)); }catch(e){} }

/* ---------- montar uma pista ---------- */
let seq=0;
function pista(fase,o){ o=o||{};
  return { id: o.id || ("f"+fase+":"+(o.tipo||"pista")+":"+Date.now().toString(36)+(seq++)),
    tipo: o.tipo||"pista",
    item: o.item ? slug(o.item) : null,
    rotulo: o.rotulo ? semDados(o.rotulo) : null,
    pecas: limpaPecas(o.pecas),
    forca: FORCAS.includes(o.forca) ? o.forca : "media",
    fase, data: o.data || hoje(),
    extra: limpaExtra(o.extra) }; }

/* ---------- ler: as gavetas das fases anteriores (e a própria), mais os "nãos" e as correções ---------- */
function le(fase){ const f=carrega(), o={};
  GAVETAS.forEach(g=>{ const fg=FASE_DA[g]; if(fg==null || fg<=fase) o[g]=copia(f.gavetas[g]); });
  return o; }
function anteriores(fase){ const f=carrega(); return GAVETAS.filter(g=>FASE_DA[g]!=null&&FASE_DA[g]<fase).flatMap(g=>f.gavetas[g]); }

/* ---------- escrever: SÓ na gaveta da própria fase ---------- */
function escreve(fase,o){
  const g=DA_FASE[fase]; if(!g) return null;
  if(o&&o.gaveta&&o.gaveta!==g){ console.warn("Ficha: a Fase "+fase+" não pode escrever na gaveta "+o.gaveta); return null; }
  const f=carrega(), p=pista(fase,o), L=f.gavetas[g];
  if(window.FICHA && FICHA._forcaAoEscrever) FICHA._forcaAoEscrever(fase,p,o||{});   /* Bloco 5 */
  const i=L.findIndex(x=>x.id===p.id);
  if(i<0) L.push(p);
  else { const v=L[i];
    if(window.FICHA && FICHA._mudouDeIdeia && FICHA._mudouDeIdeia(v,p)){ L.push(p); }   /* Bloco 5: a antiga fica guardada como fraca */
    else { p.data=v.data; p.atualizada=hoje(); L[i]=p; } }
  salva(); return copia(p); }
/* qualquer fase pode anotar nos "nãos" e nas correções */
function anotaComum(gaveta,fase,o){ if(gaveta!=="naos"&&gaveta!=="correcoes") return null;
  const f=carrega(), p=pista(fase,Object.assign({},o,{forca:o&&o.forca||"forte"}));
  if(o&&o.itens) p.itens=[...new Set(o.itens.map(slug).filter(Boolean))].slice(0,12);
  if(o&&o.rotulos) p.rotulos=o.rotulos.map(semDados).slice(0,12);
  if(o&&o.de) p.de=o.de; if(o&&o.para) p.para=o.para;
  const L=f.gavetas[gaveta], i=L.findIndex(x=>x.id===p.id); if(i<0) L.push(p); else L[i]=p;
  salva(); return copia(p); }

/* ---------- marcos (qual fase ela já terminou) ---------- */
function marcaFase(fase){ const f=carrega(); if(!f.marcos["f"+fase]){ f.marcos["f"+fase]=hoje(); salva(); } }
function fasesFeitas(){ const f=carrega(); let k=0; for(let n=1;n<=7;n++){ if(f.marcos["f"+n]) k=n; else break; } return k; }

window.FICHA = {
  VERSAO, CHAVE, GAVETAS, DA_FASE, TESTE,
  carrega: () => copia(carrega()),
  le, anteriores, escreve, marcaFase, fasesFeitas,
  nao: (fase,o) => anotaComum("naos",fase,o),
  anotaCorrecao: (fase,o) => anotaComum("correcoes",fase,o),
  podeTestarNovidade: fase => fase>=1 && fase<=3,
  _interno: { carrega, salva, slug, semDados, limpaPecas, pista, hoje, get F(){ return F; }, zera(){ F=nova(); salva(); } }
};

/* =====================================================================
   Bloco 5 · AS FORÇAS DAS PISTAS
   1. Escolheu uma vez = MÉDIA. Escolheu de novo em outra fase = FORTE.
      Mudou de ideia (ou o teste de coerência mostrou mudança) = FRACA.
   2. A correção dela sempre vence: o que ela corrigiu entra FORTE e o palpite antigo vira FRACO
      (anotado também na gaveta Correções).
   3. Quando ela diz "não" a um palpite, o app pergunta "Então o que é?" e a resposta dela entra FORTE.
   4. Os "nãos": "Nenhuma dessas", novidade recusada e sugestão recusada. Um "não" NUNCA vira sugestão.
      Essas pistas alimentam as opções do 4 ao 0.
   5. Peças da Fase 4 e da Fase 5 (sem telas): a Fase 4 valida tudo (o confirmado vira forte, o negado sai);
      a Fase 5 lê SÓ as pistas fortes.
   ===================================================================== */
/* 1. ao escrever: se ela já tinha escolhido a mesma coisa numa fase anterior, a pista nasce forte */
FICHA._forcaAoEscrever = function(fase,p,o){
  if(o.forca) return;                                  /* quem escreve já disse a força (ex.: mudança = fraca) */
  if(!p.item) return;
  const antes=anteriores(fase).filter(x=>x.item===p.item && x.forca!=="fraca");
  if(antes.length){ p.forca="forte"; p.confirma=antes.map(x=>x.id).slice(0,6); } };
/* 1. mudou de ideia: a mesma pergunta com outra resposta. A antiga continua guardada, como fraca. */
FICHA._mudouDeIdeia = function(velha,nova){
  if(!velha.item || velha.item===nova.item) return false;
  velha.id = velha.id+"~"+Date.now().toString(36); velha.forca="fraca"; velha.mudou=hoje(); return true; };
/* 1. mudança vista no teste de coerência (ou na confirmação): fica uma pista fraca sobre aquele item */
FICHA.mudou = function(fase,o){ return escreve(fase,Object.assign({tipo:"mudanca"},o,{forca:"fraca"})); };

/* 2. a correção dela vence */
FICHA.corrige = function(fase,antiga,nova){
  const de = antiga ? {item:slug(antiga.item||antiga.rotulo), rotulo:antiga.rotulo?semDados(antiga.rotulo):null, id:antiga.id||null} : null;
  const p = escreve(fase,Object.assign({tipo:"correcao"},nova,{forca:"forte"}));
  FICHA.anotaCorrecao(fase,{tipo:"correcao", de, para:p?{item:p.item,rotulo:p.rotulo,id:p.id}:null});
  return p; };

/* 3. "não" a um palpite → "Então o que é?" → a resposta dela entra forte (e o palpite antigo, fraco) */
FICHA.naoAoPalpite = function(fase,palpite,resposta){
  FICHA.nao(fase,{tipo:"palpite-recusado", itens:[palpite.item||palpite.rotulo], rotulos:[palpite.rotulo||""]});
  if(resposta) return FICHA.corrige(fase,palpite,Object.assign({tipo:"resposta-dela"},resposta));
  return null; };
/* a pergunta "Então o que é?" (pronta para quando houver palpite na tela, na Fase 4).
   opcoes = [{rotulo, item, pecas}] · pode ter "Escrever o meu" (a frase fica só no celular, ver Bloco 8). */
window.fichaEntaoOQueE = function(fase,palpite,opcoes,depois){
  if(typeof rgModal!=="function"){ if(depois) depois(null); return; }
  window._fichaEntao={fase,palpite,opcoes,depois};
  rgModal(`<h3>Então o que é?</h3><p>Me conta, para eu acertar da próxima vez.</p><div class="col">
    ${(opcoes||[]).map((x,i)=>`<button class="btn sec" type="button" onclick="fichaEntaoEscolhe(${i})">${esc(x.rotulo)}</button>`).join("")}
    <button class="btn sec" type="button" onclick="fichaEntaoEscolhe(-1)">← Voltar</button></div>`); };
window.fichaEntaoEscolhe = function(i){ const e=window._fichaEntao; window._fichaEntao=null; if(typeof rgFechaModal==="function") rgFechaModal(); if(!e) return;
  const r = i>=0 ? e.opcoes[i] : null; if(r) FICHA.naoAoPalpite(e.fase,e.palpite,r); if(e.depois) e.depois(r); };

/* 4. os "nãos" */
function itensNaos(){ return new Set(carrega().gavetas.naos.flatMap(x=>x.itens||[])); }
FICHA.podeSugerir = function(item){ const s=slug(item); if(!s) return false; if(itensNaos().has(s)) return false;
  return !negados().has(s); };
/* para as opções do 4 ao 0: o que ela recusou como novidade (só o rótulo do app) */
FICHA.naosParaBaixo = function(){ return carrega().gavetas.naos.filter(x=>x.tipo==="novidade-recusada").flatMap(x=>(x.rotulos||[]).map((r,k)=>({rotulo:r,item:(x.itens||[])[k],sentido:(x.pecas&&x.pecas.sentidos||[])[0]||null}))); };

/* a visão de tudo junto: uma linha por item, com a força final (é isto que as próximas fases usam) */
function negados(){ return new Set(carrega().gavetas.fase4.filter(x=>x.tipo==="validacao"&&x.extra&&x.extra.resposta==="nao").map(x=>x.item).filter(Boolean)); }
FICHA.visao = function(){ const f=carrega(), por={}, corrigidos=new Set(), corrigidoPara=new Set();
  f.gavetas.correcoes.forEach(c=>{ if(c.de&&c.de.item) corrigidos.add(c.de.item); if(c.para&&c.para.item) corrigidoPara.add(c.para.item); });
  const naos=itensNaos(), neg=negados();
  ["gostos","jogo","regua","fase4","fase5"].forEach(g=>f.gavetas[g].forEach(p=>{ if(!p.item) return;
    const e=por[p.item]||(por[p.item]={item:p.item,rotulo:p.rotulo,pecas:p.pecas,forca:p.forca,fases:[],ids:[]});
    e.fases.push(p.fase); e.ids.push(p.id); e.rotulo=p.rotulo||e.rotulo; e.ultima=p; }));
  Object.values(por).forEach(e=>{ e.fases=[...new Set(e.fases)];
    e.forca = e.ultima.forca;
    if(corrigidos.has(e.item) && !corrigidoPara.has(e.item)) e.forca="fraca";   /* o palpite antigo vira fraco */
    if(corrigidoPara.has(e.item)) e.forca="forte";                               /* a correção dela vence */
    e.saiu = neg.has(e.item) || naos.has(e.item);                               /* o negado sai */
    delete e.ultima; });
  return Object.values(por).filter(e=>!e.saiu); };

/* 5. peças preparadas para a Fase 4 e a Fase 5 (ainda sem telas) */
FICHA.fase4 = {
  /* o que a Fase 4 vai conferir com ela: tudo o que não é forte ainda */
  paraValidar: () => FICHA.visao().filter(e=>e.forca!=="forte"),
  /* ela confirmou → forte · ela negou → sai (e vai para os "nãos") */
  valida(item,sim,o){ o=o||{};
    if(sim) return escreve(4,Object.assign({tipo:"validacao",item,rotulo:o.rotulo||item,extra:{resposta:"sim"}},o,{forca:"forte"}));
    const p=escreve(4,Object.assign({tipo:"validacao",item,rotulo:o.rotulo||item,extra:{resposta:"nao"}},o,{forca:"fraca"}));
    FICHA.nao(4,{tipo:"negado",itens:[item],rotulos:[o.rotulo||item]}); return p; } };
FICHA.fase5 = {
  /* a Fase 5 lê SÓ as pistas fortes (e nunca um "não") */
  pistas: () => FICHA.visao().filter(e=>e.forca==="forte" && FICHA.podeSugerir(e.item)) };
})();
