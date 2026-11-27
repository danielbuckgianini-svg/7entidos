/* =====================================================================
   7entidos · FASE 3 · MECÂNICA 4: O TESTE DE IMAGENS  (branch fase3-regua, só na prévia)
   Bloco 4 (27/11):
   1. "Duelo das sensações": 2 fotos lado a lado, ela toca na que tem mais a ver com ela.
      20 duplas, 5 por dia, em 4 dias. Cada dupla mede 1 dos 5 traços (4 duplas por traço).
      A 1ª foto de cada dupla conta para o traço; a 2ª, para o lado oposto. Os dois lados são bons.
   2. Variações em dias diferentes que NÃO pesam no resultado: "Desliza" (dia 2), "Galeria" (dia 3),
      "Quiz Qual sensação é você?" (dia 4, com "Trocar pergunta").
   3. Resultado: 5 tipos, só o tipo e uma frase + o aviso.
   4. "Compartilhar": cartão bonito só com o tipo, para WhatsApp e Instagram, com o link do YouTube.
   5. A pontuação dos 5 traços fica guardada SÓ no celular, como pista para a régua e as próximas fases.
      Nunca mostra números nem gráfico para ela.
   Depende de fase3-regua.js (rgTopo, rgModal, rgAviso, rgFotoHTML, RG_CANVA, RG_LIVRE).
   ===================================================================== */
(function(){
if(typeof F3_ABERTA==="undefined" || typeof window.rgTopo!=="function") return;

const CHAVE_TI = window.RG_TESTE ? "7e_teste_img_teste" : "7e_teste_img";
const YT = "https://www.youtube.com/@7Entidos";
const TRACOS = ["ext","abe","gen","org","cal"];   /* ordem dos tipos (também usada para desempatar) */
const DUPLAS = {
 ext:[["festa com amigos dançando","jantar a dois à luz de velas"],["praia cheia num domingo de sol","praia vazia de manhã cedo"],["roda de samba ao vivo","música baixinha no fone, em casa"],["almoço de família com mesa grande","café sozinha na varanda"]],
 abe:[["prato que nunca provou","prato favorito de sempre"],["trilha num lugar desconhecido","caminhada no caminho de sempre"],["museu de arte moderna","passeio na praça do bairro"],["aprender a pintar com tinta","ver a novela preferida"]],
 org:[["agenda colorida e organizada","dia livre, sem planos"],["armário arrumado por cores","roupas para dobrar depois"],["lista de compras pronta","escolher no mercado na hora"],["viagem com roteiro","mochila pronta, sem destino"]],
 gen:[["ajudar a vizinha com as sacolas","defender sua opinião numa reunião"],["cuidar das plantas","ganhar um jogo de tabuleiro"],["cozinhar para os outros","ser servida num restaurante"],["abraço de reconciliação","dizer \"não\" com firmeza"]],
 cal:[["tranquila olhando a chuva forte","chorando de emoção num filme"],["lendo calma no avião","segurando a mão de alguém no avião"],["fila longa, sem pressa","olhando o relógio na fila"],["meditando numa pedra à beira-mar","gritando na montanha-russa"]]
};
const TIPOS = {
 ext:{e:"☀️",n:"Sol de verão",f:"Você ilumina qualquer lugar e se enche de energia com gente por perto.",cor:"#ffcf3f"},
 abe:{e:"🌊",n:"Mar aberto",f:"Curiosa, você adora provar, ver e sentir o que ainda não conhece.",cor:"#5ec8ff"},
 gen:{e:"🌸",n:"Jardim",f:"Você cuida de quem está em volta, e o carinho é o seu jeito de sentir.",cor:"#ff86c0"},
 org:{e:"🌳",n:"Raiz",f:"Organizada e firme, você gosta de saber onde está pisando.",cor:"#6fe0a0"},
 cal:{e:"🏞️",n:"Lago calmo",f:"Você tem uma calma rara: sente tudo, mas sem perder a paz.",cor:"#a6c8ff"}
};
const AVISO = "Um jeito divertido de se conhecer, inspirado em estudos de personalidade.";
/* QUIZ (variação do dia 4, não pesa) · PROVISÓRIO, para o Daniel validar: perguntas usando as fotos das duplas */
const QUIZ = [
 {q:"Qual cena tem mais a cara do seu domingo?", o:["praia cheia num domingo de sol","café sozinha na varanda","almoço de família com mesa grande"]},
 {q:"Onde você queria estar agora?", o:["trilha num lugar desconhecido","meditando numa pedra à beira-mar","roda de samba ao vivo"]},
 {q:"Qual dessas te deixa mais leve?", o:["cuidar das plantas","armário arrumado por cores","dia livre, sem planos"]},
 {q:"Qual programa você escolheria hoje?", o:["museu de arte moderna","ver a novela preferida","jantar a dois à luz de velas"]},
 {q:"Qual tem mais o seu jeito de viajar?", o:["viagem com roteiro","mochila pronta, sem destino","lendo calma no avião"]}
];
const VARIACAO = {2:"desliza",3:"galeria",4:"quiz"};   /* dia do teste → variação (dia 1 não tem) */

const slug = window.rgSlug, CANVA = window.RG_CANVA;
const arqDe = t => "teste-"+slug(t)+".jpg";
const fotoDe = (t,cls) => window.rgFotoHTML(CANVA+arqDe(t), arqDe(t), cls);
const TODAS = TRACOS.flatMap(k=>DUPLAS[k].flat());
/* lista para o relatório de fotos (Bloco 3): arquivo e onde aparece */
window.tiListaFotos = () => TRACOS.flatMap(k=>DUPLAS[k].flatMap(([a,b])=>[[arqDe(a),"Teste de imagens · "+k],[arqDe(b),"Teste de imagens · "+k]]))
  .concat(TRACOS.map(k=>["teste-tipo-"+slug(TIPOS[k].n)+".jpg","Resultado do teste · "+TIPOS[k].n]));

/* ---------- o que fica guardado (só no celular) ---------- */
let TI=null;
function tiNovo(){ return {v:1,dia:0,resp:{},pontos:{ext:0,abe:0,gen:0,org:0,cal:0},var:{},datas:[],tipo:null,intro:false,passo:0}; }
function tiCarrega(){ if(TI) return TI; try{ TI=JSON.parse(localStorage.getItem(CHAVE_TI)||"null"); }catch(e){} if(!TI||TI.v!==1) TI=tiNovo(); return TI; }
function tiSalva(){ try{ localStorage.setItem(CHAVE_TI,JSON.stringify(TI));
  /* pista para a régua e as próximas fases (nunca aparece para ela) */
  localStorage.setItem("7e_pistas_tracos",JSON.stringify({pontos:TI.pontos,respondidas:Object.keys(TI.resp).length,tipo:TI.tipo})); }catch(e){} }
function hoje(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
window.tiEstado = () => { tiCarrega(); return {diasFeitos:TI.dia, pronto:TI.dia>=4, hojeFeito:TI.datas.includes(hoje()), tipo:TI.tipo}; };
window.tiPontos = () => { tiCarrega(); return Object.assign({},TI.pontos); };
window.tiZera = () => { TI=tiNovo(); tiSalva(); };
/* as 5 duplas de um dia (dia 1 a 4): uma de cada traço, em ordem que muda a cada dia */
function duplasDoDia(d){ const k=d-1; const ord=TRACOS.slice(k%5).concat(TRACOS.slice(0,k%5)); return ord.map(t=>({t,i:k,a:DUPLAS[t][k][0],b:DUPLAS[t][k][1]})); }
function tiTipo(){ let best=TRACOS[0]; TRACOS.forEach(t=>{ if(TI.pontos[t]>TI.pontos[best]) best=t; }); return best; }

/* ---------- estilos ---------- */
const css=document.createElement("style"); css.textContent=`
.ti-par{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0 10px}
.ti-par .rg-opf .rg-ft{aspect-ratio:3/4}
.ti-vs{font:800 16px "Space Mono",monospace;color:var(--azul);margin:-2px 0 6px}
.ti-pontos{display:flex;gap:8px;justify-content:center;margin:4px 0 6px}
.ti-pontos i{width:12px;height:12px;border-radius:50%;background:rgba(169,179,209,.25)}
.ti-pontos i.on{background:var(--ouro)}
.ti-uma{width:min(330px,86%);margin:10px auto 14px;border-radius:24px;overflow:hidden;position:relative;border:2px solid rgba(245,197,66,.5);touch-action:pan-y;transition:transform .25s}
.ti-uma .rg-ft{aspect-ratio:4/5}
.ti-uma .rg-cap{position:absolute;left:0;right:0;bottom:0;padding:34px 14px 14px;font-size:20px;font-weight:800;color:#fff;background:linear-gradient(180deg,transparent,rgba(5,9,26,.92) 55%)}
.ti-sn{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:380px;margin:0 auto}
.ti-sn .btn{min-height:56px;font-size:18px}
.ti-gal{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 14px}
.ti-gal button{all:unset;cursor:pointer;position:relative;border-radius:14px;overflow:hidden;border:2px solid transparent}
.ti-gal .rg-ft{aspect-ratio:1}
.ti-gal button.sel{border-color:var(--ouro);box-shadow:0 0 16px rgba(245,197,66,.5)}
.ti-gal button.sel::after{content:"✓";position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:var(--ouro);color:#15110a;font-weight:800;display:grid;place-items:center}
.ti-gal small{position:absolute;left:0;right:0;bottom:0;padding:14px 6px 6px;font-size:12px;font-weight:700;line-height:1.2;color:#fff;background:linear-gradient(180deg,transparent,rgba(5,9,26,.9) 50%)}
.ti-quiz{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0 12px}
.ti-quiz .rg-opf .rg-ft{aspect-ratio:3/5}
.ti-quiz .rg-opf .rg-cap{font-size:14px;padding:24px 8px 8px}
.ti-res{max-width:440px;margin:6px auto;padding:22px 18px;border-radius:26px;background:rgba(17,27,61,.85);border:2px solid var(--k);box-shadow:0 0 40px color-mix(in srgb,var(--k) 30%,transparent)}
.ti-res .ti-em{font-size:64px;line-height:1}
.ti-res h2{font:800 clamp(34px,10vw,46px)/1.1 Fraunces,Georgia,serif;color:var(--k);margin:8px 0 10px}
.ti-res p{font-size:20px;line-height:1.5;margin:0}
.ti-res .ti-ft{width:100%;aspect-ratio:16/10;border-radius:18px;margin:14px 0 0}
.ti-aviso{font-size:15px;color:var(--azul);margin:12px auto 0;max-width:420px}
.ti-com{display:flex;flex-direction:column;gap:10px;max-width:380px;margin:16px auto 0}
`; document.head.appendChild(css);

/* ---------- a entrada do teste (chamada pelo mapa da Fase 3) ---------- */
window.tiAbre = function(){ tiCarrega(); entrou=true; pos=R.length-1;
  if(TI.dia>=4 && !TI.emCurso) return tiResultado();
  if(!TI.emCurso){ /* começa um novo dia do teste */
    if(!window.RG_LIVRE && TI.datas.includes(hoje())) return tiVolteAmanha();
    TI.emCurso={dia:TI.dia+1, i:0, fase:"duelo"}; tiSalva(); }
  if(!TI.intro) return tiIntro();
  tiPasso(); };
function tiIntro(){ window.rgTopo("teste de imagens");
  mostra(`<div class="rot">Fase 3 · Teste de imagens</div>
    <div class="rg-reforco"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>Vou te mostrar duas fotos de cada vez. Toque na que tem mais a ver com você.</p></div>
    <h2 class="rg-q">Duelo das sensações</h2>
    <p class="sub">Não tem certo nem errado: os dois lados são bons. São 5 duplas por dia, em 4 dias.</p>
    <div class="ti-par" aria-hidden="true">${fotoDe("praia cheia num domingo de sol","")}${fotoDe("praia vazia de manhã cedo","")}</div>
    <button class="btn" type="button" onclick="click();tiComeca()">Começar</button>`); }
window.tiComeca = function(){ TI.intro=true; tiSalva(); tiPasso(); };
function tiPasso(){ const c=TI.emCurso; if(!c) return tiAbre();
  if(c.fase==="duelo") return tiDuelo();
  if(c.fase==="variacao") return tiVariacao();
  return tiFimDia(); }

/* ---------- 1 · o duelo ---------- */
function tiDuelo(){ const c=TI.emCurso, L=duplasDoDia(c.dia), d=L[c.i];
  window.rgTopo("teste de imagens · dia "+c.dia);
  const card=(t,lado)=>`<button class="rg-op rg-opf" type="button" style="--c:${TIPOS[d.t].cor}" onclick="tiEscolhe(this,'${lado}')">${fotoDe(t)}<span class="rg-cap">${esc(t.charAt(0).toUpperCase()+t.slice(1))}</span></button>`;
  mostra(`<div class="rot">Duelo das sensações · dia ${c.dia} de 4</div>
    <div class="ti-pontos">${L.map((_,k)=>`<i class="${k<c.i?"on":""}"></i>`).join("")}</div>
    <h2 class="rg-q">Qual tem mais a ver com você?</h2>
    <p class="rg-dica">Toque em uma das duas fotos.</p>
    <div class="ti-par">${card(d.a,"a")}${card(d.b,"b")}</div>`); }
window.tiEscolhe = function(btn,lado){ if(ocupado) return; ocupado=true; click(); vibra(10);
  btn.classList.add("sel"); const c=TI.emCurso, d=duplasDoDia(c.dia)[c.i], id=d.t+"-"+d.i;
  TI.resp[id]=lado;
  TRACOS.forEach(t=>{ TI.pontos[t]=Object.entries(TI.resp).filter(([k,v])=>k.startsWith(t+"-")&&v==="a").length; });
  c.i++; if(c.i>=5){ c.fase = VARIACAO[c.dia] ? "variacao" : "fim"; c.vi=0; }
  tiSalva(); setTimeout(()=>{ ocupado=false; tiPasso(); },450); };

/* ---------- 2 · as variações (não pesam no resultado) ---------- */
function tiVariacao(){ const c=TI.emCurso, v=VARIACAO[c.dia];
  if(v==="desliza") return tiDesliza(); if(v==="galeria") return tiGaleria(); return tiQuiz(); }
/* fotos da variação: as do dia anterior (ela já conhece) misturadas com outras */
function tiFotosVar(qtd,semente){ const out=[]; let k=semente*7; while(out.length<qtd){ const t=TODAS[k%TODAS.length]; if(!out.includes(t)) out.push(t); k+=11; } return out; }
function tiDesliza(){ const c=TI.emCurso, L=tiFotosVar(5,c.dia), t=L[c.vi||0];
  window.rgTopo("teste de imagens · dia "+c.dia);
  mostra(`<div class="rot">Desliza · bônus do dia</div>
    <div class="ti-pontos">${L.map((_,k)=>`<i class="${k<(c.vi||0)?"on":""}"></i>`).join("")}</div>
    <h2 class="rg-q">Essa é você?</h2><p class="rg-dica">Deslize para o lado ou toque num botão.</p>
    <div class="ti-uma" id="tiuma">${fotoDe(t)}<span class="rg-cap">${esc(t.charAt(0).toUpperCase()+t.slice(1))}</span></div>
    <div class="ti-sn"><button class="btn sec" type="button" onclick="tiSouEu(0)">✕ Não sou eu</button><button class="btn" type="button" onclick="tiSouEu(1)">✓ Sou eu</button></div>`,
    cena=>{ const el=cena.querySelector("#tiuma"); if(!el) return; let x0=null;
      el.addEventListener("pointerdown",e=>{ x0=e.clientX; });
      el.addEventListener("pointermove",e=>{ if(x0==null) return; el.style.transform=`translateX(${e.clientX-x0}px) rotate(${(e.clientX-x0)/20}deg)`; });
      const solta=e=>{ if(x0==null) return; const dx=e.clientX-x0; x0=null; el.style.transform=""; if(Math.abs(dx)>80) tiSouEu(dx>0?1:0); };
      el.addEventListener("pointerup",solta); el.addEventListener("pointercancel",()=>{ x0=null; el.style.transform=""; }); }); }
window.tiSouEu = function(sim){ if(ocupado) return; click(); vibra(10); const c=TI.emCurso, L=tiFotosVar(5,c.dia);
  (TI.var.desliza=TI.var.desliza||[]).push({foto:L[c.vi||0],souEu:!!sim}); c.vi=(c.vi||0)+1;
  if(c.vi>=L.length) c.fase="fim"; tiSalva(); tiPasso(); };
function tiGaleria(){ const c=TI.emCurso, L=tiFotosVar(9,c.dia+3); c.gsel=c.gsel||[];
  window.rgTopo("teste de imagens · dia "+c.dia);
  mostra(`<div class="rot">Galeria · bônus do dia</div>
    <h2 class="rg-q">Escolha as 3 fotos de que você mais gosta</h2>
    <p class="rg-dica" id="tigdica">${c.gsel.length}/3 escolhidas</p>
    <div class="ti-gal">${L.map((t,k)=>`<button type="button" class="${c.gsel.includes(t)?"sel":""}" onclick="tiGal(this,${k})">${fotoDe(t)}<small>${esc(t.charAt(0).toUpperCase()+t.slice(1))}</small></button>`).join("")}</div>
    <button class="btn" id="tigok" type="button" onclick="tiGalOk()" ${c.gsel.length===3?"":"disabled"}>Pronto</button>`); }
window.tiGal = function(b,k){ click(); vibra(8); const c=TI.emCurso, t=tiFotosVar(9,c.dia+3)[k], i=c.gsel.indexOf(t);
  if(i>=0) c.gsel.splice(i,1); else { if(c.gsel.length>=3) return window.rgAviso("Já são 3. Toque numa escolhida para trocar."); c.gsel.push(t); }
  b.classList.toggle("sel",c.gsel.includes(t)); document.getElementById("tigdica").textContent=c.gsel.length+"/3 escolhidas"; document.getElementById("tigok").disabled=c.gsel.length!==3; tiSalva(); };
window.tiGalOk = function(){ const c=TI.emCurso; if(c.gsel.length!==3) return; click(); TI.var.galeria=c.gsel.slice(); c.fase="fim"; tiSalva(); tiPasso(); };
function tiQuiz(){ const c=TI.emCurso; c.qi=c.qi||0; c.qn=c.qn||0; const Q=QUIZ[c.qi%QUIZ.length];
  window.rgTopo("teste de imagens · dia "+c.dia);
  mostra(`<div class="rot">Quiz · Qual sensação é você?</div>
    <div class="ti-pontos">${[0,1,2].map(k=>`<i class="${k<c.qn?"on":""}"></i>`).join("")}</div>
    <h2 class="rg-q">${esc(Q.q)}</h2>
    <div class="ti-quiz">${Q.o.map((t,k)=>`<button class="rg-op rg-opf" type="button" onclick="tiQuizResp(this,${k})">${fotoDe(t)}<span class="rg-cap">${esc(t.charAt(0).toUpperCase()+t.slice(1))}</span></button>`).join("")}</div>
    <button class="rg-volta" type="button" onclick="tiTroca()">↻ Trocar pergunta</button>`); }
window.tiTroca = function(){ click(); TI.emCurso.qi=(TI.emCurso.qi||0)+1; tiSalva(); tiQuiz(); };
window.tiQuizResp = function(b,k){ if(ocupado) return; ocupado=true; click(); vibra(10); b.classList.add("sel"); const c=TI.emCurso, Q=QUIZ[c.qi%QUIZ.length];
  (TI.var.quiz=TI.var.quiz||[]).push({q:Q.q,r:Q.o[k]}); c.qn++; c.qi++; if(c.qn>=3) c.fase="fim";
  tiSalva(); setTimeout(()=>{ ocupado=false; tiPasso(); },420); };

/* ---------- fim de cada dia do teste ---------- */
const FRASE_DIA = {1:"Primeiras 5 duplas feitas. Você escolheu rápido e com sinceridade!",2:"Mais 5! Estou começando a ver o seu jeito.",3:"Falta só um dia. Você está indo muito bem.",4:"Pronto! Você terminou o teste de imagens."};
function tiFimDia(){ const c=TI.emCurso; TI.dia=c.dia; TI.datas.push(hoje()); delete TI.emCurso; if(TI.dia>=4) TI.tipo=tiTipo(); tiSalva();
  vibra([12,40,20]); somVitoria&&somVitoria();
  if(TI.dia>=4) return tiResultado(true);
  window.rgTopo("teste de imagens");
  mostra(`<div class="rot">Teste de imagens · dia ${TI.dia} de 4</div>
    <div class="ti-pontos">${[1,2,3,4].map(k=>`<i class="${k<=TI.dia?"on":""}"></i>`).join("")}</div>
    <div class="rg-reforco"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${FRASE_DIA[TI.dia]}</p></div>
    <h2>Por hoje é isso. Amanhã tem mais.</h2>${window.RG_LIVRE?`<p class="sub" style="font-size:15px">Só enquanto as travas estão desligadas: dá para seguir agora.</p>`:""}
    <div class="ti-com">${window.RG_LIVRE?`<button class="btn" type="button" onclick="click();tiAbre()">Fazer o dia ${TI.dia+1} agora</button>`:""}
    <button class="btn ${window.RG_LIVRE?"sec":""}" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button></div>`); }
function tiVolteAmanha(){ window.rgTopo("teste de imagens");
  mostra(`<div class="rot">Teste de imagens</div><h2>Você já fez o teste hoje.</h2><p class="sub">Amanhã tem mais 5 duplas.</p>
    <button class="btn" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button>`); }

/* ---------- 3 · o resultado (só o tipo e uma frase) ---------- */
function tiResultadoHTML(){ const T=TIPOS[TI.tipo||tiTipo()];
  return `<div class="ti-res" style="--k:${T.cor}"><div class="ti-em">${T.e}</div><h2>${T.n}</h2><p>${esc(T.f)}</p>
    ${window.rgFotoHTML(CANVA+"teste-tipo-"+slug(T.n)+".jpg","teste-tipo-"+slug(T.n)+".jpg","ti-ft")}</div>
    <p class="ti-aviso">${AVISO}</p>`; }
window.tiResultadoHTML = () => { tiCarrega(); return TI.tipo ? tiResultadoHTML() : ""; };
function tiResultado(novo){ window.rgTopo("seu tipo");
  mostra(`<div class="rot">Teste de imagens · seu tipo</div>
    ${novo?`<div class="rg-reforco"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${FRASE_DIA[4]}</p></div>`:""}
    ${tiResultadoHTML()}
    <div class="ti-com"><button class="btn" type="button" onclick="tiCompartilha()">Compartilhar</button>
    <button class="btn sec" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button></div>`); }

/* ---------- 4 · compartilhar: cartão bonito só com o tipo + link do YouTube ---------- */
function tiCartao(){ const T=TIPOS[TI.tipo||tiTipo()], W=1080, H=1350; let cv, g;
  const fontes=(document.fonts&&document.fonts.ready)?document.fonts.ready.catch(()=>{}):Promise.resolve();
  const carrega=src=>new Promise(ok=>{ const im=new Image(); im.onload=()=>ok(im); im.onerror=()=>ok(null); im.src=src; });
  return Promise.all([fontes,carrega(CANVA+"teste-tipo-"+slug(T.n)+".jpg"),carrega(MANDALA)]).then(([_,foto0,mand0])=>{
   /* se alguma imagem não puder ir para o cartão (segurança do navegador), refaz o cartão sem ela */
   const desenha=(foto,mand)=>{ cv=document.createElement("canvas"); cv.width=W; cv.height=H; g=cv.getContext("2d");
    const f=g.createLinearGradient(0,0,0,H); f.addColorStop(0,"#0a1128"); f.addColorStop(1,"#141a45"); g.fillStyle=f; g.fillRect(0,0,W,H);
    const rg=g.createRadialGradient(W/2,420,40,W/2,420,620); rg.addColorStop(0,T.cor+"55"); rg.addColorStop(1,"transparent"); g.fillStyle=rg; g.fillRect(0,0,W,H);
    if(foto){ const fw=840, fh=470, x=(W-fw)/2, y=170; g.save(); g.beginPath(); g.roundRect?g.roundRect(x,y,fw,fh,40):g.rect(x,y,fw,fh); g.clip();
      const r=Math.max(fw/foto.width,fh/foto.height); g.drawImage(foto,x+(fw-foto.width*r)/2,y+(fh-foto.height*r)/2,foto.width*r,foto.height*r); g.restore(); }
    g.textAlign="center"; g.fillStyle="#f5c542"; g.font="700 34px 'Space Mono', monospace"; g.fillText("MEU TIPO NO 7ENTIDOS",W/2,120);
    const y0=foto?720:430; g.font="150px serif"; g.fillText(T.e,W/2,y0+40);
    g.fillStyle=T.cor; g.font="800 108px Fraunces, Georgia, serif"; g.fillText(T.n,W/2,y0+190);
    g.fillStyle="#f3ecd8"; g.font="500 46px Inter, system-ui, sans-serif";
    const linhas=[]; let l=""; T.f.split(" ").forEach(w=>{ const t=l?l+" "+w:w; if(g.measureText(t).width>880){ linhas.push(l); l=w; } else l=t; }); if(l) linhas.push(l);
    linhas.forEach((t,k)=>g.fillText(t,W/2,y0+280+k*62));
    if(mand) g.drawImage(mand,W/2-210,H-170,72,72);
    const xt=mand?W/2-120:W/2; g.textAlign=mand?"left":"center"; g.fillStyle="#f3ecd8"; g.font="700 40px Inter, system-ui, sans-serif"; g.fillText("7entidos",xt,H-118);
    g.fillStyle="#a9b3d1"; g.font="400 30px Inter, system-ui, sans-serif"; g.fillText("youtube.com/@7Entidos",xt,H-76);
   };
    const gera=()=>new Promise((ok,er)=>{ try{ cv.toBlob(b=>b?ok(b):er(),"image/png"); }catch(e){ er(e); } });
    desenha(foto0,mand0); return gera().catch(()=>{ desenha(null,null); return gera(); }); }); }
const textoShare = () => { const T=TIPOS[TI.tipo||tiTipo()]; return `Fiz o teste de imagens do 7entidos e deu: ${T.e} ${T.n}! ${T.f} Descubra o seu. Assista aos episódios no nosso canal: ${YT}`; };
window.tiCompartilha = function(){ click(); tiCartao().then(blob=>{ const nome="7entidos-meu-tipo.png";
  try{ const fl=new File([blob],nome,{type:"image/png"}); if(navigator.canShare&&navigator.canShare({files:[fl]})){ navigator.share({files:[fl],text:textoShare()}).catch(()=>{}); return; } }catch(e){}
  const url=URL.createObjectURL(blob);
  window.rgModal(`<h3>Compartilhar o seu tipo</h3><img src="${url}" alt="Cartão com o seu tipo" style="width:100%;border-radius:16px;margin-bottom:12px">
    <div class="col"><a class="btn" href="https://wa.me/?text=${encodeURIComponent(textoShare())}" target="_blank" rel="noopener">Mandar no WhatsApp</a>
    <button class="btn sec" type="button" id="tibaixa">Baixar a imagem (para o Instagram)</button>
    <p style="font-size:15px;margin:4px 0 0">No Instagram, poste a imagem e escreva "link na bio" ou "procure 7Entidos no YouTube".</p>
    <button class="rg-volta" type="button" onclick="rgFechaModal()">fechar</button></div>`);
  document.getElementById("tibaixa").onclick=()=>{ click();
    if(window.claude&&claude.use&&!NO_SITE){ claude.use("downloads").then(dl=>{ if(dl) return dl.save({filename:nome,data:blob}).catch(()=>{}); baixaComum(blob,nome); }).catch(()=>baixaComum(blob,nome)); return; }
    const a=document.createElement("a"); a.href=url; a.download=nome; document.body.appendChild(a); a.click(); setTimeout(()=>a.remove(),500); };
}).catch(e=>{ try{ console.warn("cartao",e); }catch(_){} window.rgAviso("Não deu para montar o cartão agora."); }); };

if(typeof window.f3Mapa3!=="function") window.f3Mapa3 = () => window.rgTela();

/* ---------- atalho só do modo teste: preencher o teste inteiro ---------- */
window.tiCompletaTeste = function(){ tiCarrega(); for(let d=1; d<=4; d++) duplasDoDia(d).forEach((x,k)=>{ TI.resp[x.t+"-"+x.i]=(k+d)%3?"a":"b"; });
  TRACOS.forEach(t=>{ TI.pontos[t]=Object.entries(TI.resp).filter(([k,v])=>k.startsWith(t+"-")&&v==="a").length; });
  TI.dia=4; TI.intro=true; delete TI.emCurso; TI.tipo=tiTipo(); tiSalva(); };
})();
