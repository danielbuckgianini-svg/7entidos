/* Efeito da fase (Sala do Efeito, 05/11): no começo "Como você chega?", no fim "Como você sai?" e "O que você leva dessa fase?".
   Substitui a nota de 0 a 10. Enquanto o Daniel não aprova, só aparece na prévia: abra qualquer fase com ?efeito=1 (fica lembrado neste aparelho; ?efeito=0 desliga). */
(function(){
  var q=new URLSearchParams(location.search).get('efeito');
  try{if(q==='1')localStorage.setItem('jornada7efeito','1');if(q==='0')localStorage.removeItem('jornada7efeito');}catch(e){}
  var on=false;try{on=localStorage.getItem('jornada7efeito')==='1';}catch(e){on=q==='1';}
  var PAL=[['Calma','#5AB8FF'],['Alegria','#FFD23F'],['Energia','#FF8A5C'],['Leveza','#3FE0D0'],['Curiosidade','#A98BFF'],['Saudade','#FF6FA3'],['Cansaço','#8C93B5']];
  var LEVA=[['🔍','Descobri algo sobre mim'],['🌅','Lembrei de algo bom'],['🌬️','Relaxei'],['🎉','Me diverti'],['➖','Nada de especial']];
  var css='.ef{display:grid;gap:10px;margin:14px 0}.ef h3{margin:0;font-size:20px}.ef .efc{display:flex;flex-wrap:wrap;gap:8px}'+
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
    /* texto que vai para a planilha */
    texto:function(chega,sai,leva){return 'Chegou '+(chega||'-')+' → saiu '+(sai||'-')+' · Levo: '+(leva||'-');},
    falta:function(sai,leva){return !sai?'Toque em como você sai.':!leva?'Toque no que você leva dessa fase.':'';}
  };
})();
