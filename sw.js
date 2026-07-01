// Lineo — Service Worker v1
// Responsável por exibir notificações mesmo com o app em segundo plano

self.addEventListener("install", function(e){
  self.skipWaiting();
});

self.addEventListener("activate", function(e){
  e.waitUntil(self.clients.claim());
});

// Exibir notificação recebida via showNotification
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(clientList){
      for(var i=0;i<clientList.length;i++){
        var client=clientList[i];
        if(client.url&&"focus" in client)return client.focus();
      }
      if(self.clients.openWindow)return self.clients.openWindow("/");
    })
  );
});
