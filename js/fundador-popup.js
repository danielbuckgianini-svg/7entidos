/* 7ENTIDOS · janela "Quero ser Fundador"
   Abre logo que a pessoa entra na página inicial, uma vez por visita.
   Fecha no X, em "Agora não", na tecla Esc ou tocando fora da janela. */
(function () {
  var CHAVE = "7entidos-popup-fundador";
  try { if (sessionStorage.getItem(CHAVE)) return; } catch (e) {}
  var cores = ["#FFD23F", "#5AB8FF", "#FF8A5C", "#7DDB8B", "#FF6FA3", "#A98BFF", "#3FE0D0"];
  var anterior = null;

  function fechar(el) {
    try { sessionStorage.setItem(CHAVE, "1"); } catch (e) {}
    el.classList.remove("aberto");
    document.removeEventListener("keydown", tecla);
    setTimeout(function () { el.remove(); if (anterior && anterior.focus) anterior.focus(); }, 300);
  }
  var el;
  function tecla(e) {
    if (e.key === "Escape") fechar(el);
    if (e.key === "Tab") { // mantém o foco dentro da janela
      var f = el.querySelectorAll("a,button"); var p = f[0], u = f[f.length - 1];
      if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
      else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
    }
  }
  function abrir() {
    anterior = document.activeElement;
    el = document.createElement("div");
    el.className = "fd-pop";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "fd-pop-titulo");
    el.innerHTML =
      '<div class="fd-pop__caixa">' +
      '<button type="button" class="fd-pop__fechar" aria-label="Fechar">×</button>' +
      '<img class="fd-pop__simbolo" src="assets/simbolo-contando-7.svg?v=20261102-novo" alt="">' +
      '<div class="fd-pop__luzes" aria-hidden="true">' + cores.map(function (c) { return '<i style="background:' + c + ';color:' + c + '"></i>'; }).join("") + "</div>" +
      '<span class="fd-pop__selo">PRÉ-VENDA · VAGAS LIMITADAS</span>' +
      '<h2 id="fd-pop-titulo">Seja um dos <em>100 Fundadores</em> do 7ENTIDOS.</h2>' +
      "<p>Acesso de Fundador por 1 ano, a partir de 1º de dezembro de 2026, e seu nome no mural de Fundadores.</p>" +
      '<p class="fd-pop__preco"><b>R$ 24,90</b> · pagamento único</p>' +
      '<a class="fd-pop__botao" href="fundadores.html">Quero ser Fundador</a>' +
      '<button type="button" class="fd-pop__depois">Agora não</button>' +
      "</div>";
    document.body.appendChild(el);
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.closest(".fd-pop__fechar") || e.target.closest(".fd-pop__depois")) fechar(el);
      else if (e.target.closest(".fd-pop__botao")) { try { sessionStorage.setItem(CHAVE, "1"); } catch (x) {} }
    });
    document.addEventListener("keydown", tecla);
    requestAnimationFrame(function () { el.classList.add("aberto"); el.querySelector(".fd-pop__botao").focus({ preventScroll: true }); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(abrir, 600); });
  else setTimeout(abrir, 600);
})();
