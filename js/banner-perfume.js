/* Banner "Quem roubou o perfume da Yara?" (A Casa dos 7 Sentidos)
   Um arquivo só, usado na página inicial e na pesquisa.
   Onde aparece: dentro de <div id="banner-perfume"></div>.
   - um palpite por dia por aparelho (guardado no próprio aparelho)
   - palpites fecham sexta 13/11/2026 às 23h59 (horário de Brasília)
   - TRAVA DE TESTE: só grava na planilha no site oficial e sem "?teste" no endereço
*/
(function () {
  "use strict";
  /* link do robô dos palpites (Google Apps Script, termina em /exec). Vazio = ainda não ligado. */
  var ROBO_PERFUME = "";

  var FECHA = new Date("2026-11-14T02:59:59Z"); /* = sexta 13/11 às 23h59 em Brasília */
  var host = (location.hostname || "").toLowerCase();
  var oficial = host === "7entidos.com.br" || host === "www.7entidos.com.br";
  var TESTE = !oficial || /[?&]teste(=|&|$)/.test(location.search || "");
  var forcaFechado = /[?&]fechado(=|&|$)/.test(location.search || "");
  var naPesquisa = /\/pesquisa(\/|\/index\.html)?$/.test(location.pathname) || !!document.getElementById("stage");

  /* pasta das fotos: sempre a pasta /pesquisa, ao lado deste arquivo (../pesquisa/) */
  var me = document.currentScript && document.currentScript.src;
  var FOTOS = window.BP_FOTOS || (me ? new URL("../pesquisa/", me).href : "/pesquisa/");

  var SUSPEITOS = [
    { id: "bia", nome: "Bia", foto: "livia.jpg" },
    { id: "duda", nome: "Duda", foto: "duda.jpg" },
    { id: "rafa", nome: "Rafa", foto: "rafa.jpg" },
    { id: "tonho", nome: "Tonho", foto: "tonho.jpg" },
    { id: "beto", nome: "Beto", foto: "beto.jpg" },
    { id: "lucas", nome: "Lucas", sombra: true }
  ];

  var hoje = (function () { var d = new Date(Date.now() - 3 * 3600e3); return d.toISOString().slice(0, 10); })();
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function grava(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var palpiteHoje = ler("7e_perfume_dia") === hoje ? ler("7e_perfume_palpite") : null;
  var fechado = forcaFechado || Date.now() > FECHA.getTime();
  var pcts = null;

  var FRASCO = '<svg viewBox="0 0 60 80" aria-hidden="true"><defs><linearGradient id="bpVidro" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".5" stop-color="#cfe3ff" stop-opacity=".15"/><stop offset="1" stop-color="#ffffff" stop-opacity=".45"/></linearGradient></defs>' +
    '<rect x="22" y="4" width="16" height="10" rx="2" fill="#d9a92f"/><rect x="26" y="14" width="8" height="8" fill="#b8892a"/>' +
    '<path d="M10 30 Q10 22 18 22 H42 Q50 22 50 30 V68 Q50 76 42 76 H18 Q10 76 10 68 Z" fill="url(#bpVidro)" stroke="#f5c542" stroke-width="2"/>' +
    '<path d="M14 70 H46" stroke="#f5c542" stroke-opacity=".5" stroke-width="2"/><path d="M17 30 V60" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/></svg>';

  var CSS = '' +
    '.bperf{--az:#070b24;--ou:#F5C542;position:relative;overflow:hidden;color:#fff;font-family:Inter,Manrope,system-ui,sans-serif;' +
    'background:radial-gradient(ellipse 70% 60% at 50% 38%,#1a2357 0%,#0b1033 55%,#04061a 100%);border-bottom:2px solid rgba(245,197,66,.35);padding:22px 14px 20px;text-align:center}' +
    '.bperf *{box-sizing:border-box}' +
    '.bperf .bp-chip{display:inline-block;font:800 11px/1 Inter,system-ui,sans-serif;letter-spacing:2px;text-transform:uppercase;color:var(--ou);border:1px solid rgba(245,197,66,.5);border-radius:99px;padding:6px 12px;margin-bottom:10px}' +
    '.bperf h2{margin:0 auto 4px;max-width:560px;font:900 clamp(26px,7.4vw,40px)/1.08 Georgia,"Fraunces",serif;color:var(--ou);text-shadow:0 0 22px rgba(245,197,66,.45);animation:bpPisca 1.6s ease-in-out infinite}' +
    '.bperf h2::after,.bperf h2::before{display:none!important}' +
    '@keyframes bpPisca{0%,100%{opacity:1}50%{opacity:.45}}' +
    '.bperf .bp-sub{margin:0 auto 14px;max-width:480px;font-size:16px;color:#c9d1f2}' +
    '.bperf .bp-palco{position:relative;max-width:520px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);grid-template-areas:"a v b" "c v d" "e . f";gap:10px 8px;align-items:center}' +
    '.bperf .bp-vit{grid-area:v;position:relative;justify-self:center;width:100%}' +
    '.bperf .bp-vit .bp-foto{width:100%;aspect-ratio:3/4;border-radius:50% 50% 18px 18px;border:3px solid var(--ou);box-shadow:0 0 30px rgba(245,197,66,.45)}' +
    '.bperf .bp-vit .bp-frasco{position:absolute;right:-10%;bottom:12%;width:44%;filter:drop-shadow(0 0 12px rgba(245,197,66,.9));animation:bpBrilho 2s ease-in-out infinite}' +
    '@keyframes bpBrilho{0%,100%{filter:drop-shadow(0 0 6px rgba(245,197,66,.6))}50%{filter:drop-shadow(0 0 18px rgba(245,197,66,1))}}' +
    '.bperf .bp-vit .bp-nome{font-weight:900;color:var(--ou)}.bperf .bp-vit small{display:block;font-size:12px;color:#c9d1f2}' +
    '.bperf .bp-foto{display:block;width:100%;aspect-ratio:1;border-radius:50%;background:#0b1033 center 18%/cover no-repeat;border:2px solid rgba(255,255,255,.18);' +
    'box-shadow:inset 0 0 0 999px rgba(4,6,26,.25);-webkit-mask-image:radial-gradient(circle at 50% 40%,#000 62%,rgba(0,0,0,.55) 100%);mask-image:radial-gradient(circle at 50% 40%,#000 62%,rgba(0,0,0,.55) 100%)}' +
    '.bperf .bp-sus{all:unset;cursor:pointer;display:block;text-align:center;position:relative;transition:transform .15s}' +
    '.bperf .bp-sus:focus-visible{outline:3px solid var(--ou);outline-offset:3px;border-radius:12px}' +
    '.bperf .bp-sus .bp-foto{max-width:92px;margin:0 auto}' +
    '.bperf .bp-sus .bp-nome{display:block;margin-top:5px;font-weight:800;font-size:15px}' +
    '.bperf .bp-sus .bp-pct{display:block;font-weight:900;font-size:15px;color:var(--ou);min-height:19px}' +
    '.bperf .bp-sus.sel .bp-foto{border-color:var(--ou);box-shadow:0 0 0 3px var(--ou),0 0 26px rgba(245,197,66,.9);-webkit-mask-image:none;mask-image:none}' +
    '.bperf .bp-sus.sel{transform:scale(1.06)}' +
    '.bperf.votou .bp-sus:not(.sel) .bp-foto,.bperf.fechou .bp-sus .bp-foto{filter:grayscale(.6) brightness(.7)}' +
    '.bperf .bp-sombra{display:grid;place-items:center;background:radial-gradient(circle at 50% 36%,#111 0 22%,transparent 23%),radial-gradient(ellipse 46% 40% at 50% 100%,#111 0 98%,transparent 100%),radial-gradient(circle,#2a2f5c,#0b1033);' +
    'font:900 30px Georgia,serif;color:var(--ou);text-shadow:0 0 12px rgba(245,197,66,.8)}' +
    '.bperf .bp-msg{max-width:480px;margin:16px auto 0}' +
    '.bperf .bp-ok{font-weight:800;font-size:18px;color:#fff;margin:0 0 12px}' +
    '.bperf .bp-btns{display:grid;gap:10px}' +
    '.bperf .bp-btn{all:unset;cursor:pointer;display:block;text-align:center;border-radius:14px;padding:14px;font:800 17px Inter,system-ui,sans-serif}' +
    '.bperf .bp-zap{background:#25D366;color:#06301a}.bperf .bp-pesq{background:var(--ou);color:#0a1128}' +
    '.bperf .bp-dica{font-size:14px;color:#c9d1f2;margin:12px 0 0}' +
    '.bperf .bp-aviso{font-size:12px;color:#8f9bd0;margin-top:8px}' +
    '@media (prefers-reduced-motion:reduce){.bperf h2,.bperf .bp-vit .bp-frasco{animation:none}}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function cartao(s, area) {
    var sel = palpiteHoje === s.id ? " sel" : "";
    var foto = s.sombra ? '<span class="bp-foto bp-sombra" aria-hidden="true">?</span>'
      : '<span class="bp-foto" style="background-image:url(\'' + FOTOS + s.foto + '\')" aria-hidden="true"></span>';
    var pct = (palpiteHoje || fechado) && pcts ? (pcts[s.id] || 0) + "%" : "";
    var podeTocar = !fechado && !palpiteHoje;
    return '<button type="button" class="bp-sus' + sel + '" style="grid-area:' + area + '" data-id="' + s.id + '"' +
      (podeTocar ? "" : ' aria-disabled="true"') + ' aria-label="' + esc(s.sombra ? "Lucas, a sombra misteriosa" : s.nome) + '">' +
      foto + '<span class="bp-nome">' + esc(s.nome) + '</span><span class="bp-pct">' + pct + '</span></button>';
  }

  function desenha(el) {
    var areas = ["a", "b", "c", "d", "e", "f"];
    var cls = "bperf" + (palpiteHoje ? " votou" : "") + (fechado ? " fechou" : "");
    var sub = fechado ? "" : (palpiteHoje ? "Você já deu o seu palpite de hoje. Volte amanhã para palpitar de novo."
      : "Toque em quem você acha que pegou. Um palpite por dia, até sexta.");
    var msg = "";
    if (fechado) {
      msg = '<p class="bp-ok">Palpites encerrados. A resposta sai domingo (15/11), às 20h, no @7entidoss.</p>';
    } else if (palpiteHoje) {
      msg = '<p class="bp-ok">Palpite guardado! A resposta sai no episódio de domingo (15/11), às 20h, no @7entidoss.</p>' +
        '<div class="bp-btns"><button type="button" class="bp-btn bp-zap" data-acao="zap">💬 Chamar as amigas pra palpitar</button>' +
        '<button type="button" class="bp-btn bp-pesq" data-acao="pesquisa">Fazer a pesquisa →</button></div>';
    }
    el.innerHTML = '<section class="' + cls + '" aria-labelledby="bp-titulo">' +
      '<span class="bp-chip">A Casa dos 7 Sentidos · mistério</span>' +
      '<h2 id="bp-titulo">Quem roubou o perfume da Yara?</h2>' + (sub ? '<p class="bp-sub">' + sub + '</p>' : "") +
      '<div class="bp-palco">' + SUSPEITOS.map(function (s, i) { return cartao(s, areas[i]); }).join("") +
      '<div class="bp-vit" aria-label="Yara, a vítima"><span class="bp-foto" style="background-image:url(\'' + FOTOS + 'yara.jpg\')"></span>' +
      '<span class="bp-frasco">' + FRASCO + '</span><span class="bp-nome">Yara</span><small>a vítima</small></div></div>' +
      '<div class="bp-msg">' + msg + (TESTE && (palpiteHoje || fechado) ? '<p class="bp-aviso">Prévia: as porcentagens aqui são só um exemplo. Nada é gravado na planilha.</p>' : "") + '</div>' +
      '</section>';
    el.querySelectorAll(".bp-sus").forEach(function (b) {
      b.addEventListener("click", function () { if (!fechado && !palpiteHoje) palpitar(el, b.getAttribute("data-id")); });
    });
    var z = el.querySelector('[data-acao="zap"]'); if (z) z.addEventListener("click", compartilhar);
    var p = el.querySelector('[data-acao="pesquisa"]'); if (p) p.addEventListener("click", irPesquisa);
  }

  function palpitar(el, id) {
    palpiteHoje = id; grava("7e_perfume_dia", hoje); grava("7e_perfume_palpite", id);
    if (!TESTE && ROBO_PERFUME) {
      try {
        fetch(ROBO_PERFUME, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ tipo: "perfume", suspeito: id, pagina: naPesquisa ? "pesquisa" : "inicial", quando: new Date().toISOString() }) });
      } catch (e) {}
    }
    desenha(el); /* aparece como guardado na hora, mesmo se a planilha demorar */
    buscaPcts(el, 1200);
  }

  function buscaPcts(el, espera) {
    if (TESTE) { /* prévia: porcentagens de exemplo, só para ver como fica */
      pcts = { bia: 8, duda: 34, rafa: 12, tonho: 15, beto: 9, lucas: 22 };
      desenha(el); return;
    }
    if (!ROBO_PERFUME) return;
    setTimeout(function () {
      fetch(ROBO_PERFUME + "?acao=perfume").then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.contagem) return;
        var tot = 0, c = d.contagem; SUSPEITOS.forEach(function (s) { tot += +c[s.id] || 0; });
        if (!tot) return;
        pcts = {}; SUSPEITOS.forEach(function (s) { pcts[s.id] = Math.round(100 * (+c[s.id] || 0) / tot); });
        desenha(el);
      }).catch(function () {});
    }, espera || 0);
  }

  function compartilhar() {
    var txt = "Alguém roubou o perfume da Yara na Casa dos 7 Sentidos! 🕵️‍♀️ Quem você acha que foi? Dá o seu palpite: https://7entidos.com.br";
    var url = "https://wa.me/?text=" + encodeURIComponent(txt);
    if (!TESTE && ROBO_PERFUME) {
      try { fetch(ROBO_PERFUME, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ tipo: "perfume_compartilhou", pagina: naPesquisa ? "pesquisa" : "inicial", quando: new Date().toISOString() }) }); } catch (e) {}
    }
    window.open(url, "_blank", "noopener");
  }

  function irPesquisa() {
    if (naPesquisa) {
      var alvo = document.getElementById("wrap") || document.getElementById("stage");
      if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      location.href = new URL("../pesquisa/", me || location.href).href;
    }
  }

  function inicia() {
    var el = document.getElementById("banner-perfume");
    if (!el) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    desenha(el);
    if (palpiteHoje || fechado) buscaPcts(el, 0);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inicia); else inicia();
})();
