/* 7entidos · ícones dos 7 sentidos (Bloco 5, 13/11/2026)
   Desenhos de linha fina, traço 1,6, na cor do sentido. Um lugar só para todos os ícones.
   Uso em JavaScript: ICONE7("visao")  ou  ICONE7("Visão", "#f5c542", 28)
   Uso em HTML: <i data-icone="audicao"></i>  (o ícone é desenhado sozinho) */
(function(){
  var COR={visao:"#f5c542",audicao:"#4aa8ff",tato:"#ff8a3d",olfato:"#5ccf8a",paladar:"#ff5a6e",equilibrio:"#b48cff",corpo:"#3fd6d0"};
  var D={
    visao:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    audicao:'<path d="M7 9a5 5 0 0 1 10 0c0 3-2 4-3 5s-1 2-1 3a3 3 0 0 1-5 1"/><path d="M10 9a2 2 0 0 1 4 0"/>',
    tato:'<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v7M14 10.5V5.5a1.5 1.5 0 0 1 3 0v7.5a7 7 0 0 1-7 7c-2.5 0-4.2-1.2-5.4-3.2L3 13.5a1.5 1.5 0 0 1 2.6-1.5L8 15"/>',
    olfato:'<path d="M12 3c-1 5-4 8-4 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2"/><path d="M9 17c-1.5 0-3 1-3 2.5M15 17c1.5 0 3 1 3 2.5"/>',
    paladar:'<path d="M4 11c2.5-2 5-2 8 0 3-2 5.5-2 8 0-2 5-5 7-8 7s-6-2-8-7z"/><path d="M4 11h16"/>',
    equilibrio:'<path d="M3 9c3-3 6-3 9 0s6 3 9 0M3 15c3-3 6-3 9 0s6 3 9 0"/>',
    corpo:'<circle cx="12" cy="4.5" r="2"/><path d="M12 7v7M6 10h12M12 14l-3.5 6.5M12 14l3.5 6.5"/>'
  };
  function chave(s){
    s=String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    if(/vis|mapa/.test(s))return"visao"; if(/aud/.test(s))return"audicao"; if(/tat/.test(s))return"tato";
    if(/olf/.test(s))return"olfato"; if(/pal/.test(s))return"paladar"; if(/equi/.test(s))return"equilibrio";
    if(/corp/.test(s))return"corpo"; return"";
  }
  window.ICONE7=function(sentido,cor,tam){
    var k=chave(sentido); if(!k) return "";
    tam=tam||24; cor=cor||COR[k];
    return '<svg class="icone7" viewBox="0 0 24 24" width="'+tam+'" height="'+tam+'" fill="none" stroke="'+cor+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle">'+D[k]+'</svg>';
  };
  window.ICONE7.cores=COR;
  function hidrata(raiz){ (raiz||document).querySelectorAll("[data-icone]:not([data-feito])").forEach(function(el){ el.innerHTML=window.ICONE7(el.getAttribute("data-icone"),el.getAttribute("data-cor"),+el.getAttribute("data-tam")||24); el.setAttribute("data-feito","1"); }); }
  if(document.readyState!=="loading") hidrata(); else document.addEventListener("DOMContentLoaded",function(){hidrata();});
  window.ICONE7.hidrata=hidrata;
})();
