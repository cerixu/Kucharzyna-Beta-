const CACHE="kucharzyna-beta-0-1-start-v2";
const CORE=["./","./index.html","./manifest.webmanifest","./css/tokens.css","./css/base.css","./css/layout.css","./css/components.css","./css/screens.css","./js/app.js","./js/router.js","./js/state.js","./js/db.js","./assets/start/pizza.svg","./assets/start/pasta.svg","./assets/start/bakery.svg","./assets/start/veg.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{
    const copy=response.clone();
    if(new URL(e.request.url).origin===self.location.origin)caches.open(CACHE).then(c=>c.put(e.request,copy));
    return response;
  }).catch(()=>caches.match("./index.html"))));
});
