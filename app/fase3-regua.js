/* =====================================================================
   7entidos · FASE 3 · A RÉGUA PESSOAL  (branch fase3-regua, só na prévia)
   Bloco 1 · Base da régua (abertura, 11 etapas, liberação em blocos, Coloque na régua,
             limite de 5 por dia, mandala e estrelinha)
   Bloco A · Modo teste (link direto, tudo liberado, "Avançar um dia", "Recomeçar")
   Bloco B · As rodadas de cada número (o "Akinator que desce")
   Bloco C · O conteúdo (situações, nomes, palavras do sentimento, 30 novidades, momento real, coerência)
   Bloco D · Recompensas e ritmo (estrelinha, mandala, barra, baú, foguinho, fim do dia, tela final)
   Bloco E · Abertura e conferência
   Este arquivo NÃO mexe nas Fases 1 e 2: ele só troca o que acontece depois do fim da Fase 2,
   e só quando a Fase 3 está aberta (hoje: só na prévia, F3_ABERTA = PREVIA).
   Tudo fica guardado só no celular da pessoa (localStorage "7e_regua"; no modo teste, "7e_regua_teste").
   ===================================================================== */
(function(){
if(typeof F3_ABERTA==="undefined") return;

/* =================== BLOCO A · MODO TESTE =================== */
/* Liga com o link da prévia terminado em ?teste (ou #teste), ou com window.F3_TESTE = 1 antes do app.
   Nunca liga no app de verdade (precisa estar na prévia). */
const TESTE = !!(PREVIA && (/[?&#]teste/i.test(location.search+location.hash) || window.F3_TESTE));
const CHAVE = TESTE ? "7e_regua_teste" : "7e_regua";
/* respostas de exemplo das Fases 1 e 2 (só no modo teste, só se a pessoa não tiver as suas) */
const EXEMPLO_F1 = {visao:"Pôr do sol na praia", audicao:"Som do mar", tato:"Abraço apertado", paladar:"Café passado na hora", olfato:"Cheiro de café", equilibrio:"Balançar numa rede", corpo:"Alongar"};
const EXEMPLO_F2 = {visao:3, olfato:3, tato:3, audicao:2, paladar:2, equilibrio:2, corpo:1};

/* =================== TEXTOS (Bloco C e E) =================== */
/* Quando o vídeo novo da Brisa chegar: troque o arquivo brisa-fase3.mp4, mude VIDEO3_NOVO para true
   e ajuste os segundos da legenda (LEG3_NOVA) pela fala exata. */
const VIDEO3_NOVO = true;
const FALA3 = "Agora começa uma fase muito importante: é aqui que eu começo a ligar tudo o que você me mostrou. Vamos montar a sua régua, do 10 até o 0. O que é um 10 pra você? E um 5? Ninguém sente igual, por isso a régua é só sua. São dez etapas, uma para cada número, e você escolhe o número do dia, sem pressa. A cada resposta, o app fica mais inteligente para você! Vamos começar pelo seu 10?";
const LEG3_NOVA = [[1.0,6.7,"Agora começa uma fase muito importante: é aqui que eu começo a ligar tudo o que você me mostrou."],[6.7,10.4,"Vamos montar a sua régua, do 10 até o 0."],[10.4,12.9,"O que é um 10 pra você? E um 5?"],[12.9,16.8,"Ninguém sente igual, por isso a régua é só sua."],[16.8,22.3,"São dez etapas, uma para cada número, e você escolhe o número do dia, sem pressa."],[22.3,26.3,"A cada resposta, o app fica mais inteligente para você!"],[26.3,29,"Vamos começar pelo seu 10?"]];
/* vídeo novo (27/11): arquivo separado, para não mudar o fim da Fase 2 que está no ar */
const VID3_REGUA = (NO_SITE?"/app/":"")+"brisa-fase3-regua.mp4";
const FIM_DIA = "Por hoje é isso. Amanhã tem mais um pedacinho da sua régua.";
const FOLGA_TXT = "Hoje é seu dia de folga. Seu foguinho fica guardado.";
const BAU_VAZIO = "Desta vez veio vazio. Quem sabe no próximo!";
const CURIOSIDADES = [
 "Os cientistas contam mais de 5 sentidos: equilíbrio e noção do corpo também são sentidos.",
 "O cheiro tem um caminho curto até a parte do cérebro ligada às emoções e às lembranças: por isso um perfume te leva de volta no tempo.",
 "Não existe \"mapa da língua\": doce, salgado, azedo e amargo são sentidos na língua toda.",
 "O equilíbrio mora dentro do ouvido, em canais cheios de líquido.",
 "A pele é o maior órgão do corpo, e é por ela que o carinho chega."
];

/* ---------- as etapas ---------- */
const NOMES = {10:"Êxtase",9:"Excelente",8:"Muito bom",7:"Bom",6:"Legal",5:"Tanto faz",4:"Sem graça",3:"Chato",2:"Ruim",1:"Péssimo",0:"Insuportável"};
const ORDEM = [10,1,9,8,7,6,5,4,3,2,0];
const BLOCOS = [[10,1],[9,8,7],[6,5,4],[3,2,0]];
const LIMITE_DIA = 5;

/* "Coloque na régua": 7 situações iguais para todo mundo, uma por sentido (dia 1, antes do 10). */
const COLOQUE = [
 {sid:"visao",      txt:"Ver um céu cor-de-rosa no fim da tarde"},
 {sid:"audicao",    txt:"Ouvir a música alta do vizinho tarde da noite"},
 {sid:"tato",       txt:"Um abraço apertado de quem você ama"},
 {sid:"olfato",     txt:"Cheiro de café passando de manhã"},
 {sid:"paladar",    txt:"Uma comida morna e sem sal"},
 {sid:"equilibrio", txt:"Ficar em pé num ônibus cheio que freia toda hora"},
 {sid:"corpo",      txt:"Esticar o corpo logo depois de acordar"}
];

/* palavra do sentimento: 5 por faixa de cor */
const PALAVRAS = [
 {de:9,ate:10,p:["radiante","em paz","grata","livre","encantada"]},
 {de:7,ate:8, p:["bem","satisfeita","sorridente","confortável","disposta"]},
 {de:5,ate:6, p:["de boa","calma","normal","distraída","pensativa"]},
 {de:3,ate:4, p:["cansada","sem graça","impaciente","chateada","desanimada"]},
 {de:0,ate:2, p:["chateada demais","sem energia","nervosa","abatida","incomodada"]}
];
const palavrasDe = n => PALAVRAS.find(f=>n>=f.de&&n<=f.ate).p;

/* as 30 novidades (uma entra em cada rodada), com o sentido de cada uma (para a cor) */
const NOVIDADES = [
 ["ver o nascer do sol","visao"],["olhar as estrelas deitada","visao"],["ouvir passarinhos de manhã","audicao"],["ouvir uma música antiga que marcou","audicao"],
 ["ouvir o mar de olhos fechados","audicao"],["banho morno demorado","tato"],["pés na grama","tato"],["carinho no cabelo","tato"],["lençol que secou no sol","olfato"],
 ["mãos na massa de pão","tato"],["cheiro de bolo saindo do forno","olfato"],["cheiro de terra molhada","olfato"],["flor de laranjeira","olfato"],["cheiro de livro novo","olfato"],
 ["café coado na hora","paladar"],["manga bem madura","paladar"],["chocolate derretendo devagar na boca","paladar"],["sorvete num dia de calor","paladar"],
 ["pão quentinho com manteiga","paladar"],["chá de canela","paladar"],["balançar na rede","equilibrio"],["dançar sozinha na sala","equilibrio"],
 ["caminhar descalça na areia","equilibrio"],["alongar o corpo devagar","corpo"],["boiar no mar","equilibrio"],["andar de bicicleta","equilibrio"],
 ["respirar fundo na janela","corpo"],["deitar na grama e olhar o céu","corpo"],["massagem nos pés","tato"],["rir até a barriga doer","corpo"]
];

/* =================== BLOCO B · O MOTOR DAS RODADAS =================== */
/* Degrau 1: "o mais e o menos" entre 5 opções (4 das Fases 1 e 2 + 1 novidade).
   Degrau 2: banco de perguntas preparadas, que vai mais fundo no que a pessoa confirmou.
   Degrau 3 (último): pergunta da IA (Claude Haiku). Do 0 ao 2 não tem IA: usa o banco.
   O "isto ou aquilo" (duelo) só entra para desempatar, quando a pessoa troca de caminho. */
const DIMS = {
 companhia:{q:n=>`E com quem isso é mais o seu ${n}?`,      s:["sozinha","com alguém que você ama","com amigos","em família"]},
 lugar:    {q:n=>`E onde isso é mais o seu ${n}?`,          s:["num lugar conhecido","pertinho de casa","viajando","num lugar novo"]},
 hora:     {q:n=>`E em que hora isso é mais o seu ${n}?`,   s:["de manhã cedo","no fim da tarde","à noite","sem hora para acabar"]},
 estado:   {q:n=>`E de que jeito isso é mais o seu ${n}?`,  s:["depois de um dia cheio","já tranquila","com uma lembrança boa junto","de surpresa"]}
};
/* ordem de força: a pergunta que mais separa as possibilidades vem primeiro (companhia muda mais a nota do que a hora, por exemplo) */
const DIM_ORDEM = ["companhia","lugar","hora","estado"];
const FALTOU = [["alguém junto","companhia"],["mais tempo","hora"],["outro lugar","lugar"],["estar mais tranquila","estado"],["outra coisa",null]];
const MAX_RODADAS = n => n===10?6 : n===0?1 : 4;
const CERTEZA = n => n===10?.9 : .6;     /* a partir daqui, a próxima é a última (degrau 3) */

/* ---------- o que fica guardado (só no celular) ---------- */
let RG=null;
function rgNovo(){ return {v:1,col:{},feitos:{},atual:null,hoje:null,reg:{},dias:{},folgas:{},pistasFracas:[],coer:{},novIdx:0,curIdx:0,bau:0,desloc:0}; }
function rgCarrega(){ if(RG) return RG; try{ RG=JSON.parse(localStorage.getItem(CHAVE)||"null"); }catch(e){} if(!RG||RG.v!==1) RG=rgNovo();
  const n=rgNovo(); for(const k in n) if(RG[k]==null) RG[k]=n[k];
  if(RG.atual && !RG.atual.hist) RG.atual={num:RG.atual.num,rodadas:0,cert:0,dims:{},hist:[],shown:[],escritos:[]}; /* veio do Bloco 1 */
  return RG; }
function rgSalva(){ try{ localStorage.setItem(CHAVE,JSON.stringify(RG)); }catch(e){} }
/* o "hoje" do app: no modo teste, anda com o botão "Avançar um dia" */
function rgHoje(){ const d=new Date(); d.setDate(d.getDate()+((RG&&RG.desloc)||0)); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
const diaNum = s => { const [a,m,d]=s.split("-").map(Number); return Date.UTC(a,m-1,d)/864e5; };
const diaStr = k => { const d=new Date(k*864e5); return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0"); };
function rgDia(){ return RG.primeiroDia ? diaNum(rgHoje())-diaNum(RG.primeiroDia)+1 : 1; }
function rgHojeN(){ const h=rgHoje(); return RG.hoje&&RG.hoje.d===h ? RG.hoje.n : 0; }
function rgContaRodada(){ const h=rgHoje(); if(!RG.hoje||RG.hoje.d!==h) RG.hoje={d:h,n:0}; RG.hoje.n++; RG.dias[h]=true; delete RG.folgas[h]; }
const rgFeitos = () => ORDEM.filter(n=>RG.feitos[n]!=null);
const rgColFeito = () => COLOQUE.every(c=>RG.col[c.sid]!=null);
/* um bloco abre quando todos os números dos blocos anteriores estão fechados (no modo teste, tudo aberto) */
function rgBlocoAberto(){ for(let b=0;b<BLOCOS.length;b++){ if(BLOCOS[b].some(n=>RG.feitos[n]==null)) return b; } return BLOCOS.length; }
function rgAbertos(){ return TESTE ? ORDEM.slice() : (BLOCOS[rgBlocoAberto()]||[]); }
const corSent = sid => (SENT.find(s=>s.id===sid)||{}).cor || "#f5c542";
const cap = t => t ? t.charAt(0).toUpperCase()+t.slice(1) : t;
const minus = t => t ? t.charAt(0).toLowerCase()+t.slice(1) : t;

/* =================== ESTILOS =================== */
const css=document.createElement("style"); css.textContent=`
.rg-brisa{display:flex;gap:14px;align-items:flex-start;text-align:left;background:rgba(17,27,61,.78);border:1px solid rgba(245,197,66,.35);border-radius:22px;padding:16px;margin:4px 0 18px}
.rg-brisa img{width:84px;height:84px;border-radius:50%;object-fit:cover;flex:none;border:2px solid var(--ouro)}
.rg-brisa p{margin:0;font-size:19px;line-height:1.5}
.rg-brisa b{display:block;color:var(--ouro);font:400 14px "Space Mono",monospace;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
.rg-vslot{display:none}
.rg-tag{display:inline-block;font:700 13px "Space Mono",monospace;color:#0a1128;background:#7fd3ff;border-radius:8px;padding:3px 8px;margin:0 0 10px}
.rg-mand{position:relative;width:min(230px,58vw);aspect-ratio:1;margin:6px auto 4px}
.rg-mand>img{position:absolute;inset:16%;width:68%;height:68%;object-fit:contain;filter:drop-shadow(0 10px 30px rgba(245,197,66,.25))}
.rg-mand i{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:rgba(169,179,209,.18);border:1.5px solid rgba(169,179,209,.35);transition:background .6s,box-shadow .6s,transform .6s}
.rg-mand i.on{background:var(--ouro);border-color:var(--ouro);box-shadow:0 0 14px var(--ouro)}
.rg-mand i.fase{background:#fff3c4;border-color:#fff3c4;box-shadow:0 0 12px #fff3c4}
.rg-mand i.nova{animation:rgAcende 1.2s ease-out}
@keyframes rgAcende{0%{transform:scale(.4)}60%{transform:scale(1.9)}100%{transform:scale(1)}}
.rg-estrela{display:block;margin:2px auto 6px;filter:drop-shadow(0 0 12px rgba(245,197,66,.7));transition:width .8s,height .8s}
.rg-estrela.cresce{animation:rgCresce 1.1s ease-out}
@keyframes rgCresce{0%{transform:scale(.7) rotate(-20deg)}55%{transform:scale(1.35) rotate(8deg)}100%{transform:none}}
.rg-barra{max-width:320px;margin:4px auto 4px;height:12px;border-radius:99px;background:rgba(169,179,209,.18);overflow:hidden}
.rg-barra i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#fff3c4,var(--ouro));transition:width 1s}
.rg-legmand{font-size:16px;color:var(--azul);margin:4px 0 16px}
.rg-nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:12px;margin:12px 0 6px}
.rg-num{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 8px;border-radius:20px;background:rgba(32,48,100,.55);border:1.5px solid rgba(245,197,66,.55);box-shadow:0 6px 0 rgba(0,0,0,.35)}
.rg-num b{font:800 36px/1 Fraunces,Georgia,serif;color:var(--ouro)}
.rg-num span{font-size:16px;font-weight:700;text-align:center}
.rg-num.ok{border-color:rgba(127,211,255,.5);opacity:.75;cursor:default;box-shadow:none}
.rg-num.ok b{color:#7fd3ff}
.rg-num.anda{border-color:#fff3c4;box-shadow:0 0 0 2px rgba(255,243,196,.35),0 6px 0 rgba(0,0,0,.35)}
.rg-num.tranca{opacity:.35;cursor:default;border-style:dashed;box-shadow:none}
.rg-num:active:not(.ok):not(.tranca){transform:translateY(3px)}
.rg-bloco{font:400 14px "Space Mono",monospace;color:var(--azul);letter-spacing:.06em;text-transform:uppercase;margin:18px 0 0}
.rg-tit{font:800 clamp(44px,13vw,64px)/1 Fraunces,Georgia,serif;color:var(--ouro);margin:6px 0 2px}
.rg-tit small{display:block;font:700 22px Inter,system-ui,sans-serif;color:var(--creme);margin-top:8px}
.rg-tit.pq{font-size:40px}.rg-tit.pq small{font-size:18px;margin-top:4px}
.rg-sit{font-size:clamp(24px,6.4vw,30px);font-weight:800;line-height:1.25;margin:10px 0 18px}
.rg-q{font-size:clamp(22px,5.6vw,27px);font-weight:800;line-height:1.3;margin:12px 0 14px}
.rg-q b{color:var(--ouro)}.rg-q b.menos{color:#7fd3ff}
.rg-esc{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:8px 0 14px}
.rg-esc button{all:unset;cursor:pointer;display:grid;place-items:center;width:calc((100% - 52px)/6);aspect-ratio:1;border-radius:16px;font:800 22px Inter,system-ui,sans-serif;background:rgba(32,48,100,.55);border:1.5px solid color-mix(in srgb,var(--k) 55%,transparent);box-shadow:0 5px 0 rgba(0,0,0,.35)}
.rg-esc button.sel{background:var(--k);color:#0b1020;box-shadow:0 0 22px var(--k)}
.rg-pontos{display:flex;gap:6px;justify-content:center;margin:0 0 14px}
.rg-pontos i{width:10px;height:10px;border-radius:50%;background:rgba(169,179,209,.25)}
.rg-pontos i.on{background:var(--k,#f5c542)}
.rg-ops{display:grid;gap:10px;margin:6px 0 16px;text-align:left}
@media(min-width:720px){.rg-ops{grid-template-columns:1fr 1fr}.rg-ops.duelo{grid-template-columns:1fr 1fr}}
.rg-ops.duelo{grid-template-columns:1fr 1fr}
.rg-op{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:flex;align-items:center;gap:12px;min-height:64px;padding:14px 16px 14px 20px;border-radius:18px;background:rgba(32,48,100,.6);border:1.5px solid rgba(169,179,209,.3);font-size:19px;font-weight:700;line-height:1.3;box-shadow:0 5px 0 rgba(0,0,0,.35)}
.rg-op::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:6px;border-radius:0 6px 6px 0;background:var(--c,#f5c542)}
.rg-ops.duelo .rg-op{min-height:150px;justify-content:center;text-align:center;font-size:21px;padding:18px}
.rg-op em{font-style:normal;font:700 11px "Space Mono",monospace;color:#0a1128;background:#fff3c4;border-radius:6px;padding:2px 6px;margin-left:auto;flex:none}
.rg-op.mais{border-color:var(--ouro);background:rgba(245,197,66,.2);box-shadow:0 0 18px rgba(245,197,66,.35)}
.rg-op.menos{border-color:#7fd3ff;background:rgba(127,211,255,.14)}
.rg-op.sel{border-color:var(--ouro);background:rgba(245,197,66,.2)}
.rg-op .selo{position:absolute;top:-10px;right:12px;font:800 12px "Space Mono",monospace;padding:2px 8px;border-radius:8px;background:var(--ouro);color:#15110a}
.rg-op.menos .selo{background:#7fd3ff}
.rg-op:active{transform:translateY(3px)}
.rg-tres{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:4px 0 8px}
.rg-tres button{all:unset;cursor:pointer;padding:11px 16px;border-radius:999px;border:1.5px solid rgba(169,179,209,.45);font-size:16px;font-weight:700;color:var(--creme);background:rgba(255,255,255,.04)}
.rg-tres button:active{transform:translateY(2px)}
.rg-deg{display:inline-block;font:700 12px "Space Mono",monospace;color:var(--azul);border:1px dashed rgba(169,179,209,.5);border-radius:8px;padding:3px 8px;margin:4px 0 0}
.rg-volta{all:unset;cursor:pointer;color:var(--azul);font-size:16px;text-decoration:underline;text-underline-offset:3px;margin-top:10px;display:inline-block}
.rg-palavras{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:12px 0 16px}
.rg-palavras button{all:unset;cursor:pointer;padding:12px 18px;border-radius:999px;font-size:19px;font-weight:700;background:rgba(32,48,100,.6);border:1.5px solid var(--k)}
.rg-palavras button.sel{background:var(--k);color:#0b1020}
#rgmodal{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:18px;background:rgba(3,6,18,.72);backdrop-filter:blur(4px)}
#rgmodal .cx{width:min(460px,100%);max-height:90vh;overflow:auto;background:#111b3d;border:1px solid rgba(245,197,66,.45);border-radius:24px;padding:22px 20px;text-align:center;box-shadow:0 30px 70px rgba(0,0,0,.6)}
#rgmodal h3{font-size:22px;margin:0 0 10px;line-height:1.3}
#rgmodal p{font-size:17px;line-height:1.5;margin:0 0 14px;color:var(--creme)}
#rgmodal .col{display:flex;flex-direction:column;gap:10px}
#rgmodal textarea{box-sizing:border-box;width:100%;min-height:110px;padding:14px;border-radius:16px;border:1.5px solid rgba(169,179,209,.35);background:rgba(5,9,26,.6);color:var(--creme);font:400 18px Inter,system-ui,sans-serif;resize:vertical}
#rgmodal .mic{all:unset;cursor:pointer;padding:10px 16px;border-radius:999px;border:1.5px solid rgba(245,197,66,.6);color:var(--ouro);font-weight:800;margin:8px 0 12px;display:inline-block}
#rgmodal .mic.on{background:var(--ouro);color:#15110a}
.rg-fogo{position:absolute;top:0;right:0;display:flex;align-items:center;gap:4px;padding:6px 10px;border-radius:999px;background:rgba(17,27,61,.8);border:1px solid rgba(255,138,61,.5);font:800 15px Inter,system-ui,sans-serif;color:#ffb27a;cursor:pointer}
.rg-fogo.pq{opacity:.85}
.rg-entrada{position:relative;padding-top:4px}
.rg-nota{font-size:15px;color:var(--azul);margin:-4px 0 12px}
.rg-folga{all:unset;cursor:pointer;font-size:14px;color:#ffb27a;text-decoration:underline;text-underline-offset:3px}
.rg-bau{all:unset;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;gap:6px;margin:14px auto 6px;padding:14px 22px;border-radius:22px;border:1.5px dashed rgba(245,197,66,.7);background:rgba(245,197,66,.08);font-weight:800;font-size:18px;color:var(--ouro)}
.rg-bau span{font-size:46px;line-height:1}
.rg-bau.abre span{animation:rgBau .8s ease-out}
@keyframes rgBau{0%{transform:scale(1)}40%{transform:scale(1.3) rotate(-8deg)}70%{transform:scale(.95) rotate(5deg)}100%{transform:none}}
.rg-curio{max-width:440px;margin:10px auto 6px;padding:16px 18px;border-radius:20px;background:rgba(17,27,61,.85);border:1px solid rgba(245,197,66,.5);font-size:18px;line-height:1.5}
.rg-curio b{display:block;color:var(--ouro);font:700 13px "Space Mono",monospace;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.rg-aviso{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:70;max-width:min(420px,90vw);padding:12px 18px;border-radius:16px;background:#111b3d;border:1px solid rgba(245,197,66,.55);font-size:16px;text-align:center;box-shadow:0 14px 40px rgba(0,0,0,.6);animation:guiaSobe .4s ease-out}
.rg-previa{margin-top:22px;padding-top:14px;border-top:1px dashed rgba(169,179,209,.35);display:flex;flex-direction:column;gap:6px;align-items:center}
.rg-previa .linkflow::before{content:"⚙"}
/* modo teste */
#rgteste{position:fixed;right:10px;top:calc(8px + env(safe-area-inset-top));z-index:55;font:700 12px "Space Mono",monospace;color:#0a1128;background:#7fd3ff;border-radius:8px;padding:3px 8px;pointer-events:none;opacity:.92}
#rgbarra{position:fixed;left:50%;transform:translateX(-50%);flex-wrap:wrap;justify-content:center;width:max-content;max-width:94vw;bottom:calc(10px + env(safe-area-inset-bottom));z-index:55;display:flex;gap:8px}
#rgbarra button{all:unset;cursor:pointer;white-space:nowrap;padding:9px 14px;border-radius:999px;background:#0b2a3d;border:1.5px solid #7fd3ff;color:#7fd3ff;font:700 14px Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5)}
body.rgteste main#palco{padding-bottom:70px}
`; document.head.appendChild(css);

/* ---------- peças pequenas ---------- */
function rgAviso(t,ms){ const d=document.createElement("div"); d.className="rg-aviso"; d.textContent=t; document.body.appendChild(d); setTimeout(()=>d.remove(),ms||2600); }
function rgModal(html){ rgFechaModal(); const d=document.createElement("div"); d.id="rgmodal"; d.innerHTML=`<div class="cx">${html}</div>`; d.onclick=e=>{ if(e.target===d) rgFechaModal(); }; document.body.appendChild(d); return d; }
function rgFechaModal(){ const d=document.getElementById("rgmodal"); if(d) d.remove(); if(window._rgRec){ try{ window._rgRec.stop(); }catch(e){} window._rgRec=null; } }
window.rgFechaModal = rgFechaModal;

/* ---------- topo e mandala ---------- */
function rgTopo(txt){
  const el=document.getElementById("const"); el.hidden=false;
  if(!document.getElementById("mtopo")) el.innerHTML=mandala(72,"mtopo")+`<span class="xde7" id="xde7"></span>`;
  const m=document.getElementById("mtopo"); requestAnimationFrame(()=>poeMandala(m,{pos:TODOS,luz:TODOS,miolo:true}));
  document.getElementById("xde7").innerHTML=`<b class="pal"><em>7</em>entidos</b><small>Fase 3</small>${esc(txt||"sua régua")}`;
  ["voltar","pularbtn","fundobtn"].forEach(id=>{ const b=document.getElementById(id); if(b) b.hidden=true; }); document.body.classList.add("emf3");
  foco(null); brilho(null); fundoCor(null); pararSom(); rgTesteBarra();
}
/* 13 luzes em volta da mandala: as 2 primeiras já acesas (Fases 1 e 2), depois 1 por número fechado */
function rgMandala(nova){ const feitos=rgFeitos().length, N=13; let h=`<div class="rg-mand" aria-label="Sua régua: ${feitos} de 11 números"><img src="${MANDALA}" alt="">`;
  for(let k=0;k<N;k++){ const a=-Math.PI/2+k*2*Math.PI/N, x=50+Math.cos(a)*46, y=50+Math.sin(a)*46;
    const cls=k<2?"fase":(k-2<feitos?"on"+(nova&&k-2===feitos-1?" nova":""):""); h+=`<i class="${cls}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%"></i>`; }
  return h+`</div>`; }
/* barra: já começa andando (2 de 13), anda 1 por número fechado (não conta perguntas) */
function rgBarra(){ const p=(2+rgFeitos().length)/13*100; return `<div class="rg-barra" aria-label="Progresso da Fase 3"><i style="width:${p.toFixed(1)}%"></i></div>`; }
/* estrelinha: 11 tamanhos, um a cada número fechado */
function rgEstrela(cresce){ const t=34+rgFeitos().length*7;
  return `<svg class="rg-estrela${cresce?" cresce":""}" width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.6l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 8.8l7.1-.6z" fill="#f5c542"/></svg>`; }
/* na prévia sem modo teste continuam os atalhos do Bloco 1; no modo teste, a barra de baixo substitui */
function rgPreviaBotoes(){ if(!PREVIA||TESTE) return "";
  return `<div class="rg-previa"><small class="sub" style="margin:0;font-size:14px">Só na prévia</small>
    <button class="linkflow" type="button" onclick="rgPulaEspera()">Pular a espera (novo dia)</button>
    <button class="linkflow" type="button" onclick="rgRefazColoque()">Ver o "Coloque na régua" de novo</button>
    <button class="linkflow" type="button" onclick="rgZera()">Recomeçar a Fase 3 do zero</button></div>`; }

/* =================== BLOCO A · peças do modo teste =================== */
function rgExemploF1(){ if(!TESTE) return; if(SENT.some(s=>resp["gosto_"+s.id])) return;
  SENT.forEach(s=>{ resp["gosto_"+s.id]=EXEMPLO_F1[s.id]; resp["curtiu_"+s.id]=EXEMPLO_F2[s.id]; }); resp.local_luz0=true; }
function rgTesteBarra(){ if(!TESTE) return; document.body.classList.add("rgteste");
  let t=document.getElementById("rgteste"); if(!t){ t=document.createElement("div"); t.id="rgteste"; document.body.appendChild(t); }
  t.textContent="Modo teste · dia "+rgDia();
  if(!document.getElementById("rgbarra")){ const b=document.createElement("div"); b.id="rgbarra";
    b.innerHTML=`<button type="button" onclick="rgAvancaDia()">Avançar um dia ☀</button><button type="button" onclick="rgRecomecaTeste()">Recomeçar a Fase 3</button><button type="button" onclick="rgCompletaTeste()">Ver a régua completa ✓</button>`; document.body.appendChild(b); }
  const vb=document.querySelector(".vbtn"); if(vb) vb.style.display="none"; }
window.rgAvancaDia = function(){ click(); rgCarrega(); rgFechaModal(); if(!RG.primeiroDia) RG.primeiroDia=rgHoje(); RG.desloc=(RG.desloc||0)+1; rgSalva(); rgAviso("Passou um dia. Agora é o dia "+rgDia()+" da Fase 3."); rgTela(); };
/* 27/11: pula direto para o fim (régua inteira preenchida), para ver o que vem depois */
window.rgCompletaTeste = function(){ click&&click(); rgFechaModal(); rgCarrega(); RG.intro=true; if(!RG.primeiroDia) RG.primeiroDia=rgHoje();
  COLOQUE.forEach((c,i)=>{ if(RG.col[c.sid]==null) RG.col[c.sid]=[9,2,10,8,4,1,7][i%7]; }); RG.colFeito=RG.colFeito||rgHoje();
  ORDEM.forEach(n=>{ if(RG.feitos[n]==null) RG.feitos[n]=rgHoje(); }); RG.atual=null; rgSalva(); entrou=true; pos=R.length-1; rgTela(); };
window.rgRecomecaTeste = function(){ click(); rgFechaModal(); try{ localStorage.removeItem(CHAVE); }catch(e){} RG=null; rgCarrega(); rgSalva(); rgExemploF1(); entrou=true; pos=R.length-1; window.trava3(); };

/* =================== BLOCO E · ABERTURA (fim da Fase 2) =================== */
const trava3Antiga = trava3;
window.trava3 = function(p){
  if(!F3_ABERTA) return trava3Antiga(p);   /* público: continua a porta trancada */
  rgCarrega(); rgExemploF1(); if(TESTE) rgTesteBarra();
  const msab=montaSabor()||saborExemplo();
  /* LUGAR DO VÍDEO 3: quando o vídeo novo chegar, VIDEO3_NOVO = true troca o texto pelo vídeo com legenda */
  const brisaTopo = VIDEO3_NOVO ? videoBrisa(VID3_REGUA,LEG3_NOVA)
    : `<div class="rg-brisa"><img src="${NO_SITE?"/app/":""}brisa-fase3.jpg" alt="Brisa"><p><b>Brisa</b>${esc(FALA3)}</p></div>`;
  mostra(`<div class="rot">Fase 3 · A sua régua</div>${brisaTopo}
    ${PREVIA&&!VIDEO3_NOVO?`<span class="rg-tag">vídeo novo da Brisa em gravação · por enquanto, o texto</span>`:""}
    <div><button class="btn" type="button" onclick="click();rgComeca()">Vamos começar</button></div>
    <div class="sabbaixa" style="margin-top:22px"><img id="sabprev" alt="${msab.exemplo?"Imagem de exemplo":"A imagem do seu momento"}" hidden><button class="btn sec" id="baixar" type="button" disabled>⬇ Baixar ${msab.exemplo?"a imagem":"minha imagem"}</button></div>
    ${TESTE?"":`<button class="btn sec" style="margin-top:14px" onclick="recomecar()">Fazer de novo</button>`}`,
    c=>{ if(VIDEO3_NOVO) ligaVideo(c,LEG3_NOVA,()=>{},VID3_REGUA); ligaBaixar(c,msab); });
};
window.rgComeca = function(){ rgCarrega(); RG.intro=true; if(!RG.primeiroDia) RG.primeiroDia=rgHoje(); rgSalva(); f3Abre(); };

/* a entrada da Fase 3 (também usada pelo "Continuar" de quem volta) */
window.f3Abre = function(){
  if(!F3_ABERTA){ try{ localStorage.removeItem("7e_fase3_ativa"); }catch(e){} entrou=true; pos=R.length-1; desenha(); return; }
  rgCarrega(); rgExemploF1(); entrou=true; pos=R.length-1; try{ localStorage.setItem("7e_fase3_ativa","1"); }catch(e){}
  if(!RG.intro){ desenha(); return; }      /* ainda não viu a abertura: mostra a abertura */
  rgTela();
};
window.f3DaBrisa = window.rgComeca;

/* ---------- o "cérebro" das telas ---------- */
window.rgTela = rgTela;
function rgTela(nova){
  rgCarrega(); rgFechaModal();
  if(!rgColFeito()) return rgColoque();                        /* antes do 10, no primeiro dia */
  if(rgFeitos().length===ORDEM.length) return rgFimFase();
  const limite = !TESTE && rgHojeN()>=LIMITE_DIA;
  if(!limite && rgPrecisaCoerencia() && !(RG.atual&&RG.atual.fim)) return rgCoerencia();
  /* no começo de cada dia, a pessoa passa pela entrada (foguinho, número do dia); o número em andamento fica marcado */
  const novoDia = RG.entrada!==rgHoje();
  if(RG.atual){ if(RG.atual.fim) return rgFimEtapa(); if(limite) return rgFimDia(nova); if(novoDia) return rgEscolhe(nova); return rgRodada(); }
  if(limite) return rgFimDia(nova);
  return rgEscolhe(nova);
}

/* =================== BLOCO C · COLOQUE NA RÉGUA =================== */
function rgColoque(){
  const i=COLOQUE.findIndex(c=>RG.col[c.sid]==null); const c=COLOQUE[i], k=corSent(c.sid), s=SENT.find(x=>x.id===c.sid);
  rgTopo("coloque na régua"); fundoCor(k); brilho(k);
  mostra(`<div class="rot">Coloque na régua · ${esc(s.s)}</div>
    ${i===0?`<p class="sub" style="margin-bottom:6px">Antes do seu 10: de 0 a 10, onde fica cada situação na sua régua?</p>`:""}
    <div class="rg-pontos" style="--k:${k}">${COLOQUE.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("")}</div>
    <h2 class="rg-sit">${esc(c.txt)}</h2>
    <div class="rg-esc" style="--k:${k}">${[0,1,2,3,4,5,6,7,8,9,10].map(n=>`<button type="button" onclick="rgColNota(this,'${c.sid}',${n})" aria-label="${n}">${n}</button>`).join("")}</div>
    ${i>0?`<div><button class="btn sec" type="button" style="min-height:48px;font-size:17px" onclick="rgColVolta()">← voltar uma</button></div>`:""}
    ${rgPreviaBotoes()}`);
}
window.rgColNota = function(b,sid,n){ if(ocupado) return; ocupado=true; click(); vibra(8+n);
  b.parentNode.querySelectorAll("button").forEach(x=>x.classList.remove("sel")); b.classList.add("sel");
  RG.col[sid]=n; if(rgColFeito()) RG.colFeito=rgHoje(); rgSalva();
  setTimeout(()=>{ ocupado=false; if(rgColFeito()){ fundoCor(null); brilho(null); rgEscolhe(false,true); } else rgColoque(); },420); };
window.rgColVolta = function(){ click(); const i=COLOQUE.findIndex(c=>RG.col[c.sid]==null); if(i>0){ delete RG.col[COLOQUE[i-1].sid]; rgSalva(); } rgColoque(); };

/* =================== BLOCO D · FOGUINHO =================== */
/* Nunca zera: cada dia sem responder volta 1 (no mínimo fica 1). 1 dia de folga por semana:
   a pessoa pode tirar a folga no dia, ou a folga cobre sozinha o primeiro dia sem resposta da semana. */
function rgFogo(){
  const r={fogo:0,livre:false,hojeFolga:false,ontemFolga:false}; if(!RG.primeiroDia) return r;
  const ini=diaNum(RG.primeiroDia), hoje=diaNum(rgHoje()), usou={};
  Object.keys(RG.folgas).forEach(d=>{ usou[Math.floor((diaNum(d)-ini)/7)]=true; });
  let f=0; const auto={};
  for(let k=ini;k<=hoje;k++){ const d=diaStr(k), w=Math.floor((k-ini)/7);
    if(RG.dias[d]) f++;
    else if(RG.folgas[d]) {}
    else if(k<hoje){ if(!usou[w]){ usou[w]=true; auto[d]=true; } else if(f>1) f--; } }
  r.fogo=f; r.livre=!usou[Math.floor((hoje-ini)/7)]; r.hojeFolga=!!RG.folgas[diaStr(hoje)];
  const ontem=diaStr(hoje-1); r.ontemFolga=!!(auto[ontem]||RG.folgas[ontem]); return r; }
function rgFogoHTML(){ const g=rgFogo(); if(!g.fogo&&!g.hojeFolga) return "";
  return `<button type="button" class="rg-fogo" onclick="rgFogoInfo()" aria-label="${g.fogo} foguinhos">🔥 ${g.fogo}</button>`; }
window.rgFogoInfo = function(){ click(); const g=rgFogo();
  rgModal(`<h3>🔥 Seu foguinho: ${g.fogo}</h3><p>Ele cresce a cada dia em que você responde. Se você pular um dia, ele volta só 1, e nunca apaga. Toda semana você tem 1 dia de folga.</p>
    ${g.hojeFolga?`<p><b>${FOLGA_TXT}</b></p>`:g.livre&&!RG.dias[rgHoje()]?`<div class="col"><button class="btn sec" type="button" onclick="rgTiraFolga()">Tirar folga hoje</button></div>`:""}
    <div class="col" style="margin-top:10px"><button class="btn" type="button" onclick="rgFechaModal()">Fechar</button></div>`); };
window.rgTiraFolga = function(){ click(); RG.folgas[rgHoje()]=true; rgSalva(); rgFechaModal(); rgAviso(FOLGA_TXT,3600); rgEscolhe(); };

/* =================== BLOCO E · ESCOLHER O NÚMERO DO DIA =================== */
function rgEscolhe(nova,depoisColoque){
  rgTopo(); RG.entrada=rgHoje(); rgSalva(); const abertos=rgAbertos(), b=rgBlocoAberto(), g=rgFogo();
  const botao=n=>{ const ok=RG.feitos[n]!=null, tr=!abertos.includes(n)&&!ok, anda=RG.atual&&RG.atual.num===n;
    return `<button class="rg-num${ok?" ok":""}${tr?" tranca":""}${anda?" anda":""}" type="button" ${ok||tr?"disabled":`onclick="rgVai(${n})"`} aria-label="${n} ${NOMES[n]}${ok?", pronto":tr?", ainda fechado":""}"><b>${n}</b><span>${ok?"✓ ":tr?"🔒 ":""}${NOMES[n]}${n===0&&!ok?" · opcional":""}</span></button>`; };
  const mostrar = TESTE ? ORDEM : abertos;
  const pendentes=abertos.filter(n=>RG.feitos[n]==null);
  let nota="";
  if(g.hojeFolga) nota=FOLGA_TXT; else if(g.ontemFolga&&!RG.dias[rgHoje()]) nota="Ontem foi seu dia de folga. Seu foguinho ficou guardado.";
  mostra(`<div class="rg-entrada">${rgFogoHTML()}<div class="rot">Fase 3 · A sua régua</div>
    ${rgMandala(nova)}${rgEstrela(nova)}${rgBarra()}
    <p class="rg-legmand">${rgFeitos().length?`Cada luz é um número da sua régua: ${rgFeitos().length} de 11.`:"Você já fez as Fases 1 e 2: duas luzes já estão acesas."}</p>
    ${nota?`<p class="rg-nota">${esc(nota)}</p>`:""}
    <h2>${depoisColoque?"Pronto! Agora, o seu 10.":pendentes.length>1?"Hoje quero fazer o meu…":"O número de hoje"}</h2>
    <div class="rg-nums">${mostrar.map(botao).join("")}</div>
    ${!TESTE&&b<BLOCOS.length-1?`<p class="rg-bloco">Depois: ${BLOCOS.slice(b+1).map(x=>x.join(" · ")).join("  →  ")}</p>`:""}
    ${rgPreviaBotoes()}</div>`);
}
window.rgVai = function(n){ if(ocupado) return; click(); vibra(12);
  if(!RG.atual||RG.atual.num!==n) RG.atual={num:n,rodadas:0,cert:0,dims:{},hist:[],shown:[],escritos:[],pulos:0};
  rgSalva(); rgTela(); };
window.rgVoltaRegua = function(){ click(); rgEscolhe(); };

/* =================== BLOCO B · MONTAR CADA RODADA =================== */
/* as escolhas das Fases 1 e 2, em ordem: primeiro o que a pessoa escolheu (do jogo que mais curtiu para o que menos curtiu),
   depois as fotos que ela viu e não escolheu. Para os números de baixo, as não escolhidas vêm primeiro. */
function rgDasFases(n){
  const g=(typeof f3Gostos==="function"?f3Gostos():SENT.map(s=>resp["gosto_"+s.id]||null));
  const esc1=SENT.map((s,i)=>({t:g[i],s:s.id,o:"f1",p:+(resp["curtiu_"+s.id]||0)})).filter(x=>x.t).sort((a,b)=>b.p-a.p);
  const nao=SENT.flatMap((s,i)=>s.o.filter(o=>o!==g[i]).map(o=>({t:o,s:s.id,o:"nao",p:0})));
  /* o que já virou o centro de outro número vai para o fim (para a régua não repetir) */
  const usados=Object.values(RG.reg).map(r=>r&&r.base).filter(Boolean);
  const ord=x=>usados.includes(x.t)?1:0;
  let lista = n>=6 ? esc1.concat(nao) : nao.concat(esc1.slice().reverse());
  if(n>=6&&n<=8) lista = esc1.slice(Math.max(0,9-n)).concat(esc1.slice(0,Math.max(0,9-n)),nao); /* 9 e 8 e 7 e 6 começam por outras escolhas */
  return lista.sort((a,b)=>ord(a)-ord(b));
}
function rgNovidade(A){ const usadas=(A&&A.shown)||[];
  for(let k=0;k<NOVIDADES.length;k++){ const [t,s]=NOVIDADES[(RG.novIdx+k)%NOVIDADES.length]; if(!usadas.includes(t)){ RG.novIdx=(RG.novIdx+k+1)%NOVIDADES.length; return {t,s,o:"nov"}; } }
  const [t,s]=NOVIDADES[RG.novIdx]; RG.novIdx=(RG.novIdx+1)%NOVIDADES.length; return {t,s,o:"nov"}; }
function rgBase(A,qtd){ let l=rgDasFases(A.num).filter(x=>!A.shown.includes(x.t)); if(l.length<qtd){ A.shown=A.shown.filter(t=>NOVIDADES.some(nv=>nv[0]===t)); l=rgDasFases(A.num); } return l.slice(0,qtd); }
const conhecido = A => DIM_ORDEM.filter(d=>A.dims[d]!=null).map(d=>DIMS[d].s[A.dims[d]]);
const textoFoco = (A,extra) => [cap(A.foco.t)].concat(conhecido(A),extra?[extra]:[]).join(", ");
function rgProximaDim(A){ const pul=A.dimsPuladas||[];
  if(A.pref&&A.dims[A.pref]==null&&!pul.includes(A.pref)) return A.pref;
  return DIM_ORDEM.find(d=>A.dims[d]==null&&!pul.includes(d)) || DIM_ORDEM.find(d=>A.dims[d]==null) || null; }

/* ---- PONTO DA IA (degrau 3 e "Escrever o meu") ----
   SERVIDOR_IA: quando o servidor intermediário (Claude Haiku) estiver pronto, troque o corpo desta função por uma chamada a ele,
   mandando {numero, nome do número, foco, o que já se sabe (dims), histórico das rodadas, textos escritos} e recebendo 4 opções curtas.
   Enquanto isso, a prévia usa respostas preparadas montadas com o que a pessoa já respondeu. */
const SERVIDOR_IA = "";   /* endereço do servidor (vazio = usar as respostas preparadas) */
function rgPerguntaIA(A){
  const d=rgProximaDim(A);
  if(!d) return null;
  return {dim:d, itens:DIMS[d].s.map(sf=>({t:textoFoco(A,sf),s:A.foco.s,o:"ia",dim:d,sf}))};
}

function rgMontaRodada(A){
  const n=A.num, max=MAX_RODADAS(n);
  if(n===0) return {tipo:"leve", itens:rgBase(A,4).concat(rgNovidade(A))};
  if(!A.foco) return {tipo:"mm", itens:rgBase(A,4).concat(rgNovidade(A))};
  if(A.duelo) return {tipo:"duelo", itens:A.duelo};
  if(A.cert>=CERTEZA(n) || A.rodadas>=max-1){ const ia=rgPerguntaIA(A); if(ia) return {tipo:"ia", ia:n>2, dim:ia.dim, itens:ia.itens.concat(rgNovidade(A))}; }
  const d=rgProximaDim(A); if(!d) return null;
  return {tipo:"fundo", dim:d, itens:DIMS[d].s.map(sf=>({t:textoFoco(A,sf),s:A.foco.s,o:"var",dim:d,sf})).concat(rgNovidade(A))};
}
const PERGUNTA = (A,op,parte) => {
  const n=A.num;
  if(op.tipo==="mm") return parte==="menos" ? `E qual destas é <b class="menos">menos</b> o seu ${n}?` : `Destas, qual é <b>mais</b> o seu ${n}?`;
  if(op.tipo==="leve") return `Sem pressa: qual destas é o seu 0?`;
  if(op.tipo==="duelo") return `Isto ou aquilo: qual é mais o seu ${n}?`;
  if(op.tipo==="ia") return n===10 ? `Qual destas é o seu 10 perfeito?` : `Qual destas é bem o seu ${n}?`;
  return DIMS[op.dim].q(n);
};
const DEGRAU = op => op.tipo==="mm"?"degrau 1 · o mais e o menos":op.tipo==="leve"?"rodada leve do 0 · sem IA":op.tipo==="duelo"?"desempate · isto ou aquilo":op.tipo==="ia"?(op.ia?"último degrau · pergunta da IA (preparada; servidor ainda não ligado)":"último degrau · banco de perguntas (sem IA do 0 ao 2)"):"degrau 2 · banco de perguntas";

/* ---------- a tela da rodada ---------- */
function rgRodada(){
  const A=RG.atual, n=A.num;
  if(!A.op){ A.op=rgMontaRodada(A); if(!A.op){ rgEncerra(A); return rgTela(); } A.op.itens.forEach(x=>{ if(!A.shown.includes(x.t)) A.shown.push(x.t); }); A.sel={}; rgSalva(); }
  const op=A.op, sel=A.sel||{};
  rgTopo(n+" · "+NOMES[n]);
  const parte = op.tipo==="mm"&&sel.mais!=null ? "menos" : "mais";
  const card=(x,i)=>{ const c=sel.mais===i?" mais":sel.menos===i?" menos":sel.um===i?" sel":"";
    const selo=sel.mais===i?`<span class="selo">MAIS</span>`:sel.menos===i?`<span class="selo">MENOS</span>`:"";
    return `<button class="rg-op${c}" type="button" style="--c:${corSent(x.s)}" onclick="rgToca(${i})">${selo}<span>${esc(cap(x.t))}</span>${x.o==="nov"?`<em>novidade</em>`:""}</button>`; };
  mostra(`<div class="rg-tit pq">${n}<small>${NOMES[n]}</small></div>
    ${PREVIA?`<span class="rg-deg">${DEGRAU(op)} · rodada ${A.rodadas+1}</span>`:""}
    <h2 class="rg-q">${PERGUNTA(A,op,parte)}</h2>
    <div class="rg-ops${op.tipo==="duelo"?" duelo":""}">${op.itens.map(card).join("")}</div>
    <div class="rg-tres">
      <button type="button" onclick="rgNenhuma()">Nenhuma dessas</button>
      <button type="button" onclick="rgMaisOuMenos()">Mais ou menos</button>
      ${RG.texto===false?"":`<button type="button" onclick="rgEscrever('rodada')">✎ Escrever o meu</button>`}
    </div>
    ${n===0?`<button class="rg-volta" type="button" onclick="rgPula0()">Pular o 0 (é opcional)</button><br>`:""}
    <button class="rg-volta" type="button" onclick="rgVoltaRegua()">← voltar à régua</button>`);
}
/* tocar numa opção */
window.rgToca = function(i){ if(ocupado) return; const A=RG.atual, op=A.op, sel=A.sel||(A.sel={}); click(); vibra(10);
  if(op.tipo==="mm"){
    if(sel.mais===i){ delete sel.mais; delete sel.menos; rgSalva(); return rgRodada(); }
    if(sel.mais==null){ sel.mais=i; rgSalva(); return rgRodada(); }
    sel.menos=i; rgSalva(); ocupado=true; return setTimeout(()=>{ ocupado=false; rgResponde(); },450);
  }
  sel.um=i; rgSalva(); const bt=palco.querySelectorAll(".rg-op"); bt.forEach((b,k)=>b.classList.toggle("sel",k===i)); ocupado=true; setTimeout(()=>{ ocupado=false; rgResponde(); },450);
};
/* a resposta muda o caminho */
function rgResponde(){
  const A=RG.atual, op=A.op, sel=A.sel, n=A.num; rgContaRodada(); A.rodadas++;
  if(op.tipo==="mm"){ const m=op.itens[sel.mais], me=op.itens[sel.menos];
    A.hist.push({tipo:"mm",mais:m.t,menos:me.t}); A.menos=me.t; A.foco={t:m.t,s:m.s,o:m.o}; A.dims={};
    A.cert = m.o==="f1"?.4 : m.o==="nao"?.3 : .2;  /* confirmou o que já tinha escolhido: vai mais fundo com mais certeza */
  } else {
    const x=op.itens[sel.um]; A.hist.push({tipo:op.tipo,escolha:x.t});
    if(op.tipo==="leve"){ A.foco={t:x.t,s:x.s,o:x.o}; A.final=x.t; A.fim=true; }
    else if(op.tipo==="duelo"){ if(x.o==="nov"||x.o==="eu"){ A.foco=x; A.dims={}; A.cert=.35; } else A.cert+=.2; A.duelo=null; A.mudou=null; }
    else if(x.o==="nov"){ A.duelo=[{t:A.foco.t,s:A.foco.s,o:A.foco.o},x]; A.cert=.2; A.mudou=true; } /* escolheu outra coisa: o caminho muda (desempate) */
    else { A.dims[x.dim]=DIMS[x.dim].s.indexOf(x.sf); A.cert+=.3+(A.foco.o==="f1"?.1:0); if(A.pref===x.dim) A.pref=null;
      if(op.tipo==="ia"){ A.final=x.t; A.fim=true; } }
  }
  A.op=null; A.sel={}; A.dimsPuladas=[];
  if(!A.fim && A.rodadas>=MAX_RODADAS(n)) rgEncerra(A);
  rgSalva(); rgTela();
}
function rgEncerra(A){ A.duelo=null; A.final = A.foco ? textoFoco(A) : (A.escritos[0]||""); A.fim=true; }

/* "Nenhuma dessas": 5 opções novas ou escrever a própria resposta */
window.rgNenhuma = function(){ click();
  rgModal(`<h3>Nenhuma combina?</h3><p>Sem problema. O que você prefere?</p><div class="col">
    <button class="btn" type="button" onclick="rgNovas()">Me mostra 5 opções novas</button>
    ${RG.texto===false?"":`<button class="btn sec" type="button" onclick="rgFechaModal();rgEscrever('rodada')">Quero escrever a minha</button>`}
    <button class="rg-volta" type="button" onclick="rgFechaModal()">voltar</button></div>`); };
window.rgNovas = function(){ click(); rgFechaModal(); const A=RG.atual, op=A.op; A.pulos=(A.pulos||0)+1;
  A.hist.push({tipo:"nenhuma",viu:op.itens.map(x=>x.t)});
  if(op.dim){ (A.dimsPuladas=A.dimsPuladas||[]).push(op.dim); }
  if(op.tipo==="duelo"){ A.duelo=null; }
  A.op=null; rgSalva(); rgRodada(); };

/* "Mais ou menos": o que faltou para ser um N? */
window.rgMaisOuMenos = function(){ const A=RG.atual, op=A.op, sel=A.sel||{};
  const i = op.tipo==="mm" ? sel.mais : sel.um;
  if(i==null){ click(); rgAviso("Toque primeiro na opção que chegou perto."); return; }
  click(); const x=op.itens[i];
  rgModal(`<h3>O que faltou para ser um ${A.num}?</h3><p>“${esc(cap(x.t))}”</p><div class="col">
    ${FALTOU.map(([t],k)=>`<button class="btn sec" type="button" onclick="rgFaltou(${i},${k})">${t}</button>`).join("")}
    <button class="rg-volta" type="button" onclick="rgFechaModal()">voltar</button></div>`); };
window.rgFaltou = function(i,k){ click(); rgFechaModal(); const A=RG.atual, op=A.op, x=op.itens[i], [txt,dim]=FALTOU[k];
  rgContaRodada(); A.rodadas++; A.hist.push({tipo:"maisoumenos",item:x.t,faltou:txt});
  if(!A.foco || x.o==="nov" || op.tipo==="mm" || op.tipo==="leve" || op.tipo==="duelo"){ A.foco={t:x.dim?A.foco.t:x.t,s:x.s,o:x.o==="var"||x.o==="ia"?A.foco.o:x.o}; if(!x.dim) A.dims={}; A.cert=Math.max(A.cert,.25); }
  A.cert+=.1; A.pref=dim; A.duelo=null; A.op=null; A.sel={};
  if(A.num===0){ A.final=x.t; A.fim=true; }
  else if(A.rodadas>=MAX_RODADAS(A.num)) rgEncerra(A);
  rgSalva();
  if(dim===null && RG.texto!==false && !A.fim) return rgEscrever("faltou");
  rgTela(); };

/* "Escrever o meu": escrever ou falar. Antes da primeira vez, o aviso com "Aceito" e "Prefiro só escolher". */
window.rgEscrever = function(onde){ click(); if(RG.texto===true) return rgCaixaTexto(onde);
  rgModal(`<h3>Antes de escrever</h3><p>O que você escrever ou falar fica guardado só neste celular e ajuda o app a te conhecer melhor. Quando a inteligência do app estiver ligada, ela vai ler o seu texto para criar perguntas feitas só para você.</p>
    <div class="col"><button class="btn" type="button" onclick="rgTextoSim('${onde}')">Aceito</button><button class="btn sec" type="button" onclick="rgTextoNao()">Prefiro só escolher</button></div>`); };
window.rgTextoSim = function(onde){ click(); RG.texto=true; rgSalva(); rgCaixaTexto(onde); };
window.rgTextoNao = function(){ click(); RG.texto=false; rgSalva(); rgFechaModal(); rgAviso("Combinado: só escolher."); if(RG.atual&&!RG.atual.fim) rgRodada(); else rgTela(); };
function rgCaixaTexto(onde){
  const A=RG.atual, n=A?A.num:10, pode=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  const tit = onde==="momento" ? `Conte o seu momento real` : onde==="faltou" ? `O que faltou? Conte do seu jeito` : `Qual é o seu ${n}? Conte do seu jeito`;
  rgModal(`<h3>${tit}</h3>${pode?`<button class="mic" id="rgmic" type="button" onclick="rgFala()">🎤 Falar</button>`:`<p style="font-size:15px;color:var(--azul)">Para falar, use o microfone do teclado do celular.</p>`}
    <textarea id="rgtxt" maxlength="280" placeholder="Escreva aqui…"></textarea>
    <div class="col" style="margin-top:12px"><button class="btn" type="button" onclick="rgSalvaTexto('${onde}')">Pronto</button><button class="rg-volta" type="button" onclick="rgFechaModal()">voltar</button></div>`);
  setTimeout(()=>{ const t=document.getElementById("rgtxt"); if(t&&!pode) t.focus(); },60);
}
window.rgFala = function(){ const b=document.getElementById("rgmic"), t=document.getElementById("rgtxt"); if(!b||!t) return; click();
  if(window._rgRec){ try{ window._rgRec.stop(); }catch(e){} window._rgRec=null; b.classList.remove("on"); b.textContent="🎤 Falar"; return; }
  try{ const S=window.SpeechRecognition||window.webkitSpeechRecognition, r=new S(); r.lang="pt-BR"; r.interimResults=false; r.continuous=false;
    const antes=t.value; r.onresult=e=>{ const fala=Array.from(e.results).map(x=>x[0].transcript).join(" "); t.value=(antes?antes+" ":"")+fala; };
    r.onend=()=>{ window._rgRec=null; b.classList.remove("on"); b.textContent="🎤 Falar"; };
    r.onerror=()=>{ rgAviso("Não deu para ouvir. Pode escrever?"); };
    window._rgRec=r; r.start(); b.classList.add("on"); b.textContent="● Ouvindo… toque para parar"; }catch(e){ rgAviso("Não deu para ouvir. Pode escrever?"); } };
window.rgSalvaTexto = function(onde){ const t=document.getElementById("rgtxt"); const v=String(t&&t.value||"").replace(/\s+/g," ").trim().slice(0,280);
  if(!v){ rgAviso("Escreva ou fale alguma coisa, ou toque em voltar."); return; } click(); rgFechaModal(); const A=RG.atual;
  if(onde==="momento"){ A.momento={escrito:v}; A.momentoFeito=true; rgSalva(); return rgTela(); }
  rgContaRodada(); A.rodadas++; A.escritos.push(v); A.hist.push({tipo:"escrito",texto:v,onde});
  if(onde==="faltou"){ A.faltouTexto=v; }
  else { A.foco={t:v,s:null,o:"eu"}; A.dims={}; A.duelo=null; A.cert=Math.max(A.cert,CERTEZA(A.num)); } /* depois de escrever, a próxima é a da IA */
  A.op=null; A.sel={};
  if(A.num===0||A.num<=2&&A.rodadas>=MAX_RODADAS(A.num)){ A.final=v; A.fim=true; }
  else if(A.rodadas>=MAX_RODADAS(A.num)) rgEncerra(A);
  rgSalva(); rgTela(); };
window.rgPula0 = function(){ click(); const A=RG.atual; A.pulou=true; A.final=null; A.fim=true; A.palavraFeita=true; rgSalva(); rgFechaNumero(); };

/* =================== BLOCO C · FIM DE CADA NÚMERO =================== */
/* 6 a 10: "Um momento real" (opcional) → palavra do sentimento → fecha o número (estrelinha, mandala, baú) */
const MOMENTO_SUG = ["Foi numa viagem","Foi em casa, num dia comum","Foi com alguém especial","Foi faz pouco tempo","Foi quando eu era criança"];
function rgFimEtapa(){ const A=RG.atual, n=A.num;
  if(n>=6 && !A.momentoFeito) return rgMomento();
  if(!A.palavraFeita) return rgPalavra();
  rgFechaNumero(); }
function rgMomento(){ const A=RG.atual, n=A.num; rgTopo(n+" · "+NOMES[n]);
  mostra(`<div class="rg-tit pq">${n}<small>${NOMES[n]}</small></div>
    <p class="sub" style="margin:12px 0 4px">Seu ${n}: “${esc(A.final||"")}”</p>
    <h2 class="rg-q">Você lembra de um momento real assim?</h2><p class="sub" style="margin-top:-6px">É opcional.</p>
    <div class="rg-ops">${MOMENTO_SUG.map((t,i)=>`<button class="rg-op" type="button" onclick="rgMomentoSug(${i})"><span>${t}</span></button>`).join("")}</div>
    <div class="rg-tres">${RG.texto===false?"":`<button type="button" onclick="rgEscrever('momento')">✎ Escrever ou falar</button>`}<button type="button" onclick="rgMomentoPula()">Agora não</button></div>`); }
window.rgMomentoSug = function(i){ click(); vibra(10); const A=RG.atual; A.momento={sugestao:MOMENTO_SUG[i]}; A.momentoFeito=true; rgSalva(); rgTela(); };
window.rgMomentoPula = function(){ click(); const A=RG.atual; A.momentoFeito=true; rgSalva(); rgTela(); };
function rgPalavra(){ const A=RG.atual, n=A.num, k=corNum(n); rgTopo(n+" · "+NOMES[n]);
  mostra(`<div class="rg-tit pq">${n}<small>${NOMES[n]}</small></div>
    <h2 class="rg-q">Quando algo é o seu ${n}, você fica…</h2>
    <div class="rg-palavras" style="--k:${k}">${palavrasDe(n).map((w,i)=>`<button type="button" onclick="rgPalavraEsc(this,${i})">${w}</button>`).join("")}</div>
    <button class="rg-volta" type="button" onclick="rgPalavraEsc(null,-1)">Seguir sem escolher</button>`); }
window.rgPalavraEsc = function(b,i){ if(ocupado) return; click(); vibra(10); const A=RG.atual;
  if(b){ b.classList.add("sel"); A.palavra=palavrasDe(A.num)[i]; } A.palavraFeita=true; rgSalva(); ocupado=true; setTimeout(()=>{ ocupado=false; rgFechaNumero(); },b?420:0); };

function rgFechaNumero(){ const A=RG.atual, n=A.num;
  RG.feitos[n]=rgHoje();
  RG.reg[n]={base:A.foco?A.foco.t:null, final:A.final||null, dims:A.dims, menos:A.menos||null, palavra:A.palavra||null, momento:A.momento||null, escritos:A.escritos, hist:A.hist, rodadas:A.rodadas, pulou:!!A.pulou, quando:rgHoje()};
  RG.atual=null; rgSalva(); vibra([12,40,20]); somVitoria&&somVitoria();
  rgTopo();
  mostra(`<div class="rot">Mais um número na sua régua</div>
    ${rgMandala(true)}${rgEstrela(true)}${rgBarra()}
    <div class="rg-tit" style="font-size:44px;margin-top:8px">${n}<small>${NOMES[n]}</small></div>
    <h2 style="margin-top:14px">${rgFeitos().length===ORDEM.length?"Você completou a sua régua.":A.pulou?"Tudo bem pular o 0.":"Seu "+n+" está na régua."}</h2>
    <div id="rgbauarea"><button class="rg-bau" type="button" onclick="rgAbreBau(this)"><span>🎁</span>Abrir o baú surpresa</button></div>
    <div style="margin-top:12px"><button class="btn" type="button" onclick="click();rgTela()">Seguir</button></div>`); }

/* =================== BLOCO D · BAÚ SURPRESA =================== */
/* sorteio de verdade: 1 em cada 5 vem vazio */
function rgSorteio(){ try{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]/4294967296; }catch(e){ return Math.random(); } }
window.rgAbreBau = function(b){ if(b.dataset.aberto) return; b.dataset.aberto="1"; click(); vibra([10,30,10]); b.classList.add("abre");
  const vazio = rgSorteio() < 0.2; RG.bau=(RG.bau||0)+1;
  let html; if(vazio){ html=`<div class="rg-curio">${BAU_VAZIO}</div>`; }
  else { const t=CURIOSIDADES[RG.curIdx%CURIOSIDADES.length]; RG.curIdx++; html=`<div class="rg-curio"><b>Curiosidade</b>${esc(t)}</div>`; }
  (RG.bauHist=RG.bauHist||[]).push(vazio?"vazio":"cheio"); rgSalva();
  setTimeout(()=>{ const ar=document.getElementById("rgbauarea"); if(ar) ar.innerHTML=html; },650); };

/* =================== BLOCO C · TESTE DE COERÊNCIA (escondido) =================== */
/* no máximo 1 por dia, a partir do dia 3. Pergunta de novo um número já feito, como se fosse uma pergunta comum.
   Se a resposta mudar, vira uma "pista fraca", guardada para a Fase 4 (não aparece para a pessoa). */
function rgPrecisaCoerencia(){ if(rgDia()<3) return false; const h=rgHoje(); if(RG.coer[h]) return false;
  return Object.keys(RG.reg).some(n=>RG.reg[n]&&RG.reg[n].final&&!RG.reg[n].pulou&&!(RG.reg[n].reteste)); }
function rgCoerencia(){
  const cands=Object.keys(RG.reg).filter(n=>RG.reg[n]&&RG.reg[n].final&&!RG.reg[n].pulou&&!RG.reg[n].reteste);
  const n=+cands[Math.floor(rgSorteio()*cands.length)], r=RG.reg[n]; RG.coerAtual=n; rgSalva();
  rgTopo("sua régua");
  mostra(`<div class="rot">Fase 3 · A sua régua</div>
    <h2 class="rg-q">Rapidinho: onde fica isso na sua régua?</h2>
    <h2 class="rg-sit">“${esc(r.final)}”</h2>
    <div class="rg-esc" style="--k:#f5c542">${[0,1,2,3,4,5,6,7,8,9,10].map(v=>`<button type="button" onclick="rgCoerResp(this,${v})" aria-label="${v}">${v}</button>`).join("")}</div>`); }
window.rgCoerResp = function(b,v){ if(ocupado) return; ocupado=true; click(); vibra(8+v); b.classList.add("sel");
  const n=RG.coerAtual, r=RG.reg[n], h=rgHoje(); RG.coer[h]={num:n,resposta:v}; r.reteste={dia:h,resposta:v};
  if(v!==n) RG.pistasFracas.push({num:n,item:r.final,antes:n,agora:v,dia:h});
  delete RG.coerAtual; rgSalva(); setTimeout(()=>{ ocupado=false; rgTela(); },420); };

/* =================== BLOCO D · FIM DO DIA =================== */
function rgFimDia(nova){ rgTopo("até amanhã");
  mostra(`<div class="rg-entrada">${rgFogoHTML()}<div class="rot">Fase 3 · A sua régua</div>${rgMandala(nova)}${rgEstrela(nova)}${rgBarra()}
    <h2 style="margin-top:12px">${FIM_DIA}</h2>
    ${RG.lembrete?`<p class="sub">Combinado: amanhã eu te lembro.</p>`:`<button class="rg-volta" type="button" onclick="rgLembrete()">🔔 Quero um lembrete amanhã</button>`}
    <div><button class="btn sec" style="margin-top:14px" type="button" onclick="irInicio()">Ir para o começo</button></div>
    ${rgPreviaBotoes()}</div>`); }
/* notificação só se a pessoa pedir. SERVIDOR: o envio do lembrete precisa do servidor; por enquanto, só guarda o pedido. */
window.rgLembrete = function(){ click(); RG.lembrete=true; rgSalva();
  try{ if(window.Notification && Notification.permission==="default") Notification.requestPermission().catch(()=>{}); }catch(e){}
  rgFimDia(); };

/* =================== BLOCO D · TELA FINAL DA FASE 3 (neutra) =================== */
/* Não revela o que a Brisa descobriu. O palpite da Brisa e "Suas pistas" ficam para a Fase 4. */
function rgFimFase(){ rgTopo("régua montada");
  mostra(`<div class="rot">Fase 3</div>${rgMandala()}${rgEstrela()}${rgBarra()}
    <h2>Sua régua está montada.</h2><p class="sub">Eu já estou ligando os pontos. Na próxima fase, tem uma coisa para te mostrar.</p>
    ${PREVIA?`<div style="margin-top:18px"><button class="btn" type="button" onclick="rgVaiMotivos()">Seguir para os motivos →</button><p class="sub" style="font-size:15px;margin-top:8px">Só na prévia: a parte da análise da função (como fica a ligação com a régua é decisão da sala).</p></div>`:""}
    ${rgPreviaBotoes()}`); }
/* 27/11 · prévia: depois da régua montada, segue para as perguntas dos motivos (análise da função), que já existiam no app */
window.rgVaiMotivos = function(){ click&&click(); try{ if(typeof f3ExemploFase1==="function") f3ExemploFase1(); }catch(e){}
  f3Carrega(); F3.intro=true; f3Salva(); entrou=true; pos=R.length-1;
  if(!document.getElementById("rgSemCerebro")){ const st=document.createElement("style"); st.id="rgSemCerebro"; st.textContent="#f3cerebro{display:none!important}"; document.head.appendChild(st); }
  f3Tela(); };

/* ---------- botões só da prévia (sem modo teste) ---------- */
window.rgPulaEspera = function(){ click(); RG.hoje=null; rgSalva(); rgTela(); };
window.rgRefazColoque = function(){ click(); RG.col={}; delete RG.colFeito; rgSalva(); rgTela(); };
window.rgZera = function(){ click(); RG=rgNovo(); rgSalva(); entrou=true; pos=R.length-1; desenha(); };

/* =================== BLOCO A · LINK DIRETO =================== */
/* No modo teste, o app abre direto na Fase 3 (sem passar pelas Fases 1 e 2), com as respostas de exemplo. */
if(TESTE){ rgCarrega(); rgExemploF1(); fechaPainel&&fechaPainel(); entrou=true; pos=R.length-1;
  try{ localStorage.setItem("7e_fase3_ativa","1"); }catch(e){}
  const g=document.getElementById("guia-ios"); if(g) g.remove();
  if(window.F3_COMPLETA || /[?&#]completa/i.test(location.search+location.hash)) window.rgCompletaTeste();
  else if(RG.intro) rgTela(); else window.trava3(); }
})();
