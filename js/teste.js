/* 7entidos · teste rápido de 3 perguntas, prévia, contato e resultado (Blocos 7 a 10 e 12, 13/11/2026)
   Textos iniciais para o Daniel validar. */
(function(){
  "use strict";
  /* ---------- textos ---------- */
  var PERGUNTAS=[
    {t:"O que mais te acalma?",o:[["O mar","visao"],["Uma música","audicao"],["Um abraço","tato"],["Cheiro de café","olfato"]]},
    {t:"O que te dá mais energia?",o:[["Uma comida gostosa","paladar"],["Dançar","equilibrio"],["Alongar o corpo","corpo"],["Sol da manhã","visao"]]},
    {t:"Qual momento você queria repetir hoje?",o:[["Ouvir a chuva","audicao"],["Banho quente","tato"],["Cheiro de bolo no forno","olfato"],["Balançar na rede","equilibrio"]]}
  ];
  var S={
    visao:{nome:"Visão",cor:"#f5c542",pintor:"visao",micro:"Interessante: o olhar mexe com você.",
      f:["Você se sente bem quando os olhos encontram beleza.","Luz, cor e paisagem mudam o seu humor mais do que parece.","Experimente: hoje, pare um minuto só para olhar o céu."]},
    audicao:{nome:"Audição",cor:"#4aa8ff",pintor:"audicao",micro:"Interessante: o som mexe com você.",
      f:["O som tem o poder de te trazer de volta para o agora.","A música certa muda o rumo do seu dia.","Experimente: escolha uma música e ouça de olhos fechados, sem fazer mais nada."]},
    tato:{nome:"Tato",cor:"#ff8a3d",pintor:"tato",micro:"Interessante: o toque mexe com você.",
      f:["Você sente o mundo pela pele.","Um abraço, um tecido macio ou a água morna te acalmam.","Experimente: repare na textura de algo que você toca todo dia."]},
    olfato:{nome:"Olfato",cor:"#5ccf8a",pintor:"olfato",micro:"Interessante: os cheiros mexem com você.",
      f:["Os cheiros abrem as gavetas da sua memória.","Um aroma pode te levar de volta a um lugar feliz.","Experimente: escolha um cheiro que te faz bem e deixe por perto."]},
    paladar:{nome:"Paladar",cor:"#ff5a6e",pintor:"paladar",micro:"Interessante: os sabores mexem com você.",
      f:["Para você, sabor é carinho.","Comer com calma e cozinhar te fazem bem.","Experimente: na próxima refeição, saboreie a primeira garfada devagar."]},
    equilibrio:{nome:"Equilíbrio",cor:"#b48cff",pintor:"equilibrio",micro:"Interessante: o movimento mexe com você.",
      f:["Você se sente bem quando o corpo se mexe.","Dançar, balançar e caminhar te deixam mais leve.","Experimente: coloque uma música e se mexa por um minuto."]},
    corpo:{nome:"Noção do corpo",cor:"#3fd6d0",pintor:"corpo",micro:"Interessante: o seu corpo fala alto.",
      f:["Você se sente bem quando está à vontade no próprio corpo.","Alongar, respirar fundo e cuidar da postura te dão presença.","Experimente: espreguice devagar, como quem acorda de um sono bom."]}
  };
  /* Envio automático do retrato por e-mail: só vira true quando o robô da planilha estiver preparado para mandar e-mail. */
  var ENVIA_EMAIL=false;

  /* ---------- guarda no navegador ---------- */
  function ler(k,pad){try{var v=localStorage.getItem(k);return v===null?pad:JSON.parse(v);}catch(e){return pad;}}
  function grava(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var CH="7e_teste_v1";
  var E=ler(CH,null)||{r:[],fase:"q"};
  var PID=ler("7e_pid",null); if(!PID){PID="t"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);grava("7e_pid",PID);}

  /* ---------- versão do título (Bloco 12) ---------- */
  var V=ler("7e_titulo",null); if(V!=="A"&&V!=="B"){V=Math.random()<.5?"A":"B";grava("7e_titulo",V);}
  var tit=document.getElementById("titulo");
  if(tit&&V==="B") tit.innerHTML='Você sabe o que te faz <em>bem?</em> Descubra agora.';
  /* eventos (só funcionam depois do "OK" das estatísticas, porque o Google só liga depois disso) */
  function ev(n,extra){try{if(window.gtag){var p={versao_titulo:V};if(extra)for(var k in extra)p[k]=extra[k];window.gtag("event",n,p);}}catch(e){}}
  ev("chegou");

  var $=function(id){return document.getElementById(id);};
  var caixa=$("teste"), menos=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

  function sentidoFinal(){
    var c={},ult=null;
    E.r.forEach(function(i,q){var k=PERGUNTAS[q].o[i][1];c[k]=(c[k]||0)+1;ult=k;});
    var max=0;for(var k in c)if(c[k]>max)max=c[k];
    var emp=Object.keys(c).filter(function(k){return c[k]===max;});
    return emp.length===1?emp[0]:(emp.indexOf(ult)>=0?ult:emp[0]);
  }
  function estrelas(n){var h="";for(var i=0;i<3;i++)h+='<i class="'+(i<n?"on":"")+'"></i>';return '<span class="estrelas" aria-hidden="true">'+h+'</span>';}

  /* ---------- perguntas ---------- */
  function pergunta(q){
    var P=PERGUNTAS[q];
    caixa.innerHTML='<div class="t-topo"><span class="t-num">Nº 0'+(q+1)+' / 03</span>'+estrelas(q)+
      (q>0?'<button type="button" class="t-voltar" id="voltar">‹ voltar</button>':'<span></span>')+'</div>'+
      '<h2 class="t-perg">'+esc(P.t)+'</h2><div class="t-grade" role="radiogroup" aria-label="'+esc(P.t)+'">'+
      P.o.map(function(o,i){return '<button type="button" class="t-op" role="radio" aria-checked="false" data-i="'+i+'" style="--c:'+S[o[1]].cor+'">'+
        window.ICONE7(o[1],S[o[1]].cor,34)+'<span>'+esc(o[0])+'</span></button>';}).join("")+
      '</div><p class="t-priv">🔒 Suas respostas ficam só com você até você decidir.</p>';
    caixa.querySelectorAll(".t-op").forEach(function(b){b.addEventListener("click",function(){escolhe(q,+b.dataset.i,b);});});
    var v=$("voltar"); if(v) v.addEventListener("click",function(){E.r=E.r.slice(0,q-1);grava(CH,E);pergunta(q-1);});
  }
  var trava=false;
  function escolhe(q,i,b){
    if(trava)return; trava=true;
    b.classList.add("sel"); b.setAttribute("aria-checked","true");
    E.r=E.r.slice(0,q); E.r[q]=i; grava(CH,E);
    if(q===0) ev("tocou_pergunta_1");
    var k=PERGUNTAS[q].o[i][1];
    setTimeout(function(){
      if(q<2){
        caixa.innerHTML='<div class="t-micro" style="--c:'+S[k].cor+'">'+window.ICONE7(k,S[k].cor,44)+'<p>'+esc(S[k].micro)+'</p></div>';
        setTimeout(function(){trava=false;pergunta(q+1);},menos?300:1000);
      } else { trava=false; E.fase="previa"; grava(CH,E); ev("terminou_3"); previa(); }
    },300);
  }

  /* ---------- retrato ---------- */
  function retrato(k,completo){
    var s=S[k];
    return '<div class="retrato p-'+s.pintor+'" style="--c:'+s.cor+'"><div class="r-tex" aria-hidden="true"></div>'+
      '<span class="t-num">Seu sentido mais forte</span><div class="r-nome">'+window.ICONE7(k,s.cor,40)+'<b>'+esc(s.nome)+'</b></div>'+
      '<p>'+esc(s.f[0])+'</p><div class="'+(completo?"":"r-emb")+'"><p>'+esc(s.f[1])+'</p><p>'+esc(s.f[2])+'</p></div></div>';
  }

  /* ---------- prévia + contato (Bloco 8) ---------- */
  function previa(){
    var k=sentidoFinal();
    caixa.innerHTML=retrato(k,false)+
      '<h3 class="t-pede">Para onde mando o seu retrato completo?</h3>'+
      '<div class="t-canais"><button type="button" class="t-canal" data-c="whatsapp">'+icChat()+'WhatsApp</button><button type="button" class="t-canal" data-c="email">'+icMail()+'E-mail</button></div>'+
      '<form id="form" class="t-form" hidden novalidate>'+
        '<label>Seu nome<input id="fNome" autocomplete="given-name" required></label>'+
        '<label id="lCont"><span id="tCont">Seu WhatsApp com DDD</span><input id="fCont" required></label>'+
        '<p class="t-erro" id="erro" aria-live="polite"></p>'+
        '<button type="submit" class="cta t-enviar" id="enviar" disabled>Receber meu retrato</button>'+
        '<p class="t-mini">Só para mandar seu retrato. Sem spam. <a href="/privacidade.html">Privacidade</a></p>'+
        '<label class="t-check"><input type="checkbox" id="fNov"> Quero receber novidades do 7entidos</label>'+
      '</form>'+
      '<button type="button" class="t-pular" id="pular">Agora não, ver só a prévia</button>';
    var canal=null,form=$("form");
    caixa.querySelectorAll(".t-canal").forEach(function(b){b.addEventListener("click",function(){
      canal=b.dataset.c; caixa.querySelectorAll(".t-canal").forEach(function(x){x.classList.toggle("sel",x===b);});
      form.hidden=false; var c=$("fCont");
      if(canal==="whatsapp"){ $("tCont").textContent="Seu WhatsApp com DDD"; c.type="tel"; c.inputMode="tel"; c.autocomplete="tel"; c.placeholder="(13) 9 9999-9999"; }
      else { $("tCont").textContent="Seu e-mail"; c.type="email"; c.inputMode="email"; c.autocomplete="email"; c.placeholder="voce@email.com"; }
      c.value=""; valida(false); $("fNome").focus();
    });});
    function ok(){
      var n=$("fNome").value.trim(), c=$("fCont").value.trim();
      if(n.length<2) return "Escreva o seu nome.";
      if(canal==="whatsapp"){var d=c.replace(/\D/g,"");if(d.length<10||d.length>13)return "Confira o WhatsApp com DDD.";}
      else if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c)) return "Confira o e-mail.";
      return "";
    }
    function valida(mostra){var e=ok();$("enviar").disabled=!!e;$("erro").textContent=mostra?e:"";}
    ["fNome","fCont"].forEach(function(id){var el=$(id);el.addEventListener("input",function(){valida(false);});el.addEventListener("blur",function(){if(el.value)valida(true);});});
    form.addEventListener("submit",function(e){e.preventDefault();if(ok()){valida(true);return;}
      var dados={nome:$("fNome").value.trim(),canal:canal,contato:$("fCont").value.trim(),novidades:$("fNov").checked};
      envia(k,dados); E.fase="feito"; E.contato={nome:dados.nome,canal:canal}; grava(CH,E); ev("deixou_contato",{canal:canal}); resultado(k,dados);});
    $("pular").addEventListener("click",function(){E.fase="pulou";grava(CH,E);ev("pulou_contato");resultado(k,null);});
  }

  /* grava na planilha pelo mesmo robô da pesquisa (respeita a trava de teste de pesquisa/config.js) */
  function envia(k,d){
    var url=window.PESQUISA_URL||""; if(!url) return;
    var resp=E.r.map(function(i,q){return PERGUNTAS[q].o[i][0];}).join(" | ");
    var corpo={pesquisa:"teste-rapido",pessoa:PID,parcial:true,respostas:{
      nome:d.nome,canal:d.canal==="whatsapp"?"WhatsApp":"E-mail",contato:d.contato,sentido:S[k].nome,respostas:resp,
      novidades:d.novidades?"sim":"não",versao_titulo:V,etiqueta:d.canal==="whatsapp"?"mandar no WhatsApp":(ENVIA_EMAIL?"e-mail enviado":"mandar por e-mail"),
      data_hora:new Date().toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}};
    try{fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(corpo)}).catch(function(){});}catch(e){}
  }

  /* ---------- resultado, compartilhar, convite, YouTube (Bloco 9 e 10) ---------- */
  function resultado(k,d){
    var aviso="";
    if(d&&d.canal==="whatsapp") aviso='<p class="t-ok">Pronto, '+esc(d.nome)+'! Seu retrato também vai chegar no seu WhatsApp.</p>';
    else if(d&&ENVIA_EMAIL) aviso='<p class="t-ok">Pronto, '+esc(d.nome)+'! Mandamos o seu retrato para o seu e-mail.</p>';
    else if(d) aviso='<p class="t-ok">Pronto, '+esc(d.nome)+'! Anotamos o seu e-mail. Seu retrato completo está aqui.</p>';
    caixa.innerHTML=aviso+retrato(k,!!d)+
      (d?'<button type="button" class="ci-cta2 t-share" id="share">Mandar para uma amiga</button><p class="t-mini" id="shareMsg" aria-live="polite"></p>':'')+
      '<a class="cta t-jornada" href="/pesquisa/" id="jornada">Continuar minha Jornada</a><p class="t-mini" style="text-align:center">7 fases · uma por sentido</p>'+
      '<a class="t-yt" href="https://www.youtube.com/@7Entidos" id="yt"><span class="t-yt-play" aria-hidden="true">▶</span><span>Assista à história no nosso canal do YouTube</span></a>'+
      '<button type="button" class="t-pular" id="refazer">Refazer o teste</button>';
    $("jornada").addEventListener("click",function(){ev("abriu_jornada");});
    $("yt").addEventListener("click",function(){ev("abriu_youtube");});
    $("refazer").addEventListener("click",function(){E={r:[],fase:"q"};grava(CH,E);pergunta(0);});
    if(d) $("share").addEventListener("click",function(){compartilha(k);});
  }

  function compartilha(k){
    var s=S[k],cv=document.createElement("canvas");cv.width=1080;cv.height=1350;var g=cv.getContext("2d");
    g.fillStyle="#0B1430";g.fillRect(0,0,1080,1350);
    var gr=g.createRadialGradient(860,240,10,860,240,620);gr.addColorStop(0,s.cor+"55");gr.addColorStop(1,"#0B143000");g.fillStyle=gr;g.fillRect(0,0,1080,1350);
    g.strokeStyle="rgba(169,179,209,.07)";for(var x=0;x<1080;x+=36){g.beginPath();g.moveTo(x,0);g.lineTo(x,1350);g.stroke();}for(var y=0;y<1350;y+=36){g.beginPath();g.moveTo(0,y);g.lineTo(1080,y);g.stroke();}
    g.fillStyle="#F5C542";g.font="400 34px 'Space Mono',monospace";g.fillText("Meu sentido mais forte",90,200);
    g.fillStyle=s.cor;g.beginPath();g.arc(140,330,46,0,6.283);g.fill();
    g.fillStyle="#F3EEE3";g.font="600 110px Fraunces,Georgia,serif";g.fillText(s.nome,220,370);
    g.font="400 46px Manrope,system-ui,sans-serif";var yy=520;
    s.f.forEach(function(fr){var pal=fr.split(" "),l="";pal.forEach(function(p){var t=l?l+" "+p:p;if(g.measureText(t).width>880){g.fillText(l,90,yy);yy+=64;l=p;}else l=t;});g.fillText(l,90,yy);yy+=100;});
    g.fillStyle="#A9B3D1";g.font="400 36px Manrope,system-ui,sans-serif";g.fillText("Descubra o seu em 30 segundos:",90,1190);
    g.fillStyle="#F5C542";g.font="800 46px Manrope,system-ui,sans-serif";g.fillText("7entidos.com.br",90,1260);
    var msg=$("shareMsg");
    cv.toBlob(function(b){
      var arq=new File([b],"meu-sentido-7entidos.png",{type:"image/png"});
      if(navigator.canShare&&navigator.canShare({files:[arq]})){
        navigator.share({files:[arq],text:"Meu sentido mais forte é "+s.nome+". Descubra o seu: https://7entidos.com.br"}).catch(function(){});
      } else {
        var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=arq.name;document.body.appendChild(a);a.click();a.remove();
        msg.innerHTML='Imagem baixada. Mande junto este link: <b>https://7entidos.com.br</b>';
      }
    },"image/png");
  }

  function icChat(){return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>';}
  function icMail(){return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';}

  /* ---------- início: continua de onde parou ---------- */
  function inicio(){
    if(E.fase==="feito"||E.fase==="pulou"){resultado(sentidoFinal(),E.fase==="feito"?{nome:(E.contato||{}).nome||"",canal:(E.contato||{}).canal||"email"}:null);return;}
    if(E.fase==="previa"&&E.r.length===3){previa();return;}
    if(E.r.length>0&&E.r.length<3){
      var falta=3-E.r.length;
      caixa.innerHTML='<div class="t-volta"><h2 class="t-perg">Que bom te ver de novo!</h2><p>Faltam só '+falta+' pergunta'+(falta>1?"s":"")+'.</p>'+
        '<button type="button" class="cta" id="cont">Continuar</button><button type="button" class="t-pular" id="zero">Começar do zero</button></div>';
      $("cont").addEventListener("click",function(){pergunta(E.r.length);});
      $("zero").addEventListener("click",function(){E={r:[],fase:"q"};grava(CH,E);pergunta(0);});
      return;
    }
    pergunta(0);
  }
  inicio();
})();
