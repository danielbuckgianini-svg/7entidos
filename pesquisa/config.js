/* Endereço do robô da planilha da pesquisa v5 (Google Apps Script).
   Cole aqui o link que termina em /exec, entre as aspas.
   TRAVA DE TESTE: só manda respostas para a planilha de verdade quando a pesquisa
   está aberta no site oficial (7entidos.com.br) e SEM "?teste" no endereço.
   Prévias, áreas de teste e o link com ?teste=1 não gravam nada. */
(function(){
  var URL_REAL='https://script.google.com/macros/s/AKfycbzyFvE9Z2YT4L_JvgZNkI3MawQImnZBMysKvtxd6FxxhnTYrZvphnY76SxGkLnUsRQp/exec';
  var h=(location.hostname||'').toLowerCase();
  var oficial=(h==='7entidos.com.br'||h==='www.7entidos.com.br');
  var teste=/[?&]teste(=|&|$)/.test(location.search||'');
  window.PESQUISA_TESTE=!oficial||teste;
  window.PESQUISA_URL=window.PESQUISA_TESTE?'':URL_REAL;
})();
