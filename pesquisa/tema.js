/* Visual novo da pesquisa: troca o estilo tela por tela e mostra a barrinha de validação da prévia */
(function(){
  var NOMES={C:"Contemporânea",X:"Criativa",M:"Moderna"};
  var SWIRL='<svg viewBox="0 0 200 200" fill="none" stroke-linecap="round"><g stroke="#6F93E8" stroke-width="5"><path d="M100 100m-10 0a10 10 0 1 1 20 0a20 20 0 1 1-40 0a30 30 0 1 1 60 0a40 40 0 1 1-80 0a50 50 0 1 1 100 0a60 60 0 1 1-120 0a70 70 0 1 1 140 0"/></g><g stroke="#F5C542" stroke-width="2" opacity=".7"><path d="M100 100m-15 0a15 15 0 1 1 30 0a25 25 0 1 1-50 0a35 35 0 1 1 70 0a45 45 0 1 1-90 0a55 55 0 1 1 110 0"/></g></svg>';
  function fx(t){
    if(t==="C"){var st="";for(var i=0;i<22;i++){st+='<i class="st" style="left:'+((i*41)%96+2)+'%;top:'+((i*23)%88+4)+'%;animation-delay:'+((i%5)*.4)+'s"></i>';}
      return '<div class="sw1">'+SWIRL+'</div><div class="sw2">'+SWIRL+'</div><div class="moon"></div>'+st;}
    if(t==="X") return '<div class="big7">7</div><div class="scan"></div>';
    return '<div class="spin"></div>';
  }
  var atual=null, tela=null;
  var V={}; try{V=JSON.parse(localStorage.getItem("visualV6")||"{}")}catch(e){}
  function salva(){ try{localStorage.setItem("visualV6",JSON.stringify(V))}catch(e){} }
  var aberto=null; /* null | "rev" | "lista" */
  var REV=["Cor de fundo","Fonte","Logotipo","Botões","Letra maior","Letra menor","Muito parado","Muito agitado","Difícil de ler","Trocar o estilo"];

  function set(t,s,id,nome){
    var b=document.body; if(!b) return;
    if(t!==atual){
      b.classList.remove("t-C","t-X","t-M"); b.classList.add("t-"+t);
      var f=document.getElementById("tfx"); if(!f){f=document.createElement("div");f.id="tfx";b.insertBefore(f,b.firstChild);}
      f.innerHTML=fx(t); atual=t;
    }
    b.style.setProperty("--s", s||"#F5C542");
    if(!tela||tela.id!==id) aberto=null;
    tela={id:id,nome:nome,t:t}; barra();
  }
  function marca(st){ var k=tela.id; V[k]={nome:tela.nome,estilo:NOMES[tela.t],s:st,rev:(V[k]&&V[k].rev)||[]}; if(st==="validado"){V[k].rev=[];aberto=null;} else aberto="rev"; salva(); barra(); }
  function togRev(r){ var k=tela.id; V[k]=V[k]||{nome:tela.nome,estilo:NOMES[tela.t],s:"revisar",rev:[]}; V[k].s="revisar"; var i=V[k].rev.indexOf(r); if(i>=0)V[k].rev.splice(i,1); else V[k].rev.push(r); salva(); barra(); }
  function texto(){ return "VALIDAÇÃO DO VISUAL · prévia v6\n"+Object.keys(V).map(function(k){var x=V[k];return "- "+x.nome+" ("+x.estilo+"): "+(x.s==="validado"?"validado":"revisar ("+(x.rev.join(", ")||"sem detalhe")+")");}).join("\n"); }
  var NO_SITE=/(^|\.)7entidos\.com\.br$/.test(location.hostname);
  function barra(){
    if(NO_SITE) return; /* no site oficial o público não vê a barrinha de validação */
    var el=document.getElementById("tv"); if(!el){el=document.createElement("div");el.id="tv";document.body.appendChild(el);}
    if(!tela){el.innerHTML="";return;}
    var v=V[tela.id], n=Object.keys(V).length;
    var h='<div class="pill"><span>Estilo: <b>'+NOMES[tela.t]+'</b></span>'+
      '<button class="v '+(v&&v.s==="validado"?"on":"")+'" data-a="val">✓ Validado</button>'+
      '<button class="r '+(v&&v.s==="revisar"?"on":"")+'" data-a="rev">✎ Revisar</button>'+
      '<button data-a="lista" title="Ver o que já marquei">📋 '+n+'</button></div>';
    if(aberto==="rev"){
      var sel=(v&&v.rev)||[];
      h+='<div class="box"><p>'+tela.nome+': o que muda?</p><div class="ch">'+REV.map(function(r){return '<button class="'+(sel.indexOf(r)>=0?"sel":"")+'" data-r="'+r+'">'+r+'</button>';}).join("")+'</div><p style="font-weight:400;font-size:16px;color:#cfc8d8">Fica anotado. Depois é só copiar a lista e me mandar.</p><button class="min" data-a="fecha">fechar</button></div>';
    } else if(aberto==="lista"){
      h+='<div class="box"><p>O que você já marcou ('+n+')</p><ul>'+(n?Object.keys(V).map(function(k){var x=V[k];return "<li>"+x.nome+": "+(x.s==="validado"?"✓ validado":"✎ revisar ("+(x.rev.join(", ")||"sem detalhe")+")")+"</li>";}).join(""):"<li>nada ainda</li>")+'</ul><div class="ch"><button class="v" data-a="copia">Copiar para me mandar</button><button class="min" data-a="fecha">fechar</button></div></div>';
    }
    el.innerHTML=h;
    el.onclick=function(e){var b=e.target.closest("button");if(!b)return;var a=b.getAttribute("data-a"),r=b.getAttribute("data-r");
      if(r) return togRev(r);
      if(a==="val") return marca("validado");
      if(a==="rev") return marca("revisar");
      if(a==="lista"){aberto=aberto==="lista"?null:"lista";return barra();}
      if(a==="fecha"){aberto=null;return barra();}
      if(a==="copia"){try{navigator.clipboard.writeText(texto()).then(function(){b.textContent="Copiado ✓";},function(){b.textContent="Não deu para copiar";});}catch(err){b.textContent="Não deu para copiar";}}
    };
  }
  window.TEMA={set:set};
})();
