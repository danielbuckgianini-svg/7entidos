/* 7entidos · aviso de consentimento das estatísticas (Google Analytics e Metricool)
   Regra: nada do Google é carregado antes de a pessoa tocar em "Aceitar".
   A escolha fica guardada só neste navegador. Para mudar de ideia:
   link "Preferências de estatísticas" no rodapé. */
(function () {
  var A = (window.SITE && window.SITE.analytics) || { idMedicao: "G-0GPWW3EZZF", ativo: true };
  var ID = A.idMedicao, CHAVE = "7entidos-estatisticas-v2", carregado = false;

  function ler() { try { return localStorage.getItem(CHAVE); } catch (e) { return null; } }
  function gravar(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }

  function ligar() {
    if (carregado || !A.ativo || !ID) return;
    carregado = true;
    window["ga-disable-" + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    /* Página com meta de anúncio (ex.: página do anúncio): conta a visita como resultado no Google Ads, só depois do "Aceitar" */
    if (window.CONVERSAO_ADS) window.gtag("event", window.CONVERSAO_ADS);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
    document.head.appendChild(s);
    /* Metricool: contagem de visitas no painel do Metricool, também só depois do "Aceitar" */
    var m = document.createElement("script");
    m.async = true;
    m.src = "https://tracker.metricool.com/resources/be.js";
    m.onload = function () { try { window.beTracker && window.beTracker.t({ hash: "5e829989b85ed41feb8bce45e5a0e1b3" }); } catch (e) {} };
    document.head.appendChild(m);
  }
  function desligar() { if (ID) window["ga-disable-" + ID] = true; }

  function aviso() {
    if (document.getElementById("aviso-estatisticas")) return;
    var d = document.createElement("div");
    d.id = "aviso-estatisticas";
    d.className = "aviso-estatisticas";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-label", "Estatísticas de visitas");
    d.innerHTML =
      '<p><strong>Podemos contar as visitas?</strong> Só números, sem saber quem você é. Nada é ligado antes do “OK”. <a href="/privacidade.html">Saiba mais</a></p>' +
      '<div class="botoes"><button type="button" data-escolha="recusado">Recusar</button><button type="button" class="aceitar" data-escolha="aceito">OK</button></div>';
    document.body.appendChild(d);
    /* Páginas sem a folha de estilo da marca: garante que o aviso fique fixo no rodapé da tela */
    try {
      if (getComputedStyle(d).position !== "fixed") {
        var st = document.createElement("style");
        st.textContent = ".aviso-estatisticas{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:10px;align-items:center;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(11,20,48,.97);border-top:1px solid rgba(169,179,209,.3);color:#F3EEE3;font:16px/1.35 system-ui,sans-serif}.aviso-estatisticas p{flex:1;margin:0}.aviso-estatisticas a{color:#F5C542}.aviso-estatisticas .botoes{display:flex;gap:6px}.aviso-estatisticas button{min-height:44px;padding:0 14px;font-size:16px;border-radius:999px;background:transparent;color:#F3EEE3;border:1.5px solid rgba(243,238,227,.5)}.aviso-estatisticas button.aceitar{background:#F5C542;color:#10131F;border-color:#F5C542}";
        document.head.appendChild(st);
      }
    } catch (e) {}
    d.addEventListener("click", function (e) {
      var b = e.target.closest("[data-escolha]");
      if (!b) return;
      var v = b.getAttribute("data-escolha");
      var antes = ler();
      gravar(v);
      d.remove();
      if (v === "aceito") ligar();
      else { desligar(); if (antes === "aceito") location.reload(); }
    });
    var foco = d.querySelector(".aceitar"); if (foco) foco.focus({ preventScroll: true });
  }

  var escolha = ler();
  if (escolha === "aceito") ligar();
  else if (escolha !== "recusado") aviso();

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-preferencias-estatisticas]");
    if (!a) return;
    e.preventDefault();
    aviso();
  });
})();
