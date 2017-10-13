const GAME = {};


window.addEventListener("load", function(){
  // Get the DOM element to attach to
  GAME.container =
      document.querySelector('#container');
  
  initialise(GAME.container);
  
  var boat = new THREE.Sprite(GAME.materials.boat);
  GAME.camera.add(boat);
  boat.position.z = -10;
  boat.scale.set(30,30,30);
  
  for (var i = 0; i < 1000; i++) {
    var pos = new THREE.Vector3(
      (Math.random()*2-1)*1000,
      (Math.random()*2-1)*1000,
      0
    );
    var island = Island();
    island.position.set(pos.x, pos.y, 0);
    GAME.scene.add(island);
  }
  
  GAME.init();
  // GO!
  update();
  
});



GAME.textures = {
  islandtex: new THREE.TextureLoader().load("/images/tile_bord.png"),
  boat: new THREE.TextureLoader().load("/images/boat.png"),
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
  var geometry = new THREE.Geometry();
  geometry.merge(outergeometry, new THREE.Matrix4());
  geometry.merge(innergeometry, new THREE.Matrix4());
  geometry.uvsNeedUpdate = true;
  geometry.computeBoundingSphere();
  var island = new THREE.Mesh(geometry, GAME.materials.islandmat);
  
  return island;
}

GAME.onClick = function(pos){
  pos.z = 300;
  GAME.target = pos;
}

GAME.init = function(){
  GAME.target = new THREE.Vector3(1,1,0);
  GAME.boatvelocity = new THREE.Vector3();
}
var forward = new THREE.Vector3(0,0,1);
GAME.update = function(dt){
  var desiredDirection = (GAME.target.clone().sub(GAME.camera.position)).normalize().applyAxisAngle(forward,-TAU/4);
  var currentDirection = new THREE.Vector3(Math.cos(GAME.camera.rotation.z),Math.sin(GAME.camera.rotation.z),0);
  
  currentDirection.lerp(desiredDirection,3*dt);
  GAME.boatvelocity.add(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(dt*10)).sub(GAME.boatvelocity.clone().multiplyScalar(dt*1));
  
  GAME.camera.rotation.z = Math.atan2(currentDirection.y, currentDirection.x);
  
  
  
  
  GAME.camera.position.add(GAME.boatvelocity.clone().multiplyScalar(dt));
  console.log(GAME.boatvelocity, GAME.camera.position);
}






