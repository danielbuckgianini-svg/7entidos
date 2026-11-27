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
})();
