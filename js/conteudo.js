/* =====================================================================
   7ENTIDOS · CONTEÚDO EDITÁVEL DO SITE
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
  fotoDestaque: { arquivo: "", descricao: "", legenda: "" },

  fotos: [
    { sentido: "Visão",          arquivo: "", descricao: "", legenda: "" },
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
     --------------------------------------------------------------- */
  telas: {
    "descoberta-rapida": { arquivo: "", descricao: "" },
    "sala-detetive":     { arquivo: "", descricao: "" },
    "mapa":              { arquivo: "", descricao: "" },
    "sensacoes":         { arquivo: "", descricao: "" },
    "descobridor":       { arquivo: "", descricao: "" },
    "retrospectiva":     { arquivo: "", descricao: "" }
  },

  /* ---------------------------------------------------------------
     E-MAIL DE CONTATO
     Só mude "ativo" para true depois de testar que o e-mail
     recebe mensagens no Google Workspace.
     --------------------------------------------------------------- */
  contato: { email: "contato@7entidos.com.br", ativo: false },

  /* ---------------------------------------------------------------
     GOOGLE ANALYTICS · DESLIGADO
     Identificador registrado, mas NADA é carregado nem enviado.
     Antes de ligar: política de privacidade final, aviso de
     consentimento e lista de eventos aprovada. Nunca enviar
     respostas, memórias, relatos ou qualquer conteúdo pessoal.
     --------------------------------------------------------------- */
  analytics: { idMedicao: "G-0GPWW3EZZF", ativo: false }
};
