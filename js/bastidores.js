/* Formulário "Entre nos bastidores da Casa" (seção do reality, página inicial).
   Guarda primeiro nome + WhatsApp na planilha da Jornada (mesmo robô do Google),
   com tipo "bastidores". Envio só com o aceite marcado. */
(function () {
  var alvo = document.getElementById('bastidores');
  if (!alvo) return;
  var URL_PLANILHA = window.PLANILHA_URL || '';
  var CONVITE = '7s0a4653';
  var INSTA = 'https://www.instagram.com/7entidoss/';

  alvo.innerHTML =
    '<form class="bastidores" novalidate>' +
    '<h3>Entre nos bastidores da Casa</h3>' +
    '<p>Deixe o seu primeiro nome e o seu WhatsApp para receber os bastidores dos episódios.</p>' +
    '<label>Primeiro nome<input type="text" name="nome" autocomplete="given-name" maxlength="40" required></label>' +
    '<label>WhatsApp com DDD<input type="tel" name="cel" autocomplete="tel" inputmode="tel" placeholder="(13) 99999-9999" maxlength="16" required></label>' +
    '<label class="ok-check"><input type="checkbox" name="aceite" required><span>Aceito receber mensagens do 7entidos no WhatsApp. Posso sair quando quiser. <a href="privacidade.html" target="_blank" rel="noopener">Privacidade</a></span></label>' +
    '<button type="submit">Quero os bastidores</button>' +
    '<p class="msg" role="status" aria-live="polite"></p>' +
    '</form>';

  var f = alvo.querySelector('form');
  var msg = f.querySelector('.msg');
  var cel = f.cel;

  cel.addEventListener('input', function () {
    var d = cel.value.replace(/\D/g, '').slice(0, 11);
    var t = d;
    if (d.length > 2) t = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) t = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    cel.value = t;
  });

  function erro(t, campo) { msg.textContent = t; msg.className = 'msg erro'; if (campo) campo.focus(); }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = f.nome.value.trim().split(/\s+/)[0] || '';
    var num = cel.value.replace(/\D/g, '');
    if (!nome) return erro('Escreva o seu primeiro nome.', f.nome);
    if (num.length < 10 || num.length > 11) return erro('Confira o WhatsApp: DDD + número.', cel);
    if (!f.aceite.checked) return erro('Marque o aceite para receber as mensagens.', f.aceite);
    var b = f.querySelector('button'); b.disabled = true; b.textContent = 'Enviando...';
    var corpo = { c: CONVITE, tipo: 'bastidores', id: 'b' + Date.now().toString(36), nome: nome, cel: '55' + num, em: new Date().toISOString(), origem: 'site · reality', aceite: 'sim' };
    var envio = URL_PLANILHA
      ? fetch(URL_PLANILHA, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(corpo), keepalive: true })
      : Promise.resolve();
    envio.then(fim, fim);
    function fim() {
      try { if (window.gtag) window.gtag('event', 'bastidores_inscricao'); } catch (x) {}
      f.innerHTML =
        '<h3>Pronto, ' + nome.replace(/[<>&"]/g, '') + '! Você está nos bastidores.</h3>' +
        '<p>Os bastidores dos episódios vão chegar no seu WhatsApp. Enquanto isso, siga a Casa no Instagram para não perder nenhum episódio.</p>' +
        '<a class="cta" href="' + INSTA + '" target="_blank" rel="noopener">Seguir @7entidoss</a>';
    }
  });
})();
