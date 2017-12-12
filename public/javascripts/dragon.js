const DRAGON = {
  dragon: [],
  spawn: function(x,y){
    var dragon = {}
    var size = 75
    dragon.mesh = new THREE.Mesh(rectangle(-size/2,-size/2,size,size),GAME.materials.dragon.clone());
    dragon.mesh.position.setX(x);
    dragon.mesh.position.setY(y);
    dragon.odd = true;
    dragon.flaptime = 0;
    dragon.flapscale = 20;
    GAME.scene.add(dragon.mesh);
    DRAGON.dragon.push(dragon)
  },
  update: function(dt) {
    for (var i = 0; i < DRAGON.dragon.length; i++) {
      var dragon = DRAGON.dragon[i];
      dragon.flaptime-=dragon.flapscale*dt;
      if (dragon.flaptime<0){
        dragon.flaptime+=1;
        dragon.odd = !dragon.odd;
        dragon.mesh.material.map = GAME.textures["dragon"+(dragon.odd ? "1" : "2")];
      }
    }
  }
}