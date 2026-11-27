/* =====================================================================
   7entidos · FASE 3 · A RÉGUA PESSOAL  (branch fase3-regua, só na prévia)
   Bloco 1 · Base da régua
   - Abertura com o texto novo do vídeo 3 da Brisa (vídeo novo ainda vai ser gravado)
   - 11 etapas, uma por número, na ordem 10 → 1 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 0
   - Liberação em blocos: [10, 1] → [9, 8, 7] → [6, 5, 4] → [3, 2, 0]
   - "Coloque na régua" no primeiro dia, antes do 10 (7 situações, uma por sentido)
   - Limite de 5 rodadas por dia (o "Coloque na régua" não conta)
   - Mandala da Fase 3: abre com 2 luzes (Fases 1 e 2) + 1 luz por número fechado; estrelinha com 11 tamanhos
   Este arquivo NÃO mexe nas Fases 1 e 2: ele só troca o que acontece depois do fim da Fase 2,
   e só quando a Fase 3 está aberta (hoje: só na prévia, F3_ABERTA = PREVIA).
   Tudo fica guardado só no celular da pessoa (localStorage "7e_regua").
   ===================================================================== */
(function(){
if(typeof F3_ABERTA==="undefined") return;

/* ---------- textos ---------- */
/* Quando o vídeo novo da Brisa chegar: troque o arquivo brisa-fase3.mp4, mude VIDEO3_NOVO para true
   e ajuste os segundos da legenda (LEG3_NOVA) pela fala exata. */
const VIDEO3_NOVO = true;
const FALA3 = "Agora começa uma fase muito importante: é aqui que eu começo a ligar tudo o que você me mostrou. Vamos montar a sua régua, do 10 até o 0. O que é um 10 pra você? E um 5? Ninguém sente igual, por isso a régua é só sua. São dez etapas, uma para cada número, e você escolhe o número do dia, sem pressa. A cada resposta, o app fica mais inteligente para você! Vamos começar pelo seu 10?";
const LEG3_NOVA = [[1.0,6.7,"Agora começa uma fase muito importante: é aqui que eu começo a ligar tudo o que você me mostrou."],[6.7,10.4,"Vamos montar a sua régua, do 10 até o 0."],[10.4,12.9,"O que é um 10 pra você? E um 5?"],[12.9,16.8,"Ninguém sente igual, por isso a régua é só sua."],[16.8,22.3,"São dez etapas, uma para cada número, e você escolhe o número do dia, sem pressa."],[22.3,26.3,"A cada resposta, o app fica mais inteligente para você!"],[26.3,29,"Vamos começar pelo seu 10?"]];
/* vídeo novo (27/11): arquivo separado, para não mudar o fim da Fase 2 que está no ar */
const VID3_REGUA = (NO_SITE?"/app/":"")+"brisa-fase3-regua.mp4";
const FIM_DIA = "Por hoje é isso. Amanhã tem mais um pedacinho da sua régua.";

/* ---------- as etapas ---------- */
const NOMES = {10:"Êxtase",9:"Excelente",8:"Muito bom",7:"Bom",6:"Legal",5:"Tanto faz",4:"Sem graça",3:"Chato",2:"Ruim",1:"Péssimo",0:"Insuportável"};
const ORDEM = [10,1,9,8,7,6,5,4,3,2,0];
const BLOCOS = [[10,1],[9,8,7],[6,5,4],[3,2,0]];
const LIMITE_DIA = 5;
/* Bloco 1: o motor de perguntas ainda não existe (entra no Bloco 2). Na prévia, cada número fecha com 2 rodadas de teste. */
const RODADAS_TESTE = 2;

/* "Coloque na régua": 7 situações iguais para todo mundo, uma por sentido.
   PROVISÓRIAS: são as recomendações da Sala 3. Troque aqui quando chegar o resultado da Sala 3. */
const COLOQUE = [
 {sid:"visao",      txt:"Ver um céu cor-de-rosa no fim da tarde"},
 {sid:"audicao",    txt:"Ouvir a música alta do vizinho tarde da noite"},
 {sid:"tato",       txt:"Um abraço apertado de quem você ama"},
 {sid:"olfato",     txt:"Cheiro de café passando de manhã"},
 {sid:"paladar",    txt:"Uma comida morna e sem sal"},
 {sid:"equilibrio", txt:"Ficar em pé num ônibus cheio que freia toda hora"},
 {sid:"corpo",      txt:"Esticar o corpo logo depois de acordar"}
];
const COLOQUE_PROVISORIO = true;

/* ---------- o que fica guardado (só no celular) ---------- */
/* {v:1, intro, col:{sid:nota}, colFeito:"aaaa-mm-dd", feitos:{num:"aaaa-mm-dd"}, atual:{num, rodadas}, hoje:{d, n}, primeiroDia} */
let RG=null;
function rgCarrega(){ if(RG) return RG; try{ RG=JSON.parse(localStorage.getItem("7e_regua")||"null"); }catch(e){} if(!RG||RG.v!==1) RG={v:1,col:{},feitos:{},atual:null,hoje:null}; return RG; }
function rgSalva(){ try{ localStorage.setItem("7e_regua",JSON.stringify(RG)); }catch(e){} }
function rgHojeN(){ const h=hojeStr(); return RG.hoje&&RG.hoje.d===h ? RG.hoje.n : 0; }
function rgContaRodada(){ const h=hojeStr(); if(!RG.hoje||RG.hoje.d!==h) RG.hoje={d:h,n:0}; RG.hoje.n++; }
const rgFeitos = () => ORDEM.filter(n=>RG.feitos[n]!=null);
const rgColFeito = () => COLOQUE.every(c=>RG.col[c.sid]!=null);
/* um bloco abre quando todos os números dos blocos anteriores estão fechados */
function rgBlocoAberto(){ for(let b=0;b<BLOCOS.length;b++){ if(BLOCOS[b].some(n=>RG.feitos[n]==null)) return b; } return BLOCOS.length; }
const corSent = sid => (SENT.find(s=>s.id===sid)||{}).cor || "#f5c542";

/* ---------- estilos da Fase 3 nova ---------- */
const css=document.createElement("style"); css.textContent=`
.rg-brisa{display:flex;gap:14px;align-items:flex-start;text-align:left;background:rgba(17,27,61,.78);border:1px solid rgba(245,197,66,.35);border-radius:22px;padding:16px;margin:4px 0 18px}
.rg-brisa img{width:84px;height:84px;border-radius:50%;object-fit:cover;flex:none;border:2px solid var(--ouro)}
.rg-brisa p{margin:0;font-size:19px;line-height:1.5}
.rg-brisa b{display:block;color:var(--ouro);font:400 14px "Space Mono",monospace;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
.rg-tag{display:inline-block;font:700 13px "Space Mono",monospace;color:#0a1128;background:#7fd3ff;border-radius:8px;padding:3px 8px;margin:0 0 10px}
.rg-mand{position:relative;width:min(250px,64vw);aspect-ratio:1;margin:6px auto 4px}
.rg-mand>img{position:absolute;inset:16%;width:68%;height:68%;object-fit:contain;filter:drop-shadow(0 10px 30px rgba(245,197,66,.25))}
.rg-mand i{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:rgba(169,179,209,.18);border:1.5px solid rgba(169,179,209,.35);transition:background .6s,box-shadow .6s,transform .6s}
.rg-mand i.on{background:var(--ouro);border-color:var(--ouro);box-shadow:0 0 14px var(--ouro)}
.rg-mand i.fase{background:#fff3c4;border-color:#fff3c4;box-shadow:0 0 12px #fff3c4}
.rg-mand i.nova{animation:rgAcende 1.2s ease-out}
@keyframes rgAcende{0%{transform:scale(.4)}60%{transform:scale(1.9)}100%{transform:scale(1)}}
.rg-estrela{display:block;margin:2px auto 6px;filter:drop-shadow(0 0 12px rgba(245,197,66,.7));transition:width .8s,height .8s}
.rg-estrela.cresce{animation:rgCresce 1.1s ease-out}
@keyframes rgCresce{0%{transform:scale(.7) rotate(-20deg)}55%{transform:scale(1.35) rotate(8deg)}100%{transform:none}}
.rg-legmand{font-size:16px;color:var(--azul);margin:0 0 16px}
.rg-nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin:12px 0 6px}
.rg-num{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px 10px;border-radius:20px;background:rgba(32,48,100,.55);border:1.5px solid rgba(245,197,66,.55);box-shadow:0 6px 0 rgba(0,0,0,.35)}
.rg-num b{font:800 38px/1 Fraunces,Georgia,serif;color:var(--ouro)}
.rg-num span{font-size:17px;font-weight:700}
.rg-num.ok{border-color:rgba(127,211,255,.5);opacity:.75;cursor:default;box-shadow:none}
.rg-num.ok b{color:#7fd3ff}
.rg-num.tranca{opacity:.35;cursor:default;border-style:dashed;box-shadow:none}
.rg-num:active:not(.ok):not(.tranca){transform:translateY(3px)}
.rg-bloco{font:400 14px "Space Mono",monospace;color:var(--azul);letter-spacing:.06em;text-transform:uppercase;margin:18px 0 0}
.rg-tit{font:800 clamp(44px,13vw,64px)/1 Fraunces,Georgia,serif;color:var(--ouro);margin:6px 0 2px}
.rg-tit small{display:block;font:700 22px Inter,system-ui,sans-serif;color:var(--creme);margin-top:8px}
.rg-sit{font-size:clamp(24px,6.4vw,30px);font-weight:800;line-height:1.25;margin:10px 0 18px}
.rg-esc{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:8px 0 14px}
.rg-esc button{all:unset;cursor:pointer;display:grid;place-items:center;width:calc((100% - 52px)/6);aspect-ratio:1;border-radius:16px;font:800 22px Inter,system-ui,sans-serif;background:rgba(32,48,100,.55);border:1.5px solid color-mix(in srgb,var(--k) 55%,transparent);box-shadow:0 5px 0 rgba(0,0,0,.35)}
.rg-esc button.sel{background:var(--k);color:#0b1020;box-shadow:0 0 22px var(--k)}
.rg-esc-pontas{display:flex;justify-content:space-between;color:var(--azul);font-size:15px;margin:0 2px 10px}
.rg-pontos{display:flex;gap:6px;justify-content:center;margin:0 0 14px}
.rg-pontos i{width:10px;height:10px;border-radius:50%;background:rgba(169,179,209,.25)}
.rg-pontos i.on{background:var(--k,#f5c542)}
.rg-previa{margin-top:22px;padding-top:14px;border-top:1px dashed rgba(169,179,209,.35);display:flex;flex-direction:column;gap:6px;align-items:center}
.rg-previa .linkflow::before{content:"⚙"}
`; document.head.appendChild(css);

/* ---------- topo e mandala ---------- */
function rgTopo(txt){
  const el=document.getElementById("const"); el.hidden=false;
  if(!document.getElementById("mtopo")) el.innerHTML=mandala(72,"mtopo")+`<span class="xde7" id="xde7"></span>`;
  const m=document.getElementById("mtopo"); requestAnimationFrame(()=>poeMandala(m,{pos:TODOS,luz:TODOS,miolo:true}));
  document.getElementById("xde7").innerHTML=`<b class="pal"><em>7</em>entidos</b><small>Fase 3</small>${esc(txt||"sua régua")}`;
  ["voltar","pularbtn","fundobtn"].forEach(id=>{ const b=document.getElementById(id); if(b) b.hidden=true; }); document.body.classList.add("emf3");
  foco(null); brilho(null); fundoCor(null); pararSom();
}
/* 13 luzes em volta da mandala: as 2 primeiras já acesas (Fases 1 e 2), depois 1 por número fechado */
function rgMandala(nova){ const feitos=rgFeitos().length, N=13; let h=`<div class="rg-mand" aria-label="Sua régua: ${feitos} de 11 números"><img src="${MANDALA}" alt="">`;
  for(let k=0;k<N;k++){ const a=-Math.PI/2+k*2*Math.PI/N, x=50+Math.cos(a)*46, y=50+Math.sin(a)*46;
    const cls=k<2?"fase":(k-2<feitos?"on"+(nova&&k-2===feitos-1?" nova":""):""); h+=`<i class="${cls}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%"></i>`; }
  return h+`</div>`; }
/* estrelinha: 11 tamanhos, um a cada número fechado */
function rgEstrela(cresce){ const t=34+rgFeitos().length*7;
  return `<svg class="rg-estrela${cresce?" cresce":""}" width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.6l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 8.8l7.1-.6z" fill="#f5c542"/></svg>`; }
function rgPreviaBotoes(){ if(!PREVIA) return "";
  return `<div class="rg-previa"><small class="sub" style="margin:0;font-size:14px">Só na prévia</small>
    <button class="linkflow" type="button" onclick="rgPulaEspera()">Pular a espera (novo dia)</button>
    <button class="linkflow" type="button" onclick="rgRefazColoque()">Ver o "Coloque na régua" de novo</button>
    <button class="linkflow" type="button" onclick="rgZera()">Recomeçar a Fase 3 do zero</button></div>`; }

/* ---------- 1 · ABERTURA (fim da Fase 2) ---------- */
const trava3Antiga = trava3;
window.trava3 = function(p){
  if(!F3_ABERTA) return trava3Antiga(p);   /* público: continua a porta trancada */
  const msab=montaSabor()||saborExemplo();
  const brisaTopo = VIDEO3_NOVO ? videoBrisa(VID3_REGUA,LEG3_NOVA)
    : `<div class="rg-brisa"><img src="${NO_SITE?"/app/":""}brisa-fase3.jpg" alt="Brisa"><p><b>Brisa</b>${esc(FALA3)}</p></div>`;
  mostra(`<div class="rot">Fase 3 · A sua régua</div>${brisaTopo}
    ${PREVIA&&!VIDEO3_NOVO?`<span class="rg-tag">vídeo novo da Brisa em gravação · por enquanto, o texto</span>`:""}
    <div><button class="btn" type="button" onclick="click();rgComeca()">Vamos começar</button></div>
    <div class="sabbaixa" style="margin-top:22px"><img id="sabprev" alt="${msab.exemplo?"Imagem de exemplo":"A imagem do seu momento"}" hidden><button class="btn sec" id="baixar" type="button" disabled>⬇ Baixar ${msab.exemplo?"a imagem":"minha imagem"}</button></div>
    <button class="btn sec" style="margin-top:14px" onclick="recomecar()">Fazer de novo</button>`,
    c=>{ if(VIDEO3_NOVO) ligaVideo(c,LEG3_NOVA,()=>{},VID3_REGUA); ligaBaixar(c,msab); });
};
window.rgComeca = function(){ rgCarrega(); RG.intro=true; if(!RG.primeiroDia) RG.primeiroDia=hojeStr(); rgSalva(); f3Abre(); };

/* a entrada da Fase 3 (também usada pelo "Continuar" de quem volta) */
window.f3Abre = function(){
  if(!F3_ABERTA){ try{ localStorage.removeItem("7e_fase3_ativa"); }catch(e){} entrou=true; pos=R.length-1; desenha(); return; }
  rgCarrega(); entrou=true; pos=R.length-1; try{ localStorage.setItem("7e_fase3_ativa","1"); }catch(e){}
  if(!RG.intro){ desenha(); return; }      /* ainda não viu a abertura: mostra a abertura */
  rgTela();
};
window.f3DaBrisa = window.rgComeca;

/* ---------- o "cérebro" das telas ---------- */
window.rgTela = rgTela;
function rgTela(nova){
  rgCarrega();
  if(!rgColFeito()) return rgColoque();                      /* 4 · antes do 10, no primeiro dia */
  if(rgFeitos().length===ORDEM.length) return rgFimFase();
  if(RG.atual && rgHojeN()<LIMITE_DIA) return rgEtapa(RG.atual.num);  /* continua o número em andamento */
  if(rgHojeN()>=LIMITE_DIA) return rgFimDia(nova);           /* 5 · limite do dia */
  return rgEscolhe(nova);
}

/* ---------- 4 · COLOQUE NA RÉGUA ---------- */
function rgColoque(){
  const i=COLOQUE.findIndex(c=>RG.col[c.sid]==null); const c=COLOQUE[i], k=corSent(c.sid), s=SENT.find(x=>x.id===c.sid);
  rgTopo("coloque na régua"); fundoCor(k); brilho(k);
  mostra(`<div class="rot">Coloque na régua · ${esc(s.s)}</div>
    ${i===0?`<p class="sub" style="margin-bottom:6px">Antes do seu 10: de 0 a 10, onde fica cada situação na sua régua?</p>`:""}
    ${PREVIA&&COLOQUE_PROVISORIO?`<span class="rg-tag">situação provisória · espera o resultado da Sala 3</span>`:""}
    <div class="rg-pontos" style="--k:${k}">${COLOQUE.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("")}</div>
    <h2 class="rg-sit">${esc(c.txt)}</h2>
    <div class="rg-esc" style="--k:${k}">${[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button type="button" onclick="rgColNota(this,'${c.sid}',${n})" aria-label="${n}">${n}</button>`).join("")}</div>
    ${i>0?`<div><button class="btn sec" type="button" style="min-height:48px;font-size:17px" onclick="rgColVolta()">← voltar uma</button></div>`:""}
    ${rgPreviaBotoes()}`);
}
window.rgColNota = function(b,sid,n){ if(ocupado) return; ocupado=true; click(); vibra(8+n);
  b.parentNode.querySelectorAll("button").forEach(x=>x.classList.remove("sel")); b.classList.add("sel");
  RG.col[sid]=n; if(rgColFeito()) RG.colFeito=hojeStr(); rgSalva();
  setTimeout(()=>{ ocupado=false; if(rgColFeito()){ fundoCor(null); brilho(null); rgEscolhe(false,true); } else rgColoque(); },420); };
window.rgColVolta = function(){ click(); const i=COLOQUE.findIndex(c=>RG.col[c.sid]==null); if(i>0){ delete RG.col[COLOQUE[i-1].sid]; rgSalva(); } rgColoque(); };

/* ---------- 3 · ESCOLHER O NÚMERO DO DIA ---------- */
function rgEscolhe(nova,depoisColoque){
  rgTopo(); const b=rgBlocoAberto(), abertos=BLOCOS[b]||[];
  const botao=n=>{ const ok=RG.feitos[n]!=null, tr=!abertos.includes(n)&&!ok;
    return `<button class="rg-num${ok?" ok":""}${tr?" tranca":""}" type="button" ${ok||tr?"disabled":`onclick="rgVai(${n})"`} aria-label="${n} ${NOMES[n]}${ok?", pronto":tr?", ainda fechado":""}"><b>${n}</b><span>${ok?"✓ ":tr?"🔒 ":""}${NOMES[n]}</span></button>`; };
  const pendentes=abertos.filter(n=>RG.feitos[n]==null);
  mostra(`<div class="rot">Fase 3 · A sua régua</div>
    ${rgMandala(nova)}${rgEstrela(nova)}
    <p class="rg-legmand">${rgFeitos().length?"Cada luz é um número da sua régua.":"Você já fez as Fases 1 e 2: duas luzes já estão acesas."}</p>
    <h2>${depoisColoque?"Pronto! Agora, o seu 10.":pendentes.length>1?"Hoje quero fazer o meu…":"O número de hoje"}</h2>
    <div class="rg-nums">${abertos.map(botao).join("")}</div>
    ${b<BLOCOS.length-1?`<p class="rg-bloco">Depois: ${BLOCOS.slice(b+1).map(x=>x.join(" · ")).join("  →  ")}</p>`:""}
    ${rgPreviaBotoes()}`);
}
window.rgVai = function(n){ if(ocupado) return; click(); vibra(12); if(!RG.atual||RG.atual.num!==n) RG.atual={num:n,rodadas:0}; rgSalva(); rgEtapa(n); };

/* ---------- 2 · A ETAPA DE UM NÚMERO ---------- */
/* Bloco 1: a rodada é só um marcador de teste. No Bloco 2 entra aqui o motor de perguntas (jeito Akinator). */
function rgEtapa(n){
  rgTopo(n+" · "+NOMES[n]);
  mostra(`<div class="rg-tit">${n}<small>${NOMES[n]}</small></div>
    <p class="sub" style="margin-top:14px">${n===10?"O que é um 10 pra você?":`O que é um ${n} pra você?`}</p>
    ${PREVIA?`<div class="rg-brisa" style="justify-content:center;text-align:center"><p><b>Só na prévia · Bloco 1</b>As perguntas de cada número entram no Bloco 2. Por enquanto, toque abaixo para simular uma rodada (o número fecha com ${RODADAS_TESTE}).</p></div>
    <button class="btn" type="button" onclick="rgRodadaTeste()">Fazer uma rodada de teste</button>`:`<p class="sub">Em breve.</p>`}
    <div style="margin-top:14px"><button class="btn sec" type="button" style="min-height:48px;font-size:17px" onclick="rgVoltaRegua()">← voltar à régua</button></div>
    ${rgPreviaBotoes()}`);
}
window.rgVoltaRegua = function(){ click(); rgEscolhe(); };
window.rgRodadaTeste = function(){ if(ocupado||!RG.atual) return; click(); vibra(10);
  RG.atual.rodadas++; rgContaRodada();
  if(RG.atual.rodadas>=RODADAS_TESTE) return rgFechaNumero();
  rgSalva(); if(rgHojeN()>=LIMITE_DIA) return rgFimDia(); rgEtapa(RG.atual.num); };
function rgFechaNumero(){ const n=RG.atual.num; RG.feitos[n]=hojeStr(); RG.atual=null; rgSalva(); vibra([12,40,20]);
  rgTopo();
  mostra(`<div class="rot">Mais um número na sua régua</div>
    ${rgMandala(true)}${rgEstrela(true)}
    <div class="rg-tit" style="font-size:44px">${n}<small>${NOMES[n]}</small></div>
    <h2 style="margin-top:14px">${rgFeitos().length===ORDEM.length?"Você completou a sua régua.":"Seu "+n+" está na régua."}</h2>
    <div style="margin-top:16px"><button class="btn" type="button" onclick="click();rgTela()">Seguir</button></div>`); }

/* ---------- 5 · FIM DO DIA ---------- */
function rgFimDia(nova){ rgTopo("até amanhã");
  mostra(`<div class="rot">Fase 3 · A sua régua</div>${rgMandala(nova)}${rgEstrela(nova)}
    <h2>${FIM_DIA}</h2>
    <button class="btn sec" style="margin-top:14px" type="button" onclick="irInicio()">Ir para o começo</button>
    ${rgPreviaBotoes()}`); }

/* ---------- fim da fase (tela neutra; o Bloco 5 confere) ---------- */
function rgFimFase(){ rgTopo("régua montada");
  mostra(`<div class="rot">Fase 3</div>${rgMandala()}${rgEstrela()}
    <h2>Sua régua está montada.</h2><p class="sub">Na próxima fase, você confere o que eu percebi.</p>
    ${rgPreviaBotoes()}`); }

/* ---------- botões só da prévia ---------- */
window.rgPulaEspera = function(){ click(); RG.hoje=null; rgSalva(); rgTela(); };
window.rgRefazColoque = function(){ click(); RG.col={}; delete RG.colFeito; rgSalva(); rgTela(); };
window.rgZera = function(){ click(); RG={v:1,col:{},feitos:{},atual:null,hoje:null}; rgSalva(); entrou=true; pos=R.length-1; desenha(); };
})();
