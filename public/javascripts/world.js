const WORLD = {
  init: function(){
    WORLD.world = new THREE.Object3D;
    GAME.scene.add(WORLD.world);
    var builder = WORLD.buildWorld();
    var tracker = {
      value: 0
    }
    LOADER.trackers.push(tracker);
    LOADER.refresh();
    iterateCoroutine(WORLD.buildWorld(tracker));
  },
  buildWorld: function*(tracker) {
    for (var i = 0; i < 100; i++) {
      WORLD.putIsland();
      tracker.value = i/100;
      LOADER.refresh()
      yield;
    }
    tracker.value = 1;
    LOADER.refresh()
  },
  putIsland: function(){
    var island = Island();
    var pos = new THREE.Vector2(Math.random()*1000-500,Math.random()*1000-500);
    //island.mesh.renderOrder = 0;
    island.mesh.position.set(pos.x, pos.y, 0);
    island.position = new THREE.Vector3(pos.x,pos.y, 0);
    
    GAME.objects.collisions.push({
      center: pos.clone().add(island.collision.boundingSphere.center),
      position: pos.clone(),
      radius: island.collision.boundingSphere.radius*1.5,
      points: island.collision.vertices
    });
    var glowCenter = island.collision.boundingSphere.center;
    var glowRadius = island.collision.boundingSphere.radius*2.5;
    var glow = new THREE.Mesh(rectangle(
        -glowRadius,
        -glowRadius,
        glowRadius*2,
        glowRadius*2
      ),
      GAME.materials.glow
    );
    island.mesh.add(glow);
    glow.position.z = -2;
    WORLD.world.add(island.mesh);
    
    //*
    for (var il=0; il<Math.random()*3; il++){
      
      var seg = Math.floor(Math.random()*(island.collision.vertices.length-1));
      var p1 = island.collision.vertices[seg];
      var p2 = island.collision.vertices[seg+1];
      var av = p1.clone().lerp(p2,0.5);
      var d = p2.clone().sub(p1).normalize();
      var ang = Math.atan2(d.y, d.x);
      var size = 7+Math.random()*10
      var deco = new THREE.Mesh(rectangle(-size,-size/3,size*2,size*2),GAME.materials.islandDecorations.pickRandom());
      deco.rotation.z = ang;
      deco.position.copy(av);
      island.mesh.add(deco);
    }
    //*/
  }
}












function Island(){
  
  var ipoints = [];
  var d = 10+Math.random()*10;
  var v = 2;
  var md = 5;
  var Md = 100;
  var aoff = Math.random()*TAU
  for (var a = 0; a < Math.PI*2-0.3; a+=0.2+Math.random()*0.1) {
    d = Math.max(md,Math.min(Md,d+(Math.random()*2-1)*v));
    ipoints.push(d*Math.cos(a+aoff));
    ipoints.push(d*Math.sin(a+aoff));
  }
  
  var outergeometry = convexShell(ipoints,12,100);
  var innergeometry = shapeFromPoints(ipoints);
  innergeometry.computeBoundingSphere();
  var geometry = new THREE.Geometry();
  geometry.merge(outergeometry, new THREE.Matrix4());
  geometry.merge(innergeometry, new THREE.Matrix4());
  geometry.uvsNeedUpdate = true;
  geometry.computeBoundingSphere();
  var island = new THREE.Mesh(geometry, GAME.materials.islandmat);
  return {
    mesh: island,
    collision: innergeometry
  }
}