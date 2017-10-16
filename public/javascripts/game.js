const GAME = {};
GAME.boatradius = 8;

window.addEventListener("load", function(){
  // Get the DOM element to attach to
  GAME.container =
      document.querySelector('#container');
  
  initialise(GAME.container);
  
  
  GAME.init();
  // GO!
  update();
  
});



GAME.textures = {
  islandtex: new THREE.TextureLoader().load("/images/tile_bord.png"),
  boat: new THREE.TextureLoader().load("/images/boat.png"),
  stars: new THREE.TextureLoader().load("/images/stars_trans.png"),
  touch: new THREE.TextureLoader().load("/images/white_glow.png"),
  splash: new THREE.TextureLoader().load("/images/water_circle_trail.png"),
  glow: new THREE.TextureLoader().load("/images/white_glow.png"),
}
GAME.textures.islandtex.wrapT = THREE.RepeatWrapping;
GAME.materials = {
  islandmat: new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: GAME.textures.islandtex,
    transparent: true
  }),
  boat: new THREE.SpriteMaterial({
    map: GAME.textures.boat,
    color: 0xFFFFFF
  }),
  stars: new THREE.MeshBasicMaterial({
    map: GAME.textures.stars,
    color: 0xFFFFFF,
    transparent: true
  }),
  splash: new THREE.MeshBasicMaterial({
    map: GAME.textures.splash,
    color: 0xFFFFFF,
    transparent: true
  }),
  touch: new THREE.MeshBasicMaterial({
    map: GAME.textures.touch,
    color: 0xFFFFFF,
    transparent: true
  }),
  glow: new THREE.MeshBasicMaterial({
    map: GAME.textures.glow,
    color: 0xFFFFFF,
    transparent: true
  })
}
function Island(){
  
  var ipoints = [];
  var d = 10+Math.random()*10;
  var v = 2;
  var md = 5;
  var Md = 100;
  for (var a = 0; a < Math.PI*2-0.3; a+=0.2+Math.random()*0.1) {
    d = Math.max(md,Math.min(Md,d+(Math.random()*2-1)*v));
    ipoints.push(d*Math.cos(a));
    ipoints.push(d*Math.sin(a));
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

GAME.onClick = function(pos){
  var partpos = pos.clone()
  partpos.z = -1;
  SPARTICLE.spawn(partpos,GAME.materials.splash,{
    minScale: 0,
    maxScale: 20
  });
  GAME.cursor.position.copy(partpos);
  GAME.cursorTime = GAME.clock.elapsedTime;
  pos.z = 300;
  GAME.target = pos;
}

GAME.init = function(){
  GAME.objects = [];
  GAME.splashTime = 1;
  GAME.splashTimeScale = 0.25;
  
  GAME.cursor = new THREE.Mesh(rectangle(-5,-5,10,10),GAME.materials.touch);
  GAME.cursor.position.z = 10000;
  GAME.cursorTime = 1000;
  GAME.scene.add(GAME.cursor);
  
  var boat = new THREE.Sprite(GAME.materials.boat);
  boat.renderOrder = 0;
  GAME.camera.add(boat);
  boat.position.z = -10;
  boat.scale.set(30,30,30);
  GAME.objects.collisions = [];
  for (var i = 0; i < 1000; i++) {
    var pos = new THREE.Vector3(
      (Math.random()*2-1)*1000,
      (Math.random()*2-1)*1000,
      0
    );
    var island = Island();
    island.mesh.renderOrder = 0;
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
    glow.material.color = new THREE.Color(0x1E47AE);
    glow.material.opacity = 1;
    island.mesh.add(glow);
    glow.position.z = -2;
    GAME.scene.add(island.mesh);
  }
  
  console.log(GAME.size);
  SCROLL.newLayer(GAME.materials.stars,100,GAME.size,-10);
  
  
  GAME.target = new THREE.Vector3(1,1,0);
  GAME.boatvelocity = new THREE.Vector3();
  GAME.boatangularvelocity = 0;
}


var forward = new THREE.Vector3(0,0,1);
GAME.update = function(dt){
  var desiredDirection = (GAME.target.clone().sub(GAME.camera.position)).normalize().applyAxisAngle(forward,-TAU/4);
  var currentDirection = new THREE.Vector3(Math.cos(GAME.camera.rotation.z),Math.sin(GAME.camera.rotation.z),0);
  
  var ctime = Math.max(0, Math.min(1, (GAME.clock.elapsedTime-GAME.cursorTime)*2 ));
  var wob =  1-(Math.pow(((Math.sin(ctime*Math.PI)+ctime)/1.55),2))/5;
  GAME.cursor.material.opacity = ctime*wob;
  //GAME.cursor.scale.set(ctime*wob,ctime*wob,wob);
  
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
      var dotty = desiredDirection.dot(currentDirection);
      
      GAME.boatvelocity.add(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(dt*10*Math.max(0,dotty))).sub(GAME.boatvelocity.clone().multiplyScalar(dt*1));
  } else {
    GAME.cursor.position.z = 10000;
    GAME.boatvelocity.sub(GAME.boatvelocity.clone().multiplyScalar(dt*2));
  }
  var pushVelocity = new THREE.Vector3();
  var maxPower = 0;
  for (var i = 0; i < GAME.objects.collisions.length; i++) {
    var collision = GAME.objects.collisions[i];
    var cdx = GAME.camera.position.x-collision.center.x;
    var cdy = GAME.camera.position.y-collision.center.y;
    var cd = (cdx*cdx+cdy*cdy);
    if (cd<Math.pow(collision.radius+GAME.boatradius,2)){
      for (var ci = 0; ci < collision.points.length; ci++) {
        var point = collision.position.clone().add(collision.points[ci]);
        var dx = GAME.camera.position.x-point.x;
        var dy = GAME.camera.position.y-point.y;
        var d2 = (dx*dx+dy*dy);
        if (d2<GAME.boatradius*GAME.boatradius){
          var d = Math.sqrt(d2);
          var nx = dx/d;
          var ny = dy/d;
          maxPower = Math.max(maxPower,GAME.boatradius-d);
          pushVelocity.add(new THREE.Vector3(nx,ny,0));
        }
      }
    }
  }
  pushVelocity.normalize().multiplyScalar(100*dt*(maxPower/GAME.boatradius));
  GAME.boatvelocity.add(pushVelocity);
  var curAngle = Math.atan2(currentDirection.y, currentDirection.x);
  var desiAngle = Math.atan2(desiredDirection.y, desiredDirection.x);
  currentDirection.lerp(desiredDirection,dt);
  var aimAngle = Math.atan2(currentDirection.y, currentDirection.x);
  //console.log(curAngle,desiAngle,aimAngle);
  GAME.camera.rotation.z = aimAngle;
  
  
  GAME.boatvelocity.z = 0;
  
  GAME.splashTime-=GAME.boatvelocity.length()*GAME.splashTimeScale*dt;
  //console.log(GAME.boatvelocity.length);
  if (GAME.splashTime<=0){
    console.log("splash");
    GAME.splashTime = 1+Math.random();
    var partpos = GAME.camera.position.clone().sub(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(6));
    partpos.z = -1;
    var size = 0.75+Math.random()*0.25;
    SPARTICLE.spawn(partpos,GAME.materials.splash,{
      minScale: 3*size,
      maxScale: 10*size,
      roam: 10,
      scaleFunc: function(x){ return Math.sqrt(x);},
      alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
      maxAge: 3
    });
  }
  
  
  
  GAME.camera.position.add(GAME.boatvelocity.clone().multiplyScalar(dt));
  SPARTICLE.update(dt);
  SCROLL.update(dt);
  
}






