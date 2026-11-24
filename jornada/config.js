/* Endereço do robô da planilha (Google Apps Script). */
window.PLANILHA_URL='https://script.google.com/macros/s/AKfycbwRvx36xfpHBv3-ErzjJUlH2O5czTUuIa44hgT-dzqdjXMqeOIEMTBXCeW6n6yKs9x5/exec';

/* Origem da jornada neste aparelho. A entrada principal inicia uma nova atribuição. */
window.codigoDaJornada = function (novaEntrada = false) {
  const codigoPadrao = '7s0a4653';
  const chave = 'jornada7-origem';
  const parametros = new URLSearchParams(location.search);
  let codigo = parametros.get('c');
  if (codigo === null && !novaEntrada) {
    try { codigo = localStorage.getItem(chave); } catch (e) {}
  }
  if (!codigo || codigo.length > 30 || /[^a-z0-9-]/.test(codigo)) {
    codigo = codigoPadrao;
  }
  try { localStorage.setItem(chave, codigo); } catch (e) {}
  return codigo;
};
