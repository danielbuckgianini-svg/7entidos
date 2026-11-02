/**
 * 7ENTIDOS · recebe o cadastro de fundadores do site e grava numa Planilha Google da empresa.
 *
 * Como ligar (uma vez só, na conta Google da empresa):
 * 1. Crie uma planilha chamada "7ENTIDOS · Fundadores".
 * 2. Menu Extensões → Apps Script. Apague o que estiver lá e cole este arquivo inteiro.
 * 3. Clique em Implantar → Nova implantação → tipo "App da Web".
 *    Executar como: Eu. Quem pode acessar: Qualquer pessoa.
 * 4. Copie o endereço que termina em /exec e cole em js/conteudo.js → SITE.fundadores.endereco,
 *    e mude "ativo" para true.
 *
 * A planilha fica privada: só quem tem acesso à conta da empresa vê os cadastros.
 */
var ABA = "Cadastros";
var CABECALHO = ["Recebido em", "Nome", "E-mail", "WhatsApp", "18 anos ou mais", "Aceita contato",
  "Nome no mural", "Quer testar antes", "Celular", "Origem"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var d = JSON.parse(e.postData.contents || "{}");
    var email = String(d.email || "").trim().toLowerCase();
    if (!d.nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !d.maior18 || !d.aceiteContato) {
      return resposta({ ok: false });
    }
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
    if (aba.getLastRow() === 0) aba.appendRow(CABECALHO);
    /* Não repete quem já se cadastrou com o mesmo e-mail */
    var emails = aba.getLastRow() > 1 ? aba.getRange(2, 3, aba.getLastRow() - 1, 1).getValues().map(function (r) { return String(r[0]).toLowerCase(); }) : [];
    if (emails.indexOf(email) === -1) {
      aba.appendRow([new Date(), limpar(d.nome, 80), email, limpar(d.whatsapp, 20), "sim", "sim",
        d.mural ? "sim" : "não", d.testarAntes ? "sim" : "não", limpar(d.sistema, 10), limpar(d.origem, 80)]);
    }
    return resposta({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* Evita que um texto comece com =, +, - ou @ e vire fórmula na planilha */
function limpar(t, max) {
  var s = String(t || "").slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
