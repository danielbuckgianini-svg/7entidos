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

/* prévia: quem saiu do modo teste para ver a Fase 1 volta para o teste da régua pelo painel "Validar a prévia" */
if(typeof painel==="function"){ const painel0=window.painel; window.painel=function(){ painel0.apply(this,arguments);
  let fase1=false; try{ fase1=sessionStorage.getItem("7e_previa_fase1")==="1"; }catch(e){}
  const cx=document.querySelector("#vp .vcaixa"); if(fase1&&cx&&!cx.querySelector(".volta-teste")){ const b=document.createElement("button"); b.className="btn volta-teste"; b.type="button"; b.style.margin="0 0 16px";
    b.textContent="Voltar ao teste da Fase 3 (régua)"; b.onclick=()=>{ try{ sessionStorage.removeItem("7e_previa_fase1"); }catch(e){} location.reload(); }; cx.insertBefore(b,cx.firstChild); } }; }

})();
