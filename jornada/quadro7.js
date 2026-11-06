/* Quadro dos 7 sentidos (06/11/2026, prévia na branch imagens-adultas · Sala do Quadro).
   Junta as 7 favoritas da pessoa (a 1ª escolha de cada sentido) num quadro só, com elementos tirados
   das pinturas dos pintores do Museu, sem copiar obras:
   Klimt (ouro, mosaico, espirais) · Van Gogh (redemoinhos, ciprestes, estrelas) · Monet (lago, nenúfares, ponte)
   Frida Kahlo (coroa de flores, folhas grandes, moldura) · Picasso (facetas, olho de frente e de lado)
   Dalí (deserto, sombras longas, relógio que derrete) · Museu (cada sentido no seu pintor, numa parede de molduras).
   Cada pessoa ganha um quadro único: as posições e os detalhes variam com uma semente tirada das escolhas dela.
   Uso: Q7.quadro(estilo, J) -> <svg> 300x300 · Q7.ESTILOS · Q7.estiloDe(J) */
(function(){
  var IDS=['mapa','aud','tato','olf','pal','equi','corpo'];
  var NOMES=['Visão','Audição','Tato','Olfato','Paladar','Equilíbrio','Noção do corpo'];
  var COR=['#FFD23F','#5AB8FF','#FF8A5C','#7DDB8B','#FF6FA3','#A98BFF','#3FE0D0'];
  var ESTILOS={
    klimt:{nome:'Árvore dourada',pintor:'Klimt',frase:'Ouro, mosaico e espirais: as 7 favoritas viram medalhões numa árvore.'},
    vangogh:{nome:'Noite em redemoinho',pintor:'Van Gogh',frase:'Céu em pinceladas que giram: cada favorita é uma estrela acesa.'},
    monet:{nome:'Lago de nenúfares',pintor:'Monet',frase:'Água em manchas de luz: cada favorita flutua numa folha.'},
    frida:{nome:'Coroa de flores',pintor:'Frida Kahlo',frase:'A Visão no centro e as outras 6 numa coroa de flores e folhas.'},
    picasso:{nome:'Rosto em facetas',pintor:'Picasso',frase:'Um rosto em pedaços: cada pedaço guarda um sentido.'},
    dali:{nome:'Deserto do sonho',pintor:'Dalí',frase:'As favoritas flutuam no deserto, com sombras longas e um relógio mole.'},
    museu:{nome:'Parede do museu',pintor:'Os 6 pintores',frase:'Cada favorita no quadro do seu pintor, numa parede de molduras.'}};
  /* Visão → pintor do quadro (regra "o pintor da sua favorita da Visão") */
  var DA_VISAO={redemoinho:'vangogh',estrelado:'vangogh',facetas:'picasso',nascer:'monet',pordosol:'monet',derrete:'dali',jardim:'frida',mosaico:'klimt'};

  function hash(t){var h=2166136261;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)||7;}
  function semente(J){var t=(J&&J.id||'')+'|'+IDS.map(function(id){return ((J&&J.esc&&J.esc[id])||[]).join(',');}).join('|');var sd=hash(t);
    return function(){sd=sd*16807%2147483647;return sd/2147483647;};}
  function favs(J){var P=window.ARTE7_PATHS||{},A=window.ARTE7||{};return IDS.map(function(id,k){var n=((J&&J.esc&&J.esc[id])||[])[0]||null;
    return {id:id,k:k,n:n,p:(n&&P[id]&&P[id][n])||null,arte:(n&&A[id]&&A[id][n])||null,cor:COR[k]};});}
  function estiloDe(J,O){O=O||{};if(J&&J.quadro&&ESTILOS[J.quadro])return J.quadro;
    if(O.quadroRegra==='visao'){var n=((J&&J.esc&&J.esc.mapa)||[])[0];var id=n&&(window.ARTE7_VISAO_ID||{})[n];return DA_VISAO[id]||'museu';}
    return ESTILOS[O.quadro]?O.quadro:'klimt';}
  /* desenha os traços de uma favorita centrados em (x,y), tamanho s */
  function desenho(f,x,y,s,tinta,larg,extra){if(!f.p)return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="'+(s*.3)+'" fill="'+tinta+'" opacity=".5">?</text>';
    var d=f.p.map(function(q){return '<path d="'+q+'"/>';}).join('');
    return '<g transform="translate('+(x-s/2).toFixed(1)+' '+(y-s/2).toFixed(1)+') scale('+(s/100).toFixed(3)+')" fill="none" stroke="'+tinta+'" stroke-width="'+(larg*100/s).toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round" '+(extra||'')+'>'+d+'</g>';}
  function svg(id,corpo,rot){return '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+(rot||'Quadro dos 7 sentidos')+'">'+corpo+'</svg>';}

  /* ---------- Klimt ---------- */
  function klimt(F,r,u){var s='<defs><radialGradient id="'+u+'g" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="#F8DE8A"/><stop offset=".6" stop-color="#D9A93A"/><stop offset="1" stop-color="#8A5E12"/></radialGradient>'+
      '<radialGradient id="'+u+'m" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#FFF7DC"/><stop offset="1" stop-color="#F1D894"/></radialGradient></defs><rect width="300" height="300" fill="url(#'+u+'g)"/>';
    for(var i=0;i<20;i++)for(var j=0;j<20;j++){var v=r();if(v<.16)s+='<rect x="'+(i*15+2)+'" y="'+(j*15+2)+'" width="8" height="8" fill="'+(v<.06?'#1E1408':v<.11?'#B5442E':'#FFF3C4')+'" opacity=".55"/>';else if(v<.24)s+='<circle cx="'+(i*15+7)+'" cy="'+(j*15+7)+'" r="3.4" fill="none" stroke="#5A3A08" stroke-width="1" opacity=".5"/>';}
    /* tronco e galhos em espiral */
    s+='<g fill="none" stroke="#4A2E06" stroke-linecap="round"><path d="M150 300 C146 262 154 240 150 214" stroke-width="9"/>';
    var G=[[150,214,70,150,-1],[150,214,230,150,1],[150,214,150,120,0],[150,240,62,226,-1],[150,240,238,226,1]];
    G.forEach(function(g){var mx=(g[0]+g[2])/2+g[4]*10,my=(g[1]+g[3])/2-18;s+='<path d="M'+g[0]+' '+g[1]+' Q'+mx+' '+my+' '+g[2]+' '+g[3]+'" stroke-width="4"/>';
      for(var t=0;t<2;t++){var cx=g[2]+(g[4]||1)*(10+t*8),cy=g[3]+8+t*6;s+='<path d="M'+cx+' '+cy+'m-6 0a6 6 0 1 1 6 6a4 4 0 1 1 -4-4" stroke-width="2"/>';}});
    s+='</g>';
    var pos=[[150,96,78],[70,140,54],[230,140,54],[56,224,48],[244,224,48],[102,184,40],[198,184,40]];
    F.forEach(function(f,k){var p=pos[k],R=p[2]/2+(r()-.5)*3,x=p[0]+(r()-.5)*6,y=p[1]+(r()-.5)*6;
      s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(R+4).toFixed(1)+'" fill="#1E1408"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(R+2).toFixed(1)+'" fill="none" stroke="#F8DE8A" stroke-width="1.6"/>'+
        '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+R.toFixed(1)+'" fill="url(#'+u+'m)"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(R-3).toFixed(1)+'" fill="none" stroke="'+f.cor+'" stroke-width="1.4" opacity=".9"/>'+
        desenho(f,x,y,R*1.45,'#1E1408',1.8);});
    return s;}

  /* ---------- Van Gogh ---------- */
  function vangogh(F,r,u){var s='<rect width="300" height="300" fill="#13296A"/>';
    var tons=['#2E55B8','#4C7BD9','#7FA6EE','#1C3C8C','#A9C4F5'];
    for(var i=0;i<170;i++){var x=r()*300,y=r()*230,a=r()*6.28,l=7+r()*9;s+='<path d="M'+x.toFixed(0)+' '+y.toFixed(0)+'q'+(Math.cos(a)*l/2+3).toFixed(1)+' '+(Math.sin(a)*l/2-3).toFixed(1)+' '+(Math.cos(a)*l).toFixed(1)+' '+(Math.sin(a)*l).toFixed(1)+'" stroke="'+tons[i%5]+'" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>';}
    /* grande redemoinho no meio */
    var p='',a0=r()*6;for(var t=0;t<13;t+=.15){var rr=4+t*4.2;p+=(t?'L':'M')+(150+rr*Math.cos(t+a0)).toFixed(1)+' '+(118+rr*Math.sin(t+a0)*.62).toFixed(1);}
    s+='<path d="'+p+'" fill="none" stroke="#DCE8FF" stroke-width="3" opacity=".55" stroke-linecap="round"/><path d="'+p+'" fill="none" stroke="#F5D04A" stroke-width="1.2" opacity=".6" transform="translate(3 2)"/>';
    /* colinas e vila */
    s+='<path d="M0 238 Q60 214 120 236 T240 228 T300 236 V300 H0Z" fill="#1B2F5E"/><path d="M0 256 Q80 240 160 258 T300 250 V300 H0Z" fill="#24407A"/>';
    for(var c=0;c<9;c++){var cx=110+c*20,ch=8+r()*8;s+='<rect x="'+cx+'" y="'+(262-ch)+'" width="12" height="'+ch.toFixed(0)+'" fill="#0E1A3A"/>'+(r()<.6?'<rect x="'+(cx+4)+'" y="'+(264-ch)+'" width="3" height="3" fill="#F5D04A"/>':'');}
    /* cipreste */
    s+='<path d="M34 300 C20 240 30 170 44 110 C52 150 60 220 58 300Z" fill="#0F2A1E"/><g fill="none" stroke="#2C6B46" stroke-width="2" stroke-linecap="round">';for(var k2=0;k2<10;k2++)s+='<path d="M'+(38+r()*12).toFixed(0)+' '+(130+k2*17)+'q4 -8 2 -14"/>';s+='</g>';
    var pos=[[150,118,64],[70,58,42],[232,52,44],[262,140,40],[92,170,40],[200,186,40],[150,40,36]];
    F.forEach(function(f,k){var q=pos[k],x=q[0]+(r()-.5)*8,y=q[1]+(r()-.5)*8,R=q[2]/2;
      for(var h=3;h>=1;h--)s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(R+h*5).toFixed(1)+'" fill="none" stroke="'+(h===1?'#F5D04A':h===2?'#F2A93B':'#FFF3B0')+'" stroke-width="2.4" stroke-dasharray="7 4" opacity="'+(.9-h*.15).toFixed(2)+'"/>';
      s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+R.toFixed(1)+'" fill="#0B1A47"/><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+R.toFixed(1)+'" fill="none" stroke="'+f.cor+'" stroke-width="1.2" opacity=".8"/>'+desenho(f,x,y,R*1.5,'#FFE27A',1.7);});
    return s;}

  /* ---------- Monet ---------- */
  function monet(F,r,u){var s='<defs><linearGradient id="'+u+'a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE3EC"/><stop offset=".5" stop-color="#9CC7D6"/><stop offset="1" stop-color="#6E9FB8"/></linearGradient><filter id="'+u+'b"><feGaussianBlur stdDeviation="1.6"/></filter></defs><rect width="300" height="300" fill="url(#'+u+'a)"/><g filter="url(#'+u+'b)">';
    var cs=['#E9F3F7','#C8B6E2','#A8D8B0','#F2D6A2','#E9B8C8','#7FB3C9','#5E8FA8'];
    for(var i=0;i<150;i++){var y=r()*300;s+='<ellipse cx="'+(r()*300).toFixed(0)+'" cy="'+y.toFixed(0)+'" rx="'+(7+r()*12).toFixed(0)+'" ry="'+(1.6+r()*2.4).toFixed(1)+'" fill="'+cs[i%7]+'" opacity="'+(.35+r()*.4).toFixed(2)+'"/>';}
    s+='</g>';
    /* ponte japonesa */
    s+='<g fill="none" stroke="#4F7F5A" stroke-linecap="round"><path d="M-10 70 Q150 4 310 70" stroke-width="6"/><path d="M-10 84 Q150 22 310 84" stroke-width="3"/>';for(var b=0;b<11;b++){var bx=b*30;s+='<path d="M'+bx+' '+(70-Math.sin(b/10*Math.PI)*48+10).toFixed(0)+' l0 16" stroke-width="2.4"/>';}s+='</g>';
    var pos=[[150,176,84],[60,132,58],[240,128,58],[58,238,56],[242,240,56],[150,262,46],[150,104,48]];
    F.forEach(function(f,k){var q=pos[k],x=q[0]+(r()-.5)*10,y=q[1]+(r()-.5)*8,R=q[2]/2,a=(r()*360).toFixed(0);
      s+='<ellipse cx="'+x.toFixed(1)+'" cy="'+(y+3).toFixed(1)+'" rx="'+(R+6).toFixed(1)+'" ry="'+(R*.62+5).toFixed(1)+'" fill="#3E6D52" opacity=".35"/>'+
        '<g transform="rotate('+a+' '+x.toFixed(1)+' '+y.toFixed(1)+')"><ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(R+5).toFixed(1)+'" ry="'+(R*.76+4).toFixed(1)+'" fill="#7DB87F"/><path d="M'+x.toFixed(1)+' '+y.toFixed(1)+' l'+(R+7).toFixed(1)+' -6 l0 12Z" fill="#9CC7D6"/></g>'+
        '<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(R*.92).toFixed(1)+'" ry="'+(R*.7).toFixed(1)+'" fill="#F3F8EE" opacity=".82"/>'+desenho(f,x,y,R*1.35,'#22356B',1.7)+
        '<g transform="translate('+(x+R*.85).toFixed(1)+' '+(y-R*.55).toFixed(1)+')"><circle r="4.5" fill="'+(k%2?'#F2A7C3':'#FFFFFF')+'"/><circle r="2" fill="'+f.cor+'"/></g>';});
    return s;}

  /* ---------- Frida Kahlo ---------- */
  function frida(F,r,u){var s='<rect width="300" height="300" fill="#24563D"/>';
    for(var i=0;i<26;i++){var x=r()*300,y=r()*300,a=(r()*360).toFixed(0),l=26+r()*28;s+='<path d="M0 0 C'+(l*.3).toFixed(0)+' -'+(l*.3).toFixed(0)+' '+(l*.8).toFixed(0)+' -'+(l*.2).toFixed(0)+' '+l.toFixed(0)+' 0 C'+(l*.8).toFixed(0)+' '+(l*.2).toFixed(0)+' '+(l*.3).toFixed(0)+' '+(l*.3).toFixed(0)+' 0 0Z" fill="'+(i%3?'#3F8A57':'#5FA86A')+'" opacity=".8" transform="translate('+x.toFixed(0)+' '+y.toFixed(0)+') rotate('+a+')"/><path d="M0 0 L'+l.toFixed(0)+' 0" stroke="#24563D" stroke-width="1" transform="translate('+x.toFixed(0)+' '+y.toFixed(0)+') rotate('+a+')"/>';}
    /* moldura central */
    s+='<ellipse cx="150" cy="150" rx="72" ry="86" fill="#7A1E22"/><ellipse cx="150" cy="150" rx="66" ry="80" fill="#F3E6CC"/><ellipse cx="150" cy="150" rx="60" ry="74" fill="none" stroke="#D8A23A" stroke-width="1.6" stroke-dasharray="3 3"/>';
    s+=desenho(F[0],150,150,104,'#7A1E22',2.4);
    var fl=function(x,y,R,c){var o='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')">';for(var q=0;q<7;q++){var aa=q/7*360;o+='<ellipse cx="0" cy="-'+(R*.62).toFixed(1)+'" rx="'+(R*.42).toFixed(1)+'" ry="'+(R*.6).toFixed(1)+'" fill="'+c+'" transform="rotate('+aa.toFixed(0)+')"/>';}return o+'<circle r="'+(R*.4).toFixed(1)+'" fill="#F2B632"/></g>';};
    var ring=[[150,30],[256,92],[256,208],[150,272],[44,208],[44,92]];
    ring.forEach(function(p,i){var x=(p[0]+ring[(i+1)%6][0])/2,y=(p[1]+ring[(i+1)%6][1])/2;s+=fl(x+(r()-.5)*6,y+(r()-.5)*6,13+r()*4,i%2?'#D8363C':'#E86A92');});
    F.slice(1).forEach(function(f,i){var p=ring[i],x=p[0],y=p[1],R=26;
      s+=fl(x,y,R+12,i%2?'#F2B632':'#D8363C')+'<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="#F3E6CC" stroke="'+f.cor+'" stroke-width="2"/>'+desenho(f,x,y,R*1.45,'#7A1E22',1.7);});
    return s;}

  /* ---------- Picasso ---------- */
  function picasso(F,r,u){var j=function(v){return (v+(r()-.5)*14).toFixed(0);};
    var P=[[[0,0],[j(120),0],[j(96),j(110)],[0,j(90)]],[[j(120),0],[300,0],[300,j(80)],[j(190),j(104)],[j(96),j(110)]],[[0,j(90)],[j(96),j(110)],[j(84),j(214)],[0,j(196)]],
      [[j(96),j(110)],[j(190),j(104)],[j(206),j(200)],[j(84),j(214)]],[[j(190),j(104)],[300,j(80)],[300,j(206)],[j(206),j(200)]],[[0,j(196)],[j(84),j(214)],[j(150),300],[0,300]],[[j(84),j(214)],[j(206),j(200)],[300,j(206)],[300,300],[j(150),300]]];
    var cores=['#7C93B0','#C9763E','#D9C7A3','#E8D9B5','#8E8A80','#B9A06A','#4E6A8E'];var s='<rect width="300" height="300" fill="#D9C7A3"/>';
    P.forEach(function(pg,i){s+='<path d="M'+pg.map(function(p){return p.join(' ');}).join(' L')+' Z" fill="'+cores[i]+'" stroke="#1B1B1B" stroke-width="3" stroke-linejoin="round"/>';
      for(var h=0;h<5;h++){var a=pg[0],b=pg[2];s+='<line x1="'+a[0]+'" y1="'+(+a[1]+h*6)+'" x2="'+((+a[0]+ +b[0])/2)+'" y2="'+(+a[1]+h*6+10)+'" stroke="#1B1B1B" stroke-width=".6" opacity=".18"/>';}});
    /* rosto: perfil e olho de frente */
    s+='<g fill="none" stroke="#1B1B1B" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M150 18 C206 22 226 70 214 112 L232 132 L212 140 C214 170 196 196 168 196 L176 240"/><path d="M150 18 C100 24 76 72 86 126 C92 162 112 186 136 196 L128 240"/></g>';
    s+='<g transform="translate(118 74)"><path d="M-22 0 Q0 -16 22 0 Q0 16 -22 0Z" fill="#F7F1E2" stroke="#1B1B1B" stroke-width="2.6"/><circle r="7" fill="#1B1B1B"/></g><g transform="translate(192 84) rotate(-8)"><path d="M-12 0 Q4 -14 16 0 Q4 6 -12 0Z" fill="#F7F1E2" stroke="#1B1B1B" stroke-width="2.4"/><circle cx="4" r="4" fill="#1B1B1B"/></g>';
    var C=P.map(function(pg){var x=0,y=0;pg.forEach(function(p){x+=+p[0];y+=+p[1];});return [x/pg.length,y/pg.length];});
    var ordem=[3,0,1,2,4,5,6];
    F.forEach(function(f,i){var c=C[ordem[i]],R=i===0?30:24,x=c[0],y=c[1]+(i===0?16:0);
      s+='<rect x="'+(x-R).toFixed(1)+'" y="'+(y-R).toFixed(1)+'" width="'+(2*R)+'" height="'+(2*R)+'" fill="#F7F1E2" stroke="#1B1B1B" stroke-width="2.4" transform="rotate('+((r()-.5)*16).toFixed(0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')"/>'+
        '<rect x="'+(x-R+4).toFixed(1)+'" y="'+(y-R+4).toFixed(1)+'" width="8" height="8" fill="'+f.cor+'"/>'+desenho(f,x,y,R*1.55,'#1B1B1B',2);});
    return s;}

  /* ---------- Dalí ---------- */
  function dali(F,r,u){var s='<defs><linearGradient id="'+u+'c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E9CC4"/><stop offset=".45" stop-color="#F1DDA6"/><stop offset=".62" stop-color="#E8B86A"/><stop offset="1" stop-color="#A86A32"/></linearGradient></defs><rect width="300" height="300" fill="url(#'+u+'c)"/>';
    s+='<path d="M200 186 L214 150 L236 146 L252 120 L270 124 L300 112 V186Z" fill="#B88A55"/><path d="M200 186 L300 186" stroke="#7A4E22" stroke-width="1"/>';
    for(var i=0;i<6;i++)s+='<path d="M0 '+(200+i*18)+' Q150 '+(194+i*18+r()*6)+' 300 '+(200+i*18)+'" stroke="#8A5524" stroke-width="1" fill="none" opacity=".25"/>';
    /* galho seco e relógio mole */
    s+='<path d="M24 300 L30 216 L22 196 M30 216 L58 196 L96 198" stroke="#3E2A16" stroke-width="5" fill="none" stroke-linecap="round"/>';
    s+='<g transform="translate(70 198)"><path d="M-30 -2 C-24 -28 24 -30 30 -6 C34 8 22 12 18 30 C16 42 6 44 4 34 C2 22 -8 18 -18 16 C-30 14 -32 6 -30 -2Z" fill="#E9D9A6" stroke="#5A3A1A" stroke-width="2"/>';
    for(var h=0;h<12;h++){var a=h/12*6.28;s+='<line x1="'+(Math.cos(a)*16).toFixed(1)+'" y1="'+(Math.sin(a)*12-6).toFixed(1)+'" x2="'+(Math.cos(a)*19).toFixed(1)+'" y2="'+(Math.sin(a)*14-6).toFixed(1)+'" stroke="#5A3A1A" stroke-width="1.2"/>';}
    s+='<path d="M0 -6 L-2 -16 M0 -6 L9 -2" stroke="#5A3A1A" stroke-width="2" stroke-linecap="round"/></g>';
    var pos=[[150,96,70],[52,60,44],[248,58,44],[228,226,46],[150,232,42],[96,150,38],[262,152,36]];
    F.forEach(function(f,k){var q=pos[k],x=q[0]+(r()-.5)*10,y=q[1]+(r()-.5)*10,R=q[2]/2,ys=Math.max(y+R+20,196+(r()*70));
      s+='<ellipse cx="'+(x+30).toFixed(1)+'" cy="'+ys.toFixed(1)+'" rx="'+(R*1.4).toFixed(1)+'" ry="'+(R*.22).toFixed(1)+'" fill="#4A2A10" opacity=".32"/>'+
        '<line x1="'+x.toFixed(1)+'" y1="'+(y+R).toFixed(1)+'" x2="'+(x+2).toFixed(1)+'" y2="'+(ys-2).toFixed(1)+'" stroke="#4A2A10" stroke-width="1.4" opacity=".55"/>'+
        '<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="'+(R+2).toFixed(1)+'" ry="'+(R+2).toFixed(1)+'" fill="#FFF6E0" stroke="#5A3A1A" stroke-width="2"/>'+
        '<path d="M'+(x-R).toFixed(1)+' '+(y+R*.4).toFixed(1)+' q'+(R*.3).toFixed(1)+' '+(R*.9).toFixed(1)+' '+(R*.6).toFixed(1)+' '+(R*.3).toFixed(1)+'" fill="#FFF6E0" stroke="#5A3A1A" stroke-width="1.6"/>'+
        '<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(R-3).toFixed(1)+'" fill="none" stroke="'+f.cor+'" stroke-width="1.4"/>'+desenho(f,x,y,R*1.5,'#3E2A16',1.8);});
    return s;}

  /* ---------- Museu: cada favorita no quadro do seu pintor ---------- */
  function museu(F,r,u){var s='<rect width="300" height="300" fill="#5B1F2A"/>';for(var i=0;i<16;i++)s+='<line x1="'+(i*20)+'" y1="0" x2="'+(i*20)+'" y2="300" stroke="#4A1822" stroke-width="7" opacity=".5"/>';
    s+='<rect x="0" y="270" width="300" height="30" fill="#2A0E14"/>';
    var M=[[150,128,104],[42,58,64],[258,58,64],[42,150,60],[258,150,60],[60,236,58],[240,236,58]];
    F.forEach(function(f,k){var m=M[k],w=m[2],x=m[0]-w/2,y=m[1]-w/2,b=k===0?9:6;
      s+='<rect x="'+(x-b).toFixed(1)+'" y="'+(y-b).toFixed(1)+'" width="'+(w+2*b)+'" height="'+(w+2*b)+'" fill="#C99A2E" stroke="#6E4E0E" stroke-width="2"/><rect x="'+(x-b/2).toFixed(1)+'" y="'+(y-b/2).toFixed(1)+'" width="'+(w+b)+'" height="'+(w+b)+'" fill="none" stroke="#F3D57A" stroke-width="1.2"/>';
      if(f.arte)s+='<svg x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w+'" height="'+w+'" viewBox="0 0 300 300">'+f.arte+'</svg>';else s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+w+'" fill="#20283F"/>';
      s+='<rect x="'+(m[0]-12)+'" y="'+(y+w+b+2).toFixed(1)+'" width="24" height="5" rx="1" fill="'+f.cor+'"/>';});
    s+='<path d="M150 0 L150 10 M120 0 L150 10 L180 0" stroke="#C99A2E" stroke-width="1.2" fill="none" opacity=".7"/>';
    return s;}

  var FN={klimt:klimt,vangogh:vangogh,monet:monet,frida:frida,picasso:picasso,dali:dali,museu:museu};
  var n0=0;
  function quadro(estilo,J,opt){opt=opt||{};estilo=FN[estilo]?estilo:'klimt';var r=semente(J);var u='q7'+(++n0);var F=favs(J);if(opt.semCor)F.forEach(function(f){f.cor='none';});
    var corpo=FN[estilo](F,r,u);
    if(opt.assina&&J&&J.nome){corpo+='<text x="292" y="294" text-anchor="end" font-family="Georgia,serif" font-style="italic" font-size="11" fill="'+(estilo==='vangogh'||estilo==='museu'||estilo==='frida'?'#F3E6CC':'#3A2410')+'" opacity=".85">'+String(J.nome).replace(/[&<>]/g,'').split(' ')[0]+' · '+new Date().getFullYear()+'</text>';}
    return svg(u,corpo,ESTILOS[estilo].nome+', no estilo de '+ESTILOS[estilo].pintor+', com as suas 7 favoritas');}
  window.Q7={ESTILOS:ESTILOS,quadro:quadro,estiloDe:estiloDe,favs:favs,NOMES:NOMES};
})();
