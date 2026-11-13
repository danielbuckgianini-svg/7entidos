/* =====================================================================
   7entidos · CONTEÚDO EDITÁVEL DO SITE
   Este é o arquivo para trocar fotos e ligar/desligar recursos.
   Os textos ficam direto no index.html, cada um marcado com um
   comentário <!-- TEXTO: ... --> para achar fácil.
   ===================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------
     FOTOS 10×10
     Para colocar uma foto: salve o arquivo na pasta "fotos/" e
     escreva o nome dele em "arquivo". Em "descricao", descreva o
     que aparece na foto (para quem usa leitor de tela).
     Deixe "legenda" vazia se não quiser legenda. Não invente história.
     Enquanto "arquivo" estiver vazio, o site mostra um espaço
     reservado identificado.
     --------------------------------------------------------------- */
  fotoDestaque: { arquivo: "visao-por-do-sol-santos.jpg", descricao: "Pôr do sol em Santos: céu rosa e vermelho sobre o mar, com a orla iluminada, a ilha e as montanhas ao fundo.", legenda: "" },

  fotos: [
    { sentido: "Visão",          arquivo: "visao-por-do-sol-santos.jpg", descricao: "Pôr do sol em Santos: céu rosa e vermelho sobre o mar, com a orla iluminada, a ilha e as montanhas ao fundo.", legenda: "Visão" },
    { sentido: "Audição",        arquivo: "", descricao: "", legenda: "" },
    { sentido: "Tato",           arquivo: "", descricao: "", legenda: "" },
    { sentido: "Olfato",         arquivo: "", descricao: "", legenda: "" },
    { sentido: "Paladar",        arquivo: "", descricao: "", legenda: "" },
    { sentido: "Equilíbrio",     arquivo: "", descricao: "", legenda: "" },
    { sentido: "Noção do corpo", arquivo: "", descricao: "", legenda: "" }
  ],

  /* ---------------------------------------------------------------
     CAPTURAS DO APLICATIVO
     Mesmo esquema: arquivo na pasta "telas/". Use só telas reais e
     sem dados pessoais (de preferência com uma conta de teste).
     As 6 telas abaixo foram feitas com uma pessoa inventada (Marina),
     sem nenhum dado real.
     --------------------------------------------------------------- */
  telas: {
    "descoberta-rapida": { arquivo: "descoberta-rapida.png", descricao: "Tela da Descoberta Rápida no celular: primeira de três perguntas, com seis opções de resposta e uma delas escolhida." },
    "sala-detetive":     { arquivo: "sala-detetive.png", descricao: "Tela da Sala de Detetive no celular: a investigação aparece pausada na pergunta 13, com o botão para retomar." },
    "mapa":              { arquivo: "mapa.png", descricao: "Tela do Mapa no celular: uma constelação escura em que pontos amarelos ligam pistas como aconchego, som e música e cores e luz." },
    "sensacoes":         { arquivo: "sensacoes.png", descricao: "Tela de Memórias no celular: o que se repete nos relatos e uma linha do tempo com lembranças como café coado na casa da avó." },
    "descobridor":       { arquivo: "descobridor.png", descricao: "Tela Para viver no celular: experiências sugeridas, cada uma com o porquê e o que ainda não se sabe." },
    "retrospectiva":     { arquivo: "retrospectiva.png", descricao: "Retrospectiva do mês em formato de Stories: fundo roxo, duas boas sensações registradas e o que mais fez bem no mês." }
  },

  /* ---------------------------------------------------------------
     E-MAIL DE CONTATO
     Só mude "ativo" para true depois de testar que o e-mail
     recebe mensagens no Google Workspace.
     --------------------------------------------------------------- */
  contato: { email: "contato@7entidos.com.br", ativo: false },

  /* ---------------------------------------------------------------
     GOOGLE ANALYTICS · SÓ COM CONSENTIMENTO (js/consentimento.js)
     Nada é carregado antes de a pessoa tocar em "Aceitar" no aviso.
     "ativo: false" desliga tudo, mesmo para quem já aceitou.
     Antes de ligar: política de privacidade final, aviso de
     consentimento e lista de eventos aprovada. Nunca enviar
     respostas, memórias, relatos ou qualquer conteúdo pessoal.
     --------------------------------------------------------------- */
  analytics: { idMedicao: "G-0GPWW3EZZF", ativo: true }
};
