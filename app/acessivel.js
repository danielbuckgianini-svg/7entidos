/* =====================================================================
   7entidos · USABILIDADE (V4, 27/11) · app inteiro, só na prévia (branch fase3-regua)
   Bloco 9: "← Voltar" escrito no canto de cima, sinal claro de "salvo" depois de cada resposta.
   Bloco 10: "Ouvir a Brisa" em toda tela, internet fraca, "nunca pede senha", recompensas sem competição, mãozinha na 1ª vez.
   Carregado depois de tudo (index.html, fase3-*.js). Não mexe no que fica guardado das Fases 1 e 2.
   ===================================================================== */
(function(){
if(typeof mostra!=="function") return;

/* ---------- Bloco 9 · 1. "← Voltar" escrito, sempre no mesmo lugar (canto de cima, à esquerda) ---------- */
const vb=document.getElementById("voltar"); if(vb){ vb.textContent="← Voltar"; vb.setAttribute("aria-label","Voltar"); }

/* ---------- Bloco 9 · 4. depois de cada resposta, sinal claro de que foi salvo (não some sozinho: fica na tela seguinte) ---------- */
window.SALVO=false;
let respAntes=null;
/* só contam as respostas dela (não o consentimento, horários, nome guardado só no celular etc.) */
const soResp=()=>{ try{ const r={}; Object.keys(resp).forEach(k=>{ if(!/^(consentiu|inicio|inicio_fase2|ouviu_brisa|fase1_completa|abriu_flow)$|^local_|_t0$/.test(k)) r[k]=resp[k]; }); return JSON.stringify(r); }catch(e){ return null; } };
const mostra0=window.mostra;
window.mostra=function(html,depois){ const s=window.SALVO; window.SALVO=false;
  const chip = s ? `<div class="salvo" role="status">✓ Resposta salva</div>` : "";
  return mostra0(chip+html, c=>{ respAntes=soResp(); if(depois) depois(c); if(window.depoisDeMostrar) window.depoisDeMostrar(c); }); };
const avanca0=window.avanca;
if(typeof avanca0==="function") window.avanca=function(){ if(respAntes!=null && soResp()!==respAntes) window.SALVO=true; return avanca0.apply(this,arguments); };

/* ---------- Bloco 10 · 1. "Ouvir a Brisa" em toda tela: lê a pergunta e as opções em voz ----------
   Por enquanto com a voz do próprio celular (português do Brasil). Depois troca por áudios gravados:
   basta pôr o arquivo em AUDIOS_GRAVADOS["texto da pergunta"] = "arquivo.mp3" (se existir, toca o arquivo no lugar da voz). */
const AUDIOS_GRAVADOS = {};
const fala = window.speechSynthesis;
let vozPT=null;
function achaVoz(){ if(!fala) return null; const v=fala.getVoices()||[]; vozPT = v.find(x=>/pt[-_]BR/i.test(x.lang)&&/Google|Luciana|Francisca|Maria/i.test(x.name)) || v.find(x=>/pt[-_]BR/i.test(x.lang)) || v.find(x=>/^pt/i.test(x.lang)) || null; return vozPT; }
if(fala){ achaVoz(); try{ fala.onvoiceschanged=achaVoz; }catch(e){} }
const SEL_LER = "#rgmodal h3,#rgmodal p,#rgmodal .col .btn,h1,h2,.rg-q,.rg-sit,.fala,.prontos,.gesto,.sub,.rg-dica,.dica,.brisafrase,.missao,.apoio,.rg-curio,.vleg,.rg-confcard,.rg-seu,.compara1,.rg-op .rg-cap,.rg-op .rg-lt,.opt,.foto .nm,.rg-palavras button,.scol button,.chips button,.curtiu button,.rg-sugs button,.rg-balao p,label";
function textoDaTela(){ const modal=document.getElementById("rgmodal"), raiz=modal||document.querySelector("#palco .cena")||document.body;
  const els=[...raiz.querySelectorAll(SEL_LER)].filter(e=>e.offsetParent!==null&&!e.closest(".salvo"));
  const top=els.filter(e=>!els.some(o=>o!==e&&o.contains(e)));
  const opcoes=[], frases=[];
  top.forEach(e=>{ const t=(e.innerText||"").replace(/\s+/g," ").trim(); if(!t) return;
    if(e.matches(".rg-op .rg-cap,.rg-op .rg-lt,.opt,.foto .nm,.rg-palavras button,.scol button,.chips button,.curtiu button,.rg-sugs button,#rgmodal .col .btn")) opcoes.push(t); else frases.push(t); });
  let t=frases.map(x=>/[.?!…:]$/.test(x)?x:x+".").join(" ");
  if(opcoes.length) t+=". As opções são: "+opcoes.join("; ")+".";
  if(raiz.querySelector(".escala,.rg-esc,.rg-desl-n")) t+=" Toque num número de 0 a 10.";
  return t.replace(/([.?!])\./g,"$1").replace(/[✓✎🔊🔍🎤🔒🔥🎁☀↺←→•·]/g," "); }
window.textoDaTela=textoDaTela;   /* para testar */
let audioGravado=null;
function paraDeFalar(){ try{ fala&&fala.cancel(); }catch(e){} if(audioGravado){ try{ audioGravado.pause(); }catch(e){} audioGravado=null; } const b=document.getElementById("ouvirbrisa"); if(b){ b.classList.remove("on"); b.textContent="🔊 Ouvir a Brisa"; } }
window.ouvirBrisa=function(){ const b=document.getElementById("ouvirbrisa");
  if(b&&b.classList.contains("on")) return paraDeFalar();
  const t=textoDaTela(); if(!t) return;
  const q=(document.querySelector("#palco .cena h2")||{}).innerText||"";
  b&&(b.classList.add("on"),b.textContent="■ Parar");
  if(AUDIOS_GRAVADOS[q]){ audioGravado=new Audio(AUDIOS_GRAVADOS[q]); audioGravado.onended=paraDeFalar; audioGravado.play().catch(paraDeFalar); return; }
  if(!fala){ paraDeFalar(); return; }
  try{ fala.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="pt-BR"; if(vozPT||achaVoz()) u.voice=vozPT; u.rate=.92; u.pitch=1.05; u.onend=paraDeFalar; u.onerror=paraDeFalar; fala.speak(u); }catch(e){ paraDeFalar(); } };
const ob=document.createElement("button"); ob.id="ouvirbrisa"; ob.type="button"; ob.className="ouvirbrisa"; ob.textContent="🔊 Ouvir a Brisa"; ob.setAttribute("aria-label","Ouvir a Brisa ler a tela"); ob.onclick=()=>{ try{ click(); }catch(e){} ouvirBrisa(); };
document.body.appendChild(ob);

/* ---------- Bloco 10 · 2. Internet fraca: as respostas ficam guardadas no celular e vão quando a internet voltar ---------- */
const FILA="7e_fila_envio";
const filaLe=()=>{ try{ return JSON.parse(localStorage.getItem(FILA)||"[]"); }catch(e){ return []; } };
const filaGrava=l=>{ try{ localStorage.setItem(FILA,JSON.stringify(l.slice(-60))); }catch(e){} };
const fetch0=window.fetch.bind(window);
const ehEnvio=(u,o)=>{ try{ return typeof ENDPOINT!=="undefined"&&ENDPOINT&&String(u).indexOf(ENDPOINT)===0&&o&&o.method==="POST"; }catch(e){ return false; } };
window.fetch=function(u,o){ if(!ehEnvio(u,o)) return fetch0(u,o);
  const guarda=()=>{ const l=filaLe(); l.push({u:String(u),body:o.body,quando:Date.now()}); filaGrava(l); return new Response(null,{status:204}); };
  if(navigator.onLine===false) return Promise.resolve(guarda());
  return fetch0(u,o).catch(()=>guarda()); };
let mandando=false;
function filaManda(){ if(mandando||navigator.onLine===false) return; const l=filaLe(); if(!l.length) return; mandando=true;
  const x=l[0]; fetch0(x.u,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:x.body})
    .then(()=>{ filaGrava(filaLe().slice(1)); mandando=false; setTimeout(filaManda,400); })
    .catch(()=>{ mandando=false; }); }
addEventListener("online",filaManda); setTimeout(filaManda,4000);

/* ---------- Bloco 10 · 5. Primeira vez com uma mãozinha: na 1ª tela de cada tipo, uma mãozinha mostra onde tocar e some depois ---------- */
const MAOS=[["numeros",".escala button,.rg-esc button,.rg-desl-n button"],["bolinhas",".rg-b.ab"],["fotos",".g22 .foto,.rg-ops.fotos .rg-op"],["lista",".rg-ops.lista .rg-op,.opts .opt"],
  ["palavras",".rg-palavras button,.scol button"],["ouvir",".fbtns .ouvir2"]];
const MAO_SVG='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 8c0-3 5-3 5 0v20l3-1V22c0-3 5-3 5 0v6l3-1v-3c0-3 5-3 5 0v5l3-1c0-3 5-3 5 0v12c0 10-6 18-16 18h-2c-6 0-10-3-13-8L12 36c-2-3 2-6 5-3l5 5z" fill="#f4ecdc" stroke="#15110a" stroke-width="2" stroke-linejoin="round"/></svg>';
function maosVistas(){ try{ return JSON.parse(localStorage.getItem("7e_maos")||"{}"); }catch(e){ return {}; } }
function tiraMao(){ document.querySelectorAll(".maozinha").forEach(m=>m.remove()); }
function poeMao(c){ tiraMao(); if(!c) return; const v=maosVistas();
  for(const [tipo,sel] of MAOS){ const alvo=c.querySelector(sel); if(!alvo||v[tipo]) continue;
    v[tipo]=1; try{ localStorage.setItem("7e_maos",JSON.stringify(v)); }catch(e){}
    const r=alvo.getBoundingClientRect(), m=document.createElement("div"); m.className="maozinha"; m.innerHTML=MAO_SVG;
    m.style.left=(r.left+window.scrollX+r.width*.55)+"px"; m.style.top=(r.top+window.scrollY+r.height*.45)+"px"; document.body.appendChild(m);
    const some=()=>{ tiraMao(); removeEventListener("pointerdown",some,true); }; addEventListener("pointerdown",some,true); break; } }

/* ---------- depois de cada tela: para a voz da tela anterior e mostra a mãozinha, se for a 1ª vez ---------- */
window.depoisDeMostrar=function(c){ paraDeFalar(); setTimeout(()=>poeMao(c),950); };

/* prévia: quem saiu do modo teste para ver a Fase 1 volta para o teste da régua pelo painel "Validar a prévia" */
if(typeof painel==="function"){ const painel0=window.painel; window.painel=function(){ painel0.apply(this,arguments);
  let fase1=false; try{ fase1=sessionStorage.getItem("7e_previa_fase1")==="1"; }catch(e){}
  const cx=document.querySelector("#vp .vcaixa"); if(fase1&&cx&&!cx.querySelector(".volta-teste")){ const b=document.createElement("button"); b.className="btn volta-teste"; b.type="button"; b.style.margin="0 0 16px";
    b.textContent="Voltar ao teste da Fase 3 (régua)"; b.onclick=()=>{ try{ sessionStorage.removeItem("7e_previa_fase1"); }catch(e){} location.reload(); }; cx.insertBefore(b,cx.firstChild); } }; }

})();
