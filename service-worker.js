const CACHE="kucharzyna-beta-0-1-v3";
const CORE=["./","./index.html","./manifest.webmanifest","./css/tokens.css","./css/base.css","./css/layout.css","./css/components.css","./css/screens.css","./js/app.js","./js/router.js","./js/state.js","./js/db.js","./assets/start/pizza.svg","./assets/start/pasta.svg","./assets/start/bakery.svg","./assets/start/veg.svg"];
const NETWORK_FIRST=["/","/index.html","/js/app.js","/js/router.js","/js/state.js","/js/db.js","/css/tokens.css","/css/base.css","/css/layout.css","/css/components.css","/css/screens.css"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  const path=url.pathname.replace(/\\/g,"/");
  if(NETWORK_FIRST.includes(path)){
    e.respondWith(fetch(e.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return response}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return response}).catch(()=>caches.match("./index.html"))));
});