// Lineo — Service Worker v1
// Responsável por exibir notificações mesmo com o app em segundo plano

self.addEventListener("install", function(e){
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(self.clients.claim());
});

// Recebe push real (enviado pelo servidor) e exibe a notificação
self.addEventListener("push", function(e){
  var data = {};
  try{
    data = e.data ? e.data.json() : {};
  }catch(err){
    data = { title: "Lineo", body: e.data ? e.data.text() : "" };
  }
  var title = data.title || "Lineo";
  var options = {
    body: data.body || "",
    data: { url: data.url || "/" },
    tag: data.tag || undefined,
    renotify: !!data.tag
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Exibir notificação recebida via showNotification
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(
    self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(clientList){
      for(var i=0;i<clientList.length;i++){
        var client=clientList[i];
        if(client.url&&"focus" in client)return client.focus();
      }
      if(self.clients.openWindow)return self.clients.openWindow(url);
    })
  );
});
