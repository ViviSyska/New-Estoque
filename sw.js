var CACHE='ns-estoque-pro-v1';
var ASSETS=['./','/index.html'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  if(e.request.url.includes('supabase.co')||e.request.url.includes('googleapis')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      var fresh=fetch(e.request).then(res=>{
        if(res.ok){var clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone))}
        return res;
      }).catch(()=>cached);
      return cached||fresh;
    })
  );
});
