const DILL = {
  spawn: function(region, count, seed){
    if (!region.dills){
      region.dills = [];
    }
    var wseed = 0;
    function n(){
      return wseed++;
    }
    function rand(){
      return ndhash(region.x, region.y, n())
    }
    var x = region.x*WORLD.regionSize+lerp(WORLD.regionSize/6,5*WORLD.regionSize/6,rand());
    var y = region.y*WORLD.regionSize+lerp(WORLD.regionSize/6,5*WORLD.regionSize/6,rand());
    var pos = new THREE.Vector3(x,y,0);
    var scatter = 50;
    var maxRadius = 30;
    var good = true;
    for (var tries = 0; tries < 100; tries++){
      good = true;
      x = region.x*WORLD.regionSize+lerp(WORLD.regionSize/6,5*WORLD.regionSize/6,rand());
      y = region.y*WORLD.regionSize+lerp(WORLD.regionSize/6,5*WORLD.regionSize/6,rand());
      pos = new THREE.Vector3(x,y,0);
      for (var i = 0; i < region.islands.length; i++) {
        var island = region.islands[i];
        var ccenter = new THREE.Vector3(island.collisions.center.x,island.collisions.center.y,0);
        var d = pos.distanceTo(ccenter);
        if (d<scatter+maxRadius+island.collisions.radius) {
          good = false;
          break;
        }
      }
      if (good) break;
    }
    var glowCenter = pos;
    var glowRadius = scatter;
    var glow = new THREE.Mesh(rectangle(
        -glowRadius,
        -glowRadius,
        glowRadius*2,
        glowRadius*2
      ),
      GAME.materials.glow
    );
    if (ENGINE.quality)
      region.three.add(glow)
    if (good){
      for (var i = 0; i<count; i++){
        var rad = lerp(maxRadius/2,maxRadius,rand());
        var dillmesh = new THREE.Mesh(rectangle(-rad/2,-rad/2,rad,rad), GAME.materials.dill);
        var ang = (i/count)*Math.PI*2//+rand()*Math.PI*0.2;
        var d = lerp(0,scatter,rand());
        dillmesh.position.setX(pos.x+d*Math.cos(ang));
        dillmesh.position.setY(pos.y+d*Math.sin(ang));
        dillmesh.position.setZ(-1);
        dillmesh.rotation.z = rand()*Math.PI*2;
        var dill = {
          mesh: dillmesh,
          radius: rad,
          position: dillmesh.position.clone(),
          velocity: new THREE.Vector3(0,0,0),
          spring: 5,
          damp: 1,
          splash: Math.random()
        }
        region.three.add(dillmesh);
        region.dills.push(dill)
      }
    }
  },
  update: function(dill, dt){
    dill.tagged = false;
    dill.splash-=dt*0.1*(1+dill.velocity.length());
    if (dill.splash<0){
      dill.splash = 1+Math.random();
      var partpos = dill.mesh.position.clone();
      partpos.z = -2;
      var size = 0.2+Math.random()*0.25;
      SPARTICLE.spawn(partpos,GAME.materials.semisplash,{
        angle: Math.atan2(dill.velocity.y, dill.velocity.y),
        minScale: 12*size,
        maxScale: 30*size,
        scaleFunc: function(x){ return Math.sqrt(x);},
        alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
        maxAge: size*7
      });
    }
    
    
    
    var boatpush = dill.mesh.position.clone().sub(GAME.camera.position);
    boatpush.setZ(0);
    if (boatpush.length()<4+dill.radius){
      var force = (4+dill.radius)-boatpush.length();
      dill.tagged = true;
      dill.velocity.add(boatpush.clone().normalize().multiplyScalar(force*dt*dill.spring));
    }
    
    for (var i = 0; i < FISH.fish.length; i++) {
      for (var h = 0; h < FISH.fish[i].history.length; h++) {
        var fpos = FISH.fish[i].history[h];
        var fishpush = dill.mesh.position.clone().sub(fpos);
        fishpush.setZ(0);
        if (fishpush.length()<FISH.fish[i].width/2){
          var force = (FISH.fish[i].width/2)-fishpush.length();
          var w = h/FISH.fish[i].history.length;
          w = 1-((w-0.5)*(w-0.5)*4);
          force*=0.1*w;
          dill.velocity.add(fishpush.clone().normalize().multiplyScalar(force*dt*dill.spring));
        }
      }
    }
    
    var error = dill.mesh.position.clone().sub(dill.position);
    dill.velocity.sub(error.multiplyScalar(dt*dill.spring));
    
    dill.mesh.position.add(dill.velocity.clone().multiplyScalar(dt));
    dill.velocity.sub(dill.velocity.clone().multiplyScalar(dill.damp*dt));
  }
}