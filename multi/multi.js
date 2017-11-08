var multi = {
  handle: {
    connect: function(client){
      new Player(client);
    }
  }
}
var timeout = 5000;
multi.players = [];
multi.fog = {};
multi.regionSize = 300;
multi.fogDensity = 12;

var updateMulti = function(){
  multi.players = multi.players.filter(function(player){
    if (player.lastUpdate+timeout<Date.now()){
      return true;
      //return false;
    } else {
      if (player.ready){
        for (var i = 0; i < multi.players.length; i++) {
          var p = multi.players[i];
          if (p.ready){
            player.client.emit('event',{
              name: "tick",
              id: p.id,
              time: Date.now(),
              position: p.position,
              rotation: p.rotation,
              direction: p.direction
            });
            if (p.clicked){
              player.client.emit('event',{
                name: "click",
                id: p.id,
                time: Date.now(),
                position: p.click
              });
            }  
          }
        }
      }
      return true;
    }
    return true;
  });
  for (var i = 0; i < multi.players.length; i++) {
    multi.players[i].clicked = false;
  }
  setTimeout(updateMulti, 1000);
}
updateMulti();


function Player(client) {
  var that = {};
  multi.players.push(that);
  that.client = client;
  that.lastUpdate = Date.now();
  that.ready = false;
  client.on('event', function(data){
    that.lastUpdate = Date.now();
    switch (data.name) {
      case "tick":
        that.id = data.id;
        that.ready = true;
        that.position = data.position;
        that.direction = data.direction;
        that.rotation = data.rotation;
        break;
      case "click":
        that.clicked = true;
        that.click = data.position;
        break;
      default:
    }
  });
  client.on('disconnect', function(){
    multi.players = multi.players.filter(function(player){
      return player.id != that.id;
    });
  });
}

function mod(x, n){
	return ((x%n)+n)%n;
}


function clearfog(x,y){
    var region = {
      x: Math.floor(x/regionSize),
      y: Math.floor(y/regionSize)
    };
    var fogregion = {}
    if (fog.hasOwnProperty(region.x+"-"+region.y)){
      fogregion = fog[region.x+"-"+region.y];
    }
    var chunk = {
      
    }
}


multi.getFog = function(x,y){
  return "NO";
}


module.exports = multi;