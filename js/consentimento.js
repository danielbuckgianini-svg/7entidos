/* 7ENTIDOS · aviso de consentimento das estatísticas (Google Analytics e Metricool)
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
    /* Página com meta de anúncio (ex.: pré-venda): conta a visita como resultado no Google Ads, só depois do "Aceitar" */
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
      '<p><strong>Podemos contar as visitas?</strong> Usamos ferramentas do Google e do Metricool para saber quantas pessoas visitam o site, quais partes são mais lidas e quantas chegaram pelos nossos anúncios. Não usamos para mostrar anúncios personalizados a você. Nada é carregado sem o seu “Aceitar”. <a href="privacidade.html">Saiba mais</a></p>' +
      '<div class="botoes"><button type="button" data-escolha="recusado">Recusar</button><button type="button" class="aceitar" data-escolha="aceito">Aceitar</button></div>';
    document.body.appendChild(d);
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
