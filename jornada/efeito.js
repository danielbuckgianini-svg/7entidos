/* Efeito da fase (Sala do Efeito, 05/11): no começo "Como você chega?", no fim "Como você sai?" e "O que você leva dessa fase?".
   Substitui a nota de 0 a 10. Enquanto o Daniel não aprova, só aparece na prévia: abra qualquer fase com ?efeito=1 (fica lembrado neste aparelho; ?efeito=0 desliga). */
(function(){
  var q=new URLSearchParams(location.search).get('efeito');
  try{if(q==='1')localStorage.setItem('jornada7efeito','1');if(q==='0')localStorage.removeItem('jornada7efeito');}catch(e){}
  var on=false;try{on=localStorage.getItem('jornada7efeito')==='1';}catch(e){on=q==='1';}
  var PAL=[['Calma','#5AB8FF'],['Alegria','#FFD23F'],['Energia','#FF8A5C'],['Leveza','#3FE0D0'],['Curiosidade','#A98BFF'],['Saudade','#FF6FA3'],['Cansaço','#8C93B5']];
  var LEVA=[['🔍','Descobri algo sobre mim'],['🌅','Lembrei de algo bom'],['🌬️','Relaxei'],['🎉','Me diverti'],['➖','Nada de especial']];
  var VW=['<b>Abaixo de quanto</b> o 7entidos completo seria tão barato que você desconfiaria da qualidade?','Por quanto o 7entidos completo seria <b>um bom negócio</b>, uma pechincha?','<b>A partir de quanto</b> ele começaria a ficar caro, mas você ainda pensaria em comprar?','<b>A partir de quanto</b> ele seria caro demais, a ponto de você não comprar?'];
  var VW_INI=[10,20,35,50];
  var PRES=['Sim, para a família','Sim, para amigos','Sim, para o meu amor','Talvez','Não'];
  var css='.efganha{border:1px solid rgba(255,212,59,.45);border-radius:14px;padding:10px 14px;font-size:15px}.efganha ul{margin:6px 0 0;padding-left:18px}.efganha li{margin:2px 0}'+
   '.efvw{display:grid;grid-template-columns:1fr auto;gap:4px 10px;align-items:center;font-size:15px}.efvw input{grid-column:1/-1;width:100%;accent-color:#FFD43B;min-height:32px}.efvv{font-weight:800;color:#FFD43B;font-variant-numeric:tabular-nums;white-space:nowrap}'+
   '.ef{display:grid;gap:10px;margin:14px 0}.ef h3{margin:0;font-size:20px}.ef .efc{display:flex;flex-wrap:wrap;gap:8px}'+
   '.ef .efc button{font:inherit;font-size:15px;font-weight:700;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:inherit;border-radius:999px;padding:9px 15px;cursor:pointer;display:inline-flex;gap:7px;align-items:center;min-height:44px}'+
   '.ef .efc button i{width:10px;height:10px;border-radius:50%}.ef .efc button.on{background:#FFD43B;color:#0A0F24;border-color:#FFD43B}'+
   '.ef .efc button:focus-visible{outline:3px solid #FFD43B;outline-offset:2px}.ef .efr{font-size:19px;line-height:1.35}.ef .efr b{color:#FFD43B}';
  if(on){var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function chips(lista,sel,acao,cor){return '<div class="efc">'+lista.map(function(p){var v=p[cor?0:1];return '<button type="button" class="'+(sel===v?'on':'')+'" data-a="'+acao+'" data-v="'+esc(v)+'">'+(cor?'<i style="background:'+p[1]+'"></i>':p[0]+' ')+esc(v)+'</button>';}).join('')+'</div>';}
  window.EF={
    on:on,
    /* bloco do começo da fase */
    chega:function(sel){return '<div class="ef"><h3>Como você chega?</h3>'+chips(PAL,sel,'efchega',true)+'</div>';},
    /* bloco do fim da fase */
    sai:function(chega,sai,leva){return '<div class="ef">'+(chega&&!sai?'<div class="efr">Você chegou <b>'+esc(chega)+'</b>.</div>':'')+'<h3>Como você sai?</h3>'+chips(PAL,sai,'efsai',true)+
      (sai&&chega?'<div class="efr">Você chegou <b>'+esc(chega)+'</b> e saiu <b>'+esc(sai)+'</b>.</div>':'')+
      '<h3>O que você leva dessa fase?</h3>'+chips(LEVA,leva,'efleva',false)+'</div>';},
    /* sugestão opcional */
    sug:function(txt){return '<div class="ef"><h3>Quer deixar uma sugestão? <span style="font-weight:400;font-size:15px;opacity:.75">(opcional)</span></h3><textarea id="efsug" maxlength="500" rows="3" placeholder="O que deixaria esta fase ainda melhor?" style="font:inherit;font-size:16px;width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:inherit">'+esc(txt||'')+'</textarea></div>';},
    /* pesquisa de preço (Sala do Preço, 05/11): Van Westendorp, opcional, com pergunta de presente */
    preco:function(pr){pr=pr||{};
      if(pr.pular)return '<div class="ef"><div class="efr" style="font-size:15px;opacity:.8">Tudo bem, a pergunta do preço ficou para depois. <button type="button" data-a="efprvolta" style="font:inherit;background:none;border:0;color:#FFD43B;text-decoration:underline;cursor:pointer">Responder agora</button></div></div>';
      var v=pr.v||VW_INI;
      return '<div class="ef efpr"><h3>Uma pergunta rápida sobre preço <span style="font-weight:400;font-size:15px;opacity:.75">(opcional)</span></h3>'+
       '<div class="efr" style="font-size:16px"><span style="color:#FFD43B">✦</span> Brisa: "Você me ajuda a dar um preço justo ao 7entidos?"</div>'+
       '<div class="efganha"><b>O 7entidos completo vai ter:</b><ul><li>As 7 fases da jornada, no seu ritmo</li><li>A sua pintura dos 7 sentidos</li><li>O Museu do 7entidos, com os 7 pintores</li><li>O Hall da Fama, com todo o seu histórico</li></ul></div>'+
       VW.map(function(t,i){return '<label class="efvw"><span>'+(i+1)+'. '+t+'</span><span class="efvv" id="efvv'+i+'">'+(pr.t?'R$ '+v[i]:'arraste')+'</span><input type="range" min="0" max="100" step="1" value="'+v[i]+'" data-vw="'+i+'" aria-label="Pergunta '+(i+1)+' do preço"></label>';}).join('')+
       '<h3 style="font-size:17px">Você daria o 7entidos de presente?</h3>'+chips(PRES.map(function(x){return ['',x];}),pr.pres,'efpres',false).replace(/<button([^>]*)> /g,'<button$1>')+
       '<button type="button" data-a="efprpula" style="font:inherit;font-size:14px;background:none;border:0;color:inherit;opacity:.7;text-decoration:underline;cursor:pointer;justify-self:start;padding:4px 0">Agora não</button></div>';},
    /* mantém as 4 respostas em ordem crescente enquanto a pessoa arrasta */
    vw:function(pr,i,val){pr.v=(pr.v||VW_INI).slice();pr.v[i]=val;for(var k=i+1;k<4;k++)if(pr.v[k]<pr.v[k-1])pr.v[k]=pr.v[k-1];for(var j=i-1;j>=0;j--)if(pr.v[j]>pr.v[j+1])pr.v[j]=pr.v[j+1];pr.t=true;return pr;},
    precoTexto:function(pr){if(!pr||pr.pular)return 'Preço: pulou';var s=pr.t?'Preço: barato demais R$ '+pr.v[0]+' · bom negócio R$ '+pr.v[1]+' · ficando caro R$ '+pr.v[2]+' · caro demais R$ '+pr.v[3]:'Preço: não respondeu';return s+(pr.pres?' · Presente: '+pr.pres:'');},
    /* texto que vai para a planilha */
    texto:function(chega,sai,leva){return 'Chegou '+(chega||'-')+' → saiu '+(sai||'-')+' · Levo: '+(leva||'-');},
    falta:function(sai,leva){return !sai?'Toque em como você sai.':!leva?'Toque no que você leva dessa fase.':'';}
  };
})();
