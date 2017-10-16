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
  })
}
function Island(){
  
  var ipoints = [];
  var d = 5+Math.random()*10;
  var v = 1;
  var md = 1;
  var Md = 100;
  for (var a = 0; a < Math.PI*2-0.3; a+=0.2+Math.random()*0.1) {
    d = Math.max(md,Math.min(Md,d+(Math.random()*2-1)*v));
    ipoints.push(d*Math.cos(a));
    ipoints.push(d*Math.sin(a));
  }
  
  var outergeometry = convexShell(ipoints,6);
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
  pos.z = 300;
  GAME.target = pos;
}

GAME.init = function(){
  GAME.objects = [];
  
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
  
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
      var dotty = desiredDirection.dot(currentDirection);
      
      GAME.boatvelocity.add(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(dt*10*Math.max(0,dotty))).sub(GAME.boatvelocity.clone().multiplyScalar(dt*1));
  } else {
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
  GAME.camera.position.add(GAME.boatvelocity.clone().multiplyScalar(dt));
  
  SCROLL.update(dt);
  
}






