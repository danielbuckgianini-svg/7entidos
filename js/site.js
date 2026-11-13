/* 7entidos · comportamento do site (sem dependências externas) */
(function () {
  var S = window.SITE || {};
  var esc = function (t) { return String(t || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* Foto real ou espaço reservado identificado */
  function figura(item, pasta, titulo, detalhe) {
    if (item && item.arquivo) {
      return '<figure class="foto"><img src="' + pasta + esc(item.arquivo) + '" alt="' + esc(item.descricao) + '" loading="lazy">' +
        (item.legenda ? '<figcaption>' + esc(item.legenda) + '</figcaption>' : '') + '</figure>';
    }
    return '<figure class="foto"><div class="reservado" role="img" aria-label="' + esc(titulo + ". " + detalhe) + '">' +
      '<span class="num">Espaço reservado</span><b>' + esc(titulo) + '</b><span>' + esc(detalhe) + '</span></div></figure>';
  }

  /* Início */
  var d = document.querySelector('[data-foto="destaque"]');
  if (d) d.innerHTML = figura(S.fotoDestaque, "fotos/", "Foto 10×10 de abertura", "Aguardando a fotografia aprovada para o início.");

  /* Telas do aplicativo */
  document.querySelectorAll("[data-tela]").forEach(function (el) {
    var k = el.getAttribute("data-tela"), nome = el.getAttribute("data-nome");
    var t = (S.telas || {})[k];
    el.className = "tela";
    el.innerHTML = figura(t, "telas/", "Captura real: " + nome, "Pendente. Será uma tela verdadeira do protótipo, sem dados pessoais.");
  });

  /* Galeria manual, sem avanço automático */
  var trilho = document.getElementById("trilho");
  var fotos = (S.fotos || []).filter(function (f) { return f.arquivo; });
  var secGal = document.querySelector("[data-galeria]");
  if (secGal && fotos.length < 3) { secGal.hidden = true; }
  if (trilho && !(secGal && secGal.hidden)) {
    trilho.innerHTML = fotos.map(function (f, i) {
      return figura(f, "fotos/", "Foto " + (i + 1) + (f.sentido ? " · " + f.sentido : ""), "Aguardando a foto nova deste sentido.");
    }).join("");
    var itens = trilho.querySelectorAll(".foto");
    var ant = document.getElementById("foto-anterior"), prox = document.getElementById("foto-proxima"), cont = document.getElementById("contador");
    var atual = 0;
    var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function ir(i) {
      atual = Math.max(0, Math.min(itens.length - 1, i));
      var alvo = itens[atual];
      trilho.scrollTo({ left: alvo.offsetLeft - trilho.offsetLeft, behavior: reduz ? "auto" : "smooth" });
      marcar();
    }
    function marcar() {
      if (cont) cont.textContent = (atual + 1) + " / " + itens.length;
      if (ant) ant.disabled = atual === 0;
      if (prox) prox.disabled = atual === itens.length - 1;
    }
    var t;
    trilho.addEventListener("scroll", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var x = trilho.scrollLeft, melhor = 0, dist = 1e9;
        itens.forEach(function (it, i) { var dd = Math.abs(it.offsetLeft - trilho.offsetLeft - x); if (dd < dist) { dist = dd; melhor = i; } });
        atual = melhor; marcar();
      }, 80);
    });
    if (ant) ant.addEventListener("click", function () { ir(atual - 1); });
    if (prox) prox.addEventListener("click", function () { ir(atual + 1); });
    trilho.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); ir(atual + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); ir(atual - 1); }
    });
    marcar();
  }

  /* Menu do celular */
  var bm = document.getElementById("botao-menu"), menu = document.getElementById("menu");
  if (bm && menu) {
    var fechar = function () { menu.classList.remove("aberto"); bm.setAttribute("aria-expanded", "false"); bm.textContent = "Menu"; };
    bm.addEventListener("click", function () {
      var abre = !menu.classList.contains("aberto");
      menu.classList.toggle("aberto", abre);
      bm.setAttribute("aria-expanded", String(abre));
      bm.textContent = abre ? "Fechar" : "Menu";
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) fechar(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("aberto")) { fechar(); bm.focus(); } });
  }

  /* Contato: só vira link quando o e-mail for confirmado */
  var c = S.contato || {};
  var em = document.getElementById("email-contato"), est = document.getElementById("estado-email");
  if (em && c.email) {
    em.textContent = c.email;
    if (c.ativo) {
      em.innerHTML = '<a href="mailto:' + esc(c.email) + '" style="color:inherit">' + esc(c.email) + '</a>';
      if (est) est.textContent = "Escreva para este endereço.";
    }
  }

  /* Analytics: nada é carregado enquanto S.analytics.ativo for false. */
})();
