const DRAGON = {
  dragon: [],
  spawn: function(size){
    var dragon = {}
    var startIsland = DRAGON.getTarget();
    var x = startIsland.mesh.position.x;
    var y = startIsland.mesh.position.y;
    dragon.obj = new THREE.Object3D();
    dragon.obj.position.setX(x);
    dragon.obj.position.setY(y);
    dragon.obj.rotation.z = -Math.random()*Math.PI*2-Math.PI;
    dragon.token = new THREE.Mesh(rectangle(-5,-5,10,10),GAME.materials.token) 
    dragon.mesh = new THREE.Mesh(rectangle(-size/2,-size/2,size,size),GAME.materials.dragon);
    dragon.mesh.position.setX(-size*0.19);
    dragon.mesh.position.setY(0);
    dragon.mesh.rotation.z = -Math.PI/2;
    
    var wingsize = size * 0.3;
    dragon.winganchor = new THREE.Object3D();
    dragon.winganchor.scale.set(wingsize,wingsize,wingsize);
    dragon.winganchor.position.setY(size*0.2);
    
    dragon.leftanchor = new THREE.Object3D();
    dragon.wingleft = new THREE.Mesh(rectangle(-1,-1,2,2),GAME.materials.dragonwingleft);
    //dragon.wingleft.scale.set(1,-1,1);
    dragon.wingleft.position.setX(-0.95);
    dragon.wingleft.position.setY(-0.25);
    //dragon.wingleft.rotation.z = Math.PI/2;
    dragon.winganchor.add(dragon.leftanchor);
    dragon.leftanchor.add(dragon.wingleft);
    
    
    dragon.rightanchor = new THREE.Object3D();
    dragon.wingright = new THREE.Mesh(rectangle(-1,-1,2,2),GAME.materials.dragonwingright);
    dragon.wingright.position.setX(0.95);
    dragon.wingright.position.setY(-0.25);
    //dragon.wingright.rotation.z = Math.PI/2;
    dragon.winganchor.add(dragon.rightanchor);
    dragon.rightanchor.add(dragon.wingright);
    dragon.changedir = 0;
    dragon.power = 400;
    dragon.friction = 2;
    dragon.speed = 0;
    dragon.rotspeed = 0.5;
    dragon.obj.add(dragon.mesh);
    dragon.mesh.add(dragon.winganchor);
    dragon.wingtime = 0;
    dragon.twitch = 0;
    dragon.turn = 0;
    dragon.lastMove = new THREE.Vector3();
    dragon.resting = true;
    dragon.flytime = 1+Math.random();
    GAME.scene.add(dragon.obj);
    //GAME.scene.add(dragon.token);
    DRAGON.dragon.push(dragon)
  },
  update: function(dt) {
    for (var i = 0; i < DRAGON.dragon.length; i++) {
      var dragon = DRAGON.dragon[i];
      if (dragon.target){
        dragon.token.position.copy(dragon.target.mesh.position);
        dragon.token.position.setZ(3);
        dragon.twitch = lerp(dragon.twitch,0,dt*10);
        dragon.turn = lerp(dragon.turn,0,dt*10);
        dragon.obj.rotation.z += (dragon.turn)*dt;
        dragon.wingtime += (dragon.speed*0.3+1.5+dragon.twitch*40)*dt;
        dragon.leftanchor.rotation.z = lerp(-0.25,0.3,Math.sin(dragon.wingtime)*0.5+0.5 );
        dragon.rightanchor.rotation.z = lerp(0.25,-0.3,Math.sin(dragon.wingtime)*0.5+0.5 );
        if (dragon.resting){
          dragon.obj.position.setX(dragon.target.mesh.position.x);
          dragon.obj.position.setY(dragon.target.mesh.position.y);
          dragon.speed = 0;
          dragon.flytime-=dt*0.15;
          if (dragon.flytime<=0 || dragon.target.tagged){
            dragon.twitch = 1;
            dragon.turn = (5+Math.random()*5)*Math.sign(Math.random()-0.5);
            if (Math.random()<0.25 || dragon.target.tagged){
              dragon.resting = false;
              dragon.target = DRAGON.getTarget(dragon);
              dragon.target.splash = 0;
            } else {
              dragon.flytime=1+Math.random();
            }
          }
        } else {
          if (dragon.obj.position.distanceTo(dragon.target.mesh.position)<5){
            dragon.target.velocity.add(dragon.lastMove.clone().multiplyScalar(dragon.speed*0.07));
            dragon.target.splash = 0;
            dragon.lastMove = new THREE.Vector3(0,0,0);
            dragon.resting = true;
            dragon.flytime = 1+Math.random()
          } else {
            dragon.changedir-=dt*0.5;
            if (dragon.changedir<=0){
              dragon.target = DRAGON.getTarget(dragon);
              dragon.changedir = Math.random()
            }
            dragon.speed+= (dragon.power-dragon.speed*dragon.friction)*dt;
            var move = null
            if (dragon.target){
              move  = dragon.target.mesh.position.clone().sub(dragon.obj.position);
            } else {
              move = new THREE.Vector3(Math.cos(dragon.mesh.rotation.z), Math.sin(dragon.mesh.rotation.z),0);
            }
            move.setZ(0);
            var mangle = Math.atan2(move.y, move.x);
            if (Math.abs(dragon.obj.rotation.z-mangle)>0.1){
              var dangle = dragon.obj.rotation.z;
              //dangle = mod(dangle+Math.PI,Math.PI*2)-Math.PI;
              //mangle = mod(mangle+Math.PI,Math.PI*2)-Math.PI;
              //var rot = Math.max(-1,Math.min(1,(mangle-dangle)*1));
              var rot = mangle-dangle;
              rot = ((rot+Math.PI)%(Math.PI*2))-Math.PI
              rot = Math.max(-1,Math.min(1,rot*10))
              var nangle = dangle+rot*dt*5;
              dragon.obj.rotation.z = nangle;
              move.setX(Math.cos(nangle));
              move.setY(Math.sin(nangle));
            } else {
              dragon.obj.rotation.z = mangle;
            }
            dragon.lastMove = move.clone().normalize();
            move.normalize().multiplyScalar(dragon.speed*dt);
            dragon.obj.position.add(move);
          }
        }
      } else {
        dragon.target = DRAGON.getTarget(dragon);
      }
    }
  },
  getTarget(dragon){
    for (var i = 100; i>0; i--){
      var region = WORLD.regions.pickRandom();
      if (region && region.plants && region.plants.length>0){
        var targetcol = region.plants.pickRandom();
        var good = true;
        for (var i = 0; i < DRAGON.dragon.length; i++) {
          if (DRAGON.dragon[i].target==targetcol){
            good = false;
            break;
          }
        }
        if (good)
          return targetcol;
      }
    }
    if (dragon.target){
        return dragon.target;
    } else {
      return WORLD.regions.pickRandom().plants.pickRandom();
    }
  }
}