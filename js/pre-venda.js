/* Pré-lançamento 7ENTIDOS. Só ativar após conectar e testar um receptor privado.
   O receptor deve validar os campos, aplicar proteção contra abuso, armazenar
   em área privada e responder JSON {ok:true} somente depois da gravação.
   Nunca guardar cadastros no repositório público ou nas ferramentas de Analytics. */
(function () {
  'use strict';
  var config = window.PRE_VENDA || { endpoint: '' };
  var dialog = document.getElementById('pre-venda');
  var form = document.getElementById('pv-form');
  var status = document.getElementById('pv-status');
  if (!dialog || !form || !status) return;
  var button = form.querySelector('[type="submit"]');
  var endpoint = '';
  try { var url = new URL(config.endpoint); if (url.protocol === 'https:') endpoint = url.href; } catch (e) {}
  var payment = document.getElementById('pv-pagar');
  // Só apresentar cobrança após informar as regras e conectar checkout real.
  if (payment && config.paymentUrl && config.paymentTermsApproved === true) {
    try { var checkout = new URL(config.paymentUrl);
      if (checkout.protocol === 'https:') { payment.href = checkout.href; payment.hidden = false; }
    } catch (e) {}
  }
  var busy = false, sent = false, previousFocus = null;
  function setStatus(message, error) {
    status.textContent = message;
    status.toggleAttribute('data-erro', !!error);
  }
  if (endpoint) {
    button.disabled = false;
    setStatus('Seus dados serão usados somente para esta seleção e o lançamento.');
  }
  function open() {
    if (dialog.open || typeof dialog.showModal !== 'function') return;
    previousFocus = document.activeElement;
    dialog.showModal();
    var target = dialog.querySelector('[data-fechar-pre-venda]');
    target.focus({preventScroll:true});
  }
  function dismissed() { try { return sessionStorage.getItem('7entidos-pre-venda-v1') === 'fechado'; } catch (e) { return false; } }
  dialog.addEventListener('close', function () {
    try { sessionStorage.setItem('7entidos-pre-venda-v1','fechado'); } catch (e) {}
    if (previousFocus && previousFocus.isConnected) previousFocus.focus({preventScroll:true});
  });
  document.querySelectorAll('[data-abrir-pre-venda]').forEach(function (el) { el.addEventListener('click', open); });
  dialog.querySelector('[data-fechar-pre-venda]').addEventListener('click', function () { dialog.close(); });
  // Não disputar o foco com o aviso de consentimento das estatísticas.
  var timer = setTimeout(function () {
    if (dismissed()) return;
    if (!document.getElementById('aviso-estatisticas')) { open(); return; }
    var observer = new MutationObserver(function () {
      if (!document.getElementById('aviso-estatisticas')) {
        observer.disconnect();
        if (!dismissed()) open();
      }
    });
    observer.observe(document.body,{childList:true});
  }, 1800);
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy || sent || !form.reportValidity()) return;
    if (!endpoint) { setStatus('As inscrições ainda não estão abertas. Nenhum dado foi enviado.', true); return; }
    var data = new FormData(form);
    var phone = String(data.get('whatsapp') || '').trim();
    if (phone && !/^\+?[\d\s().-]{10,24}$/.test(phone)) {
      setStatus('Confira o WhatsApp e inclua o DDD, ou deixe esse campo vazio.', true);
      document.getElementById('pv-whatsapp').focus(); return;
    }
    var payload = { nome:String(data.get('nome') || '').trim(), email:String(data.get('email') || '').trim(), whatsapp:phone, consentimento:data.get('consentimento') === 'on', aviso:'pre-lancamento-dezembro-2026-v1', campanha:'100-primeiros-dezembro-2026' };
    if (!payload.nome) { setStatus('Preencha seu nome para continuar.',true); return; }
    busy = true; button.disabled = true; form.setAttribute('aria-busy','true');
    setStatus('Enviando sua inscrição…');
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); },15000);
    try {
      var response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
      var result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error('Inscrição não confirmada');
      sent = true; form.reset();
      form.querySelectorAll('input').forEach(function (input) { input.disabled = true; });
      button.textContent = 'Inscrição recebida';
      setStatus('Recebemos sua inscrição! A seleção das 100 pessoas acontece em dezembro de 2026. Se você for escolhido, entraremos em contato.');
    } catch (error) {
      setStatus('Não foi possível confirmar sua inscrição. Seus dados continuam no formulário; tente novamente.',true);
    } finally { clearTimeout(timeout); busy = false; button.disabled = sent; form.removeAttribute('aria-busy'); }
  });
})();
