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
/* A ficha só recebe rótulos do app e peças do dicionário (nunca a frase dela). Mesmo assim, por segurança:
   tira e-mail e telefone, corta textos longos e nunca guarda um campo que seja igual ao nome dela. */
function semDados(v){ let t=String(v==null?"":v).replace(/[^\s@]+@[^\s@]+/g,"").replace(/\+?\d[\d\s().-]{6,}\d/g,"").replace(/\s+/g," ").trim().slice(0,80);
  let nm=""; try{ nm=(typeof NOME==="function"?NOME():"")||""; }catch(e){}
  if(nm && t.toLowerCase()===nm.toLowerCase()) return "";
  return t; }
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
/* as fases vêm em ordem: quem terminou a Fase 3 já passou pela 1 e pela 2 */
function fasesFeitas(){ const f=carrega(); let k=0; for(let n=1;n<=7;n++){ if(f.marcos["f"+n]) k=n; } return k; }

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
/* "Nenhuma dessas" diz "nenhuma destas é o meu N", não "não gosto". Por isso ele bloqueia como sugestão só o que ela nunca
   escolheu em outro lugar; o que ela já escolheu (ex.: nas fotos da Fase 1) continua valendo. Os outros "nãos" bloqueiam sempre. */
function itensNaos(){ const f=carrega(), escolhidos=new Set(["gostos","jogo","regua","fase4","fase5"].flatMap(g=>f.gavetas[g]).filter(p=>p.item&&p.forca!=="fraca").map(p=>p.item));
  return new Set(f.gavetas.naos.flatMap(x=>(x.itens||[]).filter(it=>x.tipo!=="nenhuma"||!escolhidos.has(it)))); }
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

/* =====================================================================
   Bloco 6 · AS FASES 1 E 2 ESCREVEM NA FICHA (SÓ NA PRÉVIA)
   - Nenhuma tela, texto ou foto das Fases 1 e 2 muda. Só o que é guardado por trás.
   - A Fase 1 escreve na gaveta Gostos; a Fase 2, na gaveta Jeito de jogar.
   - Quem já fez as Fases 1 e 2 antes: ao abrir, o que já está no celular é copiado para as gavetas certas.
   ===================================================================== */
/* o resumo em peças, a partir de um rótulo do app (ou de uma frase dela: a frase em si nunca entra na ficha) */
const P_QUEM=[[/fam[ií]lia|filh|net[oa]s?\b|m[ãa]e\b|pai\b|\bv[óo]\b|av[óo]|irm[ãa]/i,"família"],[/amig|turma|grupo|galera/i,"amigos"],[/algu[ée]m querido|quem (voc[êe] )?ama|quem eu amo|marido|espos|namor|\bpar\b|a dois/i,"alguém querido"],[/vizinh|bairro|conhecid|feirante/i,"vizinhança"],[/sozinh|s[óo] eu|eu mesma|ningu[ée]m/i,"sozinha"]];
const P_ONDE=[[/praia|\bmar\b|areia|orla|onda|quiosque/i,"praia"],[/casa|cozinha|sof[áa]|\bcama\b|quarto|varanda|quintal|telhado|cobertor|len[çc]ol|banho/i,"casa"],[/natureza|jardim|planta|terra|grama|trilha|campo|montanha|\brio\b|lago|pedra/i,"natureza"],[/\brua\b|cidade|grafite|mural|feira|padaria|shopping|loja|vitrine|[ôo]nibus|cal[çc]ada/i,"rua"],[/viagem|lugar novo|desconhecid|avi[ãa]o|estrada/i,"viagem"],[/show|samba|baile|festa|restaurante|museu/i,"passeio"],[/rede\b/i,"casa"]];
const P_QUANDO=[[/manh[ãa]|acordar|nascer do sol|\b7h\b/i,"manhã"],[/p[ôo]r do sol|fim de tarde|\btarde\b/i,"fim de tarde"],[/noite|estrel|dormir|\blua\b/i,"noite"],[/domingo|fim de semana|f[ée]rias|folga/i,"folga"],[/inf[âa]ncia|crian[çc]a|antig|de v[óo]\b/i,"lembrança antiga"],[/chuva/i,"dia de chuva"],[/calor|dia quente|ver[ãa]o/i,"calor"]];
const P_SENT={visao:/\bver\b|olhar|\bcor(es)?\b|paisagem|vista|p[ôo]r do sol|c[ée]u|estrel|foto|mural|grafite/i,audicao:/ouvir|\bsom\b|m[úu]sica|barulho|cant|sil[êe]ncio|chuva no telhado/i,tato:/toque|pele|abra[çc]|[áa]gua|carinho|areia|cobertor|macio|massagem/i,
  olfato:/cheir|perfume|aroma/i,paladar:/comer|sabor|\bgost(o|inho)\b|comida|bolo|caf[ée]|doce|fruta|p[ãa]o/i,equilibrio:/dan[çc]|balan[çc]|bicicleta|\brede\b|surf|prancha|barco/i,corpo:/alongar|respir|\bcorpo\b|caminh|correr|nadar|deitar/i};
const P_MOT={soc:/amig|fam[ií]l|filh|net[oa]|marido|espos|namor|m[ãa]e\b|pai\b|\bgente\b|junt|convers|abra[çc]|vizinh|turma|pessoa|algu[ée]m querido/i,
  pau:/descans|\bpaz\b|sossego|sil[êe]ncio|folga|relax|calm|sem pressa|dormir|cochil|ningu[ée]m|longe|respir/i,
  sen:/cheir|sabor|gost(o|inho)|\bsom\b|m[úu]sica|\bcor(es)?\b|vento|\bmar\b|\bsol\b|pele|toque|[áa]gua|vista|\bluz\b|perfume/i,
  con:/comid|comer|presente|ganh|compr|dinheir|lanche|bolo|doce|roupa|pr[êe]mio/i,
  jei:/escolh|meu jeito|minha hora|quando eu quero|livre|liberdade|decid|do meu modo|eu mesma/i};
const acha=(L,t)=>{ for(const [re,v] of L) if(re.test(t)) return v; return null; };
FICHA.pecasDe = function(texto,o){ o=o||{}; const t=String(texto||"");
  const sent=Object.keys(P_SENT).filter(k=>P_SENT[k].test(t)); const mot=MOTIVOS_OK.filter(k=>P_MOT[k].test(t));
  return limpaPecas({quem:acha(P_QUEM,t), onde:acha(P_ONDE,t), quando:acha(P_QUANDO,t),
    sentidos:[o.sentido].concat(sent).filter(Boolean).slice(0,3), motivo:o.motivo||(mot.length===1?mot[0]:null)}); };

/* Fase 1 → gaveta Gostos */
function daFase1(r){ if(!r||typeof SENT==="undefined") return 0; let k=0;
  SENT.forEach(s=>{ const v=r["gosto_"+s.id]; if(!v) return; k++;
    escreve(1,{id:"f1:gosto:"+s.id, tipo:"gosto", item:v, rotulo:v, pecas:FICHA.pecasDe(v,{sentido:s.id})}); });
  if(r.vaso) escreve(1,{id:"f1:olhar", tipo:"olhar", item:"olhar "+r.vaso, rotulo:r.vaso, pecas:{quem:r.vaso==="Dois rostos"?"pessoas":null}});
  if(r.fase1_completa) marcaFase(1);
  if(k>=4) folha("f1");                                             /* Bloco 11: folhinha na metade da fase */
  return k; }
/* Fase 2 → gaveta Jeito de jogar */
function daFase2(r,pos){ if(!r||typeof SENT==="undefined") return 0; let k=0;
  SENT.forEach(s=>{ const st=r["jogo_"+s.id], cu=r["curtiu_"+s.id]; if(st==null&&cu==null) return; k++;
    escreve(2,{id:"f2:jogo:"+s.id, tipo:"jogo", item:"jogo "+s.id, rotulo:s.jogo, pecas:{sentidos:[s.id]}, forca: st==="pulado"?"fraca":undefined,
      extra:{jogou:st!=="pulado", curtiu:cu==null?null:+cu, repetiu:+(r["repetiu_"+s.id]||0), nivel:r[s.id+"_nivel"]==null?null:r[s.id+"_nivel"], bonus:r[s.id+"_bonus"]||null}}); });
  /* as preferências que aparecem dentro dos jogos (rótulos do app): se repetem o que ela escolheu na Fase 1, ficam fortes */
  const fav=[["tato_favorita","tato"],["olfato_favorito","olfato"],["olfato_sentiu","olfato"],["olfato_viagem","olfato"],["corpo_agora","corpo"],["saborear_sentido",null]];
  fav.forEach(([k2,sid])=>{ const v=r[k2]; if(!v||typeof v!=="string") return;
    escreve(2,{id:"f2:"+k2, tipo:"preferencia-no-jogo", item:v, rotulo:v, pecas:FICHA.pecasDe(v,{sentido:sid})}); });
  if(Array.isArray(r.paladar_prato)) r.paladar_prato.slice(0,6).forEach((v,i)=>{ if(typeof v==="string") escreve(2,{id:"f2:prato:"+i, tipo:"preferencia-no-jogo", item:v, rotulo:v, pecas:FICHA.pecasDe(v,{sentido:"paladar"})}); });
  if(k>=4) folha("f2");
  const iFim = typeof R!=="undefined" ? R.findIndex(x=>x.t==="grafico") : -1;
  if(pos!=null && iFim>=0 && pos>=iFim) marcaFase(2);
  return k; }
FICHA.daFases12 = function(r,pos){ const a=daFase1(r), b=daFase2(r,pos); return {fase1:a,fase2:b}; };
/* folhinhas da planta (Bloco 11) */
function folha(k){ const f=carrega(); if(!f.planta.folhas[k]){ f.planta.folhas[k]=hoje(); salva(); } }
FICHA.folha = folha;

/* quem já fez as Fases 1 e 2 antes desta mudança: copia o que está no celular para as gavetas, sem perder nada */
FICHA.migraFases12 = function(){ let r=null, pos=null;
  try{ const s=JSON.parse(localStorage.getItem("7e_app_novo")||"null"); if(s&&s.resp){ r=s.resp; pos=s.pos; } }catch(e){}
  try{ const f1=JSON.parse(localStorage.getItem("7e_app_novo_fase1")||"null");
    if(f1&&Array.isArray(f1.gostos)&&typeof SENT!=="undefined"){ r=r||{}; SENT.forEach((s,i)=>{ if(f1.gostos[i]&&!r["gosto_"+s.id]) r=Object.assign({},r,{["gosto_"+s.id]:f1.gostos[i]}); }); r=Object.assign({fase1_completa:true},r); } }catch(e){}
  if(!r) return null;
  const n=FICHA.daFases12(r,pos); const f=carrega(); if(!f.migrou.f12){ f.migrou.f12=hoje(); salva(); } return n; };

/* ligar: depois de cada "guardar" das Fases 1 e 2, a ficha copia o que mudou (a tela não muda nada) */
if(typeof window.salvaLocal==="function"){ const salvaLocal0=window.salvaLocal;
  window.salvaLocal=function(){ const r=salvaLocal0.apply(this,arguments); try{ if(!document.body.classList.contains("emf3")) FICHA.daFases12(resp,pos); }catch(e){} return r; }; }
try{ FICHA.migraFases12(); if(typeof resp!=="undefined" && resp && Object.keys(resp).length) FICHA.daFases12(resp,pos); }catch(e){}

/* =====================================================================
   Bloco 8 · PRIVACIDADE
   1. A frase inteira que ela escreve ou fala fica SÓ no celular dela, num lugar SEPARADO da ficha
      (localStorage "7e_frases"). A Brisa pode relembrar essa frase. (Atualiza a regra antiga "não guarda o texto".)
   2. Para a ficha, para o servidor e para a inteligência do app vai só o resumo em peças
      (quem, onde, quando, sentidos, motivo). Nunca o nome, o e-mail ou o telefone.
   3. Botão "Apagar" logo depois que ela escreve ou fala (fica no arquivo da Fase 3).
   4. Tela "O que eu escrevi", aberta pela planta: apaga uma frase ou todas.
   5. Cópia da ficha (sem nome) no servidor para quem faz login: PRONTA e DESLIGADA.
   ===================================================================== */
const CHAVE_FRASES = TESTE ? "7e_frases_teste" : "7e_frases";
const frLe = () => { try{ const l=JSON.parse(localStorage.getItem(CHAVE_FRASES)||"[]"); return Array.isArray(l)?l:[]; }catch(e){ return []; } };
const frGrava = l => { try{ localStorage.setItem(CHAVE_FRASES,JSON.stringify(l.slice(-200))); }catch(e){} };
FICHA.frases = {
  CHAVE: CHAVE_FRASES,
  /* guarda a frase dela (só no celular) e devolve o número da frase */
  guarda(texto,o){ o=o||{}; const t=String(texto||"").replace(/\s+/g," ").trim().slice(0,500); if(!t) return null;
    const l=frLe(), id="fr"+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);
    l.push({id, texto:t, onde:o.onde||null, fase:o.fase||null, numero:o.numero==null?null:o.numero, data:hoje()}); frGrava(l); return id; },
  lista: () => frLe().slice().reverse(),
  ultima: () => frLe().slice(-1)[0] || null,
  apaga(id){ frGrava(frLe().filter(x=>x.id!==id)); },
  apagaTudo(){ frGrava([]); }
};
/* o resumo em peças, em uma linha (é isto que vai para a inteligência do app, no lugar da frase) */
FICHA.resumoEmPecas = function(pc){ pc=limpaPecas(pc);
  return ["quem: "+(pc.quem||"-"), "onde: "+(pc.onde||"-"), "quando: "+(pc.quando||"-"), "sentidos: "+(pc.sentidos.join(", ")||"-"), "motivo: "+(pc.motivo||"-")].join("; "); };

/* 4. a tela "O que eu escrevi" */
window.fichaTelaFrases = function(){ try{ click(); }catch(e){}
  const l=FICHA.frases.lista();
  const brisaTxt = l.length ? "Aqui está o que você me contou. Fica só no seu celular, e você pode apagar quando quiser." : "Você ainda não escreveu nem falou nada para mim. Quando contar, fica guardado só aqui no seu celular.";
  mostra(`<div class="rot">O que eu escrevi</div>
    <div class="rg-reforco"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${esc(brisaTxt)}</p></div>
    <div class="fr-lista">${l.map(x=>`<div class="fr-it"><p>“${esc(x.texto)}”</p><small>${esc(fraseOnde(x))}</small>
      <button class="btn sec" type="button" onclick="fichaApagaFrase('${x.id}')">Apagar esta frase</button></div>`).join("")}</div>
    ${l.length>1?`<div style="margin-top:14px"><button class="btn sec" type="button" onclick="fichaApagaTudo()">Apagar todas</button></div>`:""}
    <div style="margin-top:14px"><button class="btn" type="button" onclick="fichaVoltaInicio()">← Voltar</button></div>
    <p class="rg-seguro" style="margin-top:16px">O 7entidos nunca pede senha, dinheiro nem dados do banco.</p>`);
  const vb=document.getElementById("voltar"); if(vb) vb.hidden=true; };
function fraseOnde(x){ const d=x.data?x.data.split("-").reverse().join("/"):"";
  const o = x.onde==="momento"?"Um momento real":x.onde==="curinga"?"Pergunta do dia":"Na sua régua"; return o+(x.numero!=null?" · "+x.numero:"")+(d?" · "+d:""); }
window.fichaApagaFrase = function(id){ try{ click(); }catch(e){} FICHA.frases.apaga(id); if(typeof rgAviso==="function") rgAviso("Pronto, apaguei."); fichaTelaFrases(); };
window.fichaApagaTudo = function(){ try{ click(); }catch(e){}
  if(typeof rgModal!=="function"){ FICHA.frases.apagaTudo(); return fichaTelaFrases(); }
  rgModal(`<h3>Apagar todas as frases?</h3><p>Elas saem do seu celular e não voltam.</p><div class="col">
    <button class="btn" type="button" onclick="FICHA.frases.apagaTudo();rgFechaModal();rgAviso('Pronto, apaguei todas.');fichaTelaFrases()">Sim, apagar todas</button>
    <button class="btn sec" type="button" onclick="rgFechaModal()">← Voltar</button></div>`); };
/* volta para a tela inicial */
window.fichaVoltaInicio = function(){ try{ click(); }catch(e){} try{ entrou=false; pos=0; }catch(e){}
  try{ const s=JSON.parse(localStorage.getItem("7e_app_novo")||"null"); if(s&&s.resp&&s.r===R.length&&s.pos>0&&s.pos<R.length-2){ resp=s.resp; pos=s.pos; } }catch(e){}
  let f3=false; try{ f3=localStorage.getItem("7e_fase3_ativa")==="1"; }catch(e){}
  if((f3||pos>0) && typeof boasVindas==="function") return boasVindas();
  desenha(); };
const cssF=document.createElement("style"); cssF.textContent=`
.fr-lista{display:flex;flex-direction:column;gap:12px;max-width:460px;margin:12px auto 0;text-align:left}
.fr-it{padding:14px 16px;border-radius:20px;background:rgba(17,27,61,.85);border:1.5px solid rgba(245,197,66,.45)}
.fr-it p{margin:0 0 6px;font-size:19px;line-height:1.45;color:#f4ecdc}
.fr-it small{display:block;font-size:16px;color:#c9d0e8;margin-bottom:10px}
.fr-it .btn{width:100%}`; document.head.appendChild(cssF);

/* 5. cópia da ficha no servidor (sem nome): PRONTA e DESLIGADA.
   Só liga quando existir login E a revisão de privacidade (LGPD) estiver feita. As frases dela NUNCA vão. */
const NUVEM = { ligada:false, temLogin:false, lgpdRevisada:false, url:"" };
FICHA.NUVEM = NUVEM;
FICHA.copiaParaNuvem = function(){
  if(!NUVEM.ligada || !NUVEM.temLogin || !NUVEM.lgpdRevisada || !NUVEM.url) return Promise.resolve({enviada:false, motivo:"desligada"});
  const f=copia(carrege()); /* sem nome: a ficha nunca guarda o nome; sem frases: elas ficam em outro lugar */
  return fetch(NUVEM.url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ficha:f})}).then(r=>({enviada:r.ok})).catch(()=>({enviada:false})); };
function carrege(){ return carrega(); }

/* =====================================================================
   Bloco 9 · RECOMEÇAR, CONTINUAR APRENDENDO E RESUMO DO FIM DA FASE
   1. Recomeçar uma fase: na tela ela vê a fase zerada; por trás, as respostas antigas ficam na ficha como pista FRACA.
      (Continua valendo: 1 vez por semana no grátis, até 5 no pago — com as travas desligadas por enquanto.)
   2. Depois da Fase 5 a ficha continua aprendendo: sugestão aceita volta como pista; recusada vai para Os "nãos".
   3. O resumo do fim de cada fase (vídeo da Brisa + 3 destaques) mostra SÓ o que ela escolheu, tirado da ficha, sem interpretar.
   4. Junto do resumo, uma frase curta: é uma primeira visão, ainda em construção.
   5. O resumo nunca mostra força das pistas, gavetas ou qualquer coisa da ficha.
   ===================================================================== */
FICHA.recomeca = function(fase){ const g=DA_FASE[fase]; if(!g) return 0; const f=carrega(), t=Date.now().toString(36); let k=0;
  f.gavetas[g].forEach(p=>{ if(p.recomecou) return; p.forca="fraca"; p.recomecou=hoje(); p.id=p.id+"~r"+t; k++; });
  salva(); return k; };   /* a planta e os marcos NÃO voltam: ela nunca murcha */
FICHA.depoisDaFase5 = {
  aceitou(sug){ sug=sug||{}; return escreve(5,{id:sug.id?"f5:aceita:"+sug.id:undefined, tipo:"sugestao-aceita", item:sug.item||sug.rotulo, rotulo:sug.rotulo, pecas:sug.pecas}); },
  recusou(sug){ sug=sug||{}; return FICHA.nao(5,{tipo:"sugestao-recusada", itens:[sug.item||sug.rotulo], rotulos:[sug.rotulo||""], pecas:sug.pecas}); } };

/* 3. os destaques de cada fase, tirados da ficha (só o que ela escolheu) */
FICHA.destaques = function(fase){ const L=(le(fase)[DA_FASE[fase]]||[]).filter(p=>!p.recomecou);   /* só o que ela escolheu agora (sem olhar a força) */
  if(fase===1) return SENT.map(s=>{ const p=L.find(x=>x.id==="f1:gosto:"+s.id); const j=p?s.o.indexOf(p.rotulo):-1; return j<0?null:{t:s.o[j],img:foto(s.id,j)}; }).filter(Boolean).slice(0,3);
  if(fase===2){ const g=FICHA.destaques(1).length?(le(2).gostos||[]):[];
    return SENT.map((s,i)=>{ const p=L.find(x=>x.id==="f2:jogo:"+s.id); return {s,i,v:p&&p.extra&&p.extra.curtiu?+p.extra.curtiu:0}; }).filter(x=>x.v>0).sort((a,b)=>b.v-a.v||a.i-b.i).slice(0,3)
      .map(x=>{ const gp=g.find(y=>y.id==="f1:gosto:"+x.s.id), j=gp?x.s.o.indexOf(gp.rotulo):-1; return {t:x.s.jogo, img:j>=0?foto(x.s.id,j):""}; }); }
  if(fase===3) return L.filter(p=>p.tipo==="regua"&&p.rotulo&&p.extra&&p.extra.numero>=5).sort((a,b)=>b.extra.numero-a.extra.numero).slice(0,3)
      .map(p=>{ const s=SENT.find(x=>(p.pecas.sentidos||[])[0]===x.id), j=s?s.o.indexOf(p.rotulo):-1; return {t:p.extra.numero+" · "+p.rotulo, img:j>=0?foto(s.id,j):""}; });
  return []; };
/* 4. a frase da "primeira visão" */
FICHA.FRASE_PRIMEIRA_VISAO = "Esta é uma primeira visão, ainda em construção. Quanto mais você preencher, mais o app vai te surpreender.";
/* nas Fases 1 e 2 a frase fica PRONTA e DESLIGADA: as telas das Fases 1 e 2 não podem mudar sem o Daniel dizer (ver relatório) */
FICHA.PRIMEIRA_VISAO_NAS_FASES_1_E_2 = false;
FICHA.htmlPrimeiraVisao = () => `<p class="rsm-visao">${esc(FICHA.FRASE_PRIMEIRA_VISAO)}</p>`;
const cssV=document.createElement("style"); cssV.textContent=`.rsm-visao{font-size:18px;line-height:1.45;color:#fff3c4;margin:10px auto 4px;max-width:30em;padding:10px 14px;border-radius:16px;border:1.5px dashed rgba(245,197,66,.55);background:rgba(17,27,61,.6)}`; document.head.appendChild(cssV);

/* as telas do fim das Fases 1 e 2 passam a pegar os destaques da ficha (o que aparece é exatamente o mesmo) */
if(typeof window.destFase1==="function"){ const d10=window.destFase1;
  window.destFase1=function(){ try{ FICHA.daFases12(resp,pos); const d=FICHA.destaques(1); if(d.length) return d; }catch(e){} return d10(); }; }
if(typeof window.destFase2==="function"){ const d20=window.destFase2;
  window.destFase2=function(){ try{ FICHA.daFases12(resp,pos); const d=FICHA.destaques(2); if(d.length) return d; }catch(e){} return d20(); }; }
if(FICHA.PRIMEIRA_VISAO_NAS_FASES_1_E_2 && typeof window.resumoBrisa==="function"){ const rb0=window.resumoBrisa;
  window.resumoBrisa=function(fase){ const h=rb0.apply(this,arguments); return fase<=2 ? h+FICHA.htmlPrimeiraVisao() : h; }; }
/* 1. recomeçar as Fases 1 e 2 ("Fazer de novo" / "Prefiro começar do zero"): por trás, o antigo vira fraco */
if(typeof window.recomecar==="function"){ const rc0=window.recomecar;
  window.recomecar=function(){ try{ FICHA.recomeca(1); FICHA.recomeca(2); }catch(e){} return rc0.apply(this,arguments); }; }
})();
