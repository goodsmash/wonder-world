/* Wonder World service worker: the whole game opens with no internet.
   - shell (page, fonts, 3D library, icons, dino pictures, voice indexes) is saved at install,
   - voice packs are saved the first time they are heard or when a grown-up taps "Download voices",
   - a new version replaces the shell but keeps downloaded voice packs whose voice did not change. */
const VERSION = 'f6aec8604be4';
const SHELL = 'ww-shell-' + VERSION, MEDIA = 'ww-media';
const PRECACHE = ["./","manifest.webmanifest","vendor/fonts/wXKrE3kTposypRyd51bcANwr.woff2","vendor/fonts/wXKrE3kTposypRyd51fcANwr.woff2","vendor/fonts/wXKrE3kTposypRyd51jcAA.woff2","vendor/fonts/wXKrE3kTposypRyd51ncANwr.woff2","vendor/fonts/XRXV3I6Li01BKofIMeaBXso.woff2","vendor/fonts/XRXV3I6Li01BKofINeaB.woff2","vendor/fonts/XRXV3I6Li01BKofIO-aBXso.woff2","vendor/fonts/XRXV3I6Li01BKofIOOaBXso.woff2","vendor/fonts/XRXV3I6Li01BKofIOuaBXso.woff2","vendor/fonts.css","vendor/three.min.js","icons/apple-touch-icon.png","icons/favicon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-192.png","icons/maskable-512.png","dinoart/acrocanthosaurus.webp","dinoart/alamosaurus.webp","dinoart/albertosaurus.webp","dinoart/allosaurus.webp","dinoart/amargasaurus.webp","dinoart/anchiornis.webp","dinoart/ankylosaurus.webp","dinoart/apatosaurus.webp","dinoart/archaeopteryx.webp","dinoart/argentinosaurus.webp","dinoart/austroraptor.webp","dinoart/baryonyx.webp","dinoart/brachiosaurus.webp","dinoart/camarasaurus.webp","dinoart/carcharodontosaurus.webp","dinoart/carnotaurus.webp","dinoart/centrosaurus.webp","dinoart/ceratosaurus.webp","dinoart/cetiosaurus.webp","dinoart/citipati.webp","dinoart/coelophysis.webp","dinoart/compsognathus.webp","dinoart/concavenator.webp","dinoart/cryolophosaurus.webp","dinoart/deinonychus.webp","dinoart/deinosuchus.webp","dinoart/dilophosaurus.webp","dinoart/dimetrodon.webp","dinoart/dimorphodon.webp","dinoart/diplodocus.webp","dinoart/dracorex.webp","dinoart/dunkleosteus.webp","dinoart/edmontosaurus.webp","dinoart/elasmosaurus.webp","dinoart/eoraptor.webp","dinoart/euoplocephalus.webp","dinoart/gallimimus.webp","dinoart/gastonia.webp","dinoart/giganotosaurus.webp","dinoart/glyptodon.webp","dinoart/gorgosaurus.webp","dinoart/guanlong.webp","dinoart/herrerasaurus.webp","dinoart/heterodontosaurus.webp","dinoart/huayangosaurus.webp","dinoart/hypacrosaurus.webp","dinoart/hypsilophodon.webp","dinoart/ichthyosaurus.webp","dinoart/iguanodon.webp","dinoart/irritator.webp","dinoart/kentrosaurus.webp","dinoart/kosmoceratops.webp","dinoart/kronosaurus.webp","dinoart/lambeosaurus.webp","dinoart/leedsichthys.webp","dinoart/lesothosaurus.webp","dinoart/liopleurodon.webp","dinoart/maiasaura.webp","dinoart/majungasaurus.webp","dinoart/mamenchisaurus.webp","dinoart/mapusaurus.webp","dinoart/massospondylus.webp","dinoart/megalodon.webp","dinoart/megalosaurus.webp","dinoart/megatherium.webp","dinoart/microraptor.webp","dinoart/mixosaurus.webp","dinoart/mosasaurus.webp","dinoart/muttaburrasaurus.webp","dinoart/nigersaurus.webp","dinoart/olorotitan.webp","dinoart/ornithomimus.webp","dinoart/ouranosaurus.webp","dinoart/oviraptor.webp","dinoart/pachycephalosaurus.webp","dinoart/pachyrhinosaurus.webp","dinoart/parasaurolophus.webp","dinoart/patagotitan.webp","dinoart/pentaceratops.webp","dinoart/postosuchus.webp","dinoart/prenocephale.webp","dinoart/protoceratops.webp","dinoart/psittacosaurus.webp","dinoart/pteranodon.webp","dinoart/pterodactylus.webp","dinoart/quetzalcoatlus.webp","dinoart/sarcosuchus.webp","dinoart/saurolophus.webp","dinoart/scelidosaurus.webp","dinoart/shantungosaurus.webp","dinoart/shunosaurus.webp","dinoart/sinosauropteryx.webp","dinoart/smilodon.webp","dinoart/spinosaurus.webp","dinoart/stegosaurus.webp","dinoart/struthiomimus.webp","dinoart/styracosaurus.webp","dinoart/suchomimus.webp","dinoart/supersaurus.webp","dinoart/tarbosaurus.webp","dinoart/therizinosaurus.webp","dinoart/titanoboa.webp","dinoart/torosaurus.webp","dinoart/torvosaurus.webp","dinoart/trex.webp","dinoart/triceratops.webp","dinoart/troodon.webp","dinoart/tuojiangosaurus.webp","dinoart/utahraptor.webp","dinoart/velociraptor.webp","dinoart/woollymammoth.webp","dinoart/woollyrhino.webp","dinoart/yutyrannus.webp","dinoart/zuul.webp","voice/ar.json","voice/de.json","voice/en.json","voice/es.json","voice/fr.json","voice/hello.json","voice/hi.json","voice/pt.json","voice/x_en.json","voice/x_es.json","voice/zh.json"];
const VOICE = {"ar":"8b21c92e52ec","de":"bd696cd3dfa1","en":"8e85e82441ba","es":"9e5d1f9cfa5c","fr":"263e2471235f","hello":"1a08c062a95b","hi":"832bf8cac44b","pt":"ce0677a78bc8","x_en":"429095adb687","x_es":"8d17bc552036","zh":"f58bd4912154"}; // voice id -> hash of its index
const packOf = path => (path.match(/voice\/([^/]+)\/\d+\.mp3$/) || [])[1];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('ww-shell-') && k !== SHELL) await caches.delete(k);
    // drop saved voice packs whose voice changed in this version (clip offsets would no longer match)
    const media = await caches.open(MEDIA);
    for (const req of await media.keys()) {
      const id = packOf(new URL(req.url).pathname), res = await media.match(req);
      if (!id || !res || res.headers.get('x-ww-voice') !== VOICE[id]) await media.delete(req);
    }
    await self.clients.claim();
  })());
});
const stamp = async (res, id) => { const h = new Headers(res.headers); h.set('x-ww-voice', VOICE[id] || ''); return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: h }); };
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') { // the page itself: saved copy at once, so it opens offline
    e.respondWith(caches.match('./', { cacheName: SHELL }).then(r => r || fetch(req)).catch(() => caches.match('./')));
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true }); if (hit) return hit;
    const res = await fetch(req), id = packOf(url.pathname);
    if (res.ok && id && VOICE[id]) { const s = await stamp(res.clone(), id); await (await caches.open(MEDIA)).put(url.origin + url.pathname, s); }
    return res;
  })());
});
