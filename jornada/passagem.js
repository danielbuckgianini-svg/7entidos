/* Passagem das fases da Jornada dos 7entidos (06/11/2026, prévia na branch imagens-adultas).
   Reúne o que vale para todas as fases:
   - Porta de entrada: "Você já fez a Fase 1?" (Não → Fase 1 e depois Fase 2 · Sim → refazer a Fase 1 ou seguir)
   - Validação na entrada: Fase 2 "Espelho" (mapa anterior) · Fase 3 "Aconteceu?" (uma carta dourada anterior)
   - Céus de luz: 5 céus em Linha de luz no lugar da nota de 0 a 10 (a nota fica guardada por trás)
   - Cartas douradas: 1 descoberta por sentido, que vira ao terminar o sentido
   - Desenhos que se preenchem no "Ajude a melhorar a Jornada"
   As escolhas da porta ficam numa chave própria (jornada7porta), para nenhuma página apagar o que a outra gravou.
   Sem sequência de dias, sem contagem regressiva e sem sorteio. */
(function(){
  var OURO='#F5C542',COR=['#FFD23F','#5AB8FF','#FF8A5C','#7DDB8B','#FF6FA3','#A98BFF','#3FE0D0'];
  var IDS=['mapa','aud','tato','olf','pal','equi','corpo'];
  var NOMES=['Visão','Audição','Tato','Olfato','Paladar','Equilíbrio','Noção do corpo'];
  var PREVIA=!/(^|\.)7entidos\.com\.br$/.test(location.hostname);
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function lerJ(){try{return JSON.parse(localStorage.getItem('jornada7')||'null');}catch(e){return null;}}
  function fase1Ok(J){J=J||lerJ();return !!(J&&J.esc&&IDS.every(function(id){return (J.esc[id]||[]).length>=7;}));}
  function opc(){try{return JSON.parse(localStorage.getItem('j7opc')||'{}');}catch(e){return {};}}

  /* ---------- estilo ---------- */
  var css=''+
  '.p7v{position:fixed;inset:0;z-index:60;overflow:auto;background:radial-gradient(900px 600px at 80% -10%,#1a2552 0%,#0E1533 40%,#0A0F24 75%),#0A0F24;color:#F4F1EA;font:17px/1.5 Manrope,system-ui,sans-serif}'+
  '.p7w{max-width:560px;margin:0 auto;padding:28px 18px 60px;text-align:center}'+
  '.p7k{font-size:13px;letter-spacing:.1em;font-weight:800;text-transform:uppercase;color:'+OURO+'}'+
  '.p7h{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:30px;line-height:1.2;margin:10px 0 8px}'+
  '.p7m{color:#AEB5D6}.p7s{font-size:13px}'+
  '.p7op{display:grid;gap:10px;margin:22px 0 8px}'+
  '.p7b{font:inherit;font-weight:800;font-size:17px;border:1px solid #3B4C8F;background:#1B2654;color:#F4F1EA;border-radius:16px;padding:14px 16px;cursor:pointer;min-height:56px;display:flex;gap:12px;align-items:center;justify-content:center;text-align:left}'+
  '.p7b.pri{background:'+OURO+';border-color:'+OURO+';color:#0A0F24}.p7b small{display:block;font-weight:600;font-size:13px;opacity:.8}'+
  '.p7b:focus-visible,.p7ceu:focus-visible{outline:3px solid '+OURO+';outline-offset:2px}'+
  '.p7luz{display:flex;gap:9px;justify-content:center;margin:0 0 14px}.p7luz i{width:11px;height:11px;border-radius:50%}'+
  '.p7favs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}.p7fav{background:#1B2654;border:1px solid #3B4C8F;border-top:3px solid var(--c);border-radius:12px;padding:5px;font-size:11.5px;font-weight:700;line-height:1.2}.p7fav svg{width:100%;height:auto;border-radius:8px;display:block;margin-bottom:4px}'+
  '.p7fav.n7{grid-column:span 1}'+
  /* céus */
  '.p7ceus{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin:20px 0 6px}'+
  '.p7ceu{font:inherit;color:#F4F1EA;background:#0D1430;border:1.5px solid #2E3C78;border-radius:14px;padding:6px 3px 8px;cursor:pointer;display:grid;gap:4px;justify-items:center;transition:transform .2s,border-color .2s,box-shadow .2s}'+
  '.p7ceu svg{width:100%;height:auto;display:block}.p7ceu b{font-size:11.5px;line-height:1.15;font-weight:700}'+
  '.p7ceu.on{border-color:'+OURO+';box-shadow:0 0 18px rgba(245,197,66,.45);transform:translateY(-3px)}'+
  '.p7ceus.sem b{display:none}'+
  '@media(max-width:380px){.p7ceus{grid-template-columns:repeat(5,1fr);gap:4px}.p7ceu b{font-size:10px}}'+
  '@keyframes p7pis{0%,100%{opacity:.35}50%{opacity:1}}.p7ceu .tw{animation:p7pis 2.4s ease-in-out infinite}'+
  '@keyframes p7chuva{from{transform:translateY(-4px);opacity:0}40%{opacity:1}to{transform:translateY(6px);opacity:0}}.p7ceu .ch{animation:p7chuva 1.3s linear infinite}'+
  /* carta dourada */
  '.p7cv{position:fixed;inset:0;z-index:70;background:rgba(5,8,20,.88);display:grid;place-items:center;padding:18px;animation:p7fade .3s ease-out}'+
  '@keyframes p7fade{from{opacity:0}to{opacity:1}}'+
  '.p7cena{perspective:1200px;width:min(320px,86vw);aspect-ratio:5/7}'+
  '.p7carta{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.3,.7,.2,1);cursor:pointer}'+
  '.p7carta.virou{transform:rotateY(180deg)}'+
  '.p7lado{position:absolute;inset:0;border-radius:20px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}'+
  '.p7costas{background:linear-gradient(145deg,#FFE08A 0%,#F5C542 35%,#B8891E 70%,#F5C542 100%);box-shadow:0 0 40px rgba(245,197,66,.55);display:grid;place-items:center;color:#3A2A05}'+
  '.p7costas .in{position:absolute;inset:10px;border:1.5px solid rgba(58,42,5,.45);border-radius:14px}'+
  '.p7costas b{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:22px;position:absolute;bottom:26px;left:0;right:0;text-align:center}'+
  '.p7costas .toq{position:absolute;top:22px;left:0;right:0;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}'+
  '.p7frente{transform:rotateY(180deg);background:linear-gradient(170deg,#18224A,#0A0F24);border:2px solid '+OURO+';box-shadow:0 0 30px rgba(245,197,66,.35);padding:22px 18px;display:flex;flex-direction:column;gap:8px;text-align:left}'+
  '.p7frente .p7k{font-size:11.5px}.p7frente h3{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:24px;line-height:1.2;margin:2px 0 4px;color:#FFE08A}'+
  '.p7frente p{margin:0;font-size:15px;line-height:1.45}.p7frente .x{color:#AEB5D6;font-size:14px}'+
  '.p7tem{margin-top:auto;display:grid;gap:6px}.p7tem .t{font-size:13px;font-weight:800;color:#AEB5D6}.p7tem .o{display:flex;gap:6px}'+
  '.p7tem button{flex:1;font:inherit;font-weight:800;font-size:14px;border:1px solid #3B4C8F;background:#1B2654;color:#F4F1EA;border-radius:12px;padding:10px 4px;cursor:pointer;min-height:44px}'+
  '.p7tem button.on{background:'+OURO+';color:#0A0F24;border-color:'+OURO+'}'+
  '.p7cseg{margin-top:14px;text-align:center}'+
  /* coleção */
  '.p7col{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:10px 0}'+
  '.p7mini{font:inherit;aspect-ratio:5/7;border-radius:8px;border:0;cursor:pointer;padding:0;background:linear-gradient(145deg,#FFE08A,#F5C542 40%,#B8891E);box-shadow:0 0 10px rgba(245,197,66,.4);color:#3A2A05;font-weight:900;font-size:15px;display:grid;place-items:center}'+
  '.p7mini.vazia{background:#0D1430;border:1.5px dashed #3B4C8F;box-shadow:none;color:#3B4C8F;cursor:default}'+
  '.p7mini.lida{outline:2px solid var(--c);outline-offset:2px}'+
  /* desenho que se preenche */
  '.p7viz{margin:6px auto 4px;max-width:420px}.p7viz svg{width:100%;height:auto;display:block}'+
  '@keyframes p7pop{0%{transform:scale(.2);opacity:0}70%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}.p7viz .nv{transform-box:fill-box;transform-origin:center;animation:p7pop .6s ease-out}'+
  '@keyframes p7traco{from{stroke-dashoffset:var(--L)}to{stroke-dashoffset:0}}.p7viz .nt{animation:p7traco .9s ease-out forwards}'+
  '@media (prefers-reduced-motion:reduce){.p7carta{transition:none}.p7ceu .tw,.p7ceu .ch,.p7viz .nv,.p7viz .nt{animation:none}}';
  var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);

  /* ---------- Céus de luz (Linha de luz: traço dourado no escuro) ---------- */
  var CEUS=['Céu fechado','Nublado','Entre nuvens','Céu aberto','Céu radiante'];
  var NOTAS=[2,4,6,8,10];/* a nota que fica guardada por trás de cada céu (mesma régua de 0 a 10 de antes) */
  function nuvem(x,y,s){return '<path d="M'+x+' '+y+' a'+(7*s)+' '+(7*s)+' 0 0 1 '+(3*s)+' -'+(13*s)+' a'+(10*s)+' '+(10*s)+' 0 0 1 '+(19*s)+' -'+(3*s)+' a'+(8*s)+' '+(8*s)+' 0 0 1 '+(14*s)+' '+(7*s)+' a'+(6*s)+' '+(6*s)+' 0 0 1 -'+(1*s)+' '+(9*s)+' Z"/>';}
  function sol(cx,cy,r,raios,L){var s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>';for(var i=0;i<raios;i++){var a=i/raios*Math.PI*2;s+='<line x1="'+(cx+Math.cos(a)*(r+3)).toFixed(1)+'" y1="'+(cy+Math.sin(a)*(r+3)).toFixed(1)+'" x2="'+(cx+Math.cos(a)*(r+3+L)).toFixed(1)+'" y2="'+(cy+Math.sin(a)*(r+3+L)).toFixed(1)+'"/>';}return s;}
  function brilho(x,y,r,d){return '<path class="tw" style="animation-delay:'+d+'s" d="M'+x+' '+(y-r)+' L'+(x+r*.28)+' '+(y-r*.28)+' L'+(x+r)+' '+y+' L'+(x+r*.28)+' '+(y+r*.28)+' L'+x+' '+(y+r)+' L'+(x-r*.28)+' '+(y+r*.28)+' L'+(x-r)+' '+y+' L'+(x-r*.28)+' '+(y-r*.28)+' Z"/>';}
  function ceuSVG(i){
    var g='<g fill="none" stroke="'+OURO+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#p7gl)">',s='';
    if(i===0){s=nuvem(10,40,1.25)+nuvem(30,34,1)+'<path d="M38 46 l-6 11 h7 l-5 11" stroke-width="2"/>';for(var k=0;k<6;k++)s+='<line class="ch" style="animation-delay:'+(k*.2)+'s" x1="'+(14+k*7)+'" y1="50" x2="'+(12+k*7)+'" y2="56"/>';}
    if(i===1){s=nuvem(8,42,1.1)+nuvem(28,30,.9);for(var k2=0;k2<3;k2++)s+='<line class="ch" style="animation-delay:'+(k2*.4)+'s" x1="'+(18+k2*10)+'" y1="50" x2="'+(17+k2*10)+'" y2="54"/>';}
    if(i===2){s=sol(40,24,8,8,4)+'<g fill="#0D1430">'+nuvem(8,48,1.2)+'</g>';}
    if(i===3){s=sol(30,32,10,10,6)+nuvem(38,58,.6);}
    if(i===4){s=sol(30,32,11,14,9)+brilho(8,12,4,0)+brilho(54,14,3,.6)+brilho(52,56,3.5,1.1)+brilho(8,56,2.5,1.6);}
    return '<svg viewBox="0 0 60 66" aria-hidden="true"><defs><filter id="p7gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+g+s+'</g></svg>';}
  function ceus(sel,acao){var o=opc();return '<div class="p7ceus'+(o.ceuNomes==='nao'?' sem':'')+'" role="radiogroup">'+CEUS.map(function(n,i){return '<button type="button" class="p7ceu'+(sel===i?' on':'')+'" role="radio" aria-checked="'+(sel===i)+'" data-a="'+acao+'" data-i="'+i+'" aria-label="'+n+'">'+ceuSVG(i)+'<b>'+n+'</b></button>';}).join('')+'</div>';}

  /* ---------- Cartas douradas: uma descoberta por sentido ---------- */
  var ORG={mapa:'Seu olhar',aud:'Seu ouvido',tato:'Suas mãos',olf:'Seu nariz',pal:'Sua boca',equi:'Seu corpo em movimento',corpo:'Seu corpo'};
  var PEDE=['natureza e céu aberto','aconchego','movimento','calma','energia','leveza e frescor','gente por perto'];
  var TEMA_DE={'água':'água','cozinha e mesa':'cozinha e mesa','infância':'infância','noite':'noite','calor e aconchego':'calor e aconchego','natureza':'natureza'};
  function carta(id,picks,tempoMs){
    if(typeof META==='undefined'||typeof TAGS==='undefined'||!picks||!picks.length)return null;
    var k=IDS.indexOf(id),sc=[0,0,0,0,0,0,0],cnt=[0,0,0,0,0,0,0];
    picks.forEach(function(n,o){var m=META[id]&&META[id][n];if(m){sc[m[0]]+=7-o;cnt[m[0]]++;}});
    var dom=sc.indexOf(Math.max.apply(null,sc));var fav=picks[0],fm=META[id]&&META[id][fav];
    var t=ORG[id]+' pede '+PEDE[dom]+'.';
    var d=cnt[dom]+' das suas 7 escolhas de '+NOMES[k].toLowerCase()+' são de '+TAGS[dom][2]+'.';
    var x='';
    if(typeof TEMAS!=='undefined'){var best=null;Object.keys(TEMAS).forEach(function(tn){var h=picks.filter(function(p){return TEMAS[tn].indexOf(p)>=0;});if(h.length>=3&&(!best||h.length>best[1].length))best=[tn,h];});
      if(best)x='E tem um fio escondido: '+best[1].length+' delas falam de '+(TEMA_DE[best[0]]||best[0])+' ('+best[1].slice(0,3).join(', ').toLowerCase()+').';}
    if(!x&&fm&&fm[0]!==dom)x='Curioso: a sua favorita, '+fav.toLowerCase()+', é de outro tipo ('+TAGS[fm[0]][2].split(',')[0]+'). Ela pode ser o seu jeito de variar.';
    if(!x){var two=sc.map(function(v,i){return [v,i];}).sort(function(a,b){return b[0]-a[0];})[1];if(two&&two[0]>0)x='Logo atrás vem '+TAGS[two[1]][2].split(',')[0]+': '+(two[1]===3||two[1]===1?'um lado mais quieto':'um lado mais solto')+' que também te faz bem.';}
    if(tempoMs&&tempoMs>1500){var sg=Math.max(1,Math.round(tempoMs/1000));x+=(x?' ':'')+(sg<=40?'E você decidiu rápido: '+sg+' segundos.':'');}
    return {id:id,k:k,t:t,d:d,x:x};}
  function cartaHTML(c,resp,opts){opts=opts||{};var cor=COR[c.k];
    return '<div class="p7cv" role="dialog" aria-modal="true" aria-label="Carta dourada de '+NOMES[c.k]+'"><div><div class="p7cena"><div class="p7carta'+(opts.virada?' virou':'')+'" data-a="p7vira">'+
     '<div class="p7lado p7costas"><div class="in"></div><span class="toq">'+(opts.sozinha?'Carta dourada':'Toque para virar')+'</span>'+
     '<svg viewBox="0 0 100 100" width="58%" aria-hidden="true">'+COR.map(function(cc,i){var a=i/7*Math.PI*2-Math.PI/2;return '<circle cx="'+(50+Math.cos(a)*34).toFixed(1)+'" cy="'+(50+Math.sin(a)*34).toFixed(1)+'" r="'+(i===c.k?8:5)+'" fill="'+(i===c.k?'#3A2A05':'none')+'" stroke="#3A2A05" stroke-width="1.6"/>';}).join('')+'<text x="50" y="62" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="34" fill="#3A2A05">7</text></svg>'+
     '<b>'+NOMES[c.k]+'</b></div>'+
     '<div class="p7lado p7frente"><div class="p7k" style="color:'+cor+'">✨ '+NOMES[c.k]+' · carta '+(c.k+1)+' de 7</div><div class="p7s p7m">Algo que você talvez não tenha percebido</div><h3>'+esc(c.t)+'</h3><p>'+esc(c.d)+'</p>'+(c.x?'<p class="x">'+esc(c.x)+'</p>':'')+
     (opts.semPergunta?'':'<div class="p7tem"><div class="t">Isso tem a ver com você?</div><div class="o">'+[['tem','Tem'],['parte','Em parte'],['nao','Não']].map(function(o){return '<button type="button" class="'+(resp===o[0]?'on':'')+'" data-a="p7resp" data-v="'+o[0]+'">'+o[1]+'</button>';}).join('')+'</div></div>')+
     '</div></div></div><div class="p7cseg">'+(opts.botao||'')+'</div></div></div>';}
  function colecao(cartas,acao){cartas=cartas||{};return '<div class="p7col">'+IDS.map(function(id,k){var c=cartas[id];return c?'<button type="button" class="p7mini '+(c.r?'lida':'')+'" style="--c:'+COR[k]+'" data-a="'+acao+'" data-id="'+id+'" aria-label="Carta de '+NOMES[k]+'">'+(k+1)+'</button>':'<span class="p7mini vazia">'+(k+1)+'</span>';}).join('')+'</div>';}

  /* ---------- Desenhos que se preenchem a cada resposta (Ajude a melhorar) ---------- */
  var VIZ={
    casa:{nome:'Casa dos 7 Sentidos',frase:'A cada resposta, uma janela acende.'},
    constelacao:{nome:'Constelação',frase:'A cada resposta, uma estrela se liga às outras.'},
    jardim:{nome:'Jardim de luz',frase:'A cada resposta, uma flor de luz nasce.'},
    fio:{nome:'Fio de luz nas 7 cores',frase:'A cada resposta, o fio ganha uma cor.'}};
  function viz(tipo,n,novo){var s='',G='stroke="'+OURO+'" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    var nv=function(i){return i===novo?' nv':'';};
    if(tipo==='casa'){s='<path d="M60 92 L150 30 L240 92 V188 H60 Z" '+G+'/><path d="M150 12 v8 M146 16 h8" '+G+' opacity="'+(n>=7?1:.25)+'"/>';
      var W=[[80,104],[118,104],[156,104],[194,104],[90,146],[134,146],[178,146]];
      W.forEach(function(p,i){var on=i<n;s+='<rect class="'+nv(i)+'" x="'+p[0]+'" y="'+p[1]+'" width="28" height="28" rx="3" fill="'+(on?COR[i]:'none')+'" stroke="'+(on?COR[i]:'#3B4C8F')+'" stroke-width="2" '+(on?'filter="url(#p7vg)"':'')+'/>'+(on?'':'<path d="M'+(p[0]+14)+' '+p[1]+' v28 M'+p[0]+' '+(p[1]+14)+' h28" stroke="#3B4C8F" stroke-width="1"/>');});
      s+='<circle cx="150" cy="74" r="10" '+(n>=7?'fill="'+OURO+'" stroke="'+OURO+'" filter="url(#p7vg)" class="nv"':G+' opacity=".3"')+'/>';}
    if(tipo==='constelacao'){var P=[[40,140],[85,70],[135,118],[170,40],[210,104],[250,58],[270,150]];
      for(var i=1;i<n;i++)s+='<line class="'+(i===novo?'nt':'')+'" style="--L:120;stroke-dasharray:120" x1="'+P[i-1][0]+'" y1="'+P[i-1][1]+'" x2="'+P[i][0]+'" y2="'+P[i][1]+'" stroke="'+OURO+'" stroke-width="1.4" opacity=".7"/>';
      P.forEach(function(p,i){var on=i<n;s+=on?'<g class="'+nv(i)+'" filter="url(#p7vg)"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="'+COR[i]+'"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="13" fill="none" stroke="'+COR[i]+'" stroke-width="1" opacity=".6"/></g>':'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#3B4C8F"/>';});}
    if(tipo==='jardim'){s='<path d="M20 180 Q150 170 280 180" '+G+' opacity=".6"/>';
      for(var j=0;j<7;j++){var x=42+j*36,h=[70,95,80,110,85,100,75][j],on=j<n,y=180-h;
        s+='<path d="M'+x+' 180 Q'+(x+(j%2?8:-8))+' '+(180-h/2)+' '+x+' '+(on?y:176)+'" stroke="'+(on?'#7DDB8B':'#3B4C8F')+'" stroke-width="2" fill="none"/>';
        if(on){s+='<g class="'+nv(j)+'" filter="url(#p7vg)">';for(var q=0;q<6;q++){var a=q/6*Math.PI*2;s+='<ellipse cx="'+(x+Math.cos(a)*9).toFixed(1)+'" cy="'+(y+Math.sin(a)*9).toFixed(1)+'" rx="6" ry="4" transform="rotate('+(q*60)+' '+(x+Math.cos(a)*9).toFixed(1)+' '+(y+Math.sin(a)*9).toFixed(1)+')" fill="'+COR[j]+'" opacity=".9"/>';}s+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="'+OURO+'"/></g>';}
        else s+='<circle cx="'+x+'" cy="176" r="3" fill="#3B4C8F"/>';}}
    if(tipo==='fio'){var pts=[[20,120],[60,70],[100,140],[140,60],[180,140],[220,70],[260,130],[285,95]];
      for(var f=0;f<7;f++){var a0=pts[f],a1=pts[f+1],on2=f<n,mx=(a0[0]+a1[0])/2,my=(a0[1]+a1[1])/2-(f%2?-26:26);
        s+='<path class="'+(on2&&f===novo?'nt':'')+'" style="--L:140;stroke-dasharray:'+(on2?140:'4 6')+'" d="M'+a0[0]+' '+a0[1]+' Q'+mx+' '+my+' '+a1[0]+' '+a1[1]+'" stroke="'+(on2?COR[f]:'#3B4C8F')+'" stroke-width="'+(on2?4:2)+'" fill="none" stroke-linecap="round" '+(on2?'filter="url(#p7vg)"':'')+'/>';}
      var e=pts[Math.min(n,7)];s+='<circle class="nv" cx="'+e[0]+'" cy="'+e[1]+'" r="7" fill="'+OURO+'" filter="url(#p7vg)"/>';}
    return '<svg viewBox="0 0 300 200" role="img" aria-label="'+VIZ[tipo].nome+': '+n+' de 7"><defs><filter id="p7vg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+s+'</svg>';}

  /* ---------- registro da porta (chave própria) ---------- */
  function registra(r){r.em=new Date().toISOString();var L=[];try{L=JSON.parse(localStorage.getItem('jornada7porta')||'[]');}catch(e){}L.push(r);try{localStorage.setItem('jornada7porta',JSON.stringify(L.slice(-30)));}catch(e){}
    var J=lerJ()||{};var url=window.PLANILHA_URL||'';if(!url||PREVIA)return;
    var corpo={c:'7s0a4653',tipo:'porta',id:J.id||'',nome:J.nome||'',cel:'',em:r.em,fase:r.fase,fez1:r.fez1||'',escolha:r.escolha||'',validacao:r.validacao||'',mostrado:r.mostrado||''};
    try{fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(corpo),keepalive:true});}catch(e){}}
  function aviso(t){var d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:90;background:#F5C542;color:#0A0F24;font:800 15px Manrope,system-ui,sans-serif;padding:12px 16px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.5);max-width:90vw;text-align:center';document.body.appendChild(d);setTimeout(function(){d.remove();},3200);}
  function vai(url,t){if(PREVIA){aviso('Prévia: aqui abriria '+t+'.');return false;}location.href=url;return true;}

  /* ---------- Porta das Fases 2 e 3 (tela por cima da página) ---------- */
  function favsHTML(J){return '<div class="p7favs">'+IDS.map(function(id,k){var n=(J.esc[id]||[])[0];var t=null;if(typeof SEN!=='undefined'){var s=SEN.find(function(x){return x[0]===id;});t=s&&s[5].find(function(x){return x.n===n;});}
      if(typeof A!=='undefined')try{A=['#E9B10E','#2F7FD1','#E8643A','#3E9E5E','#D9487E','#7457C9','#17A99B'];}catch(e){}
      return '<div class="p7fav" style="--c:'+COR[k]+'">'+(t?'<svg viewBox="0 0 300 300">'+t.art()+'</svg>':'')+esc(n||'—')+'</div>';}).join('')+'<div class="p7fav" style="--c:'+OURO+';display:grid;place-items:center;font-size:13px">Seu mapa<br>da Fase 1</div></div>';}
  function cartaAntiga(J){var c=J.cartas||{};var ids=IDS.filter(function(id){return c[id];});var pref=ids.filter(function(id){return c[id].r==='tem';});var id=(pref[0]||ids[0]);
    if(id)return c[id];var k=0;for(;k<7;k++){var x=carta(IDS[k],(J.esc||{})[IDS[k]]);if(x)return x;}return null;}
  function porta(o){
    var fase=o.fase,simula=!!o.simula,raiz=document.createElement('div');raiz.className='p7v';var passo=o.inicio||'p1',r={fase:fase};if(passo==='valida'){r.fez1='sim';r.escolha='ir para a Fase '+fase+' (escolheu na Fase 1)';}
    var luzes='<div class="p7luz">'+COR.map(function(c){return '<i style="background:'+c+';box-shadow:0 0 10px '+c+'"></i>';}).join('')+'</div>';
    function fecha(){raiz.remove();document.documentElement.style.overflow='';if(o.depois)o.depois(r);}
    function tela(){var J=lerJ()||{esc:{}};var h='';
      if(passo==='p1')h=luzes+'<div class="p7k">Fase '+fase+'</div><h1 class="p7h">Você já fez a Fase 1?</h1><p class="p7m">A Fase 1 é o mapa dos 7 sentidos: escolher 7 de 15 em cada um.</p>'+
        '<div class="p7op"><button class="p7b pri" data-a="sim">Sim, já fiz</button><button class="p7b" data-a="nao">Ainda não</button></div>'+
        (fase1Ok(J)?'<p class="p7s p7m">Encontramos uma Fase 1 completa neste aparelho.</p>':'');
      if(passo==='semdados')h='<div class="p7k">Fase '+fase+'</div><h1 class="p7h">Não encontramos a sua Fase 1 neste aparelho</h1><p class="p7m">As respostas ficam guardadas só no celular onde você jogou. Se foi em outro, abra este link nele.</p>'+
        '<div class="p7op"><button class="p7b pri" data-a="aqui">Fazer a Fase 1 aqui</button><button class="p7b" data-a="outro">Vou abrir no outro aparelho</button></div>';
      if(passo==='p2')h=luzes+'<div class="p7k">Fase '+fase+'</div><h1 class="p7h">Quer refazer a Fase 1 ou ir direto para a Fase '+fase+'?</h1>'+
        '<div class="p7op"><button class="p7b" data-a="refaz">↺ Refazer a Fase 1<small>Depois a gente compara as suas respostas de antes e de agora.</small></button><button class="p7b pri" data-a="segue">Ir para a Fase '+fase+' →</button></div>';
      if(passo==='valida'&&fase===2)h='<div class="p7k">Espelho</div><h1 class="p7h">Este ainda é você?</h1><p class="p7m">As suas favoritas de cada sentido na Fase 1.</p>'+favsHTML(J)+
        '<div class="p7op"><button class="p7b" data-a="v" data-v="Ainda sou eu">🪞 Ainda sou eu</button><button class="p7b" data-a="v" data-v="Mudou um pouco">🌗 Mudou um pouco</button><button class="p7b" data-a="v" data-v="Mudou muito">🌀 Mudou muito</button></div>';
      if(passo==='valida'&&fase===3){var c=cartaAntiga(J);if(!c){fecha();return;}r.mostrado=c.t;
        h='<div class="p7k">Aconteceu?</div><h1 class="p7h">Uma das suas cartas douradas disse:</h1><div class="p7frente" style="position:relative;transform:none;border-radius:20px;margin:14px 0;text-align:left;padding:18px"><div class="p7k" style="color:'+COR[c.k]+'">✨ '+NOMES[c.k]+'</div><h3>'+esc(c.t)+'</h3><p>'+esc(c.d)+'</p></div>'+
        '<p class="p7m">Desde a Fase 1, isso apareceu na sua vida?</p><div class="p7op"><button class="p7b" data-a="v" data-v="Aconteceu">✨ Aconteceu</button><button class="p7b" data-a="v" data-v="Às vezes">🌗 Às vezes</button><button class="p7b" data-a="v" data-v="Não">○ Não</button></div>';}
      if(passo==='obg')h=luzes+'<h1 class="p7h">Anotado ✓</h1><p class="p7m">'+(fase===2?'Vamos para a Fase 2.':'Vamos para a Fase 3.')+'</p><div class="p7op"><button class="p7b pri" data-a="fecha">Começar a Fase '+fase+' →</button></div>';
      raiz.innerHTML='<div class="p7w">'+h+'</div>';raiz.scrollTop=0;var f=raiz.querySelector('button');if(f)f.focus({preventScroll:true});}
    raiz.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;e.stopPropagation();var a=b.dataset.a,J=lerJ();
      if(a==='sim'){r.fez1='sim';passo=fase1Ok(J)?'p2':'semdados';tela();return;}
      if(a==='nao'){r.fez1='nao';r.escolha='fazer a Fase 1';registra(r);vai('/jornada/?seguir=2'+(fase===3?'&de=3':''),'a Fase 1 (e depois a Fase 2)');if(simula)fecha();return;}
      if(a==='aqui'){r.escolha='fazer a Fase 1 aqui';registra(r);vai('/jornada/?seguir=2','a Fase 1 (e depois a Fase 2)');if(simula)fecha();return;}
      if(a==='outro'){r.escolha='abrir no outro aparelho';registra(r);try{navigator.clipboard.writeText(location.href);}catch(x){}aviso('Link copiado. Abra no outro aparelho.');return;}
      if(a==='refaz'){r.escolha='refazer a Fase 1';registra(r);vai('/jornada/?refaz=1&seguir='+fase,'a Fase 1 para refazer (com comparação)');if(simula)fecha();return;}
      if(a==='segue'){r.escolha='ir para a Fase '+fase;passo='valida';tela();return;}
      if(a==='v'){r.validacao=b.dataset.v;registra(r);passo='obg';tela();return;}
      if(a==='fecha'){fecha();return;}});
    document.documentElement.style.overflow='hidden';document.body.appendChild(raiz);tela();}

  /* liga a porta numa página de fase: ?vem=1 (veio direto da Fase 1) pula tudo; ?vem=valida mostra só a validação */
  function portaDaPagina(fase){if(window.parent!==window)return;var v=new URLSearchParams(location.search).get('vem');if(v==='1')return;
    var go=function(){porta({fase:fase,inicio:v==='valida'?'valida':'p1'});};if(document.body)go();else document.addEventListener('DOMContentLoaded',go);}
  window.P7={portaDaPagina:portaDaPagina,PREVIA:PREVIA,IDS:IDS,NOMES:NOMES,COR:COR,CEUS:CEUS,NOTAS:NOTAS,ceus:ceus,ceuSVG:ceuSVG,carta:carta,cartaHTML:cartaHTML,colecao:colecao,VIZ:VIZ,viz:viz,porta:porta,registra:registra,fase1Ok:fase1Ok,aviso:aviso,vai:vai,opc:opc,esc:esc,lerJ:lerJ};
})();
