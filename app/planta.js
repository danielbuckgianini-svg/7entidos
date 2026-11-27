/* =====================================================================
   7entidos · A PLANTINHA (o progresso do app inteiro) · V5 (27/11), só na prévia
   Bloco 10 · o lugar e os andares
     1. GRANDE, no topo da tela inicial (no lugar da mandala). A barra de 11 bolinhas continua dentro da Fase 3.
     2. 7 andares: Fase 1, Fase 2, Fase 3, Fase 4, Fase 5, Hall da Fama e "Onde tudo muda" (botão de flor fechado e brilhante).
     3. Já começa plantada, com um broto: na primeira vez, a Brisa planta junto com ela, com uma frase curta.
     4. Tocar na planta: a Brisa diz em que fase ela está (com "Ouvir a Brisa").
     5. Cresce para cima e NUNCA murcha nem desce (nem quando ela recomeça uma fase ou fica dias sem entrar).
   Bloco 11 · sinais, festa e fotos
     1. Folhinha nova no meio da fase (Fase 3: a cada número fechado; nas outras: na metade).
     2. Festa no fim de cada fase: sobe um andar com uma luz, som de vitória (trilha-vitoria.mp3), vibração e uma frase curta da Brisa.
        Sem pontos e sem competição.
     3. A frase: no começo o que já fez ("Você já fez 2 de 7"); perto do fim, o que falta ("Faltam só 2").
     4. Fotos do Canva (por enquanto, espaço reservado com o nome do arquivo): planta-0-broto, planta-1 a planta-7 e planta-folhinha.
   Nada é desenhado à mão: só fotos do Canva (ou o espaço reservado).
   ===================================================================== */
(function(){
if(typeof PREVIA==="undefined" || !PREVIA || !window.FICHA) return;
const PASTA = (NO_SITE?"/app/":"")+"fotos-canva/";
const ANDARES = ["Fase 1","Fase 2","Fase 3","Fase 4","Fase 5","Hall da Fama","Onde tudo muda"];
const arqPlanta = k => k<=0 ? "planta-0-broto.png" : "planta-"+Math.min(7,k)+".png";
const ARQ_FOLHA = "planta-folhinha.png";
const I = FICHA._interno;

/* quantos andares ela já subiu (nunca desce) */
function andares(){ const f=I.carrega(); const k=Math.max(FICHA.fasesFeitas(), f.planta.max||0);
  if(k>(f.planta.max||0)){ f.planta.max=k; I.salva(); } return k; }
/* folhinhas da fase que está em andamento */
function folhasAgora(){ const f=I.carrega(), k=andares(), fase=k+1, fl=f.planta.folhas||{};
  if(fase===1) return fl.f1?1:0;
  if(fase===2) return fl.f2?1:0;
  if(fase===3) return Object.keys(fl).filter(x=>/^f3:/.test(x)).length;
  return 0; }
function frase(k){ if(k<=0) return "Sua plantinha acabou de nascer.";
  if(k>=7) return "Você fez os 7 andares.";
  if(k>=5) return "Faltam só "+(7-k)+".";
  return "Você já fez "+k+" de 7."; }
function ondeEsta(k){ if(k>=7) return "Você chegou ao topo: onde tudo muda.";
  if(k===6) return "Agora falta só o último andar: onde tudo muda.";
  if(k===5) return "Agora é o Hall da Fama.";
  const fase=k+1; return "Você está na Fase "+fase+"."+(fase>=4?" Ela chega em breve.":""); }
function foto(arq,cls,alt){ return `<span class="pl-ft ${cls||""}"><img src="${PASTA+arq}" alt="${alt||""}" onerror="plantaSemFoto(this,'${arq}')"></span>`; }
window.plantaSemFoto = function(img,arq){ const p=img.parentNode; if(p) p.innerHTML=`<span class="rg-ph"><b>foto a fazer no Canva</b><code>${esc(arq)}</code></span>`; };

/* o bloco da planta (tela inicial) */
function plantaHTML(){ const f=I.carrega(), k=andares(), fo=folhasAgora(), primeira=!f.planta.plantou;
  const nFr = FICHA.frases ? FICHA.frases.lista().length : 0;
  return `<div class="pl-bloco">
    <button class="pl-planta" type="button" onclick="plantaToca()" aria-label="Sua plantinha, ${k} de 7 andares. Toque para a Brisa dizer em que fase você está.">
      ${foto(arqPlanta(k),"pl-grande","Sua plantinha")}
      ${fo?`<span class="pl-folha">${foto(ARQ_FOLHA,"pl-pq","Folhinha")}<em>${fo===1?"1 folhinha nova":fo+" folhinhas novas"}</em></span>`:""}
    </button>
    <p class="pl-frase">${esc(frase(k))}</p>
    ${primeira?`<div class="rg-reforco pl-brisa"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>Vamos plantar juntas? Esta é a sua plantinha. Ela cresce a cada fase e nunca murcha.</p></div>`:""}
    ${nFr?`<button class="linkflow pl-escrevi" type="button" onclick="fichaTelaFrases()">O que eu escrevi</button>`:""}
  </div>`; }
window.plantaHTML = plantaHTML;

/* 4. tocar na planta: a Brisa diz em que fase ela está */
window.plantaToca = function(){ try{ click(); }catch(e){} try{ vibra(10); }catch(e){}
  const k=andares(), t=ondeEsta(k)+" "+frase(k);
  const nFr = FICHA.frases ? FICHA.frases.lista().length : 0;
  if(typeof rgModal!=="function") return;
  rgModal(`<div class="rg-reforco" style="margin:0 0 12px"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${esc(t)}</p></div>
    <p class="pl-and">${ANDARES.map((a,i)=>`<span class="${i<k?"ok":i===k?"agora":""}">${i<k?"✓ ":""}${esc(a)}</span>`).join("")}</p>
    <div class="col"><button class="btn sec" type="button" onclick="plantaFala()">🔊 Ouvir a Brisa</button>
      ${nFr?`<button class="btn sec" type="button" onclick="rgFechaModal();fichaTelaFrases()">O que eu escrevi</button>`:""}
      <button class="btn" type="button" onclick="rgFechaModal()">Ok</button></div>`);
  window._plantaTxt=t; };
window.plantaFala = function(){ try{ click(); }catch(e){} const t=window._plantaTxt||""; const f=window.speechSynthesis; if(!f||!t) return;
  try{ f.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="pt-BR"; const v=(f.getVoices()||[]).find(x=>/pt[-_]BR/i.test(x.lang)); if(v) u.voice=v; u.rate=.92; f.speak(u); }catch(e){} };

/* 11.2 a festa: a planta sobe um andar com uma luz, som de vitória, vibração e uma frase da Brisa */
function luz(){ const d=document.createElement("div"); d.className="rg-luz pl-luz"; d.style.setProperty("--k","#f5c542"); document.body.appendChild(d); setTimeout(()=>d.remove(),1400); }
const FRASE_FESTA = k => k>=7 ? "Você chegou ao topo da sua plantinha!" : "Sua plantinha subiu um andar! Agora ela tem "+k+" de 7.";
function festa(k,naTela){ const f=I.carrega(); f.planta.visto=k; f.planta.max=Math.max(f.planta.max||0,k); I.salva();
  luz(); if(!naTela){ try{ somVitoria&&somVitoria(); }catch(e){} try{ vibra([15,60,15,60,25]); }catch(e){} }   /* na tela final da Fase 3 o som e a vibração já tocam */
  if(!naTela && typeof rgModal==="function") rgModal(`<div class="pl-festa">${foto(arqPlanta(k),"pl-media","Sua plantinha")}</div>
    <div class="rg-reforco" style="margin:8px 0 12px"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${esc(FRASE_FESTA(k))}</p></div>
    <div class="col"><button class="btn" type="button" onclick="rgFechaModal()">Ok</button></div>`); }
/* na tela inicial: se ela terminou uma fase desde a última vez, a festa acontece aqui (assim as telas das Fases 1 e 2 não mudam) */
function confereFesta(){ const f=I.carrega(), k=andares(); if(k>(f.planta.visto||0)) setTimeout(()=>festa(k,false),700); }
/* no fim da Fase 3, a festa acontece na própria tela final */
window.plantaFestaHTML = function(fase){ const f=I.carrega(); FICHA.marcaFase(fase); const k=andares();
  if(k<=(f.planta.visto||0)) return "";
  setTimeout(()=>festa(k,true),500);
  return `<div class="pl-festa">${foto(arqPlanta(k),"pl-media","Sua plantinha")}
    <div class="rg-reforco" style="margin:8px auto 4px"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${esc(FRASE_FESTA(k))}</p></div></div>`; };

/* 11.1 folhinha na Fase 3: a cada número fechado */
window.plantaFolhaHTML = function(chave){ FICHA.folha(chave);
  return `<div class="pl-folhinha">${foto(ARQ_FOLHA,"pl-pq","Folhinha")}<span>Uma folhinha nova na sua plantinha</span></div>`; };

/* colocar a planta na tela inicial: no lugar da mandala da entrada e da mandala do "Que bom te ver" */
function poeNaTela(c){ if(!c) return; let ok=false;
  const em=c.querySelector(".entramdl"); if(em && !em.querySelector(".pl-bloco")){ em.innerHTML=plantaHTML(); em.classList.add("pl-topo"); ok=true; }
  const bv=c.querySelector("img.bvmand"); if(bv){ const d=document.createElement("div"); d.innerHTML=plantaHTML(); bv.replaceWith(d.firstElementChild); ok=true; }
  if(ok){ const f=I.carrega(); if(!f.planta.plantou){ f.planta.plantou=I.hoje(); I.salva(); } confereFesta(); } }
const mostra0=window.mostra;
window.mostra=function(html,depois){ return mostra0(html, c=>{ if(depois) depois(c); try{ poeNaTela(c); }catch(e){} }); };
try{ poeNaTela(document.querySelector("#palco .cena")); }catch(e){}

/* 27/11 (pedido do Daniel, depois da V5): a plantinha também entra NO TOPO das Fases 1 e 2, no lugar da mandala que se monta.
   Fica pequena ao lado do "Fase 1 · 3 de 7". Tocar nela: a Brisa diz em que fase ela está. A Fase 3 continua como está. */
function plantaMini(){ const el=document.getElementById("const"); if(!el||el.hidden||document.body.classList.contains("emf3")) return;
  const k=andares(), fo=folhasAgora(), arq=arqPlanta(k);
  let b=document.getElementById("plmini");
  if(!b){ b=document.createElement("button"); b.id="plmini"; b.type="button"; b.className="pl-mini"; b.onclick=()=>window.plantaToca(); el.insertBefore(b,el.firstChild); }
  if(b.dataset.arq!==arq||b.dataset.fo!==String(fo)){ b.dataset.arq=arq; b.dataset.fo=String(fo);
    b.setAttribute("aria-label","Sua plantinha. Toque para a Brisa dizer em que fase você está.");
    b.innerHTML=foto(arq,"pl-pq","Sua plantinha")+(fo?`<span class="pl-minifolha" aria-hidden="true">${foto(ARQ_FOLHA,"pl-mf","")}</span>`:""); } }
if(typeof window.desenhaMini==="function"){ const dm0=window.desenhaMini;
  window.desenhaMini=function(){ const r=dm0.apply(this,arguments); try{ plantaMini(); }catch(e){} return r; }; }
try{ plantaMini(); }catch(e){}

/* modo teste: ver a tela inicial com a plantinha, sem sair do teste */
window.plantaTelaInicio = function(){ try{ click(); }catch(e){} if(typeof rgFechaModal==="function") rgFechaModal();
  document.body.classList.remove("emf3"); const k=document.getElementById("const"); if(k) k.hidden=true;
  mostra(`<div class="bvolta"><img class="bvmand" src="${MANDALA}" alt=""><h2>Que bom te ver.</h2>
    <p class="sub">Esta é a tela inicial, com a sua plantinha.</p>
    <button class="btn" type="button" onclick="click();f3Abre()">Continuar</button></div>`); };

const css=document.createElement("style"); css.textContent=`
.pl-bloco{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%}
.pl-topo{flex-direction:column;align-items:center}
.pl-planta{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:block;width:min(62vw,260px);min-height:64px;border-radius:28px}
.pl-planta:active{transform:translateY(2px)}
.pl-ft{display:block;position:relative;overflow:hidden;border-radius:24px}
.pl-ft img{display:block;width:100%;height:100%;object-fit:contain}
.pl-grande{width:100%;aspect-ratio:4/5;filter:drop-shadow(0 16px 36px rgba(245,197,66,.22))}
.pl-media{width:min(52vw,200px);aspect-ratio:4/5;margin:0 auto}
.pl-pq{width:64px;height:64px;flex:none;border-radius:14px}
.pl-ft .rg-ph{width:100%;height:100%}
.pl-pq .rg-ph{padding:3px;gap:0}.pl-pq .rg-ph b{display:none}.pl-pq .rg-ph code{font-size:11px;line-height:1.15}
.bvolta .pl-bloco{margin-bottom:10px}
.pl-folha{position:absolute;right:-6px;bottom:-6px;display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:999px;background:rgba(17,27,61,.92);border:1.5px solid rgba(127,211,138,.7)}
.pl-folha em{font-style:normal;font-size:16px;font-weight:800;color:#d7f5df}
.pl-frase{margin:2px 0 0;font:700 21px/1.3 Manrope,system-ui,sans-serif;color:#f4ecdc;text-align:center}
.pl-brisa{margin:6px auto 0;max-width:420px}
.pl-escrevi{min-height:64px;font-size:18px}
.pl-and{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:0 0 14px!important}
.pl-and span{font-size:16px;font-weight:700;padding:8px 12px;border-radius:999px;border:1.5px solid rgba(169,179,209,.4);color:#c9d0e8}
.pl-and span.ok{border-color:#7fd38a;color:#d7f5df}
.pl-and span.agora{border-color:#f5c542;color:#fff3c4;background:rgba(245,197,66,.12)}
.pl-festa{margin:10px auto 4px;text-align:center}
.pl-luz{z-index:80;animation-duration:1.4s}
body:not(.emf3) #const #mtopo{display:none!important}
body.emf3 #plmini{display:none}
.pl-mini{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:inline-flex;flex:none;width:72px;height:72px;min-height:64px;border-radius:16px;vertical-align:middle}
.pl-mini .pl-pq{width:72px;height:72px}
.pl-minifolha{position:absolute;right:-8px;bottom:-8px}
.pl-mf{width:30px;height:30px;border-radius:8px;border:1.5px solid rgba(127,211,138,.8)}
.pl-mf .rg-ph code,.pl-mf .rg-ph b{display:none}
.pl-folhinha{display:flex;align-items:center;gap:12px;justify-content:center;margin:10px auto 2px;max-width:440px;font-size:18px;font-weight:700;color:#d7f5df}
`; document.head.appendChild(css);
})();
