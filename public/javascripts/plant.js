const PLANT = {
  spawn: function(region, count, seed){
    if (!region.plants){
      region.plants = [];
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
    var maxRadius = 15;
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
        var plantmesh = new THREE.Mesh(rectangle(-rad/2,-rad/2,rad,rad), GAME.materials.plant);
        var ang = (i/count)*Math.PI*2//+rand()*Math.PI*0.2;
        var d = lerp(0,scatter,rand());
        plantmesh.position.setX(pos.x+d*Math.cos(ang));
        plantmesh.position.setY(pos.y+d*Math.sin(ang));
        plantmesh.position.setZ(-1);
        plantmesh.rotation.z = rand()*Math.PI*2;
        var plant = {
          mesh: plantmesh,
          radius: rad,
          position: plantmesh.position.clone(),
          velocity: new THREE.Vector3(0,0,0),
          spring: 5,
          damp: 1,
          splash: Math.random()
        }
        region.three.add(plantmesh);
        region.plants.push(plant)
      }
    }
  },
  update: function(plant, dt){
    plant.tagged = false;
    plant.splash-=dt*0.1*(1+plant.velocity.length());
    if (plant.splash<0){
      plant.splash = 1+Math.random();
      var partpos = plant.mesh.position.clone();
      partpos.z = -2;
      var size = 0.2+Math.random()*0.25;
      SPARTICLE.spawn(partpos,GAME.materials.semisplash,{
        angle: Math.atan2(plant.velocity.y, plant.velocity.y),
        minScale: 12*size,
        maxScale: 30*size,
        scaleFunc: function(x){ return Math.sqrt(x);},
        alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
        maxAge: size*7
      });
    }
    
    
    
    var boatpush = plant.mesh.position.clone().sub(GAME.camera.position);
    boatpush.setZ(0);
    if (boatpush.length()<4+plant.radius){
      var force = (4+plant.radius)-boatpush.length();
      plant.tagged = true;
      plant.velocity.add(boatpush.clone().normalize().multiplyScalar(force*dt*plant.spring));
    }
    
    for (var i = 0; i < FISH.fish.length; i++) {
      for (var h = 0; h < FISH.fish[i].history.length; h++) {
        var fpos = FISH.fish[i].history[h];
        var fishpush = plant.mesh.position.clone().sub(fpos);
        fishpush.setZ(0);
        if (fishpush.length()<FISH.fish[i].width/2){
          var force = (FISH.fish[i].width/2)-fishpush.length();
          var w = h/FISH.fish[i].history.length;
          w = 1-((w-0.5)*(w-0.5)*4);
          force*=0.1*w;
          plant.velocity.add(fishpush.clone().normalize().multiplyScalar(force*dt*plant.spring));
        }
      }
    }
    
    var error = plant.mesh.position.clone().sub(plant.position);
    plant.velocity.sub(error.multiplyScalar(dt*plant.spring));
    
    plant.mesh.position.add(plant.velocity.clone().multiplyScalar(dt));
    plant.velocity.sub(plant.velocity.clone().multiplyScalar(plant.damp*dt));
  }
}