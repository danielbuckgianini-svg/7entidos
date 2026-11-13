/* Textos do lembrete do 7entidos (Bloco 2, 13/11/2026).
   Regras (Sala do Hábito e Sala do App):
   - Só vai para quem pediu, no horário que a própria pessoa escolheu. No máximo 1 por dia.
   - É um convite curto para reparar numa sensação ligada ao momento do dia.
   - Varia de um dia para o outro (não repete o mesmo texto em dias seguidos).
   - Nunca fala de sequência, de dias perdidos, de metas ou de cobrança.
   Uso: lembreteDoMomento(new Date()) devolve um texto. Quando o app das lojas tiver notificações, é daqui que elas leem. */
(function(){
  var L = {
    manha: [
      "Hora do café. Antes do primeiro gole, repare no cheiro.",
      "Bom dia. Abra a janela e repare na luz de agora.",
      "Antes de começar o dia, sinta a água do banho no rosto.",
      "Repare no primeiro som da manhã que chegar até você."
    ],
    almoco: [
      "Na primeira garfada de hoje, repare no sabor com calma.",
      "Hora do almoço. Qual cheiro vem da cozinha agora?",
      "Antes de comer, repare nas cores do seu prato."
    ],
    tarde: [
      "Uma pausa de um minuto: repare em uma textura perto de você.",
      "Que som está por perto agora? Ouça por alguns segundos.",
      "Alongue os braços devagar e repare como o corpo responde.",
      "Olhe pela janela: tem alguma cor bonita lá fora?"
    ],
    noite: [
      "Fim do dia. Repare no cheiro da sua casa agora.",
      "Antes de dormir, sinta o tecido do lençol nas mãos.",
      "Qual foi a boa sensação de hoje? Lembre dela por um instante.",
      "Apague uma luz e repare no silêncio por alguns segundos."
    ]
  };
  function momento(h){ return h<11?"manha":h<14?"almoco":h<18?"tarde":"noite"; }
  window.LEMBRETES = L;
  window.lembreteDoMomento = function(data, ultimo){
    var d = data || new Date(), lista = L[momento(d.getHours())];
    var dia = Math.floor(d.getTime()/86400000), i = dia % lista.length;
    if (ultimo && lista[i] === ultimo) i = (i+1) % lista.length;
    return lista[i];
  };
})();
