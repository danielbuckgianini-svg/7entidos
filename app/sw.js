/* 7entidos · service worker simples (escopo /app/)
   - Páginas: vêm sempre da internet (o app fica sempre atualizado);
     sem internet, mostra a página "Sem internet" (o app usa arquivos de fora,
     como o React, que não funcionam sem conexão).
   - Ícones e a página "Sem internet": ficam guardados no aparelho. */
const VERSAO = '7entidos-app-v1';
const GUARDAR = [
  '/app/offline.html',
  '/app/manifest.webmanifest',
  '/app/icones/icone-192.png',
  '/app/icones/icone-512.png',
  '/app/icones/icone-maskable-192.png',
  '/app/icones/icone-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(GUARDAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith('7entidos-app-') && n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // não mexe em nada de fora (vídeos, planilha, fontes)

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('/app/offline.html'))
    );
    return;
  }

  if (GUARDAR.includes(url.pathname)) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});
