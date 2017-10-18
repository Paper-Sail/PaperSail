var socket = io(window.location.href);
var MULTI = {
  callbacks: []
};
socket.on('connect', function(){
  console.log("THIS IS AMAZEBALLS");
});
socket.on('event', function(data){
  for (var i = 0; i < MULTI.callbacks.length; i++) {
    if (data.name==MULTI.callbacks[i].name){
      MULTI.callbacks[i].cb(data);
    }
  }
});
socket.on('disconnect', function(){});

MULTI.on = function(name, cb){
  MULTI.callbacks.push({
    name: name,
    cb: cb
  });
}

MULTI.send = function(data){
  socket.emit('event',data);
}