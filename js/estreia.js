/* Faixa + pop-up da estreia do reality "A Casa dos 7 Sentidos".
   - Pop-up abre assim que a página carrega, só na primeira visita (depois, pela faixa).
   - Contagem leve até domingo 08/11/2026 às 16h (Brasília); depois vira "Já estreou".
   - Vídeo: video/estreia-reality.mp4 (o arquivo que o Daniel enviar). */
(function () {
  var ESTREIA = new Date('2026-11-08T16:00:00-03:00').getTime();
  var VIDEO = 'video/estreia-reality.mp4';
  var INSTA = 'https://www.instagram.com/7entidoss/';
  var FACE = 'https://www.facebook.com/profile.php?id=61596119254628';
  var TIKTOK = 'https://www.tiktok.com/@7entidos';
  var CHAVE = 'estreia7_popup_visto';
  var COR = ['#FFD23F', '#5AB8FF', '#FF8A5C', '#7DDB8B', '#FF6FA3', '#A98BFF', '#3FE0D0'];

  function jaEstreou() { return Date.now() >= ESTREIA; }
  function falta() {
    var m = Math.max(0, Math.round((ESTREIA - Date.now()) / 60000));
    var d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
    if (d > 0) return 'faltam ' + d + (d > 1 ? ' dias' : ' dia') + (h ? ' e ' + h + 'h' : '');
    if (h > 0) return 'faltam ' + h + 'h' + (mi ? ' e ' + mi + ' min' : '');
    return 'faltam ' + Math.max(mi, 1) + ' min';
  }
  function avisa(nome) { try { if (window.gtag) window.gtag('event', nome); } catch (e) {} }

  /* ---- faixa no topo ---- */
  var faixa = document.createElement('div');
  faixa.className = 'estreia-faixa';
  faixa.setAttribute('role', 'button');
  faixa.tabIndex = 0;
  var topo = document.querySelector('.topo');
  document.body.insertBefore(faixa, topo || document.body.firstChild);
  function ajustaTopo() { if (topo) topo.style.top = faixa.offsetHeight + 'px'; }
  addEventListener('resize', ajustaTopo);

  function pintaFaixa() {
    faixa.innerHTML = jaEstreou()
      ? '<span class="play" aria-hidden="true">▶</span><span class="txt"><span><b>A Casa dos 7 Sentidos</b> está no ar.</span> <span class="ver">Ver o vídeo</span></span>'
      : '<span class="play" aria-hidden="true">▶</span><span class="txt"><span>Estreia do reality <b>A Casa dos 7 Sentidos</b> · domingo, 08/11, às 16h</span> <span class="conta">· ' + falta() + '</span></span>';
    faixa.setAttribute('aria-label', jaEstreou() ? 'A Casa dos 7 Sentidos está no ar: ver o vídeo' : 'Estreia do reality A Casa dos 7 Sentidos, domingo 08/11 às 16h: ver o vídeo');
  }

  /* ---- pop-up ---- */
  var veu = document.createElement('div');
  veu.className = 'estreia-veu';
  veu.innerHTML =
    '<div class="estreia-pop" role="dialog" aria-modal="true" aria-labelledby="estreia-titulo">' +
    '<button class="estreia-fechar" aria-label="Fechar">✕</button>' +
    '<div class="luzes" aria-hidden="true">' + COR.map(function (c) { return '<i style="color:' + c + '"></i>'; }).join('') + '</div>' +
    '<p class="estreia-rotulo">Reality · patrocínio 7entidos</p>' +
    '<h2 id="estreia-titulo">A Casa dos 7 Sentidos</h2>' +
    '<p class="quando"></p>' +
    '<div class="estreia-video"><video playsinline muted loop preload="metadata" controls></video>' +
    '<button class="estreia-som">🔊 Ativar som</button></div>' +
    '<div class="estreia-acoes">' +
    '<a class="estreia-seguir" href="' + INSTA + '" target="_blank" rel="noopener">Seguir @7entidoss no Instagram</a>' +
    '<span class="estreia-outras">Também no <a href="' + FACE + '" target="_blank" rel="noopener">Facebook</a> e no <a href="' + TIKTOK + '" target="_blank" rel="noopener">TikTok</a></span>' +
    '</div></div>';
  document.body.appendChild(veu);

  var video = veu.querySelector('video');
  var som = veu.querySelector('.estreia-som');
  var quando = veu.querySelector('.quando');
  var voltaFoco = null;

  video.src = VIDEO; video.poster = 'video/estreia-capa.jpg';
  video.addEventListener('error', function () {
    som.remove();
    video.remove();
    var aviso = document.createElement('div');
    aviso.className = 'sem-video';
    aviso.textContent = 'O vídeo da propaganda entra aqui.';
    veu.querySelector('.estreia-video').appendChild(aviso);
  });
  som.addEventListener('click', function () { video.muted = false; video.currentTime = 0; video.play(); som.remove(); avisa('estreia_som'); });
  video.addEventListener('volumechange', function () { if (!video.muted && som.parentNode) som.remove(); });

  function abre() {
    quando.innerHTML = jaEstreou()
      ? 'Já estreou! <b>Assista aos episódios</b> no Instagram.'
      : '<b>Domingo, 08/11, às 16h</b> · ' + falta();
    voltaFoco = document.activeElement;
    veu.classList.add('aberto');
    document.documentElement.style.overflow = 'hidden';
    try { localStorage.setItem(CHAVE, '1'); } catch (e) {}
    var p = video.play && video.play(); if (p && p.catch) p.catch(function () {});
    setTimeout(function () { veu.querySelector('.estreia-fechar').focus(); }, 30);
    avisa('estreia_popup_aberto');
  }
  function fecha() {
    veu.classList.remove('aberto');
    document.documentElement.style.overflow = '';
    try { video.pause(); } catch (e) {}
    if (voltaFoco && voltaFoco.focus) voltaFoco.focus();
  }

  faixa.addEventListener('click', abre);
  faixa.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abre(); } });
  veu.addEventListener('click', function (e) { if (e.target === veu || e.target.closest('.estreia-fechar')) fecha(); });
  veu.querySelector('.estreia-seguir').addEventListener('click', function () { avisa('estreia_seguir_instagram'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && veu.classList.contains('aberto')) fecha(); });

  pintaFaixa(); ajustaTopo();
  setInterval(function () { pintaFaixa(); ajustaTopo(); }, 60000);

  var visto = false;
  try { visto = localStorage.getItem(CHAVE) === '1' || /[?&]sem-popup/.test(location.search); } catch (e) {}
  if (!visto) abre();
})();

/* vídeo da seção do reality: se o arquivo ainda não existe, mostra o aviso */
document.querySelectorAll('.reality-video video').forEach(function (v) {
  function tira() { v.remove(); }
  if (v.error || v.networkState === 3) tira(); else v.addEventListener('error', tira);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (!v.isConnected) return; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function(){}); } else v.pause(); }); }, { threshold: .4 }).observe(v);
});

/* contador grande até a estreia (topo da página inicial) */
(function () {
  var ESTREIA = new Date('2026-11-08T16:00:00-03:00').getTime();
  var main = document.getElementById('conteudo');
  if (!main) return;
  var COR = ['#FFD23F', '#5AB8FF', '#FF8A5C', '#7DDB8B', '#FF6FA3', '#A98BFF', '#3FE0D0'];
  var box = document.createElement('section');
  box.className = 'contador-estreia';
  box.setAttribute('aria-label', 'Contagem para a estreia do reality');
  main.insertBefore(box, main.firstChild);
  function dois(n) { return (n < 10 ? '0' : '') + n; }
  function pinta() {
    var ms = ESTREIA - Date.now();
    var luzes = '<div class="luzes" aria-hidden="true">' + COR.map(function (c) { return '<i style="color:' + c + '"></i>'; }).join('') + '</div>';
    if (ms <= 0) {
      box.innerHTML = luzes + '<p class="chamada">Já estreou</p><h2>A Casa dos 7 Sentidos está no ar!</h2><a class="ir" href="#reality">Assistir agora</a>';
      clearInterval(t); return;
    }
    var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), se = s % 60;
    box.innerHTML = luzes + '<p class="chamada">Contagem para a estreia</p><h2>A Casa dos 7 Sentidos</h2>' +
      '<div class="blocos" role="timer" aria-live="off">' +
      '<div class="bl"><b>' + dois(d) + '</b><small>' + (d === 1 ? 'dia' : 'dias') + '</small></div>' +
      '<div class="bl"><b>' + dois(h) + '</b><small>horas</small></div>' +
      '<div class="bl"><b>' + dois(m) + '</b><small>min</small></div>' +
      '<div class="bl seg"><b>' + dois(se) + '</b><small>seg</small></div></div>' +
      '<p class="quando"><b>Domingo, 08/11, às 16h</b> no Instagram, no Facebook e no TikTok</p>' +
      '<a class="ir" href="#reality">Ver o vídeo e entrar nos bastidores</a>';
  }
  var t = setInterval(pinta, 1000); pinta();
})();
