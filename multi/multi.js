var multi = {
  handle: {
    connect: function(client){
      console.log("Connection!");
      new Player(client);
    }
  }
}

var players = [];

function Player(client) {
  players.push(this);
  this.client = client;
  this.client.on('event', function(data){
    for (var i = 0; i < players.length; i++) {
      console.log("This is player: "+i);
      var player = players[i];
      if (player!=this){
        console.log("I am not: "+i+" so I do the thing");
        player.client.emit('event', data);
      }
    }
  });
  this.client.on('disconnect', function(){
    players.splice(players.indexOf(this, 1));
  });
}




module.exports = multi;