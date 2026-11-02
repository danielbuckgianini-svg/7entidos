/* 7ENTIDOS · cadastro de fundadores
   Envia o cadastro para a planilha Google da empresa (endereço em js/conteudo.js → SITE.fundadores.endereco).
   Enquanto o endereço estiver vazio, nada é enviado: a página avisa que o cadastro está em configuração.
   Nunca envia nada para ferramentas de medição. */
(function () {
  var C = (window.SITE && window.SITE.fundadores) || {};
  var f = document.getElementById("form-fundadores");
  if (!f) return;
  var $ = function (id) { return document.getElementById(id); };
  var ret = $("retorno"), btn = $("f-enviar");

  $("f-testar").addEventListener("change", function () { $("bloco-sistema").hidden = !this.checked; });

  function mostrar(tipo, texto) { ret.className = "retorno " + tipo; ret.textContent = texto; ret.hidden = false; }
  function soNumeros(t) { return String(t || "").replace(/\D/g, ""); }
  function origem() {
    try { var p = new URLSearchParams(location.search); return [p.get("utm_source"), p.get("utm_campaign")].filter(Boolean).join(" / ") || "site"; }
    catch (e) { return "site"; }
  }

  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = $("f-nome").value.trim(), email = $("f-email").value.trim(), whats = soNumeros($("f-whats").value);
    if (!nome) { mostrar("erro", "Escreva o seu nome."); $("f-nome").focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrar("erro", "Confira o e-mail: parece que falta alguma parte."); $("f-email").focus(); return; }
    if (whats.length < 10 || whats.length > 13) { mostrar("erro", "Confira o WhatsApp: escreva com DDD, por exemplo (13) 90000-0000."); $("f-whats").focus(); return; }
    if (!$("f-idade").checked) { mostrar("erro", "O 7ENTIDOS é para pessoas com 18 anos ou mais."); return; }
    if (!$("f-aceite").checked) { mostrar("erro", "Para receber o convite, marque que aceita receber avisos por e-mail e WhatsApp."); return; }
    if ($("f-site").value) { mostrar("ok", "Pronto! Você está na lista."); f.reset(); return; } /* robô: finge sucesso e não envia */

    var dados = {
      nome: nome, email: email, whatsapp: whats,
      maior18: true, aceiteContato: true,
      mural: $("f-mural").checked, testarAntes: $("f-testar").checked,
      sistema: $("f-testar").checked ? $("f-sistema").value : "",
      origem: origem(), enviadoEm: new Date().toISOString()
    };

    if (!C.ativo || !C.endereco) {
      mostrar("aviso", "Prévia: o cadastro ainda não está ligado à planilha. Nada foi enviado.");
      return;
    }
    btn.disabled = true; btn.textContent = "Enviando…";
    fetch(C.endereco, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(dados) })
      .then(function () {
        f.reset(); $("bloco-sistema").hidden = true;
        mostrar("ok", "Pronto, " + nome.split(" ")[0] + "! Você está na lista. No lançamento, o convite chega por e-mail e WhatsApp.");
      })
      .catch(function () { mostrar("erro", "Não consegui enviar agora. Confira a sua internet e tente de novo."); })
      .then(function () { btn.disabled = false; btn.textContent = "Quero ser avisado"; });
  });
})();
