/* Sala da Prévia (só aparece fora do site oficial): atalhos para testar e as decisões do Daniel sobre as mudanças de 06/11.
   Cada decisão fica guardada neste aparelho (j7sala) e vira um texto para copiar e mandar ao Claude.
   As escolhas "ao vivo" (desenho do Ajude, card sumindo, carta virando, nomes dos céus) mudam a prévia na hora (j7opc). */
(function(){
  var OURO='#F5C542';
  function ler(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')||d;}catch(e){return d;}}
  function grava(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var R=ler('j7sala',{}),O=ler('j7opc',{});
  var VAL=['✓ Validado','✎ Revisar'];
  var Q=[
   {id:'porta',t:'1. Porta de entrada: "Você já fez a Fase 1?" (só nas Fases 2 e 3)',d:'A Fase 1 começa direto; na abertura dela tem "Já fez a Fase 1? Ir direto para a Fase 2". Nas Fases 2 e 3: Não → faz a Fase 1 e segue para a Fase 2. Sim → refazer a Fase 1 (com comparação) ou seguir.',tipo:'val',rev:['Pular a pergunta quando o aparelho já sabe a resposta','Tirar o "Ir direto para a Fase 2" da abertura da Fase 1','Mudar os textos da porta'],ver:'f2'},
   {id:'f3sem',t:'2. Quem entra pela Fase 3 sem ter feito a Fase 1, depois da Fase 1 vai para…',d:'Você pediu "segue direto para a Fase 2". Hoje está assim.',op:['A Fase 2 (como está)','Volta para a Fase 3']},
   {id:'espelho',t:'3. Fase 2 · Espelho',d:'Mostra as 7 favoritas da Fase 1: "Ainda sou eu / Mudou um pouco / Mudou muito".',tipo:'val',rev:['Mostrar a imagem do mapa em vez das 7 favoritas','Se "mudou muito", oferecer refazer a Fase 1','Trocar os textos das 3 respostas'],ver:'f2'},
   {id:'aconteceu',t:'4. Fase 3 · Aconteceu?',d:'Mostra uma carta dourada da Fase 1 (de preferência uma que a pessoa marcou "Tem"): "Aconteceu / Às vezes / Não".',tipo:'val',rev:['Mostrar 2 cartas em vez de 1','A pessoa escolhe qual carta','Trocar os textos das 3 respostas'],ver:'f3'},
   {id:'ceus',t:'5. Céus de luz (no começo e no fim)',d:'5 céus em Linha de luz no lugar do 0 a 10.',tipo:'val',rev:['Tirar os nomes, só o desenho','Céus maiores, um embaixo do outro','Trocar algum dos 5 céus'],viva:function(v){O.ceuNomes=v==='Tirar os nomes, só o desenho'?'nao':'sim';},ver:'ceu'},
   {id:'nota',t:'6. A nota guardada por trás de cada céu',d:'Do céu fechado ao radiante.',op:['2 · 4 · 6 · 8 · 10 (como está)','0 · 2,5 · 5 · 7,5 · 10','1 · 2 · 3 · 4 · 5']},
   {id:'vira',t:'7. Como a carta dourada vira?',d:'Ela aparece ao terminar cada sentido.',op:['Vira sozinha (como está)','A pessoa toca para virar'],viva:function(v){O.cartaVira=v.indexOf('toca')>=0?'toque':'sozinha';},ver:'carta'},
   {id:'pergunta',t:'8. Na carta, a pergunta "Isso tem a ver com você?"',d:'Tem / Em parte / Não. É o que vai para a planilha no lugar da nota de 0 a 10 das "5 coisas".',op:['Manter (como está)','Tirar a pergunta'],viva:function(v){O.cartaPergunta=v.indexOf('Tirar')===0?'nao':'sim';},ver:'carta'},
   {id:'viz',t:'9. O que vai se preenchendo no "Ajude a melhorar a Jornada"?',d:'Escolha uma. Toque em "Escolho esta" e a prévia já muda.',tipo:'viz',ver:'ajude'},
   {id:'sumir',t:'10. O card escolhido sumindo',d:'Teste tocando nas imagens de um sentido.',op:['Voa para a bandeja (como está)','Encolhe e some','Fica apagado na grade, com o número'],viva:function(v){O.sumir=v.indexOf('Voa')===0?'voa':v.indexOf('Encolhe')===0?'encolhe':'fica';},ver:'sen'},
   {id:'contraste',t:'11. Contraste do card em relação ao fundo',d:'Fundo do card mais claro, borda mais forte e sombra.',tipo:'val',rev:['Mais claro ainda','Borda dourada fina','Nome da opção maior'],ver:'sen'},
   {id:'quadro',t:'12. Sala do Quadro: qual composição vira a "imagem dos meus 7 sentidos"?',d:'Todas juntam as 7 favoritas da pessoa (uma de cada sentido) com elementos das pinturas, sem copiar obras. Escolha a principal e marque "Não quero" nas que você não quer ver.',tipo:'quadro',ver:'fim'},
   {id:'qregra',t:'13. Quem escolhe o pintor do quadro?',d:'Hoje a pessoa vê o quadro e pode trocar o pintor numa fileira de 7 miniaturas.',op:['A pessoa escolhe no fim, entre os 7 (como está)','Sempre o que eu escolhi na 12','O pintor da favorita da Visão'],viva:function(v){O.quadroRegra=v.indexOf('A pessoa')===0?'pessoa':v.indexOf('Sempre')===0?'fixo':'visao';},ver:'fim'},
   {id:'qrevela',t:'14. Como o quadro aparece no fim?',d:'',op:['Aos poucos, como uma pincelada (como está)','A pessoa toca para revelar','Aparece pronto'],viva:function(v){O.quadroRevela=v.indexOf('Aos poucos')===0?'pincelada':v.indexOf('toca')>=0?'toque':'pronto';},ver:'fim'},
   {id:'qcores',t:'15. As 7 cores dos sentidos dentro do quadro',d:'Um anel fino na cor do sentido em volta de cada favorita.',op:['Manter os anéis coloridos (como está)','Sem as cores, só o pintor'],viva:function(v){O.quadroCores=v.indexOf('Sem')===0?'nao':'sim';},ver:'fim'},
   {id:'qassina',t:'16. Assinatura no canto do quadro',d:'',op:['Primeiro nome + ano (como está)','Sem assinatura'],viva:function(v){O.quadroAssina=v.indexOf('Sem')===0?'nao':'sim';},ver:'fim'},
   {id:'qespelho',t:'17. Na chegada da Fase 2 e no Espelho, mostrar o quadro?',d:'Quem termina a Fase 1 entra direto na Fase 2 e vê "o seu quadro veio com você".',op:['Sim, o quadro e as favoritas (como está)','Só as 7 favoritas, como antes'],viva:function(v){O.quadroEspelho=v.indexOf('Só')===0?'nao':'sim';},ver:'chega'}];
  var css='.sp7b{position:fixed;right:10px;top:8px;z-index:80;font:800 13px Manrope,system-ui,sans-serif;background:'+OURO+';color:#0A0F24;border:0;border-radius:999px;padding:8px 12px;box-shadow:0 6px 24px rgba(0,0,0,.5);cursor:pointer}'+
   '.sp7{position:fixed;inset:0;z-index:85;overflow:auto;background:#070B1C;color:#F4F1EA;font:16px/1.5 Manrope,system-ui,sans-serif}.sp7 .w{max-width:620px;margin:0 auto;padding:18px 16px 80px}'+
   '.sp7 h1{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:28px;margin:4px 0}.sp7 .k{font-size:12px;letter-spacing:.1em;font-weight:800;text-transform:uppercase;color:'+OURO+'}'+
   '.sp7 .m{color:#AEB5D6;font-size:14px}.sp7 .q{background:#111A3D;border:1px solid #26315F;border-radius:16px;padding:14px;margin:12px 0}.sp7 .q b{display:block;font-size:16px}'+
   '.sp7 .o{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}.sp7 button.c{font:inherit;font-weight:700;font-size:14px;border:1px solid #3B4C8F;background:#1B2654;color:#F4F1EA;border-radius:999px;padding:9px 13px;cursor:pointer;min-height:42px}'+
   '.sp7 button.c.pri{background:'+OURO+';color:#0A0F24;border-color:'+OURO+'}.sp7 button.c.nq{background:transparent;border-style:dashed;color:#AEB5D6}.sp7 button.c.v{border-color:'+OURO+';color:'+OURO+'}'+
   '.sp7 .at{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 4px}.sp7 .vz{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.sp7 .vzi{background:#0D1430;border:1px solid #26315F;border-radius:14px;padding:8px;text-align:center;font-weight:800;font-size:14px}.sp7 .vzi.nq{opacity:.35}'+
   '.sp7 .vzi .o{justify-content:center;margin-top:6px}.sp7 .r{font-size:14px;border-top:1px solid #26315F;padding:8px 0;display:flex;gap:8px;align-items:flex-start}.sp7 .r span{flex:1}.sp7 textarea{width:100%;font:inherit;font-size:13px;background:#0D1430;color:#F4F1EA;border:1px solid #26315F;border-radius:10px;padding:8px}'+
   '.sp7 .lnk{font:inherit;background:none;border:0;color:'+OURO+';text-decoration:underline;cursor:pointer;padding:0;font-size:13px}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var bt=document.createElement('button');bt.className='sp7b';document.body.appendChild(bt);
  var pn=null,abertoRev={},vzDemo=null;
  function n(){return Q.filter(function(q){return R[q.id];}).length;}
  function rot(){bt.textContent='🚪 Sala da prévia · '+n()+' de '+Q.length;}rot();
  function salvaTudo(){grava('j7sala',R);grava('j7opc',O);rot();if(typeof aplicaSumir==='function')aplicaSumir();}
  function E(s){return P7.esc(s);}
  function texto(){return 'Sala da Prévia · Jornada (06/11) · com a Sala do Quadro\n'+Q.map(function(q){var r=R[q.id];return q.t+'\n→ '+(r?r.v+(r.rev&&r.rev.length?' ('+r.rev.join('; ')+')':'')+(r.obs?' · obs: '+r.obs:'')+(r.nq&&r.nq.length?' · não quero: '+r.nq.join(', '):''):'(sem resposta)');}).join('\n');}
  function qHTML(q){var h='<div class="q" data-q="'+q.id+'"><b>'+E(q.t)+'</b><div class="m">'+E(q.d)+'</div>';
    if(q.tipo==='val'){h+='<div class="o">'+VAL.map(function(v,i){return '<button class="c '+(i===0?'v':'')+'" data-s="'+(i===0?'ok':'rev')+'">'+v+'</button>';}).join('')+'<button class="c nq" data-s="nq">Não quero</button></div>';
      if(abertoRev[q.id])h+='<div class="m" style="margin-top:10px">O que corrigir? (pode marcar mais de uma)</div><div class="o">'+q.rev.map(function(x){var on=(abertoRev[q.id].sel||[]).indexOf(x)>=0;return '<button class="c '+(on?'pri':'')+'" data-rv="'+E(x)+'">'+E(x)+'</button>';}).join('')+'</div><textarea rows="2" placeholder="Quer explicar? (opcional)" data-obs>'+E(abertoRev[q.id].obs||'')+'</textarea><div class="o"><button class="c pri" data-s="revok">Guardar revisão</button></div>';}
    else if(q.tipo==='viz'){h+='<div class="vz">'+Object.keys(P7.VIZ).map(function(k){var nq=(R['viz_nq']||[]).indexOf(k)>=0;return '<div class="vzi '+(nq?'nq':'')+'"><div data-vzd="'+k+'">'+P7.viz(k,vzDemo&&vzDemo.k===k?vzDemo.n:4,vzDemo&&vzDemo.k===k?vzDemo.n-1:-1)+'</div>'+E(P7.VIZ[k].nome)+'<div class="o"><button class="c pri" data-vz="'+k+'">Escolho esta</button><button class="c nq" data-vznq="'+k+'">Não quero</button></div><button class="lnk" data-vzv="'+k+'">ver enchendo</button></div>';}).join('')+'</div>';}
    else if(q.tipo==='quadro'){var JD=jDemo(),nq=R.quadro_nq||[];h+='<div class="vz">'+Object.keys(Q7.ESTILOS).map(function(k){var E2=Q7.ESTILOS[k],no=nq.indexOf(k)>=0,on=(O.quadro||'klimt')===k;return '<div class="vzi '+(no?'nq':'')+'" style="'+(on?'border-color:'+OURO+';box-shadow:0 0 14px rgba(245,197,66,.4)':'')+'"><div style="border-radius:10px;overflow:hidden">'+Q7.quadro(k,JD,{semCor:O.quadroCores==='nao'}).replace('<svg ','<svg style="display:block;width:100%;height:auto" ')+'</div>'+E(E2.nome)+'<div class="m" style="font-weight:600;font-size:12px">'+E(E2.pintor)+' · '+E(E2.frase)+'</div><div class="o"><button class="c pri" data-qd="'+k+'">Escolho esta</button><button class="c nq" data-qdnq="'+k+'">Não quero</button></div></div>';}).join('')+'</div>';}
    else h+='<div class="o">'+q.op.map(function(x){return '<button class="c" data-op="'+E(x)+'">'+E(x)+'</button>';}).join('')+'<button class="c nq" data-op="Não quero">Não quero</button></div>';
    if(q.ver)h+='<div style="margin-top:8px"><button class="lnk" data-ver="'+q.ver+'">ver na prévia →</button></div>';
    return h+'</div>';}
  function desenha(){if(!pn)return;var y=pn.scrollTop;var pend=Q.filter(function(q){return !R[q.id];}),feitas=Q.filter(function(q){return R[q.id];});
    pn.innerHTML='<div class="w"><div style="display:flex;align-items:center"><div class="k" style="flex:1">Prévia · branch imagens-adultas</div><button class="c" data-x="1" style="font:inherit;font-weight:800;background:none;border:1px solid #3B4C8F;color:#F4F1EA;border-radius:999px;padding:6px 12px;cursor:pointer">Fechar ✕</button></div>'+
     '<h1>Sala da Prévia</h1><div class="m">Responda e a pergunta sai da lista. O que tiver "ver na prévia" leva direto para a tela.</div>'+
     '<div class="q"><b>Atalhos para testar</b><div class="at">'+
     [['zero','Começar do zero (abertura da Fase 1)'],['ceu','Céus de luz'],['sen','Um sentido (card sumindo)'],['carta','Carta dourada virando'],['fim','Mapa final com as 7 cartas'],['refaz','Mapa final com "Antes × agora"'],['ajude','Ajude a melhorar'],['f2','Porta da Fase 2 (Espelho)'],['f3','Porta da Fase 3 (Aconteceu?)'],['chega','Chegada na Fase 2 com o quadro']].map(function(a){return '<button class="c" data-ver="'+a[0]+'">'+a[1]+'</button>';}).join('')+'</div></div>'+
     (pend.length?pend.map(qHTML).join(''):'<div class="q"><b>Todas respondidas ✓</b><div class="m">Copie e cole para o Claude, ou só me avise no chat.</div></div>')+
     '<div class="q"><b>Suas decisões ('+feitas.length+' de '+Q.length+')</b>'+feitas.map(function(q){var r=R[q.id];return '<div class="r"><span>'+E(q.t.replace(/^\d+\. /,''))+'<br><b style="display:inline;color:'+OURO+'">'+E(r.v)+'</b>'+(r.rev&&r.rev.length?' · '+E(r.rev.join('; ')):'')+(r.obs?' · “'+E(r.obs)+'”':'')+'</span><button class="lnk" data-muda="'+q.id+'">mudar</button></div>';}).join('')+
     '<div class="o"><button class="c pri" data-copia="1">Copiar minhas decisões</button><button class="c nq" data-limpa="1">Apagar tudo</button></div></div></div>';
    pn.scrollTop=y;}
  function abre(){if(pn)return;pn=document.createElement('div');pn.className='sp7';document.body.appendChild(pn);document.documentElement.style.overflow='hidden';desenha();
    pn.addEventListener('click',clique);pn.addEventListener('input',function(e){var t=e.target;if(t.hasAttribute('data-obs')){var q=t.closest('[data-q]').dataset.q;abertoRev[q].obs=t.value;}});}
  function fecha(){if(!pn)return;pn.remove();pn=null;document.documentElement.style.overflow='';}
  function responde(q,v,extra){R[q.id]=Object.assign({v:v,em:new Date().toISOString()},extra||{});if(q.viva&&v!=='Não quero')q.viva(v);salvaTudo();desenha();}
  /* deixa uma Fase 1 completa guardada (para testar o fim e as portas das Fases 2 e 3) */
  function enche(antes){J.esc={};SEN.forEach(function(s,k){var L=s[5].map(function(t){return t.n;});var o=(k*2)%L.length;J.esc[s[0]]=L.slice(o).concat(L.slice(0,o)).slice(0,7);});
    J.cartas={};SEN.forEach(function(s){var c=P7.carta(s[0],J.esc[s[0]],8000+Math.random()*30000);c.sig=J.esc[s[0]].join('|');c.r=['tem','parte','tem'][Math.floor(Math.random()*3)];J.cartas[s[0]]=c;});
    J.ok=true;J.avatar=J.avatar||'Onda';J.ceu0=1;J.ceu1=3;J.notaIni=4;J.nota=8;
    if(antes){J.ant={esc:{},ceu1:2};SEN.forEach(function(s,k){var L=s[5].map(function(t){return t.n;});var o=(k*2+3)%L.length;J.ant.esc[s[0]]=L.slice(o).concat(L.slice(0,o)).slice(0,7);});}else delete J.ant;}
  function jDemo(){if(P7.fase1Ok(J))return J;var d={id:'demo',nome:'Você',esc:{}};SEN.forEach(function(s,k){var L=s[5].map(function(t){return t.n;});d.esc[s[0]]=[L[(k*3+1)%L.length]];});return d;}
  function ver(k){fecha();try{sessionStorage.setItem('j7porta1','1');}catch(e){}if(typeof fechaCarta==='function')fechaCarta();
    if(k==='zero'){try{localStorage.removeItem('jornada7');localStorage.removeItem('jornada7porta');sessionStorage.clear();}catch(e){}location.reload();return;}
    if(k==='f1'){try{sessionStorage.removeItem('j7porta1');}catch(e){}J.portaVolta=J.tela;J.tela='porta';J.porta='p1';salva();render();scrollTo(0,0);return;}
    if(k==='ceu'){J.ok=true;J.avatar=J.avatar||'Onda';J.ceu0=null;J.tela='ceu0';salva();render();scrollTo(0,0);return;}
    if(k==='sen'){J.ok=true;J.avatar=J.avatar||'Onda';J.tela='sen';J.i=1;J.esc.aud=[];salva();render();scrollTo(0,0);return;}
    if(k==='carta'){if(!P7.fase1Ok(J))enche(false);J.tela='sen';J.i=2;salva();render();var id=SEN[2][0];J.cartas[id].r=null;abreCarta(id,'seq');return;}
    if(k==='chega'){if(!P7.fase1Ok(J)){enche(false);salva();}P7.porta({fase:2,inicio:'chega',simula:true});return;}
    if(k==='fim'||k==='refaz'){try{QVISTO=false;}catch(e){}enche(k==='refaz');J.tela='fim';salva();render();scrollTo(0,0);return;}
    if(k==='ajude'){if(!P7.fase1Ok(J))enche(false);J.av={};J.ajNovo=-1;J.tela='ajude';salva();render();scrollTo(0,0);return;}
    if(k==='f2'||k==='f3'){if(!P7.fase1Ok(J)){enche(false);salva();}P7.porta({fase:k==='f2'?2:3,simula:true});return;}}
  function clique(e){var b=e.target.closest('button');if(!b)return;var qe=b.closest('[data-q]'),q=qe&&Q.find(function(x){return x.id===qe.dataset.q;});
    if(b.dataset.x){fecha();return;}
    if(b.dataset.ver){ver(b.dataset.ver);return;}
    if(b.dataset.copia){var t=texto();try{navigator.clipboard.writeText(t).then(function(){P7.aviso('Decisões copiadas ✓ Cole no chat com o Claude.');});}catch(x){prompt('Copie:',t);}return;}
    if(b.dataset.limpa){R={};abertoRev={};salvaTudo();desenha();return;}
    if(b.dataset.muda){delete R[b.dataset.muda];salvaTudo();desenha();return;}
    if(!q)return;
    if(b.dataset.op){responde(q,b.dataset.op);return;}
    if(b.dataset.s==='ok'){responde(q,'Validado');return;}
    if(b.dataset.s==='nq'){responde(q,'Não quero');return;}
    if(b.dataset.s==='rev'){abertoRev[q.id]=abertoRev[q.id]||{sel:[]};desenha();return;}
    if(b.dataset.rv){var a=abertoRev[q.id],i=a.sel.indexOf(b.dataset.rv);if(i>=0)a.sel.splice(i,1);else a.sel.push(b.dataset.rv);desenha();return;}
    if(b.dataset.s==='revok'){var a2=abertoRev[q.id]||{sel:[]};if(q.viva)a2.sel.forEach(function(x){q.viva(x);});responde(q,'Revisar',{rev:a2.sel.slice(),obs:a2.obs||''});delete abertoRev[q.id];return;}
    if(b.dataset.qd){O.quadro=b.dataset.qd;delete J.quadro;salva();responde(q,Q7.ESTILOS[b.dataset.qd].nome+' ('+Q7.ESTILOS[b.dataset.qd].pintor+')',{nq:(R.quadro_nq||[]).map(function(k){return Q7.ESTILOS[k].pintor;})});return;}
    if(b.dataset.qdnq){var LQ=R.quadro_nq=R.quadro_nq||[];if(LQ.indexOf(b.dataset.qdnq)<0)LQ.push(b.dataset.qdnq);if(LQ.length>=7)responde(q,'Não quero nenhum');else{salvaTudo();desenha();}return;}
    if(b.dataset.vz){O.viz=b.dataset.vz;responde(q,P7.VIZ[b.dataset.vz].nome,{nq:(R.viz_nq||[]).map(function(k){return P7.VIZ[k].nome;})});return;}
    if(b.dataset.vznq){var L=R.viz_nq=R.viz_nq||[];if(L.indexOf(b.dataset.vznq)<0)L.push(b.dataset.vznq);if(L.length>=4)responde(q,'Não quero nenhuma');else{salvaTudo();desenha();}return;}
    if(b.dataset.vzv){var k=b.dataset.vzv;vzDemo={k:k,n:0};var tm=setInterval(function(){vzDemo.n++;var el=pn&&pn.querySelector('[data-vzd="'+k+'"]');if(el)el.innerHTML=P7.viz(k,vzDemo.n,vzDemo.n-1);if(vzDemo.n>=7){clearInterval(tm);setTimeout(function(){vzDemo=null;},900);}},650);return;}}
  bt.addEventListener('click',abre);
})();
