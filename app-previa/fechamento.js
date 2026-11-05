/* Fechamento da Fase 2 (aprovado pelo Daniel em 05/11/2026):
   antes dos mini-jogos, "Como você chega?" numa tela só; no fim, uma coisa por tela:
   como você sai → o que você leva → preço justo (4 perguntas, opcional) → presente → recado → cartão.
   O estado fica em PD.ef (chega, sai, leva, pr, pres, sug, k = tela atual do fechamento). */
(function(){
  var LUZ=[['Calma','#5AB8FF'],['Alegria','#FFD23F'],['Energia','#FF8A5C'],['Leveza','#3FE0D0'],['Curiosidade','#A98BFF'],['Saudade','#FF6FA3'],['Cansaço','#8C93B5']];
  var LEVA=[['🔍','Descobri algo sobre mim'],['🌅','Lembrei de algo bom'],['🌬️','Relaxei'],['🎉','Me diverti'],['🌫️','Nada de especial']];
  var PRECO=[['1 de 4','Abaixo de quanto o 7entidos seria tão barato que você desconfiaria?','barato demais'],['2 de 4','Que preço seria uma pechincha?','pechincha'],['3 de 4','A partir de quanto começa a ficar caro?','ficando caro'],['4 de 4','A partir de quanto você desistiria de comprar?','caro demais']];
  var PES=[['👨‍👩‍👧','Família'],['🫂','Amigos'],['💞','Meu amor'],['💼','Colegas'],['🤔','Talvez'],['🙅','Ninguém']];
  var IDEIAS=['Mais sons de natureza','Achei longo','Amei os mini-jogos','Queria ver a minha pintura'];
  var css=[
   '.fch{display:flex;flex-direction:column;gap:14px;min-height:calc(100vh - 140px)}',
   '@keyframes fchin{from{opacity:0;transform:translateY(10px)}to{opacity:1}}',
   '.fch-bars{display:flex;gap:4px}.fch-bars i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.15)}.fch-bars i.ok{background:#F4F1EA}.fch-bars i.at{background:#FFD43B}',
   '.fch-k{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#FFD43B;text-align:center}',
   '.fch-luzes{display:flex;gap:7px;justify-content:center}.fch-luzes i{width:10px;height:10px;border-radius:50%;animation:fchp 2.4s ease-in-out infinite}',
   '@keyframes fchp{50%{transform:scale(1.35);filter:brightness(1.3)}}',
   '.fch-fala{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:24px;line-height:1.25;text-align:center;margin:0;text-wrap:balance}',
   '.fch-mute{color:#AEB5D6;font-size:14px;text-align:center;margin:0}',
   '.fch-ceu{position:relative;height:270px;border-radius:22px;background:radial-gradient(circle at 50% 50%,#141c45,#0B1028 70%);overflow:hidden}',
   '.fch-centro{position:absolute;left:50%;top:50%;width:88px;height:88px;margin:-44px 0 0 -44px;border-radius:50%;display:grid;place-items:center;text-align:center;font-weight:800;font-size:13px;color:#0A0F24;transition:background .6s,box-shadow .6s}',
   '.fch-astro{position:absolute;width:80px;margin-left:-40px;display:grid;justify-items:center;gap:3px;cursor:pointer;background:none;border:0;color:#F4F1EA;font:inherit;font-size:12.5px;font-weight:700;transition:transform .5s cubic-bezier(.2,.7,.2,1),opacity .4s;min-height:44px}',
   '.fch-astro i{width:24px;height:24px;border-radius:50%;box-shadow:0 0 14px currentColor}',
   '.fch-ponte{height:14px;border-radius:14px}',
   '.fch-res{font-family:Fraunces,Georgia,serif;font-size:21px;text-align:center;margin:0;text-wrap:balance}.fch-res b{font-weight:400;color:#FFD43B}',
   '.fch-acoes{margin-top:auto;display:grid;gap:6px}',
   '.fch-btn{font:inherit;font-weight:800;font-size:16px;border:1px solid #FFD43B;background:#FFD43B;color:#0A0F24;border-radius:999px;padding:14px 20px;cursor:pointer;min-height:50px}.fch-btn:disabled{opacity:.35;cursor:not-allowed}',
   '.fch-btn.sec{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18);color:#F4F1EA}',
   '.fch-pular{font:inherit;font-size:14px;background:none;border:0;color:#AEB5D6;text-decoration:underline;cursor:pointer;justify-self:center;padding:8px}',
   '.fch-lembr{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
   '.fch-lc{font:inherit;color:#F4F1EA;background:#111A3D;border:1px solid #26315F;border-radius:18px;padding:14px 10px;cursor:pointer;display:grid;gap:6px;justify-items:center;text-align:center;font-weight:700;font-size:14px;transition:transform .5s cubic-bezier(.5,-.4,.5,1.4),opacity .5s}',
   '.fch-lc span{font-size:34px;line-height:1}.fch-lc.voa{transform:translateY(160px) scale(.3);opacity:0}.fch-lc:last-child{grid-column:1/-1}',
   '.fch-bolsa{align-self:center;font-size:56px;line-height:1;transition:transform .3s}.fch-bolsa.pula{transform:scale(1.25) rotate(-6deg)}',
   '.fch-regua{position:relative;height:100px;margin:6px 4px 0}',
   '.fch-trilho{position:absolute;left:0;right:0;top:54px;height:10px;border-radius:10px;background:linear-gradient(90deg,#3FE0D0,#7DDB8B 30%,#FFD43B 55%,#FF8A5C 75%,#FF5A6A)}',
   '.fch-zona{position:absolute;top:48px;height:22px;border-radius:8px;border:2px solid #fff;box-shadow:0 0 18px rgba(255,255,255,.6)}',
   '.fch-pino{position:absolute;top:42px;width:4px;height:34px;margin-left:-2px;border-radius:3px;background:#fff;opacity:.85}.fch-pino small{position:absolute;top:36px;left:50%;transform:translateX(-50%);font-size:11px;color:#AEB5D6;font-weight:700}',
   '.fch-etq{position:absolute;top:0;transform:translateX(-50%);background:#FFD43B;color:#0A0F24;font-weight:800;border-radius:10px;padding:6px 10px;font-variant-numeric:tabular-nums;white-space:nowrap}',
   '.fch-etq:after{content:"";position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-bottom:0;border-top-color:#FFD43B}',
   '.fch-regua input{position:absolute;left:-8px;top:40px;width:calc(100% + 16px);height:44px;opacity:0;cursor:grab;margin:0}',
   '.fch-pq{font-family:Fraunces,Georgia,serif;font-size:21px;line-height:1.25;text-align:center;margin:0;text-wrap:balance}',
   '.fch-faixa{background:#111A3D;border:1px solid #FFD43B;border-radius:18px;padding:14px;text-align:center}.fch-faixa b{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:30px;color:#FFD43B;display:block;font-variant-numeric:tabular-nums}',
   '.fch-leg{display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-size:13px;color:#AEB5D6}.fch-leg b{color:#F4F1EA}',
   '.fch-pessoas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
   '.fch-ps{font:inherit;color:#F4F1EA;background:#111A3D;border:1px solid #26315F;border-radius:18px;padding:12px 6px;cursor:pointer;display:grid;gap:4px;justify-items:center;font-size:13px;font-weight:700}.fch-ps span{font-size:32px;line-height:1}.fch-ps.on{border-color:#FFD43B;box-shadow:0 0 0 2px #FFD43B}',
   '.fch-caixa{align-self:center;font-size:64px;line-height:1}.fch-caixa.abre{animation:fchab .7s ease}@keyframes fchab{30%{transform:scale(1.3) rotate(8deg)}60%{transform:scale(.9) rotate(-6deg)}}',
   '.fch textarea{font:inherit;font-size:16px;width:100%;min-height:110px;padding:12px 14px;border-radius:16px;border:1px solid #26315F;background:#111A3D;color:#F4F1EA;resize:vertical}',
   '.fch-ideias{display:flex;flex-wrap:wrap;gap:6px}.fch-ideias button{font:inherit;font-size:13px;font-weight:700;border:1px dashed #26315F;background:none;color:#AEB5D6;border-radius:999px;padding:7px 11px;cursor:pointer;min-height:36px}',
   '.fch-cartao{border-radius:24px;padding:22px;color:#0A0F24;display:grid;gap:8px}.fch-cartao .t{font-family:Fraunces,Georgia,serif;font-size:26px;line-height:1.2}.fch-cartao small{font-weight:700;opacity:.8}',
   '.fch button:focus-visible,.fch textarea:focus-visible{outline:3px solid #FFD43B;outline-offset:2px}',
   '@media (prefers-reduced-motion:reduce){.fch,.fch *{animation:none!important;transition:none!important}}'].join('');
  var st=document.createElement('style');st.textContent=css;(document.head||document.documentElement).appendChild(st);
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function cor(n){for(var i=0;i<LUZ.length;i++)if(LUZ[i][0]===n)return LUZ[i][1];return '#FFD43B';}
  function luzes(){return '<div class="fch-luzes">'+LUZ.map(function(l,i){return '<i style="background:'+l[1]+';animation-delay:'+(i*.15)+'s"></i>';}).join('')+'</div>';}
  function ceu(acao,sel,centro,centroCor){return '<div class="fch-ceu"><div class="fch-centro" style="background:'+(centroCor||'#26315F')+';box-shadow:0 0 40px '+(centroCor||'transparent')+';color:'+(centroCor?'#0A0F24':'#AEB5D6')+'">'+esc(centro)+'</div>'+
    LUZ.map(function(l,i){var a=(-90+i*360/7)*Math.PI/180;var x=50+Math.cos(a)*36,y=50+Math.sin(a)*38;var e=sel===l[0];
      return '<button type="button" class="fch-astro" data-a="'+acao+'" data-v="'+l[0]+'" style="left:'+x+'%;top:calc('+y+'% - 20px);color:'+l[1]+';'+(sel&&!e?'opacity:.25;':'')+(e?'transform:scale(1.25)':'')+'"><i style="background:'+l[1]+'"></i>'+l[0]+'</button>';}).join('')+'</div>';}
  var N=6;
  function bars(k){var h='<div class="fch-bars">';for(var i=0;i<N;i++)h+='<i class="'+(i<k?'ok':i===k?'at':'')+'"></i>';return h+'</div>';}
  window.FCH={
    LUZ:LUZ,
    /* tela da chegada, antes dos mini-jogos */
    chega:function(f){f=f||{};return '<div class="fch"><div class="fch-k">Antes de começar a Fase 2</div><div>'+luzes()+'</div><p class="fch-fala">Como você chega hoje?</p>'+
      ceu('fchchega',f.chega,f.chega||'?',f.chega?cor(f.chega):null)+
      '<p class="fch-mute">'+(f.chega?'No fim da fase eu te pergunto de novo, para ver o que mudou.':'Toque numa luz')+'</p>'+
      '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchcomeca" '+(f.chega?'':'disabled')+'>Começar a Fase 2 →</button></div></div>';},
    /* telas do fim */
    tela:function(f){var k=f.k||0;var h='<div class="fch">'+bars(k);
      if(k===0){h+='<p class="fch-fala">Você chegou <span style="color:'+cor(f.chega)+'">'+esc(f.chega||'—')+'</span>.<br>E agora, como você sai?</p>'+
        ceu('fchsai',f.sai,f.sai||f.chega||'?',f.sai?'linear-gradient(135deg,'+cor(f.chega)+','+cor(f.sai)+')':(f.chega?cor(f.chega):null))+
        (f.sai?'<div class="fch-ponte" style="background:linear-gradient(90deg,'+cor(f.chega)+','+cor(f.sai)+')"></div><p class="fch-res">Você chegou <b>'+esc(f.chega)+'</b> e sai <b>'+esc(f.sai)+'</b>.</p>':'<p class="fch-mute">Toque numa luz</p>')+
        '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchvai" '+(f.sai?'':'disabled')+'>Seguir →</button></div>';}
      if(k===1){h+='<p class="fch-fala">O que você leva desta fase?</p><div class="fch-lembr">'+LEVA.map(function(l){return '<button type="button" class="fch-lc '+(f.leva===l[1]?'voa':'')+'" data-a="fchleva" data-v="'+l[1]+'"><span>'+l[0]+'</span>'+l[1]+'</button>';}).join('')+'</div>'+
        '<div class="fch-bolsa" id="fchbolsa">👜</div>'+(f.leva?'<p class="fch-res">Na sua bolsa: <b>'+esc(f.leva)+'</b></p>':'')+
        '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchvai" '+(f.leva?'':'disabled')+'>Seguir →</button></div>';}
      if(k===2){var pr=f.pr||{};var v=pr.v||[10,20,35,50];var pi=pr.i||0;var fim=pi>=4;var p=PRECO[Math.min(pi,3)];var min=pi>0&&!fim?v[pi-1]:0;
        h+='<div>'+luzes()+'</div><p class="fch-fala" style="font-size:20px">Você me ajuda a dar um preço justo ao 7entidos?</p>'+
          (fim?'<div class="fch-faixa"><span class="fch-mute">O seu preço justo</span><b>R$ '+v[1]+' a R$ '+v[2]+'</b><span class="fch-mute">Obrigado! Isso me ajuda muito.</span></div>':'<div class="fch-k">Pergunta '+p[0]+'</div><p class="fch-pq">'+p[1]+'</p>')+
          '<div class="fch-regua"><div class="fch-trilho"></div>'+(fim?'<div class="fch-zona" style="left:'+v[1]+'%;width:'+Math.max(2,v[2]-v[1])+'%"></div>':'')+
          v.slice(0,fim?4:pi).map(function(x,i){return '<div class="fch-pino" style="left:'+x+'%"><small>'+(i+1)+'</small></div>';}).join('')+
          (fim?'':'<div class="fch-etq" id="fchetq" style="left:'+v[pi]+'%">R$ '+v[pi]+'</div><input type="range" min="'+min+'" max="100" step="1" value="'+v[pi]+'" id="fchrg" aria-label="'+esc(p[1])+'">')+'</div>'+
          (fim?'<div class="fch-leg">'+PRECO.map(function(q,i){return '<span>'+(i+1)+'. '+q[2]+': <b>R$ '+v[i]+'</b></span>';}).join('')+'</div>':'<p class="fch-mute">'+(pi===0?'O 7entidos completo: as 7 fases, a sua pintura, o Museu dos 7 pintores e o Hall da Fama.<br>':'')+'Arraste a etiqueta amarela · de R$ 0 a R$ 100</p>')+
          '<div class="fch-acoes">'+(fim?'<button type="button" class="fch-btn" data-a="fchvai">Seguir →</button>':'<button type="button" class="fch-btn" data-a="fchpreco">'+(pi<3?'Próxima →':'Ver o meu preço justo →')+'</button><button type="button" class="fch-pular" data-a="fchpula">Agora não</button>')+'</div>';}
      if(k===3){h+='<p class="fch-fala">Para quem você daria o 7entidos de presente?</p><div class="fch-caixa" id="fchcaixa">🎁</div><div class="fch-pessoas">'+
        PES.map(function(p){return '<button type="button" class="fch-ps '+(f.pres===p[1]?'on':'')+'" data-a="fchpres" data-v="'+p[1]+'"><span>'+p[0]+'</span>'+p[1]+'</button>';}).join('')+'</div>'+
        '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchvai" '+(f.pres?'':'disabled')+'>Seguir →</button><button type="button" class="fch-pular" data-a="fchvai">Pular</button></div>';}
      if(k===4){h+='<p class="fch-fala">Quer me deixar um recado?</p><p class="fch-mute">Uma ideia, uma crítica, um elogio. É opcional.</p><textarea id="fchrec" maxlength="400" placeholder="Escreva aqui…">'+esc(f.sug||'')+'</textarea>'+
        '<div class="fch-ideias">'+IDEIAS.map(function(t){return '<button type="button" data-a="fchideia" data-v="'+t+'">+ '+t+'</button>';}).join('')+'</div>'+
        '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchvai">'+((f.sug||'').trim()?'Enviar e seguir →':'Seguir sem recado →')+'</button></div>';}
      if(k===5){h+='<div class="fch-cartao" style="background:linear-gradient(160deg,'+cor(f.chega)+','+cor(f.sai||f.chega)+')"><small>7entidos · Fase 2</small><div class="t">Cheguei '+esc(f.chega||'—')+'.<br>Saí '+esc(f.sai||'—')+'.</div><small>Levei: '+esc(f.leva||'—')+'</small></div>'+
        '<div>'+luzes()+'</div><p class="fch-fala" style="font-size:21px">Está tudo guardado. A Fase 3 traz as suas lembranças.</p>'+
        '<div class="fch-acoes"><button type="button" class="fch-btn" data-a="fchfim">Continuar para a Fase 3 →</button></div>';}
      return h+'</div>';},
    /* ações; devolve true se tratou */
    acao:function(a,v,f){f.pr=f.pr||{};
      if(a==='fchchega'){f.chega=v;return true;}
      if(a==='fchsai'){f.sai=v;return true;}
      if(a==='fchleva'){f.leva=v;return true;}
      if(a==='fchpres'){f.pres=v;return true;}
      if(a==='fchvai'){f.k=Math.min(5,(f.k||0)+1);return true;}
      if(a==='fchpula'){f.pr.pular=true;f.pr.t=false;f.k=3;return true;}
      if(a==='fchpreco'){var pr=f.pr;pr.v=(pr.v||[10,20,35,50]).slice();pr.i=pr.i||0;pr.t=true;pr.pular=false;
        if(pr.i<3){pr.i++;for(var j=pr.i;j<4;j++)if(pr.v[j]<pr.v[j-1])pr.v[j]=pr.v[j-1];}else pr.i=4;return true;}
      if(a==='fchideia'){var t=document.getElementById('fchrec');var cur=t?t.value.trim():(f.sug||'');f.sug=(cur?cur+'. ':'')+v;return true;}
      return false;},
    /* arrastar a etiqueta do preço */
    arrasta:function(e,f){if(!e.target||e.target.id!=='fchrg')return false;var pr=f.pr=f.pr||{};pr.v=(pr.v||[10,20,35,50]).slice();var i=pr.i||0;var val=+e.target.value;pr.v[i]=val;pr.t=true;
      var t=document.getElementById('fchetq');if(t){t.style.left=val+'%';t.textContent='R$ '+val;}return true;},
    recado:function(e,f){if(!e.target||e.target.id!=='fchrec')return false;f.sug=e.target.value.slice(0,400);return true;}
  };
})();
