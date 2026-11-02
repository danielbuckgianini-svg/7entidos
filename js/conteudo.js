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
     As 3 telas abaixo foram feitas com uma pessoa inventada (Marina),
     sem nenhum dado real (app com a nova identidade, 02/11/2026).
     --------------------------------------------------------------- */
  telas: {
    "seu-dia":       { arquivo: "seu-dia.png", descricao: "Tela Hoje no celular: a pergunta O que você quer sentir hoje?, a sugestão do olfato e os sentidos escolhidos para trocar." },
    "meus-sentidos": { arquivo: "meus-sentidos.png", descricao: "Tela Meus sentidos no celular: o anel com sete luzes coloridas, duas acesas, e a lista dos sentidos com barras." },
    "abertura":      { arquivo: "abertura.png", descricao: "Abertura do app no celular: o símbolo, o anel de sete luzes, a frase A vida é feita de boas sensações. No seu ritmo. e o botão Começar minha jornada." }
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
