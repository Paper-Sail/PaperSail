var socket = io(window.location.href);
var MULTI = {
  callbacks: [],
  id: guid()
  
};
socket.on('connect', function(){
});
socket.on('event', function(data){
  for (var i = 0; i < MULTI.callbacks.length; i++) {
    if (data.id!=MULTI.id && data.name==MULTI.callbacks[i].name){
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
  data.id = MULTI.id;
  data.time = (new Date()).valueOf();
  socket.emit('event',data);
}