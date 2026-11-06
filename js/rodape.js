/* Rodapé e Contato em todas as páginas: TikTok, empresa, WhatsApp de dúvidas e selo do Reclame Aqui.
   Os dados ficam em js/conteudo.js (window.SITE). */
(function () {
  var S = window.SITE || {};
  var RA = S.reclameAqui || {};
  var WA = S.whatsapp || {};

  function seloRA() {
    var d = document.createElement('div');
    d.className = 'selo-ra';
    if (RA.seloId) {
      /* selo oficial do Reclame Aqui (mostra a nota real) */
      var alvo = 'ra-verified-seal-' + Math.random().toString(36).slice(2, 7);
      d.innerHTML = '<div id="' + alvo + '"></div>';
      var sc = document.createElement('script');
      sc.src = 'https://s3.amazonaws.com/raichu-beta/ra-verified/bundle.js';
      sc.id = 'ra-embed-verified-seal';
      sc.setAttribute('data-id', RA.seloId);
      sc.setAttribute('data-target', alvo);
      sc.setAttribute('data-model', '1');
      sc.async = true;
      d.appendChild(sc);
      return d;
    }
    var tag = RA.url ? 'a' : 'span';
    d.innerHTML = '<' + tag + ' class="selo-ra-simples"' + (RA.url ? ' href="' + RA.url + '" target="_blank" rel="noopener"' : '') + '>' +
      '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#1F1A28" stroke="#7DDB8B" stroke-width="2"/><path d="M10 16.5l4 4 8-9" fill="none" stroke="#7DDB8B" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span><small>Estamos no</small><b>Reclame AQUI</b></span></' + tag + '>';
    return d;
  }
  function botaoWA(classe) {
    if (!WA.numero) return null;
    var a = document.createElement('a');
    a.className = classe;
    a.href = 'https://wa.me/' + WA.numero + '?text=' + encodeURIComponent(WA.mensagem || '');
    a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 9.5c.3 2 2.2 4 4.5 4.8l1-1.1 1.8.8-.4 1.6c-3.6.2-7.2-3.3-7.3-6.9l1.6-.4.8 1.8z" fill="currentColor"/></svg>Dúvidas no WhatsApp';
    return a;
  }

  /* rodapé */
  document.querySelectorAll('.rodape .wrap').forEach(function (w) {
    var redes = w.querySelector('.redes');
    if (redes && S.tiktok && !redes.querySelector('[data-tiktok]')) {
      var t = document.createElement('a');
      t.href = S.tiktok; t.target = '_blank'; t.rel = 'noopener'; t.setAttribute('data-tiktok', '');
      t.setAttribute('aria-label', 'TikTok @7entidos');
      t.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 3c.5 2.8 2.3 4.4 5 4.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>TikTok';
      redes.appendChild(t);
    }
    var extra = document.createElement('div');
    extra.className = 'rodape-extra';
    extra.appendChild(seloRA());
    var wa = botaoWA('botao-wa');
    if (wa) extra.appendChild(wa);
    var emp = document.createElement('p');
    emp.className = 'empresa';
    emp.textContent = '7entidos é um projeto da ' + (S.empresa || '');
    w.appendChild(extra);
    w.appendChild(emp);
  });

  /* Contato (página inicial) */
  var contato = document.querySelector('#contato .contato');
  if (contato) {
    var box = document.createElement('div');
    box.className = 'contato-confianca';
    var wa2 = botaoWA('botao-wa grande');
    if (wa2) box.appendChild(wa2);
    box.appendChild(seloRA());
    contato.appendChild(box);
  }
})();
