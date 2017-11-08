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
  regionSize: 300,
  fogDensity: 12,
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
    WORLD.makeFog(region);
    WORLD.world.add(region.three);
    WORLD.regions.push(region);
    var tracker = {
      value: 0
    }
    LOADER.trackers.push(tracker);
    LOADER.refresh();
    iterateCoroutine(WORLD.buildWorld(region, tracker), 10, 1);
  },
  buildRegionNoTrack: function(x, y){
    var region = {
      three: new THREE.Object3D(),
      x: x,
      y: y
    }
    //region.three.position.set(x*WORLD.regionSize, y*WORLD.regionSize, 0);
    WORLD.makeFog(region);
    WORLD.world.add(region.three);
    WORLD.regions.push(region);
    iterateCoroutine(WORLD.buildWorld(region), 10, 1);
  },
  getRegion: function(x,y) {
    for (var i = 0; i < WORLD.regions.length; i++) {
      if (WORLD.regions[i].x==x && WORLD.regions[i].y==y)
        return WORLD.regions[i];
    }
  },
  buildWorld: function*(region, tracker) {
    var islands = 15
    var rs = WORLD.regionSize;
    var back = new THREE.Mesh(rectangle(region.x*rs,region.y*rs,rs,rs), new THREE.MeshBasicMaterial({
      color: GAME.backgroundcolor
    }));
    back.position.z = -100;
    region.three.add(back);
    for (var i = 0; i < islands; i++) {
      WORLD.putIsland(region,i);
      if (tracker){
        tracker.value = i/islands;
        LOADER.refresh()
      }
      yield;
    }
    if (tracker){
      tracker.value = 1;
      LOADER.refresh();
    }
  },
  putIsland: function(region,seed){
    var rs = WORLD.regionSize;
    function n(){
      return seed++;
    }
    function rand(){
      return ndhash(region.x, region.y, n())
    }
    var pos = new THREE.Vector2(rand()*rs+region.x*rs,rand()*rs+region.y*rs);
    var island = Island(rand());
    //island.mesh.renderOrder = 0;
    island.mesh.position.set(pos.x, pos.y, 0);
    island.position = new THREE.Vector3(pos.x,pos.y, 1);
    
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
    glow.position.z = -4;
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
  },
  doFog: function(px, py){
    for (var i = 0; i < WORLD.regions.length; i++) {
      var region = WORLD.regions[i];
      for (var fogchunk in region.fog) {
        if (region.fog.hasOwnProperty(fogchunk)) {
          var chunk = region.fog[fogchunk];
          var dx = px - chunk.x;
          var dy = py - chunk.y;
          var d2 = dx*dx+dy*dy;
          var md = (WORLD.regionSize/WORLD.fogDensity)*2.5;
          if (d2<md*md){
            delete region.fog[fogchunk];
            region.three.remove(chunk.three);
          }
        }
      }
    }
  },
  update: function(){
    var curx = Math.floor(GAME.camera.position.x/WORLD.regionSize);
    var cury = Math.floor(GAME.camera.position.y/WORLD.regionSize);
    WORLD.regions = WORLD.regions.filter(function(region){
      var valid = region.x>=curx-1 && region.x<=curx+1 && region.y>=cury-1 && region.y<=cury+1;
      if (!valid){
        //region.three.children[0].material.color = new THREE.Color(0xFF0000);
        WORLD.world.remove(region.three);
      } else {
        WORLD.doFog(GAME.camera.position.x,GAME.camera.position.y);
      }
      return valid;
    });
    for (var i = 0; i < kern.length; i++) {
      var cx = kern[i][0]+curx;
      var cy = kern[i][1]+cury;
      if (!WORLD.getRegion(cx, cy)){
        WORLD.buildRegionNoTrack(cx,cy);
      }
    }
  },
  makeFog: function(region){
    region.fog = {};
    for(var i = 0; i<WORLD.fogDensity; i++){
      for (var j=0; j<WORLD.fogDensity; j++){
        
        var chunk = {};
        chunk.x = ((i+0.5)/WORLD.fogDensity+region.x)*WORLD.regionSize;
        chunk.y = ((j+0.5)/WORLD.fogDensity+region.y)*WORLD.regionSize;
        region.fog[i+"-"+j] = chunk;
        
        chunk.three = new THREE.Mesh(
          rectangle(
            (i/WORLD.fogDensity+region.x)*WORLD.regionSize,
            (j/WORLD.fogDensity+region.y)*WORLD.regionSize,
            1/WORLD.fogDensity*WORLD.regionSize,
            1/WORLD.fogDensity*WORLD.regionSize
          ),
          new THREE.MeshBasicMaterial({
            opacity: 0.40,
            transparent: true,
            color: 0x000000//new THREE.Color(parseInt("0x"+md5(region.x+"-"+region.y+"-"+i+"-"+j).substr(0,6)))//GAME.backgroundcolor
          })
        );
        chunk.three.position.z = -3;
        region.three.add(chunk.three);
      }
    }
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