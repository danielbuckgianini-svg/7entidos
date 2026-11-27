/* =====================================================================
   7entidos · FASE 3 · BANCO DE PERGUNTAS DA RÉGUA (V4, 27/11)  · PROVISÓRIO, para o Daniel aprovar
   Arquivo só de dados (sem regras). O motor fica em fase3-regua.js.

   REGRA DA RÉGUA
   A. O 5 é o meio neutro. Do 6 ao 10, coisas boas que vão melhorando. Do 4 para baixo, coisas NEGATIVAS que vão piorando.
   B. Do 4 ao 1, cada número piora em: quanto incomoda, quanto dura e quanto a pessoa fica sem saída.
   C. Em todo número, as 5 opções são ligadas aos 5 motivos (sempre nesta ordem):
        soc = Conexão social · pau = Pausa e alívio · sen = Prazer sensorial · con = Prazer concreto · jei = Do meu jeito
      Do 4 para baixo, cada opção é o AVESSO do motivo.
   D. Nada de tragédia: nunca morte, doença grave, violência, abuso, nem nada que pareça teste clínico.
   E. Do 5 para baixo, nunca oferecer algo que a pessoa escolheu como bom nas Fases 1 e 2 (o motor confere).

   Cada opção: t = texto · m = motivo · s = sentido (para a foto e a cor da luz) · sit = situação dos motivos ligada (Bloco 6)
   ===================================================================== */
window.RG_BANCO = {
 motivos: ["soc","pau","sen","con","jei"],

 /* DEGRAU 1 · "o mais e o menos": 5 situações do nível, uma por motivo.
    Dois conjuntos por número (o 2º aparece em "Nenhuma dessas").
    No 10, o app usa 4 escolhas das Fases 1 e 2 + 1 novidade; o banco do 10 só entra se a pessoa não tiver escolhas. */
 degrau1: {
  10: [
   [{t:"Abraçar alguém que eu amo depois de muito tempo",m:"soc",s:"tato",sit:"abraco"},
    {t:"Um dia inteiro sem compromisso nenhum",m:"pau",s:"corpo",sit:"rede"},
    {t:"Ver o pôr do sol de frente para o mar",m:"sen",s:"visao",sit:"praia"},
    {t:"Ganhar uma surpresa que eu queria muito",m:"con",s:"visao",sit:"compras"},
    {t:"Uma viagem planejada do meu jeito",m:"jei",s:"visao",sit:"viagem"}],
   [{t:"Uma festa com as pessoas que eu mais amo",m:"soc",s:"audicao",sit:"samba"},
    {t:"Férias longe de tudo",m:"pau",s:"corpo",sit:"viagem"},
    {t:"Um banho de mar num dia quente",m:"sen",s:"tato",sit:"praia"},
    {t:"Minha comida preferida feita com carinho",m:"con",s:"paladar",sit:"comidavo"},
    {t:"Realizar um sonho antigo",m:"jei",s:"corpo",sit:"viagem"}]
  ],
  9: [
   [{t:"Rir muito com as amigas",m:"soc",s:"audicao",sit:"samba"},
    {t:"Um fim de semana sem pressa",m:"pau",s:"corpo",sit:"rede"},
    {t:"Ouvir a minha música preferida ao vivo",m:"sen",s:"audicao",sit:"samba"},
    {t:"Ganhar um presente bonito",m:"con",s:"visao",sit:"compras"},
    {t:"Terminar algo que eu fiz com as minhas mãos",m:"jei",s:"tato",sit:"decorar"}],
   [{t:"Almoço de domingo com a família toda",m:"soc",s:"paladar",sit:"comidavo"},
    {t:"Uma tarde inteira na rede",m:"pau",s:"equilibrio",sit:"rede"},
    {t:"Mergulhar no mar",m:"sen",s:"tato",sit:"praia"},
    {t:"Comer num restaurante especial",m:"con",s:"paladar",sit:"cozinhar"},
    {t:"Conhecer um lugar novo do meu jeito",m:"jei",s:"visao",sit:"viagem"}]
  ],
  8: [
   [{t:"Conversar com uma amiga no portão",m:"soc",s:"audicao",sit:"feira"},
    {t:"Um banho demorado depois do trabalho",m:"pau",s:"tato",sit:"agua"},
    {t:"Cheiro de bolo saindo do forno",m:"sen",s:"olfato",sit:"padaria"},
    {t:"Achar uma promoção boa na feira",m:"con",s:"visao",sit:"feira"},
    {t:"Arrumar a casa do meu jeito",m:"jei",s:"visao",sit:"decorar"}],
   [{t:"Receber uma mensagem carinhosa",m:"soc",s:"visao",sit:"abraco"},
    {t:"Cochilar à tarde",m:"pau",s:"corpo",sit:"respirar"},
    {t:"Dançar uma música que eu gosto",m:"sen",s:"equilibrio",sit:"danca"},
    {t:"Pão quentinho no café da manhã",m:"con",s:"paladar",sit:"padaria"},
    {t:"Caminhar no meu ritmo",m:"jei",s:"corpo",sit:"orla"}]
  ],
  7: [
   [{t:"Tomar um café com a vizinha",m:"soc",s:"paladar",sit:"cafe"},
    {t:"Sentar na praça e olhar o movimento",m:"pau",s:"visao",sit:"orla"},
    {t:"Ouvir a chuva no telhado",m:"sen",s:"audicao",sit:"chuva"},
    {t:"Fazer um lanche gostoso",m:"con",s:"paladar",sit:"cafe"},
    {t:"Escolher a roupa do dia com calma",m:"jei",s:"visao",sit:"compras"}],
   [{t:"Ver novela comentando com alguém",m:"soc",s:"visao",sit:"novela"},
    {t:"Fechar os olhos uns minutinhos",m:"pau",s:"corpo",sit:"respirar"},
    {t:"Sentir o sol da manhã na pele",m:"sen",s:"tato",sit:"praia"},
    {t:"Ver a casa limpinha no fim do dia",m:"con",s:"visao",sit:"decorar"},
    {t:"Cuidar das plantas sem pressa",m:"jei",s:"tato",sit:"plantas"}]
  ],
  6: [
   [{t:"Dar bom-dia para o pessoal do bairro",m:"soc",s:"audicao",sit:"padaria"},
    {t:"Um copo d'água gelada no calor",m:"pau",s:"paladar",sit:"agua"},
    {t:"Um vento fresquinho na janela",m:"sen",s:"tato",sit:"orla"},
    {t:"Comer uma fruta docinha",m:"con",s:"paladar",sit:"feira"},
    {t:"Mudar um móvel de lugar",m:"jei",s:"visao",sit:"decorar"}],
   [{t:"Uma conversa rápida na fila",m:"soc",s:"audicao",sit:"feira"},
    {t:"Sentar um pouco depois de andar",m:"pau",s:"corpo",sit:"respirar"},
    {t:"Cheiro de roupa limpa",m:"sen",s:"olfato",sit:"cobertor"},
    {t:"Achar uma coisa que eu tinha perdido",m:"con",s:"visao",sit:"decorar"},
    {t:"Ouvir o rádio na estação que eu gosto",m:"jei",s:"audicao",sit:"novela"}]
  ],
  /* 5 · Tanto faz: nem bom nem ruim, passa sem deixar marca */
  5: [
   [{t:"Cumprimentar alguém no elevador",m:"soc",s:"audicao"},
    {t:"Esperar o ônibus chegar",m:"pau",s:"corpo"},
    {t:"Ouvir o barulho da geladeira",m:"sen",s:"audicao"},
    {t:"Pegar a correspondência",m:"con",s:"tato"},
    {t:"Escolher entre dois pacotes de arroz iguais",m:"jei",s:"visao"}],
   [{t:"Responder uma mensagem do grupo",m:"soc",s:"visao"},
    {t:"Esperar na fila do mercado",m:"pau",s:"corpo"},
    {t:"Um dia nublado, sem chuva",m:"sen",s:"visao"},
    {t:"Lavar a louça do almoço",m:"con",s:"tato"},
    {t:"Arrumar a cama de manhã",m:"jei",s:"corpo"}]
  ],
  /* 4 ao 0: preparados e vazios. Aqui entram as situações ruins (o AVESSO de cada motivo) quando chegarem. */
  4: [], 3: [], 2: [], 1: [], 0: []
 },

 /* DEGRAU 2 · o porquê ("escada do porquê"): por que aquela escolha é o número dela.
    Uma frase por motivo, no tom de cada número. Aparece com a escolha dela em cima. */
 degrau2: {
  10: {soc:"Estar com quem eu amo",pau:"Esquecer de tudo, sem ninguém me pedir nada",sen:"Sentir isso com o corpo inteiro",con:"Ganhar algo gostoso no fim",jei:"Ser do meu jeito, na hora que eu quero"},
  9:  {soc:"Ter alguém para dividir",pau:"Descansar de verdade",sen:"O que eu vejo, ouço e sinto",con:"O que eu levo de bom",jei:"Fazer do meu jeito"},
  8:  {soc:"Ter alguém junto",pau:"Uma pausa na correria",sen:"A sensação gostosa",con:"Uma coisa boa que eu ganho",jei:"Poder escolher como"},
  7:  {soc:"Ter companhia",pau:"Um respiro no meio do dia",sen:"O gostinho do momento",con:"Algo útil ou gostoso",jei:"Fazer no meu ritmo"},
  6:  {soc:"Um contato com alguém",pau:"Um alívio pequeno",sen:"Uma sensação boa no corpo",con:"Um agrado simples",jei:"Uma escolha minha"},
  5:  {soc:"Estar ou não com alguém, tanto faz",pau:"Não cansa nem descansa",sen:"Não tem cor, cheiro nem gosto especial",con:"Não ganho nem perco nada",jei:"Não fui eu que escolhi, mas tanto faz"},
  4: {}, 3: {}, 2: {}, 1: {}, 0: {}
 },

 /* ÚLTIMO DEGRAU · listas aprovadas por motivo. A inteligência do app (quando ligada) só ESCOLHE 4 itens daqui,
    nunca escreve frases novas. Sem ela, o app usa os 4 primeiros que ainda não apareceram. */
 ultimo: {
  soc:["com quem eu amo do lado","com a família reunida","com as amigas","com gente nova para conhecer","com alguém para conversar","com meu bichinho por perto"],
  pau:["sem hora para acabar","longe do celular","depois de um dia cheio","sem ninguém me chamar","num dia de folga","em silêncio"],
  sen:["pelo que eu vejo","pelo som","pelo cheiro","pelo sabor","pelo toque na pele","pelo movimento do corpo"],
  con:["com uma comida gostosa","ganhando um presentinho","levando algo para casa","com uma foto para guardar","com algo pronto no fim","com uma lembrança para mostrar"],
  jei:["na hora que eu escolho","no meu ritmo","do jeito que eu inventei","sem ninguém dar palpite","no lugar que eu escolhi","decidindo tudo sozinha"]
 },

 /* "Mais ou menos" → "O que faltou para ser um N?" (cada resposta puxa para um motivo; "outra coisa" abre o "Escrever o meu") */
 faltou: [["alguém junto","soc"],["um tempo só para mim","pau"],["sentir mais com o corpo","sen"],["ganhar algo no fim","con"],["ser do meu jeito","jei"],["outra coisa",null]],

 /* as 30 novidades (lista da Sala 3): uma entra no degrau 1 do 10 */
 novidades: [
  ["ver o nascer do sol","visao"],["olhar as estrelas deitada","visao"],["ouvir passarinhos de manhã","audicao"],["ouvir uma música antiga que marcou","audicao"],
  ["ouvir o mar de olhos fechados","audicao"],["banho morno demorado","tato"],["pés na grama","tato"],["carinho no cabelo","tato"],["lençol que secou no sol","olfato"],
  ["mãos na massa de pão","tato"],["cheiro de bolo saindo do forno","olfato"],["cheiro de terra molhada","olfato"],["flor de laranjeira","olfato"],["cheiro de livro novo","olfato"],
  ["café coado na hora","paladar"],["manga bem madura","paladar"],["chocolate derretendo devagar na boca","paladar"],["sorvete num dia de calor","paladar"],
  ["pão quentinho com manteiga","paladar"],["chá de canela","paladar"],["balançar na rede","equilibrio"],["dançar sozinha na sala","equilibrio"],
  ["caminhar descalça na areia","equilibrio"],["alongar o corpo devagar","corpo"],["boiar no mar","equilibrio"],["andar de bicicleta","equilibrio"],
  ["respirar fundo na janela","corpo"],["deitar na grama e olhar o céu","corpo"],["massagem nos pés","tato"],["rir até a barriga doer","corpo"]
 ]
};
