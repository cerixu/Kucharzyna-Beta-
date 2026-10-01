(function(){
  var app=document.getElementById("app");
  function showError(error){
    if(!app)return;
    var message=error&&error.message?error.message:String(error||"Nieznany błąd");
    app.innerHTML='<main style="min-height:100%;display:grid;place-items:center;padding:28px;color:#f5f1ea;background:#100e0c;font-family:-apple-system,BlinkMacSystemFont,sans-serif"><section style="width:min(100%,520px);padding:24px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#181513"><small style="letter-spacing:.14em;color:#e7a94b;font-weight:700">KUCHARZYNA • START</small><h1 style="margin:10px 0 8px;font-size:25px">Nie udało się uruchomić aplikacji</h1><p style="margin:0 0 14px;color:#aaa;line-height:1.5">Safari załadował stronę, ale moduł aplikacji zwrócił błąd. Odśwież stronę i spróbuj ponownie.</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0;padding:12px;border-radius:12px;background:#0d0c0b;color:#ddd;font-size:11px">'+String(message).replace(/[&<>]/g,function(x){return {"&":"&amp;","<":"&lt;",">":"&gt;"}[x]})+'</pre></section></main>';
  }
  import("./app.js?v=20261001-8").catch(showError);
})();
