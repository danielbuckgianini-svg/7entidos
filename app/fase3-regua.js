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
/* 27/11 · CHAVE ÚNICA DAS TRAVAS POR DIA. Enquanto construímos fica false (tudo liberado, para testar seguido).
   No lançamento, mude para true: liga de uma vez o limite de 5 rodadas por dia, a régua em blocos (um dia de cada vez)
   e uma mecânica por dia (régua e teste de imagens em dias alternados). */
const TRAVAS_LIGADAS = false;
window.TRAVAS_LIGADAS = TRAVAS_LIGADAS; window.RG_TESTE = TESTE;
const LIVRE = TESTE || !TRAVAS_LIGADAS; window.RG_LIVRE = LIVRE;
/* do 4 ao 0: trancados ("em construção") até chegar o banco de situações ruins da Sala do Péssimo */
const EM_CONSTRUCAO = [4,3,2,1,0];
const BANCO_RUIM = [];   /* aqui entram as situações ruins (4 ao 0) quando chegarem */
/* com as travas desligadas, as perguntas dos motivos (Mecânica 2) também ficam sem o limite de 5 por dia */
if(!TRAVAS_LIGADAS && typeof f3Liberado==="function") window.f3Liberado = function(){ return true; };
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
/* 27/11 · V4: ordem 10 → 9 → 8 → 7 → 6 → 5 (4 → 3 → 2 → 1 → 0 trancados, "em construção").
   Liberação: primeiro o 10; depois 9, 8 e 7; depois 6 e 5. */
const ORDEM = [10,9,8,7,6,5,4,3,2,1,0];
const BLOCOS = [[10],[9,8,7],[6,5],[4,3,2,1,0]];
const LIMITE_DIA = 5;
/* os números que já dá para fazer (do 10 ao 5); do 4 ao 0 ficam "em construção" */
const JOGAVEIS = ORDEM.filter(n=>!EM_CONSTRUCAO.includes(n));
/* REGRA DO NÍVEL: do 10 ao 6 só coisas boas (Fases 1 e 2 + novidades boas); o 5 é neutro (este banco);
   do 4 ao 0 só o banco de situações ruins (BANCO_RUIM), que ainda vai chegar.
   BANCO DO 5 · PROVISÓRIO, para o Daniel validar: coisas do dia a dia que não são boas nem ruins. */
const NEUTROS = [
 ["esperar o elevador chegar","visao"],["lavar a louça do almoço","tato"],["ouvir o barulho da geladeira","audicao"],
 ["pegar o ônibus de sempre","equilibrio"],["arrumar a cama de manhã","corpo"],["um dia nublado, sem chuva","visao"],
 ["tomar um copo d'água","paladar"],["cheiro de sabão em pó","olfato"],["esperar na fila do mercado","corpo"],
 ["dobrar as roupas do varal","tato"]
];

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

/* =================== BLOCO 2 (V4) · O MOTOR, JEITO AKINATOR =================== */
/* Os dados (degraus 1 e 2, último degrau, "O que faltou", 30 novidades) ficam em fase3-banco.js.
   Cada número tem uma "escada do porquê": a próxima pergunta depende da anterior.
   1) degrau 1 · "o mais e o menos": o que é o número dela (no 10: 4 escolhas das Fases 1 e 2 + 1 novidade)
   2) degrau 2 · o porquê: 5 opções, uma por motivo, sobre o que ela escolheu
   3) desempate · "isto ou aquilo" entre os 2 motivos da frente, só quando ainda há dúvida
   4) último degrau · dentro do motivo da frente (lista aprovada; a inteligência do app só escolhe dentro dela)
   O app para quando tem certeza: 2 a 4 rodadas por número, até 6 no 10. */
const B = window.RG_BANCO || {degrau1:{},degrau2:{},ultimo:{},faltou:[],novidades:[]};
const MOTS = ["soc","pau","sen","con","jei"];
const NOVIDADES = B.novidades;
const FALTOU = B.faltou;
const MAX_RODADAS = n => n===10?6 : n===0?1 : 4;
const CERTEZA = n => n===10?.7 : .6;
const P0 = () => Object.fromEntries(MOTS.map(m=>[m,.2]));
const normP = P => { const t=MOTS.reduce((a,m)=>a+P[m],0)||1; MOTS.forEach(m=>P[m]/=t); return P; };
const ordemP = P => MOTS.slice().sort((a,b)=>P[b]-P[a]);
const puxa = (P,m,f) => { if(m&&P[m]!=null){ P[m]*=f; normP(P); } };
/* resposta escolhida no degrau 2: força igual à do "cérebro" da Fase 3 (45 de 100 para o motivo escolhido, ~14 para cada um dos outros) */
const escolheMot = (P,m,peso) => { MOTS.forEach(k=>{ P[k]*=Math.pow(k===m?.45:.1375, peso||1); }); normP(P); };
function novoA(n){ return {num:n,rodadas:0,P:P0(),hist:[],shown:[],pistas:[],set:0,pulos:0,duelos:0}; }

/* ---------- o que fica guardado (só no celular) ---------- */
let RG=null;
function rgNovo(){ return {v:1,col:{},feitos:{},atual:null,hoje:null,reg:{},dias:{},folgas:{},pistasFracas:[],coer:{},novIdx:0,curIdx:0,bau:0,desloc:0,ultFmt:null,iaLog:[]}; }
function rgCarrega(){ if(RG) return RG; try{ RG=JSON.parse(localStorage.getItem(CHAVE)||"null"); }catch(e){} if(!RG||RG.v!==1) RG=rgNovo();
  const n=rgNovo(); for(const k in n) if(RG[k]==null) RG[k]=n[k];
  if(RG.atual && !RG.atual.P) RG.atual=novoA(RG.atual.num); /* veio de uma versão antiga: recomeça só aquele número */
  return RG; }
function rgSalva(){ try{ localStorage.setItem(CHAVE,JSON.stringify(RG)); }catch(e){} }
/* o "hoje" do app: no modo teste, anda com o botão "Avançar um dia" */
function rgHoje(){ const d=new Date(); d.setDate(d.getDate()+((RG&&RG.desloc)||0)); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
window.rgHojeStr = () => rgHoje(); window.rgDiaFase3 = () => { rgCarrega(); return rgDia(); };
const diaNum = s => { const [a,m,d]=s.split("-").map(Number); return Date.UTC(a,m-1,d)/864e5; };
const diaStr = k => { const d=new Date(k*864e5); return d.getUTCFullYear()+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0"); };
function rgDia(){ return RG.primeiroDia ? diaNum(rgHoje())-diaNum(RG.primeiroDia)+1 : 1; }
function rgHojeN(){ const h=rgHoje(); return RG.hoje&&RG.hoje.d===h ? RG.hoje.n : 0; }
function rgContaRodada(){ const h=rgHoje(); if(!RG.hoje||RG.hoje.d!==h) RG.hoje={d:h,n:0}; RG.hoje.n++; RG.dias[h]=true; delete RG.folgas[h]; }
const rgFeitos = () => ORDEM.filter(n=>RG.feitos[n]!=null);
const rgColFeito = () => COLOQUE.every(c=>RG.col[c.sid]!=null);
/* um bloco abre quando todos os números dos blocos anteriores estão fechados (no modo teste, tudo aberto) */
/* (os números "em construção" não contam para abrir o bloco seguinte) */
function rgBlocoAberto(){ for(let b=0;b<BLOCOS.length;b++){ if(BLOCOS[b].some(n=>JOGAVEIS.includes(n)&&RG.feitos[n]==null)) return b; } return BLOCOS.length; }
function rgAbertos(){ return LIVRE ? JOGAVEIS.slice() : (BLOCOS[rgBlocoAberto()]||[]).filter(n=>JOGAVEIS.includes(n)); }
const rgReguaPronta = () => JOGAVEIS.every(n=>RG.feitos[n]!=null);
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
.rg-bau span{font-size:26px;line-height:1}
.rg-bau.abre span{animation:rgBau .8s ease-out}
@keyframes rgBau{0%{transform:scale(1)}40%{transform:scale(1.3) rotate(-8deg)}70%{transform:scale(.95) rotate(5deg)}100%{transform:none}}
.rg-curio{max-width:440px;margin:10px auto 6px;padding:16px 18px;border-radius:20px;background:rgba(17,27,61,.85);border:1px solid rgba(245,197,66,.5);font-size:18px;line-height:1.5}
.rg-curio b{display:block;color:var(--ouro);font:700 13px "Space Mono",monospace;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.rg-aviso{position:fixed;left:50%;bottom:calc(84px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:70;max-width:min(420px,90vw);padding:12px 18px;border-radius:16px;background:#111b3d;border:1px solid rgba(245,197,66,.55);font-size:16px;text-align:center;box-shadow:0 14px 40px rgba(0,0,0,.6);animation:guiaSobe .4s ease-out}
.rg-previa{margin-top:22px;padding-top:14px;border-top:1px dashed rgba(169,179,209,.35);display:flex;flex-direction:column;gap:6px;align-items:center}
.rg-previa .linkflow::before{content:"⚙"}
/* 27/11 · Bloco 5: o mapa da Fase 3 */
.f3m{display:flex;flex-direction:column;gap:10px;max-width:440px;margin:14px auto 0;text-align:left}
.f3m-it{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:flex;align-items:center;gap:14px;min-height:72px;padding:12px 16px;border-radius:20px;background:rgba(32,48,100,.6);border:1.5px solid rgba(245,197,66,.5);box-shadow:0 5px 0 rgba(0,0,0,.35)}
.f3m-it.hoje{border-color:var(--ouro);box-shadow:0 0 0 2px rgba(245,197,66,.35),0 5px 0 rgba(0,0,0,.35)}
.f3m-it.ok{border-color:rgba(127,211,255,.55)}
.f3m-it.fecha{opacity:.5;cursor:default;border-style:dashed;box-shadow:none}
.f3m-n{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:rgba(245,197,66,.15);border:1.5px solid var(--ouro);font:800 20px Inter,system-ui,sans-serif;color:var(--ouro)}
.f3m-it.ok .f3m-n{background:#7fd3ff;border-color:#7fd3ff;color:#0a1128}
.f3m-t{flex:1}.f3m-t b{display:block;font-size:20px}.f3m-t small{display:block;font-size:16px;color:var(--azul);margin-top:2px}
.f3m-it em{font-style:normal;font:700 12px "Space Mono",monospace;color:#0a1128;background:var(--ouro);border-radius:8px;padding:3px 8px}
.f3m-it.fecha em{background:none;color:var(--azul);font-size:16px}
.f3m-cur{max-width:440px;margin:12px auto 0;padding:14px 16px;border-radius:20px;background:rgba(17,27,61,.85);border:1.5px dashed rgba(245,197,66,.55);text-align:left}
.f3m-cur small{display:block;font:700 12px "Space Mono",monospace;color:var(--ouro);text-transform:uppercase;letter-spacing:.06em}
.f3m-cur b{display:block;font-size:20px;line-height:1.35;margin:4px 0 8px}
.f3m-cur p{margin:0;font-size:17px;color:#fff3c4}
.f3m-cur .rg-tres{justify-content:flex-start;margin:0}
/* 27/11 · Bloco 2: a escada da régua (0 embaixo, 10 em cima) */
.rg-escada{max-width:440px;margin:8px auto 6px;display:flex;flex-direction:column;gap:6px;text-align:left}
.rg-dir{font:700 15px "Space Mono",monospace;color:var(--azul);letter-spacing:.04em;text-align:center;margin:2px 0}
.rg-deg2{margin-left:calc(var(--d) * 1.8%);margin-right:calc((10 - var(--d)) * .6%);border-radius:18px;background:rgba(17,27,61,.72);border:1.5px solid rgba(169,179,209,.22);border-bottom:4px solid rgba(0,0,0,.35);transition:background .3s,border-color .3s}
.rg-linha{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:12px;width:100%;min-height:58px;padding:8px 14px}
.rg-bol{flex:none;width:30px;height:30px;border-radius:50%;background:rgba(169,179,209,.14);border:2.5px solid color-mix(in srgb,var(--k) 55%,transparent);transition:background .6s,box-shadow .6s,transform .6s}
.rg-deg2.ok .rg-bol{background:var(--k);border-color:var(--k);box-shadow:0 0 16px var(--k)}
.rg-deg2.nova .rg-bol{animation:rgAcende 1.3s ease-out}
.rg-linha b{font:800 28px/1 Fraunces,Georgia,serif;color:var(--creme);min-width:36px}
.rg-deg2.ok .rg-linha b{color:var(--k)}
.rg-linha span{font-size:19px;font-weight:700;flex:1}
.rg-linha em{font-style:normal;font:700 13px "Space Mono",monospace;color:var(--azul);text-align:right;white-space:nowrap}
.rg-deg2.ok .rg-linha em{color:var(--k);font-size:18px}
.rg-deg2.anda{border-color:#fff3c4}
.rg-deg2.anda .rg-linha em{color:#fff3c4}
.rg-deg2.obra{opacity:.55;border-style:dashed}
.rg-deg2.ab{background:rgba(32,48,100,.9);border-color:var(--k)}
.rg-info{padding:0 14px 14px 14px}
.rg-info p{margin:0 0 8px;font-size:18px;line-height:1.45}
.rg-info .rg-sua{font-size:17px;color:#fff3c4}
.rg-info .rg-sua b{color:var(--k)}
.rg-info .rg-obra{font-size:16px;color:var(--azul)}
.rg-fazer{margin-top:4px;min-height:52px;width:100%;white-space:nowrap}
.rg-corval{font-size:13px;color:var(--azul);margin:6px 0 0;text-align:center}
@media(max-width:360px){.rg-deg2{margin-left:calc(var(--d) * 1.2%);margin-right:0}}
/* 27/11 · Bloco 3: opções em FOTO grande com legenda curta (estilo Stories, duas lado a lado) */
.rg-ops.fotos{grid-template-columns:1fr 1fr;gap:12px}
.rg-ops.fotos.impar .rg-opf:last-child{grid-column:1 / -1;width:calc(50% - 6px);justify-self:center}
.rg-opf{flex-direction:column;align-items:stretch;gap:0;padding:0!important;min-height:0!important;overflow:hidden;border-radius:20px;border-width:2px;text-align:left}
.rg-opf .rg-ft{aspect-ratio:4/5;width:100%}
.rg-opf .rg-cap{position:absolute;left:0;right:0;bottom:0;padding:34px 12px 12px;font-size:18px;font-weight:800;line-height:1.2;color:#fff;background:linear-gradient(180deg,transparent,rgba(5,9,26,.92) 55%);text-shadow:0 1px 6px rgba(0,0,0,.6)}
.rg-opf em{position:absolute;top:8px;left:8px;margin:0}
.rg-opf .selo{top:8px;right:8px;font-size:14px;padding:4px 10px;z-index:2}
.rg-opf.mais{box-shadow:0 0 0 3px var(--ouro),0 0 22px rgba(245,197,66,.45)}
.rg-opf.menos{box-shadow:0 0 0 3px #7fd3ff;opacity:.85}
.rg-opf.sel{box-shadow:0 0 0 3px var(--ouro),0 0 22px rgba(245,197,66,.45)}
.rg-eu{display:grid;place-items:center;font-size:16px;font-weight:800;color:var(--ouro);text-align:center;padding:6px}
/* V4 · formato "escolher 1 de 5" em lista (com foto pequena) */
.rg-ops.lista{grid-template-columns:1fr!important;gap:10px}
.rg-opl{padding:8px 14px 8px 8px!important;gap:14px;min-height:76px}
.rg-opl .rg-ft{width:64px;height:64px;flex:none;border-radius:12px}
.rg-opl .rg-ph b{font-size:0}.rg-opl .rg-ph b::after{content:"foto";font-size:16px}.rg-opl .rg-ph code{display:none}
.rg-lt{flex:1;font-size:20px;line-height:1.3}
.rg-ops.duelo .rg-opf .rg-ft{aspect-ratio:3/4}
.rg-seguro{font-size:18px!important;font-weight:700;color:#d7f5df!important;background:rgba(92,207,138,.12);border:1px solid rgba(92,207,138,.45);border-radius:14px;padding:10px 12px;margin:8px 0 6px!important}
.rg-dica{font-size:17px;color:#fff3c4;margin:-6px 0 12px}
.rg-colfoto{width:min(320px,86%);aspect-ratio:16/10;margin:6px auto 2px;border-radius:20px;overflow:hidden}
.rg-reforco{display:flex;gap:14px;align-items:center;text-align:left;max-width:440px;margin:12px auto 4px;padding:12px 16px;border-radius:22px;background:rgba(17,27,61,.85);border:1.5px solid rgba(245,197,66,.5)}
.rg-reforco img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none;border:2px solid var(--ouro)}
.rg-reforco p{margin:0;font-size:19px;line-height:1.4;font-weight:700}
.rg-reforco small{display:block;font:700 12px "Space Mono",monospace;color:var(--ouro);text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
/* 27/11 · cartão de cima (a escolha dela) e fotos */
.rg-foco{display:flex;gap:14px;align-items:center;text-align:left;margin:10px 0 4px;padding:10px;border-radius:20px;background:rgba(17,27,61,.8);border:1.5px solid color-mix(in srgb,var(--c,#f5c542) 60%,transparent)}
.rg-foco .rg-ft{width:96px;height:96px;flex:none;border-radius:14px}
.rg-foco small{display:block;font:700 12px "Space Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--azul)}
.rg-foco b{display:block;font-size:21px;line-height:1.25;margin:2px 0}
.rg-foco span{display:block;font-size:16px;color:#fff3c4}
.rg-ft{display:block;position:relative;overflow:hidden;background:rgba(5,9,26,.6)}
.rg-ft img{display:block;width:100%;height:100%;object-fit:cover}
.rg-ph{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:100%;height:100%;padding:8px;box-sizing:border-box;background:repeating-linear-gradient(45deg,rgba(169,179,209,.10) 0 10px,rgba(169,179,209,.05) 10px 20px);border:1.5px dashed rgba(169,179,209,.45);border-radius:inherit;text-align:center}
.rg-ph b{font:700 13px "Space Mono",monospace;color:var(--azul);text-transform:uppercase;letter-spacing:.05em}
.rg-ph code{font:400 11px "Space Mono",monospace;color:#cdd5f0;word-break:break-all;line-height:1.3}
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
window.rgFechaModal = rgFechaModal; window.rgAviso = rgAviso; window.rgModal = rgModal;

/* ---------- topo e mandala ---------- */
window.rgTopo = function(t){ return rgTopo(t); };
function rgTopo(txt){
  const el=document.getElementById("const"); el.hidden=false;
  if(!document.getElementById("mtopo")) el.innerHTML=mandala(72,"mtopo")+`<span class="xde7" id="xde7"></span>`;
  const m=document.getElementById("mtopo"); requestAnimationFrame(()=>poeMandala(m,{pos:TODOS,luz:TODOS,miolo:true}));
  document.getElementById("xde7").innerHTML=`<b class="pal"><em>7</em>entidos</b><small>Fase 3</small>${esc(txt||"sua régua")}`;
  ["voltar","pularbtn","fundobtn"].forEach(id=>{ const b=document.getElementById(id); if(b) b.hidden=true; }); document.body.classList.add("emf3");
  foco(null); brilho(null); fundoCor(null); pararSom(); rgTesteBarra();
}
/* =================== BLOCO 2 (27/11) · A ESCADA DA RÉGUA =================== */
/* No lugar da mandala com luzinhas: uma escada que sobe, com o 0 embaixo e o 10 em cima, e uma bolinha colorida por degrau.
   A bolinha começa apagada e acende quando o número fica pronto. Tocar (ou passar o mouse) mostra o nome, a frase e, se já
   estiver pronto, a escolha dela. CORES SUGERIDAS (para o Daniel validar antes de fixar): */
const COR_NUM = {0:"#3b4a8f",1:"#3f63b8",2:"#4a86d6",3:"#5ec8ff",4:"#8fd6e6",5:"#b9c0e0",6:"#a6e8a0",7:"#6fe0a0",8:"#ffcf3f",9:"#ff9b4a",10:"#ff6fa8"};
const FRASE_NUM = {
 10:"O melhor que existe. Você queria que esse momento não acabasse.",
 9:"Muito, muito bom. Quase perfeito.",
 8:"Te deixa feliz de verdade.",
 7:"Gostoso. Você aproveita.",
 6:"Agradável e leve, um pouco melhor que o normal.",
 5:"Nem bom nem ruim. Passa, e você nem lembra.",
 4:"Nada de bom acontece. Tédio.",
 3:"Incomoda e irrita, mas passa.",
 2:"Dá vontade de sair dali.",
 1:"Nojo, aflição ou mal-estar forte.",
 0:"Forte e sem saída. O pior do dia a dia."
};
let rgAberto = null;   /* degrau aberto (mostrando a frase) */
function rgEscolhaDe(n){ const r=RG.reg[n]; if(!r) return ""; if(r.pulou) return "pulou (opcional)"; return r.final||r.base||""; }
/* acao = true: é a tela de escolher o número (cada degrau aberto mostra o botão para fazer aquele número) */
function rgEscada(o){ o=o||{}; const abertos=rgAbertos(), feitos=rgFeitos().length;
  if(rgAberto==null && o.acao){ const prox=(RG.atual&&RG.atual.num!=null)?RG.atual.num:ORDEM.find(n=>abertos.includes(n)&&RG.feitos[n]==null); rgAberto=prox==null?null:prox; }
  let h=`<div class="rg-escada" aria-label="Sua régua: ${feitos} de 11 números prontos"><div class="rg-dir">↑ mais alto</div>`;
  for(let n=10;n>=0;n--){
    const ok=RG.feitos[n]!=null, obra=EM_CONSTRUCAO.includes(n), pode=abertos.includes(n)&&!ok, anda=RG.atual&&RG.atual.num===n, ab=rgAberto===n, nova=o.nova===n;
    const st = ok?"✓":obra?"🔒 em obra":anda?"continuar":pode?"":"🔒";
    const esc1 = ok ? rgEscolhaDe(n) : "";
    h+=`<div class="rg-deg2${ok?" ok":""}${obra?" obra":""}${ab?" ab":""}${nova?" nova":""}${anda?" anda":""}" style="--k:${COR_NUM[n]};--d:${n}" data-n="${n}">
      <button class="rg-linha" type="button" onclick="rgInfo(${n})" onmouseenter="rgInfo(${n},1)" aria-expanded="${ab}" aria-label="${n}, ${NOMES[n]}${ok?", pronto":obra?", em construção":""}">
        <i class="rg-bol"></i><b>${n}</b><span>${NOMES[n]}</span><em>${st}</em></button>
      <div class="rg-info"${ab?"":" hidden"}><p>${FRASE_NUM[n]}</p>${esc1?`<p class="rg-sua">Sua escolha: <b>${esc(cap(esc1))}</b></p>`:""}
        ${o.acao&&pode?`<button class="btn rg-fazer" type="button" onclick="rgVai(${n})">${anda?"Continuar o meu "+n:"Fazer o meu "+n}</button>`:""}
        ${obra?`<p class="rg-obra">Do 4 ao 0 ainda está em construção.</p>`:""}</div></div>`; }
  h+=`<div class="rg-dir">↓ mais baixo</div></div>`;
  if(PREVIA) h+=`<p class="rg-corval">Só na prévia: cores das bolinhas sugeridas, para você validar.</p>`;
  return h; }
window.rgInfo = function(n,hover){ if(hover && window.matchMedia && !matchMedia("(hover:hover)").matches) return;
  if(!hover) click&&click(); rgAberto = (rgAberto===n && !hover) ? null : n;
  document.querySelectorAll(".rg-deg2").forEach(d=>{ const k=+d.dataset.n, on=k===rgAberto; d.classList.toggle("ab",on); d.querySelector(".rg-info").hidden=!on; d.querySelector(".rg-linha").setAttribute("aria-expanded",on); }); };
/* a mandala saiu (Bloco 2): quem chamava rgMandala agora recebe a escada sem os botões */
function rgMandala(nova){ return rgEscada({nova: nova&&RG&&RG.ultimo!=null?RG.ultimo:null}); }
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
  JOGAVEIS.forEach(n=>{ if(RG.feitos[n]==null) RG.feitos[n]=rgHoje(); }); RG.atual=null; rgSalva(); entrou=true; pos=R.length-1; rgTela(); };
window.rgRecomecaTeste = function(){ click(); rgFechaModal(); try{ localStorage.removeItem(CHAVE); localStorage.removeItem("7e_fase3"); }catch(e){} RG=null;
  try{ F3=null; }catch(e){} if(typeof tiZera==="function") tiZera(); rgCarrega(); rgSalva(); rgExemploF1(); entrou=true; pos=R.length-1; window.trava3(); };

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
  if(!rgColFeito()) return rgTela();       /* dia 1: abertura → "Coloque na régua" → régua */
  f3Mapa3();                               /* quem volta: o mapa da Fase 3 */
};
window.f3DaBrisa = window.rgComeca;

/* ---------- o "cérebro" das telas ---------- */
window.rgTela = rgTela;
function rgTela(nova){
  rgCarrega(); rgFechaModal();
  if(!rgColFeito()) return rgColoque();                        /* antes do 10, no primeiro dia */
  if(rgReguaPronta() && !RG.atual) return rgFimFase();
  const limite = !LIVRE && rgHojeN()>=LIMITE_DIA;
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
    <div class="rg-colfoto">${rgFotoHTML(CANVA+"regua-coloque-"+c.sid+".jpg","regua-coloque-"+c.sid+".jpg")}</div>
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
  const pendentes=abertos.filter(n=>RG.feitos[n]==null);
  let nota="";
  if(g.hojeFolga) nota=FOLGA_TXT; else if(g.ontemFolga&&!RG.dias[rgHoje()]) nota="Ontem foi seu dia de folga. Seu foguinho ficou guardado.";
  rgAberto=null;
  mostra(`<div class="rg-entrada">${rgFogoHTML()}<div class="rot">Fase 3 · A sua régua</div>
    ${rgEstrela(nova)}${rgBarra()}
    ${nota?`<p class="rg-nota">${esc(nota)}</p>`:""}
    <h2>${depoisColoque?"Pronto! Agora, o seu 10.":pendentes.length>1?"Qual número você quer fazer hoje?":"O número de hoje"}</h2>
    <p class="rg-legmand">Toque num degrau para ver o que ele quer dizer. Cada bolinha acende quando o número fica pronto.</p>
    ${rgEscada({acao:true,nova:nova?RG.ultimo:null})}
    <button class="rg-volta" type="button" onclick="click();f3Mapa3()">← mapa da Fase 3</button>
    ${!LIVRE&&b<BLOCOS.length-1?`<p class="rg-bloco">Depois: ${BLOCOS.slice(b+1).map(x=>x.join(" · ")).join("  →  ")}</p>`:""}
    ${rgPreviaBotoes()}</div>`);
}
window.rgVai = function(n){ if(ocupado) return; if(EM_CONSTRUCAO.includes(n)) return rgAviso("Do 4 ao 0 ainda está em construção."); click(); vibra(12);
  if(!RG.atual||RG.atual.num!==n) RG.atual=novoA(n);
  rgSalva(); rgTela(); };
window.rgVoltaRegua = function(){ click(); rgEscolhe(); };

/* =================== BLOCO 2 (V4) · MONTAR CADA RODADA =================== */
/* as escolhas das Fases 1 e 2 (só entram do 6 ao 10): primeiro as que ela escolheu (do jogo que mais curtiu para o que menos curtiu),
   depois as fotos que ela viu e não escolheu. O que já virou o centro de outro número vai para o fim (a régua não repete). */
function rgDasFases(A){
  const g=(typeof f3Gostos==="function"?f3Gostos():SENT.map(s=>resp["gosto_"+s.id]||null));
  const esc1=SENT.map((s,i)=>({t:g[i],s:s.id,o:"f1",p:+(resp["curtiu_"+s.id]||0)})).filter(x=>x.t).sort((a,b)=>b.p-a.p);
  const nao=SENT.flatMap((s,i)=>s.o.filter(o=>o!==g[i]).map(o=>({t:o,s:s.id,o:"nao",p:0})));
  const usados=Object.values(RG.reg).map(r=>r&&r.base).filter(Boolean);
  return esc1.concat(nao).filter(x=>!A.shown.includes(x.t)).sort((a,b)=>(usados.includes(a.t)?1:0)-(usados.includes(b.t)?1:0)); }
function rgNovidade(A){ const usadas=(A&&A.shown)||[];
  for(let k=0;k<NOVIDADES.length;k++){ const [t,s]=NOVIDADES[(RG.novIdx+k)%NOVIDADES.length]; if(!usadas.includes(t)){ RG.novIdx=(RG.novIdx+k+1)%NOVIDADES.length; return {t:cap(t),s,o:"nov"}; } }
  const [t,s]=NOVIDADES[RG.novIdx]; RG.novIdx=(RG.novIdx+1)%NOVIDADES.length; return {t:cap(t),s,o:"nov"}; }
/* REGRA E: do 5 para baixo, nunca oferecer algo que ela escolheu como bom nas Fases 1 e 2 (nem o que ela pôs do 6 ao 10) */
function rgBoasDela(){ const g=(typeof f3Gostos==="function"?f3Gostos():[]).filter(Boolean);
  const r=[6,7,8,9,10].map(n=>RG.reg[n]&&RG.reg[n].base).filter(Boolean); return new Set(g.concat(r).map(slug)); }
/* ordem fixa por pessoa (a mesma pessoa vê sempre a mesma ordem naquele número; cada pessoa vê uma ordem) */
function rgEmbaralha(lista,sal){ let h=2166136261; for(const ch of ((typeof PID!=="undefined"?PID:"x")+"|"+sal)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); }
  const rnd=()=>{ h+=0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; };
  const a=lista.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
/* degrau 1 */
function rgOpcoesD1(A){ const n=A.num;
  if(n===10){ const f=rgDasFases(A); if(f.length>=4) return f.slice(0,4).concat(rgNovidade(A)); }
  const sets=B.degrau1[n]||[]; if(!sets.length) return [];
  let it=sets[A.set%sets.length].map(x=>Object.assign({o:"banco"},x));
  if(n<=5){ const boas=rgBoasDela(); it=it.filter(x=>!boas.has(slug(x.t))); }
  return rgEmbaralha(it,"d1|"+n+"|"+A.set); }
/* degrau 2: o porquê. "Nenhuma dessas" troca pelas frases do último degrau (outro jeito de dizer o mesmo motivo) */
function rgOpcoesPorque(A){ const n=A.num, d2=B.degrau2[n]||{}, alt=A.porqueAlt||0;
  const it=MOTS.map(m=>({t:alt?cap((B.ultimo[m]||[])[(alt-1)%((B.ultimo[m]||[]).length||1)]||""):d2[m],m,o:"porque"})).filter(x=>x.t);
  return rgEmbaralha(it,"pq|"+n+"|"+alt); }
/* desempate: os 2 motivos da frente */
function rgOpcoesDuelo(A){ const n=A.num, [a,b]=ordemP(A.P), d2=B.degrau2[n]||{};
  const fr=m=> A.duelos ? cap((B.ultimo[m]||[])[A.duelos%6]||d2[m]) : d2[m];
  return rgEmbaralha([{t:fr(a),m:a,o:"duelo"},{t:fr(b),m:b,o:"duelo"}],"du|"+n+"|"+A.duelos); }
/* último degrau: 4 da lista aprovada do motivo da frente (a inteligência do app, quando ligada, reordena esta lista) */
function rgOpcoesUltimo(A,m){ const l=(B.ultimo[m]||[]).filter(t=>!A.shown.includes(cap(t)));
  return (l.length>=4?l:(B.ultimo[m]||[])).slice(0,4).map(t=>({t:cap(t),m,o:"ultimo"})); }

function rgMontaRodada(A){ const n=A.num;
  if(A.rodadas>=MAX_RODADAS(n)) return null;
  if(n===0) return {tipo:"leve", itens:rgOpcoesD1(A)};
  if(!A.foco){ const it=rgOpcoesD1(A); return it.length?{tipo:"mm",itens:it}:null; }
  if(!A.porqueFeito) return {tipo:"porque",itens:rgOpcoesPorque(A)};
  const [a]=ordemP(A.P), resta=MAX_RODADAS(n)-A.rodadas;
  if(!A.ultimoFeito){
    if(A.P[a]<CERTEZA(n) && resta>=(n<=5?1:2) && A.duelos<(n===10?2:1)) return {tipo:"duelo",itens:rgOpcoesDuelo(A)};
    /* o último degrau só existe do 6 ao 10 (as listas aprovadas são de coisas boas); o 5 termina no porquê */
    if(n>=6) return {tipo:"ultimo",m:a,itens:rgOpcoesUltimo(A,a)}; }
  return (window.rgRodadaExtra && window.rgRodadaExtra(A)) || null; }   /* Bloco 7: confirmação "deslizar" */
/* perguntas claras (V4): nunca mostrar textos de construção */
const PERGUNTA = (A,op,parte) => { const n=A.num;
  if(op.tipo==="mm") return parte==="menos" ? `E qual dessas você acha que se <b class="menos">distanciaria mais</b> do ${n}?` : `Qual dessas <b>mais combina</b> com o seu ${n}?`;
  if(op.tipo==="leve") return `Sem pressa: qual destas é o seu 0?`;
  if(op.tipo==="duelo") return `Entre essas duas, qual é <b>mais</b> o seu ${n}?`;
  if(op.tipo==="deslizar") return `Onde isso fica na sua régua?`;
  return `Qual dessas <b>mais combina</b> com o seu ${n}?`; };
/* uma frase curta (até 12 palavras) dizendo o que fazer agora */
const DICA = (A,op,parte) => op.tipo==="mm" ? (parte==="menos" ? "Agora toque na que ficaria mais longe." : "Toque na que mais combina.")
  : op.tipo==="porque" ? "O que faz disso o seu "+A.num+"?"
  : op.tipo==="duelo" ? "Só uma: a que pesa mais."
  : op.tipo==="deslizar" ? "Arraste a bolinha ou toque num número."
  : "Última pergunta deste número.";

/* ---------- fotos: foto real das Fases 1 e 2, ou foto do Canva (com espaço reservado enquanto não chega) ---------- */
const CANVA = (NO_SITE?"/app/":"")+"fotos-canva/";
const slug = t => String(t).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function rgArqFoto(x){ if(!x) return null;
  if((x.o==="f1"||x.o==="nao") && x.s){ const s=SENT.find(k=>k.id===x.s), j=s?s.o.indexOf(x.t):-1; if(j>=0) return {src:foto(s.id,j)}; }
  if(x.o==="eu") return null;
  const arq = (x.o==="porque"||x.o==="duelo") ? "regua-motivo-"+x.m+".jpg" : x.o==="ultimo" ? "regua-ultimo-"+slug(x.t)+".jpg" : "regua-"+slug(x.t)+".jpg";
  return {src:CANVA+arq,arq}; }
function rgFotoHTML(src,arq,cls){ return `<span class="rg-ft ${cls||""}"><img src="${src}" alt="" ${arq?`onerror="rgSemFoto(this,'${arq}')"`:""}></span>`; }
window.rgSemFoto = function(img,arq){ const p=img.parentNode; if(p) p.innerHTML=`<span class="rg-ph"><b>foto a fazer no Canva</b><code>${esc(arq)}</code></span>`; };
window.rgFotoHTML = rgFotoHTML; window.rgSlug = slug; window.RG_CANVA = CANVA;
/* o cartão de cima: a escolha dela (com foto) e o porquê, quando já tem */
function rgCartaoFoco(A){ const f=rgArqFoto(A.foco);
  return `<div class="rg-foco">${f?rgFotoHTML(f.src,f.arq):`<span class="rg-ft rg-eu"><span>Você contou</span></span>`}<div><small>Você escolheu</small><b>${esc(cap(A.foco.t))}</b>${A.porque?`<span>${esc(cap(A.porque.t))}</span>`:""}</div></div>`; }

/* formato de cada rodada (Bloco 7): nunca dois iguais seguidos */
const FORMATOS = {mm:["fotos","lista"], porque:["lista","fotos"], duelo:["duelo"], ultimo:["fotos","lista"], leve:["lista","fotos"], deslizar:["deslizar"]};
function rgFormato(tipo){ const c=FORMATOS[tipo]||["lista"]; return c.find(f=>f!==RG.ultFmt) || c[0]; }

/* ---------- a tela da rodada ---------- */
function rgRodada(){
  const A=RG.atual, n=A.num;
  if(!A.op){ A.op=rgMontaRodada(A); if(!A.op){ rgEncerra(A); rgSalva(); return rgTela(); }
    A.op.fmt=rgFormato(A.op.tipo); A.op.itens.forEach(x=>{ if(!A.shown.includes(x.t)) A.shown.push(x.t); }); A.sel={}; rgSalva();
    /* último degrau: a inteligência do app (se ligada) escolhe as 4 melhores dentro da lista aprovada */
    if(A.op.tipo==="ultimo" && window.rgIA && rgIA.pode(A)){ return rgIA.ultimo(A).then(()=>rgRodada()); } }
  const op=A.op, sel=A.sel||{}; RG.ultFmt=op.fmt;
  rgTopo(n+" · "+NOMES[n]);
  const parte = op.tipo==="mm"&&sel.mais!=null ? "menos" : "mais";
  const cima = op.tipo!=="mm" && op.tipo!=="leve" && A.foco;
  const card=(x,i)=>{ const c=sel.mais===i?" mais":sel.menos===i?" menos":sel.um===i?" sel":"";
    const selo=sel.mais===i?`<span class="selo">MAIS</span>`:sel.menos===i?`<span class="selo">MAIS LONGE</span>`:"";
    const f=rgArqFoto(x), ft=f?rgFotoHTML(f.src,f.arq):`<span class="rg-ft rg-eu"><span>Você contou</span></span>`;
    if(op.fmt==="lista") return `<button class="rg-op rg-opl${c}" type="button" onclick="rgToca(${i})">${selo}${ft}<span class="rg-lt">${esc(cap(x.t))}</span></button>`;
    return `<button class="rg-op rg-opf${c}" type="button" onclick="rgToca(${i})">${selo}${ft}<span class="rg-cap">${esc(cap(x.t))}</span></button>`; };
  const corpo = op.fmt==="deslizar" && window.rgDeslizarHTML ? rgDeslizarHTML(A,op)
    : `<div class="rg-ops ${op.fmt==="lista"?"lista":op.fmt==="duelo"?"fotos duelo":"fotos"}${op.fmt==="fotos"&&op.itens.length%2?" impar":""}">${op.itens.map(card).join("")}</div>`;
  mostra(`<div class="rg-tit pq">${n}<small>${NOMES[n]}</small></div>
    ${cima?rgCartaoFoco(A):""}
    <h2 class="rg-q">${PERGUNTA(A,op,parte)}</h2>
    <p class="rg-dica">${DICA(A,op,parte)}</p>
    ${corpo}
    ${op.fmt==="deslizar"?"":`<div class="rg-tres">
      <button type="button" onclick="rgNenhuma()">Nenhuma dessas</button>
      <button type="button" onclick="rgMaisOuMenos()">Mais ou menos</button>
      ${RG.texto===false?"":`<button type="button" onclick="rgEscrever('rodada')">✎ Escrever o meu</button>`}
    </div>`}
    ${n===0?`<button class="rg-volta" type="button" onclick="rgPula0()">Pular o 0 (é opcional)</button>`:""}`, c=>{ if(window.rgDepoisRodada) rgDepoisRodada(c,A,op); });
}
/* tocar numa opção */
window.rgToca = function(i){ if(ocupado) return; const A=RG.atual, op=A.op, sel=A.sel||(A.sel={}); click(); vibra(10);
  if(op.tipo==="mm"){
    if(sel.mais===i){ delete sel.mais; delete sel.menos; rgSalva(); return rgRodada(); }
    if(sel.menos===i){ delete sel.menos; rgSalva(); return rgRodada(); }
    if(sel.mais==null){ sel.mais=i; rgSalva(); return rgRodada(); }
    sel.menos=i; rgSalva(); ocupado=true; if(window.rgReage) rgReage(op.itens[sel.mais]); return setTimeout(()=>{ ocupado=false; rgResponde(); },450);
  }
  sel.um=i; rgSalva(); const bt=palco.querySelectorAll(".rg-op"); bt.forEach((b,k)=>b.classList.toggle("sel",k===i)); ocupado=true; if(window.rgReage) rgReage(op.itens[i]);
  setTimeout(()=>{ ocupado=false; rgResponde(); },450);
};
/* a resposta muda o caminho */
function rgResponde(){
  if(window.rgAntes) rgAntes();
  const A=RG.atual, op=A.op, sel=A.sel, n=A.num; rgContaRodada(); A.rodadas++;
  if(op.tipo==="mm"){ const m=op.itens[sel.mais], me=op.itens[sel.menos];
    A.hist.push({tipo:"mm",mais:m.t,menos:me.t}); A.menos=me.t; A.foco={t:m.t,s:m.s,o:m.o,m:m.m||null,sit:m.sit||null};
    puxa(A.P,m.m,1.6); puxa(A.P,me.m,.6);
  } else { const x=op.itens[sel.um]; A.hist.push({tipo:op.tipo,escolha:x.t,m:x.m||null});
    if(op.tipo==="leve"){ A.foco={t:x.t,s:x.s,o:x.o,m:x.m||null}; A.final=x.t; A.fim=true; }
    else if(op.tipo==="porque"){ escolheMot(A.P,x.m); A.porque={t:x.t,m:x.m}; A.porqueFeito=true; }
    else if(op.tipo==="duelo"){ const ot=op.itens.find(y=>y!==x); puxa(A.P,x.m,.7/.3); A.duelos++; if(ot) A.hist[A.hist.length-1].contra=ot.m; }
    else if(op.tipo==="ultimo"){ puxa(A.P,x.m,1.3); A.ultimo=x.t; A.ultimoFeito=true; A.final=cap(A.foco.t)+" · "+minus(x.t); }
    else if(op.tipo==="deslizar" && window.rgRespDeslizar) rgRespDeslizar(A,op);
  }
  A.op=null; A.sel={};
  if(!A.fim && !rgMontaRodada(A)) rgEncerra(A);
  rgSalva(); rgTela();
}
function rgEncerra(A){ const [m]=ordemP(A.P); A.motivo=m; A.cert=+A.P[m].toFixed(2);
  if(!A.final) A.final = A.foco ? cap(A.foco.t)+(A.porque?" · "+minus(A.porque.t):"") : "";
  A.fim=true; }

/* "Nenhuma dessas": 5 opções novas ou escrever a própria resposta */
window.rgNenhuma = function(){ click();
  rgModal(`<h3>Nenhuma combina?</h3><p>Sem problema. O que você prefere?</p><div class="col">
    <button class="btn" type="button" onclick="rgNovas()">Mostrar outras opções</button>
    ${RG.texto===false?"":`<button class="btn sec" type="button" onclick="rgFechaModal();rgEscrever('rodada')">✎ Escrever a minha</button>`}
    <button class="btn sec" type="button" onclick="rgFechaModal()">← Voltar</button></div>`); };
window.rgNovas = function(){ click(); rgFechaModal(); if(window.rgAntes) rgAntes(); const A=RG.atual, op=A.op; A.pulos=(A.pulos||0)+1;
  A.hist.push({tipo:"nenhuma",em:op.tipo,viu:op.itens.map(x=>x.t)});
  if(op.tipo==="mm"||op.tipo==="leve") A.set=(A.set||0)+1;
  else if(op.tipo==="porque") A.porqueAlt=(A.porqueAlt||0)+1;
  else if(op.tipo==="duelo"){ op.itens.forEach(x=>puxa(A.P,x.m,.8)); A.duelos++; }
  A.op=null; rgSalva(); rgRodada(); };

/* "Mais ou menos": qual chegou perto? → "O que faltou para ser um N?" */
window.rgMaisOuMenos = function(){ const A=RG.atual, op=A.op, sel=A.sel||{}; click();
  const i = op.tipo==="mm" ? sel.mais : sel.um;
  if(i==null) return rgModal(`<h3>Qual delas chegou mais perto?</h3><div class="col">${op.itens.map((x,k)=>`<button class="btn sec" type="button" onclick="rgMMquase(${k})">${esc(cap(x.t))}</button>`).join("")}
    <button class="btn sec" type="button" onclick="rgFechaModal()">← Voltar</button></div>`);
  rgMMquase(i); };
window.rgMMquase = function(i){ click(); const A=RG.atual, x=A.op.itens[i];
  rgModal(`<h3>O que faltou para ser um ${A.num}?</h3><p>“${esc(cap(x.t))}”</p><div class="col">
    ${FALTOU.map(([t],k)=>`<button class="btn sec" type="button" onclick="rgFaltou(${i},${k})">${t}</button>`).join("")}
    <button class="btn sec" type="button" onclick="rgFechaModal()">← Voltar</button></div>`); };
window.rgFaltou = function(i,k){ click(); rgFechaModal(); if(window.rgAntes) rgAntes(); const A=RG.atual, op=A.op, x=op.itens[i], [txt,dim]=FALTOU[k];
  rgContaRodada(); A.rodadas++; A.hist.push({tipo:"maisoumenos",em:op.tipo,item:x.t,faltou:txt});
  if(op.tipo==="mm"||op.tipo==="leve"){ A.foco={t:x.t,s:x.s,o:x.o,m:x.m||null,sit:x.sit||null}; puxa(A.P,x.m,1.25); }   /* conta pela metade */
  else if(op.tipo==="porque"){ escolheMot(A.P,x.m,.5); A.porque={t:x.t,m:x.m}; A.porqueFeito=true; }
  else if(op.tipo==="duelo"){ puxa(A.P,x.m,1.4); A.duelos++; }
  else if(op.tipo==="ultimo"){ A.ultimo=x.t; A.ultimoFeito=true; A.final=cap(A.foco.t)+" · "+minus(x.t); }
  puxa(A.P,dim,1.4); A.faltou=dim||"outra";
  if(A.num===0){ A.final=x.t; A.fim=true; }
  A.op=null; A.sel={};
  if(!A.fim && !rgMontaRodada(A)) rgEncerra(A);
  rgSalva();
  if(dim===null && RG.texto!==false && !A.fim) return rgEscrever("faltou");
  rgTela(); };

/* "Escrever o meu": escrever ou falar. O texto NUNCA fica guardado: o app tira dele só uma pista (motivo e sentido). */
const PISTA_MOT = {soc:/amig|famil|filh|net[oa]|marido|espos|namor|m[ãa]e\b|pai\b|irm[ãa]|gente|junt|convers|abra[çc]|vizinh|turma|pessoa/i,
  pau:/descans|paz|sossego|sil[êe]ncio|folga|relax|calm|sem pressa|dormir|cochil|ningu[ée]m|longe|respir/i,
  sen:/cheir|sabor|gost(o|inho)|som\b|m[úu]sica|cor(es)?\b|vento|mar\b|sol\b|pele|toque|[áa]gua|vista|luz|perfume/i,
  con:/comid|comer|presente|ganh|compr|dinheir|lanche|bolo|doce|roupa|pr[êe]mio/i,
  jei:/escolh|meu jeito|minha hora|quando eu quero|livre|liberdade|decid|do meu modo|eu mesma/i};
const PISTA_SENT = {visao:/\bver\b|olhar|cor|paisagem|vista|p[ôo]r do sol|c[ée]u/i,audicao:/ouvir|som|m[úu]sica|barulho|cant/i,tato:/toque|pele|abra[çc]|[áa]gua|carinho|areia/i,
  olfato:/cheir|perfume|aroma/i,paladar:/comer|sabor|gost|comida|bolo|caf[ée]|doce/i,equilibrio:/dan[çc]|balan[çc]|bicicleta|rede|surf/i,corpo:/alongar|respir|corpo|caminh|correr|nadar/i};
function rgPistaLocal(v){ const m=MOTS.filter(k=>PISTA_MOT[k].test(v)), s=Object.keys(PISTA_SENT).filter(k=>PISTA_SENT[k].test(v));
  return {m:m.length===1?m[0]:m[0]||null, s:s[0]||null, de:"escrito", local:true}; }
window.rgEscrever = function(onde){ click(); if(RG.texto===true) return rgCaixaTexto(onde);
  rgModal(`<h3>Antes de escrever</h3><p>O que você escrever é lido pelo app para te entender melhor. Seu nome não vai junto.</p>
    <p class="rg-seguro">O 7entidos nunca pede senha, dinheiro nem dados do banco.</p>
    <div class="col"><button class="btn" type="button" onclick="rgTextoSim('${onde}')">Aceito</button><button class="btn sec" type="button" onclick="rgTextoNao()">Prefiro só escolher</button></div>`); };
window.rgTextoSim = function(onde){ click(); RG.texto=true; rgSalva(); rgCaixaTexto(onde); };
window.rgTextoNao = function(){ click(); RG.texto=false; rgSalva(); rgFechaModal(); if(RG.atual&&!RG.atual.fim) rgRodada(); else rgTela(); };
function rgCaixaTexto(onde){
  const A=RG.atual, n=A?A.num:10, pode=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  const tit = onde==="momento" ? `Conte o seu momento` : onde==="faltou" ? `O que faltou? Conte do seu jeito` : `Qual é o seu ${n}? Conte do seu jeito`;
  rgModal(`<h3>${tit}</h3>${pode?`<button class="mic" id="rgmic" type="button" onclick="rgFala()">🎤 Falar</button>`:`<p class="rg-nota">Para falar, toque no microfone do teclado.</p>`}
    <textarea id="rgtxt" maxlength="280" placeholder="Escreva aqui…" aria-label="Escreva aqui"></textarea>
    <p class="rg-seguro">O 7entidos nunca pede senha, dinheiro nem dados do banco.</p>
    <div class="col" style="margin-top:12px"><button class="btn" type="button" onclick="rgSalvaTexto('${onde}')">Pronto</button><button class="btn sec" type="button" onclick="rgFechaModal()">← Voltar</button></div>`);
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
  if(!v){ rgAviso("Escreva ou fale alguma coisa, ou toque em Voltar."); return; } click(); rgFechaModal(); if(window.rgAntes) rgAntes(); const A=RG.atual;
  /* a pista sai do texto; o texto em si não é guardado em lugar nenhum */
  const usa = p => {
    if(onde==="momento"){ A.momento={pista:p}; A.momentoFeito=true; rgSalva(); return rgTela(); }
    rgContaRodada(); A.rodadas++; A.pistas.push(Object.assign({onde,rodada:A.op?A.op.tipo:null},p)); A.hist.push({tipo:"escrito",onde,m:p.m,s:p.s});
    const op=A.op;
    if(onde==="faltou"){ puxa(A.P,p.m,1.4); }
    else if(!A.foco || (op&&op.tipo==="mm") || (op&&op.tipo==="leve")){ A.foco={t:"o que você contou",s:p.s,o:"eu",m:p.m}; puxa(A.P,p.m,1.6); }
    else if(op&&op.tipo==="porque"){ if(p.m) escolheMot(A.P,p.m); A.porque={t:"o que você contou",m:p.m}; A.porqueFeito=true; }
    else { puxa(A.P,p.m,1.8); if(op&&op.tipo==="ultimo"){ A.ultimoFeito=true; A.final=cap(A.foco.t)+" · do jeito que você contou"; } else A.duelos++; }
    A.op=null; A.sel={};
    if(A.num===0){ A.final="o que você contou"; A.fim=true; }
    else if(!A.fim && !rgMontaRodada(A)) rgEncerra(A);
    rgSalva(); rgTela(); };
  if(window.rgIA && rgIA.pode(A)) return rgIA.pista(v,A).then(p=>usa(p||rgPistaLocal(v)));
  usa(rgPistaLocal(v)); };
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
  const om=ordemP(A.P||P0());
  RG.reg[n]={base:A.foco?A.foco.t:null, sit:A.foco&&A.foco.sit||null, sentido:A.foco&&A.foco.s||null, porque:A.porque?A.porque.t:null, motivo:A.motivo||om[0], certeza:+((A.P||P0())[A.motivo||om[0]]).toFixed(2), P:Object.fromEntries(MOTS.map(m=>[m,+((A.P||P0())[m]).toFixed(3)])), final:A.final||null, menos:A.menos||null, palavra:A.palavra||null, momento:A.momento||null, pistas:A.pistas||[], hist:A.hist, rodadas:A.rodadas, pulou:!!A.pulou, quando:rgHoje()};
  RG.atual=null; RG.ultimo=n; rgSalva(); vibra([12,40,20]); somVitoria&&somVitoria(); rgAberto=n;
  rgTopo();
  mostra(`<div class="rot">Mais um número na sua régua</div>
    <div class="rg-tit" style="font-size:44px;margin-top:8px;color:${COR_NUM[n]}">${n}<small>${NOMES[n]}</small></div>
    ${rgReforco(n,A)}
    ${rgEstrela(true)}${rgBarra()}
    <h2 style="margin-top:10px">${rgReguaPronta()?"Você completou a sua régua (do 10 ao 5).":A.pulou?"Tudo bem pular o 0.":"Seu "+n+" está na régua. Veja a bolinha acesa:"}</h2>
    ${rgEscada({nova:n})}
    <div id="rgbauarea"><button class="rg-bau" type="button" onclick="rgAbreBau(this)"><span>🎁</span>Abrir o baú surpresa</button></div>
    <div style="margin-top:12px"><button class="btn" type="button" onclick="click();rgTela()">Seguir</button></div>`); }

/* Bloco 3: a Brisa dá uma frase curta de reforço sobre o que ela fez, ao fechar cada número */
const REFORCO = {
 10:"Você escolheu com calma. Seu 10 está guardado!",
 9:"Muito bem! Agora eu sei o que é quase perfeito para você.",
 8:"Mais um degrau! Seu 8 já tem nome.",
 7:"Isso! Você está montando a régua do seu jeito.",
 6:"Ótimo. Até as coisas leves contam, e você percebeu.",
 5:"Perfeito. Saber o que é \"tanto faz\" também me ajuda muito.",
 4:"Pronto. Conhecer o que é sem graça também é se conhecer.",
 3:"Feito! O que te chateia também tem lugar na régua.",
 2:"Obrigada por olhar para isso com coragem.",
 1:"Você foi até o fim. Isso ajuda muito.",
 0:"Pronto. O mais difícil ficou para trás."
};
function rgReforco(n,A){ const t = A&&A.pulou ? "Tudo bem pular. A régua continua sua." : (A&&A.pistas&&A.pistas.length ? "Você contou do seu jeito, e isso vale muito. Seu "+n+" está guardado!" : REFORCO[n]);
  return `<div class="rg-reforco"><img src="${BRISA}" alt="Brisa"><p><small>Brisa</small>${esc(t)}</p></div>`; }

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
    <div><button class="btn sec" style="margin-top:14px" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button></div>
    ${rgPreviaBotoes()}</div>`); }
/* notificação só se a pessoa pedir. SERVIDOR: o envio do lembrete precisa do servidor; por enquanto, só guarda o pedido. */
window.rgLembrete = function(){ click(); RG.lembrete=true; rgSalva();
  try{ if(window.Notification && Notification.permission==="default") Notification.requestPermission().catch(()=>{}); }catch(e){}
  rgFimDia(); };

/* =================== BLOCO D · TELA FINAL DA FASE 3 (neutra) =================== */
/* Não revela o que a Brisa descobriu. O palpite da Brisa e "Suas pistas" ficam para a Fase 4. */
function rgFimFase(){ rgTopo("régua montada");
  mostra(`<div class="rot">Fase 3 · A sua régua</div>${rgEstrela()}${rgBarra()}
    <h2>Sua régua está montada, do 10 ao 5.</h2><p class="sub">Do 4 ao 0 chega depois. Enquanto isso, a Fase 3 continua no mapa.</p>
    ${rgEscada()}
    <div style="margin-top:14px"><button class="btn" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button></div>
    ${rgPreviaBotoes()}`); }
/* 27/11 · prévia: depois da régua montada, segue para as perguntas dos motivos (análise da função), que já existiam no app */
window.rgVaiMotivos = function(){ click&&click(); try{ if(typeof f3ExemploFase1==="function") f3ExemploFase1(); }catch(e){}
  f3Carrega(); F3.intro=true; f3Salva(); entrou=true; pos=R.length-1;
  if(!document.getElementById("rgSemCerebro")){ const st=document.createElement("style"); st.id="rgSemCerebro"; st.textContent="#f3cerebro{display:none!important}"; document.head.appendChild(st); }
  f3Tela(); };

/* =================== BLOCO 5 (27/11) · O MAPA DA FASE 3: RITMO E ORDEM =================== */
/* Ordem: abertura (vídeo 3 da Brisa) → dia 1 "Coloque na régua" (e a régua) → régua e teste de imagens em DIAS ALTERNADOS,
   uma mecânica por dia → depois Mecânica 2 (Motivos) e Mecânica 3 (Validação, ainda a decidir).
   Com TRAVAS_LIGADAS = false, tudo fica liberado para teste. */
const CURINGAS = ["Qual cheiro te leva para a infância?","Que música te faz dançar sozinha?","Qual comida tem gosto de casa de vó?","Que paisagem você queria ver da janela hoje?","Que som te acalma na hora de dormir?","Qual sobremesa você nunca recusa?","Onde você tiraria um cochilo agora?","Qual cor te deixa de bom humor?","Qual foi o último pôr do sol que você parou para ver?","Qual toque te acalma num dia difícil?"];
const tiOk = () => typeof tiEstado==="function" ? tiEstado() : {diasFeitos:0,pronto:false,hojeFeito:false,tipo:null};
function rgMotivosOk(){ try{ f3Carrega(); return !!F3.descoberta; }catch(e){ return false; } }
/* qual mecânica é a de hoje (só vale com as travas ligadas) */
function rgMecDoDia(){ const d=rgDia(), rOk=rgReguaPronta(), tOk=tiOk().pronto;
  if(d===1 && !rOk) return "regua";
  if(rOk && tOk) return "motivos";
  if(rOk) return "teste"; if(tOk) return "regua";
  return d%2===0 ? "teste" : "regua"; }
function rgCuringa(){ const d=rgDia(), q=CURINGAS[(d-1)%CURINGAS.length]; RG.curinga=RG.curinga||{}; return {d,q,r:RG.curinga[d]}; }
window.f3Mapa3 = function(){ rgCarrega(); rgFechaModal(); entrou=true; pos=R.length-1; try{ localStorage.setItem("7e_fase3_ativa","1"); }catch(e){}
  if(!RG.intro) return desenha();
  rgTopo("mapa da fase 3");
  const t=tiOk(), rOk=rgReguaPronta(), mOk=rgMotivosOk(), hojeMec=rgMecDoDia(), feitosR=JOGAVEIS.filter(n=>RG.feitos[n]!=null).length;
  const aberta = k => LIVRE || k===hojeMec || (k==="motivos" && rOk && t.pronto);
  const cur=rgCuringa();
  const item=(k,num,tit,sub,acao,ok,extra)=>{ const ab=aberta(k)&&!ok; const hoje=!LIVRE&&k===hojeMec&&!ok;
    return `<button class="f3m-it${ok?" ok":""}${ab?"":" fecha"}${hoje?" hoje":""}" type="button" ${ab||ok?`onclick="${acao}"`:"disabled"}>
      <span class="f3m-n">${ok?"✓":num}</span><span class="f3m-t"><b>${tit}</b><small>${sub}</small></span>${hoje?`<em>hoje</em>`:!ab&&!ok?`<em>🔒</em>`:""}${extra||""}</button>`; };
  const fimOk = rOk && t.pronto && mOk;
  mostra(`<div class="rot">Fase 3 · dia ${rgDia()}</div>
    <h2>O mapa da Fase 3</h2>
    <p class="sub">${LIVRE?"Escolha por onde seguir.":"Uma atividade por dia. A de hoje está marcada."}</p>
    ${LIVRE&&PREVIA?`<p class="rg-nota">Só na prévia: travas desligadas, tudo liberado para teste.</p>`:""}
    <div class="f3m-cur"><small>Pergunta curinga do dia</small><b>${esc(cur.q)}</b>
      ${cur.r?`<p>${cur.r.pulou?"Hoje você pulou. Amanhã tem outra.":"Sua resposta: “"+esc(cur.r.texto)+"”"}</p>`:`<div class="rg-tres">${RG.texto===false?"":`<button type="button" onclick="rgCuringaResp()">✎ Responder</button>`}<button type="button" onclick="rgCuringaPula()">Pular</button></div>`}</div>
    <div class="f3m">
      ${item("regua","1","A sua régua", rOk?"Pronta, do 10 ao 5":(rgColFeito()?feitosR+" de 6 números (do 10 ao 5)":"Começa pelo “Coloque na régua”"),"click();rgTela()",rOk)}
      ${item("teste","2","Teste de imagens", t.pronto?"Pronto · seu tipo saiu":"Dia "+Math.min(4,t.diasFeitos+1)+" de 4 · 5 duplas","click();tiAbre()",t.pronto)}
      ${item("motivos","3","Motivos", mOk?"Pronto":"Por que você gosta do que gosta","rgVaiMotivos()",mOk)}
      <div class="f3m-it fecha"><span class="f3m-n">4</span><span class="f3m-t"><b>Validação</b><small>Em breve</small></span><em>🔒</em></div>
    </div>
    ${fimOk||LIVRE&&PREVIA?`<div style="margin-top:16px"><button class="btn${fimOk?"":" sec"}" type="button" onclick="click();rgFimFase3()">${fimOk?"Ver o fim da Fase 3":"Ver o fim da Fase 3 (só na prévia)"}</button></div>`:""}
    ${PREVIA?`<div class="rg-previa"><small class="sub" style="margin:0;font-size:14px">Só na prévia: resumos das fases anteriores</small>
      <button class="linkflow" type="button" onclick="rgVerResumo(1)">Ver o resumo da Fase 1</button>
      <button class="linkflow" type="button" onclick="rgVerResumo(2)">Ver o resumo da Fase 2</button>
      ${TESTE?`<button class="linkflow" type="button" onclick="tiCompletaTeste();f3Mapa3()">Preencher o teste de imagens inteiro</button>`:""}</div>`:""}
    ${rgPreviaBotoes()}`); };
window.rgCuringaResp = function(){ click(); if(RG.texto===true) return rgCaixaCuringa();
  rgModal(`<h3>Antes de responder</h3><p>O que você escrever ou falar fica guardado só neste celular e ajuda o app a te conhecer melhor.</p>
    <div class="col"><button class="btn" type="button" onclick="rgCuringaTexto(true)">Aceito</button><button class="btn sec" type="button" onclick="rgCuringaTexto(false)">Prefiro só escolher</button></div>`); };
window.rgCuringaTexto = function(sim){ click(); RG.texto=!!sim; rgSalva(); if(sim) return rgCaixaCuringa(); rgFechaModal(); f3Mapa3(); };
window.rgCaixaCuringa = function(){ const cur=rgCuringa(), pode=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  rgModal(`<h3>${esc(cur.q)}</h3>${pode?`<button class="mic" id="rgmic" type="button" onclick="rgFala()">🎤 Falar</button>`:`<p style="font-size:15px;color:var(--azul)">Para falar, use o microfone do teclado do celular.</p>`}
    <textarea id="rgtxt" maxlength="280" placeholder="Escreva aqui…"></textarea>
    <div class="col" style="margin-top:12px"><button class="btn" type="button" onclick="rgCuringaSalva()">Pronto</button><button class="rg-volta" type="button" onclick="rgFechaModal()">voltar</button></div>`); };
window.rgCuringaSalva = function(){ const t=document.getElementById("rgtxt"), v=String(t&&t.value||"").replace(/\s+/g," ").trim().slice(0,280);
  if(!v) return rgAviso("Escreva ou fale alguma coisa, ou toque em voltar."); click(); const cur=rgCuringa();
  RG.curinga[cur.d]={q:cur.q,texto:v,quando:rgHoje()}; (RG.pistas=RG.pistas||[]).push({tipo:"curinga",q:cur.q,texto:v,dia:rgHoje()}); rgSalva();
  rgFechaModal(); rgAviso("Guardei. Isso vira uma pista para mim."); f3Mapa3(); };
window.rgCuringaPula = function(){ click(); const cur=rgCuringa(); RG.curinga[cur.d]={q:cur.q,pulou:true}; rgSalva(); f3Mapa3(); };
/* prévia: abrir o resumo do fim da Fase 1 ou da Fase 2 (com as respostas de exemplo, se não houver as dela) */
window.rgVerResumo = function(f){ click(); rgExemploF1(); try{ localStorage.removeItem("7e_fase3_ativa"); }catch(e){}
  const i=R.findIndex(p=>p.t===(f===1?"fim1":"grafico")); if(i<0) return; pos=i; entrou=true; const bb=document.getElementById("rgbarra"); desenha(); };

/* ---------- FIM DA FASE 3: vídeo-resumo da Brisa + o tipo divertido com o cartão + a porta da Fase 4 "em breve" ---------- */
function destFase3(){ return [10,9,8].map(n=>{ const e=rgEscolhaDe(n); return e?{t:"Seu "+n+": "+cap(e)}:null; }).filter(Boolean); }
window.rgFimFase3 = function(){ rgTopo("fase 3 completa"); const temTipo=typeof tiResultadoHTML==="function" && tiResultadoHTML();
  mostra(`<div class="rot pisca2">Fase 3 completa</div>
    ${resumoBrisa(3,destFase3(),"Na sua régua")}
    ${temTipo?`<h2 style="margin-top:6px">O seu tipo no teste de imagens</h2>${temTipo}<div class="ti-com"><button class="btn" type="button" onclick="tiCompartilha()">Compartilhar o meu tipo</button></div>`:""}
    <div class="porta3" style="margin-top:22px"><div class="pt-cena"><div class="pt-luz" aria-hidden="true"></div><img class="pt-img" src="${NO_SITE?"/app/":""}porta-fase3.webp" alt="Uma porta mágica trancada, com luz dourada escapando pela fresta" width="720" height="892"></div>
      <div class="pt-rot">Fase 4 · em breve</div><h2>A próxima porta já tem o seu nome.</h2>
      <p class="pt-txt">Na Fase 4, você confere o que eu percebi em todas as fases.</p></div>
    <div style="margin-top:14px"><button class="btn sec" type="button" onclick="click();f3Mapa3()">Voltar ao mapa da Fase 3</button></div>`, c=>{ if(typeof ligaResumo==="function") ligaResumo(c); vibra([10,40,10]); somVitoria&&somVitoria(); }); };
/* depois dos Motivos, o "Seguir para a Fase 4" leva de volta ao mapa (a Fase 4 nova ainda não começou) */
if(F3_ABERTA && typeof f4Abre==="function"){ const f4Antigo=f4Abre; window.f4Abre = function(){ if(RG&&RG.intro) return f3Mapa3(); return f4Antigo(); }; }

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
  else if(RG.intro) window.f3Abre(); else window.trava3(); }
})();
