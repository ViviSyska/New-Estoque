var CACHE='ns-estoque-pro-v4';

self.addEventListener('install',function(e){
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  // sempre da rede - sem cache de paginas
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  // APIs - sempre da rede
  if(e.request.url.includes('supabase.co')||
     e.request.url.includes('googleapis')||
     e.request.url.includes('cdnjs')){
    e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503})));
    return;
  }
  // outros recursos - cache first
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
async function testarSupabase() {
  console.log("Iniciando teste de conexão...");
  
  // Substitua pelas suas variáveis que já estão no código
  const url = SUPABASE_URL; 
  const key = SUPABASE_KEY;

  try {
    const resposta = await fetch(`${url}/rest/v1/?apikey=${key}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${key}` }
    });

    if (resposta.ok) {
      console.log("✅ Conexão bem-sucedida! O banco respondeu corretamente.");
      alert("Conexão com Supabase OK!");
    } else {
      console.error("❌ Erro na resposta:", resposta.statusText);
      alert("Erro de conexão: " + resposta.status);
    }
  } catch (error) {
    console.error("❌ Falha crítica ao conectar:", error);
    alert("Falha na rede ou URL incorreta.");
  }
}

// Chame a função para testar
// testarSupabase();
