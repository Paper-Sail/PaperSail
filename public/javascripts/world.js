function createKernel(fromZero){
  var kernel = [];
  for (var x = -fromZero; x<=fromZero; x++){
    for (var y = -fromZero; y<=fromZero; y++){
      kernel.push([x,y]);
    }
  }
  return kernel;
}

const WORLD = {
  regionSize: 300,
  fogDensity: 12,
  init: function(){
    WORLD.world = new THREE.Object3D();
    WORLD.regions = [];
    WORLD.fromZero = 1;
    WORLD.kernel = createKernel(WORLD.fromZero);
    GAME.scene.add(WORLD.world);
    var curx = Math.floor(GAME.camera.position.x/WORLD.regionSize);
    var cury = Math.floor(GAME.camera.position.y/WORLD.regionSize);
    for (var i = 0; i < WORLD.kernel.length; i++) {
      var p = WORLD.kernel[i]
      WORLD.buildRegion(curx+p[0],cury+p[1]);
    }
  },
  buildRegion: function(x, y){
    var region = {
      three: new THREE.Object3D(),
      x: x,
      y: y,
      islands: []
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
      y: y,
      islands: []
    }
    //region.three.position.set(x*WORLD.regionSize, y*WORLD.regionSize, 0);
    WORLD.makeFog(region);
    WORLD.world.add(region.three);
    WORLD.regions.push(region);
    iterateCoroutine(WORLD.buildWorld(region), 10, 1);
  },
  getRegionAtWorldPos(x,y){
    return WORLD.getRegion(
      Math.floor(x/WORLD.regionSize),
      Math.floor(y/WORLD.regionSize),
    );
  },
  getRegion: function(x,y) {
    for (var i = 0; i < WORLD.regions.length; i++) {
      if (WORLD.regions[i].x==x && WORLD.regions[i].y==y)
        return WORLD.regions[i];
    }
  },
  buildWorld: function*(region, tracker) {
    var wseed = 0;
    function n(){
      return wseed++;
    }
    function rand(){
      return ndhash(region.x, region.y, n())
    }
    var islands = Math.floor(rand()*20)
    var rs = WORLD.regionSize;
    /*
    var back = new THREE.Mesh(rectangle(region.x*rs,region.y*rs,rs,rs), new THREE.MeshBasicMaterial({
      color: GAME.backgroundcolor
    }));
    back.position.z = -100;
    region.three.add(back);
    */
    var iscale = 0.75+rand()*2
    for (var i = 0; i < islands; i++) {
      WORLD.putIsland(region,i, iscale);
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
  putIsland: function(region,seed, iscale){
    var rs = WORLD.regionSize;
    function n(){
      return seed++;
    }
    function rand(){
      return ndhash(region.x, region.y, n())
    }
    var pos = new THREE.Vector2(rand()*rs+region.x*rs,rand()*rs+region.y*rs);
    var island = Island(rand(), iscale);
    region.islands.push(island);
    //island.mesh.renderOrder = 0;
    island.mesh.position.set(pos.x, pos.y, 0);
    island.position = new THREE.Vector3(pos.x,pos.y, 1);
    var collisionpoints = [];
    for (var i = 0; i < island.collision.vertices.length; i++) {
      var p1 = island.collision.vertices[i];
      var p2 = island.collision.vertices[(i+1)%island.collision.vertices.length];
      var d = p1.distanceTo( p2 );
      var mind = GAME.boatradius*0.5;
      steps = Math.ceil(d/mind);
      for (var s = 0; s < steps; s++) {
        collisionpoints.push(p1.clone().lerp(p2, (s+0.5)/steps));
      }
    }
    GAME.objects.collisions.push({
      center: pos.clone().add(island.collision.boundingSphere.center),
      position: pos.clone(),
      radius: island.collision.boundingSphere.radius*1.5,
      points: collisionpoints
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
    var cmesh = new THREE.Mesh(GAME.models.cylinder,GAME.materials.black);
    island.mesh.add(cmesh);
    cmesh.scale.x = cmesh.scale.y = cmesh.scale.z = 0.1;
    cmesh.position.z = 10;
    glow.position.z = -4;
    region.three.add(island.mesh);
    //*
    for (var il=0; il<rand()*3*iscale*iscale; il++){
      
      var seg = Math.floor(rand()*(island.collision.vertices.length-1));
      var p0 = island.collision.vertices[mod(seg-1,island.collision.vertices.length)];
      var p1 = island.collision.vertices[seg];
      var p2 = island.collision.vertices[seg+1];
      //var av = p1.clone().lerp(p2,0.5);
      var d = p2.clone().sub(p0).normalize();
      var ang = Math.atan2(d.y, d.x);
      var size = 7+rand()*10*iscale
      var deco = new THREE.Mesh(rectangle(-size,-size/3,size*2,size*2),GAME.materials.islandDecorations.pickFloaty(rand()));
      deco.rotation.z = ang;
      deco.position.copy(p1);
      //deco.position.z = Math.random()*30;
      island.mesh.add(deco);
    }
    if (true || rand()<0.25){
      //DRAGON.spawn(island.mesh.position.x,island.mesh.position.y)
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
      var valid = region.x>=curx-WORLD.fromZero && region.x<=curx+WORLD.fromZero && region.y>=cury-WORLD.fromZero && region.y<=cury+WORLD.fromZero;
      if (!valid){
        //region.three.children[0].material.color = new THREE.Color(0xFF0000);
        WORLD.world.remove(region.three);
      } else {
        WORLD.doFog(GAME.camera.position.x,GAME.camera.position.y);
      }
      return valid;
    });
    for (var i = 0; i < WORLD.kernel.length; i++) {
      var cx = WORLD.kernel[i][0]+curx;
      var cy = WORLD.kernel[i][1]+cury;
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
            opacity: 0.0,
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












function Island(seed, scale){
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
  var s = scale;
  var aoff = rand()*TAU;
  var steps = 10
  for (var a = 0; a < Math.PI*2; a+=1/steps) {
    d = Math.max(md,Math.min(Md,d+(rand()*2-1)*v));
    ipoints.push(d*Math.cos(a+aoff)*s);
    ipoints.push(d*Math.sin(a+aoff)*s);
  }
  
  var outergeometry = convexShell(ipoints,12*scale,100*scale);
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