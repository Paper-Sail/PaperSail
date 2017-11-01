var multi = {
  handle: {
    connect: function(client){
      new Player(client);
    }
  }
}
var regionSize = 300;
var fogDensity = 12;
var players = [];
var fog = {}
multi.players = players;
multi.fog = fog;
multi.regionSize = regionSize;
multi.fogDensity = fogDensity;

function Player(client) {
  players.push(this);
  var that = this;
  //this.client = client;
  client.on('event', function(data){
    if (data.name && data.name=="tick"){
      that.id = data.id;
      that.position = data.position;
      that.direction = data.direction;
      that.rotation = data.rotation;
    }
    for (var i = 0; i < players.length; i++) {
      console.log(players[i]);
    }
    
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (player!=that){
        client.emit('event', data);
      }
    }
  });
  client.on('disconnect', function(){
    players.splice(players.indexOf(this, 1));
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