kern = [
  [-1,-1],
  [-1,0],
  [-1,1],
  [0,-1],
  [0,0],
  [0,1],
  [1,-1],
  [1,0],
  [1,1]
]

const WORLD = {
  regionSize: 2000,
  init: function(){
    WORLD.world = new THREE.Object3D();
    WORLD.regions = [];
    GAME.scene.add(WORLD.world);
    for (var i = 0; i < kern.length; i++) {
      var p = kern[i]
      WORLD.buildRegion(p[0],p[1]);
    }
  },
  buildRegion: function(x, y){
    var region = {
      three: new THREE.Object3D(),
      x: x,
      y: y
    }
    //region.three.position.set(x*WORLD.regionSize, y*WORLD.regionSize, 0);
    WORLD.world.add(region.three);
    WORLD.regions.push(region);
    var tracker = {
      value: 0
    }
    LOADER.trackers.push(tracker);
    LOADER.refresh();
    iterateCoroutine(WORLD.buildWorld(region, tracker));
  },
  buildWorld: function*(region, tracker) {
    var islands = 50
    var rs = WORLD.regionSize;
    var back = new THREE.Mesh(rectangle(-rs/2+region.x*rs,-rs/2+region.y*rs,rs,rs), new THREE.MeshBasicMaterial({
      color: new THREE.Color( parseInt(  md5(ndhash(region.x,region.y)).substr(0,6),16))
    }));
    back.position.z = -100;
    region.three.add(back);
    for (var i = 0; i < islands; i++) {
      WORLD.putIsland(region,i);
      tracker.value = i/islands;
      LOADER.refresh()
      yield;
    }
    tracker.value = 1;
    LOADER.refresh()
  },
  putIsland: function(region,seed){
    var rs = WORLD.regionSize;
    function n(){
      return seed++;
    }
    function rand(){
      return ndhash(region.x, region.y, n())
    }
    var pos = new THREE.Vector2(rand()*rs-rs/2+region.x*rs,rand()*rs-rs/2+region.y*rs);
    var island = Island(rand());
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
    region.three.add(island.mesh);
    //*
    for (var il=0; il<rand()*3; il++){
      
      var seg = Math.floor(rand()*(island.collision.vertices.length-1));
      var p1 = island.collision.vertices[seg];
      var p2 = island.collision.vertices[seg+1];
      var av = p1.clone().lerp(p2,0.5);
      var d = p2.clone().sub(p1).normalize();
      var ang = Math.atan2(d.y, d.x);
      var size = 7+rand()*10
      var deco = new THREE.Mesh(rectangle(-size,-size/3,size*2,size*2),GAME.materials.islandDecorations.pickFloaty(rand()));
      deco.rotation.z = ang;
      deco.position.copy(av);
      island.mesh.add(deco);
    }
    //*/
  }
}












function Island(seed){
  function n(){
    return seed++;
  }
  function rand(){
    return ndhash(n());
  }
  var ipoints = [];
  var d = 15+rand()*15;
  var v = 5;
  var md = 10;
  var Md = 40;
  var aoff = rand()*TAU
  for (var a = 0; a < Math.PI*2-0.3; a+=0.2+rand()*0.1) {
    d = Math.max(md,Math.min(Md,d+(rand()*2-1)*v));
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