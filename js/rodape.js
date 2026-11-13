/* Rodapé único do 7entidos — o mesmo no site, na pesquisa (/pesquisa) e no app (/app).
   Para mudar qualquer dado, mexa só no bloco DADOS abaixo. */
(function () {
  if (window.__rodape7) return; window.__rodape7 = true;

  var DADOS = {
    empresa: "DBGIANINI MARKETING LTDA",
    cnpj: "64.849.647/0001-75",
    cidade: "Santos/SP",
    /* Número do WhatsApp de dúvidas: só números, com 55 + DDD. Ex.: "5513999999999".
       Enquanto estiver vazio, o botão abre o e-mail de contato. */
    whatsapp: "",
    email: "contato@7entidos.com.br",
    instagram: "https://www.instagram.com/7entidoss/",
    youtube: "https://www.youtube.com/@7Entidos",
    facebook: "https://www.facebook.com/profile.php?id=61596119254628",
    linkedin: "https://www.linkedin.com/company/145418964/",
    /* Troque pelo endereço da página da empresa no Reclame Aqui. */
    reclameAqui: "https://www.reclameaqui.com.br/busca/?q=DBGIANINI"
  };

  /* descobre a raiz do site a partir do endereço deste arquivo (funciona no site e na prévia) */
  var me = document.currentScript && document.currentScript.src || "";
  var raiz = me ? me.replace(/js\/rodape\.js.*$/, "") : "/";

  var ic = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/></svg>',
    yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v7h4v-7h3l.5-4H14V8.6c0-.4.2-.6.6-.6z"/></svg>',
    li: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  var temWa = /^\d{12,13}$/.test(DADOS.whatsapp);
  var waHref = temWa
    ? "https://wa.me/" + DADOS.whatsapp + "?text=" + encodeURIComponent("Olá! Tenho uma dúvida sobre o 7entidos.")
    : "mailto:" + DADOS.email + "?subject=" + encodeURIComponent("Dúvida sobre o 7entidos");
  var waTxt = temWa ? "Dúvidas? Fale no WhatsApp" : "Dúvidas? Fale com a gente";

  var temConsent = !!document.querySelector('script[src*="consentimento"]');

  var css =
    '.r7{background:#0B1430;color:#F3EEE3;font:400 16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:22px 16px 26px;margin:0;border-top:2px solid #f5c542;text-align:center;position:relative;z-index:1;clear:both}' +
    '.r7 *{box-sizing:border-box}' +
    '.r7-in{max-width:960px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:12px}' +
    '.r7 a{color:#F3EEE3;text-decoration:none}' +
    '.r7 a:focus-visible{outline:2px solid #f5c542;outline-offset:3px;border-radius:6px}' +
    '.r7-wa{display:inline-flex;align-items:center;gap:8px;background:#f5c542;color:#0B1430!important;font-weight:700;border-radius:999px;padding:9px 16px;min-height:40px}' +
    '.r7-wa svg{width:18px;height:18px}' +
    '.r7-redes{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.r7-redes a{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(245,197,66,.45);border-radius:50%}' +
    '.r7-redes a:hover{background:rgba(245,197,66,.15)}' +
    '.r7-redes svg{width:19px;height:19px}' +
    '.r7-links{display:flex;gap:6px 16px;justify-content:center;flex-wrap:wrap}' +
    '.r7-links a{text-decoration:underline;text-decoration-color:rgba(245,197,66,.6);text-underline-offset:3px}' +
    '.r7-ra{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(233,230,242,.35);border-radius:10px;padding:6px 12px;font-size:16px}' +
    '.r7-ra b{color:#f5c542}' +
    '.r7-emp{color:#A9B3D1;font-size:16px;margin:0}' +
    '.r7-emp b{color:#f5c542;font-weight:700}' +
    '@media (max-width:600px){.r7{padding:16px 12px 20px;font-size:16px}.r7-in{gap:9px}.r7-wa{padding:7px 13px;min-height:36px;font-size:16px}.r7-redes a{width:34px;height:34px}.r7-redes svg{width:16px;height:16px}.r7-emp{font-size:16px}}';

  var html =
    '<div class="r7-in">' +
      '<a class="r7-wa" href="' + waHref + '" target="_blank" rel="noopener">' + ic.wa + '<span>' + waTxt + '</span></a>' +
      '<div class="r7-redes" aria-label="7entidos nas redes">' +
        '<a href="' + DADOS.instagram + '" target="_blank" rel="noopener" aria-label="Instagram @7entidoss" title="Instagram @7entidoss">' + ic.ig + '</a>' +
        '<a href="' + DADOS.facebook + '" target="_blank" rel="noopener" aria-label="Facebook do 7entidos" title="Facebook">' + ic.fb + '</a>' +
        '<a href="' + DADOS.youtube + '" target="_blank" rel="noopener" aria-label="Canal do 7entidos no YouTube" title="YouTube @7Entidos">' + ic.yt + '</a>' +
        '<a href="' + DADOS.linkedin + '" target="_blank" rel="noopener" aria-label="LinkedIn do 7entidos" title="LinkedIn">' + ic.li + '</a>' +
      '</div>' +
      '<nav class="r7-links" aria-label="Documentos">' +
        '<a href="' + raiz + 'ciencia/">A ciência</a>' +
        '<a href="' + raiz + 'privacidade.html">Política de Privacidade</a>' +
        '<a href="' + raiz + 'termos.html">Termos de Uso</a>' +
        (temConsent ? '<a href="#" data-preferencias-estatisticas>Preferências de estatísticas</a>' : '') +
      '</nav>' +
      '<a class="r7-ra" href="' + DADOS.reclameAqui + '" target="_blank" rel="noopener" aria-label="Nossa página no Reclame Aqui">Estamos no <b>Reclame Aqui</b></a>' +
      '<p class="r7-emp"><b>7entidos</b> é um projeto da ' + DADOS.empresa + ' · CNPJ ' + DADOS.cnpj + ' · ' + DADOS.cidade + '</p>' +
    '</div>';

  function montar() {
    if (document.querySelector(".r7")) return;
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var f = document.createElement("footer"); f.className = "r7"; f.setAttribute("role", "contentinfo"); f.innerHTML = html;
    document.body.appendChild(f);
    /* no app: a barra de abas fica presa embaixo no celular; o rodapé ganha espaço para não ficar escondido */
    var nav = document.querySelector(".bottomnav");
    if (nav && getComputedStyle(nav).position === "fixed") f.style.paddingBottom = (nav.offsetHeight + 20) + "px";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar); else montar();
  /* o app monta a barra depois; ajusta de novo quando ela aparecer */
  setTimeout(function () { var f = document.querySelector(".r7"), nav = document.querySelector(".bottomnav");
    if (f && nav && getComputedStyle(nav).position === "fixed") f.style.paddingBottom = (nav.offsetHeight + 20) + "px"; }, 1500);
})();
