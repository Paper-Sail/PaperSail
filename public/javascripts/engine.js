const ENGINE = {}
const near_plane = 1;
const far_plane = 1000;


ENGINE.initialise = function(container){
  
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  

  // Set some camera attributes.
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = near_plane;
  const FAR = far_plane;
  
  const GAMESIZE = 250;
  const GAMEWIDTH = GAMESIZE * (ASPECT>1 ? 1 : ASPECT);
  const GAMEHEIGHT = GAMESIZE / (ASPECT<1 ? 1 : ASPECT);
  
  var heightcm = px2cm(container.clientHeight);
  
  // Create a WebGL renderer, camera
  // and a scene
  GAME.renderer = new THREE.WebGLRenderer();
  GAME.camera =
  /*
      new THREE.OrthographicCamera(
          GAMEWIDTH/-2,
          GAMEWIDTH/2,
          GAMEHEIGHT/2,
          GAMEHEIGHT/-2,
          NEAR,
          FAR
      );
  /*/
    new THREE.PerspectiveCamera(
        45,
        ASPECT,
        NEAR,
        FAR
    );
  //*/
  GAME.camera.position.z = 300;
  GAME.camera.rotation.z = Math.random()*Math.PI*2;
  GAME.camera.position.x = 0;Math.floor(Math.random())*WORLD.regionSize;
  GAME.camera.position.y = 0;Math.floor(Math.random())*WORLD.regionSize;
  
  
  GAME.scene = new THREE.Scene();
  GAME.scene.background = GAME.backgroundcolor;

  // Add the camera to the scene.
  GAME.scene.add(GAME.camera);
  // Start the renderer.
  //GAME.renderer.setSize(WIDTH, HEIGHT);
  ENGINE.setSize(container);
	FastClick.attach(container);
  container.addEventListener("click",function(e){
    var vector = new THREE.Vector3();
    vector.set(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1,
        0);
    vector.unproject( GAME.camera );
    vector.sub(GAME.camera.position).multiplyScalar(150).add(GAME.camera.position);
    GAME.onClick(vector); 
  });
  window.addEventListener("resize",function() {
    ENGINE.setSize(container);
  });
  return GAME.renderer.domElement;
}

function px2cm(px) {
  var elem = document.createElement("div");
  elem.style.position = "absolute";
  elem.style.height = "1000cm";
  document.body.appendChild(elem);
  //var d = $("<div/>").css({ position: 'absolute', top : '-1000cm', left : '-1000cm', height : '1000cm', width : '1000cm' }).appendTo('body');
  var px_per_cm = elem.clientHeight / 1000;
  document.body.removeChild(elem);
  return px / px_per_cm;
}

ENGINE.setSize = function(container){
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  ENGINE.screenHeight = px2cm(container.clientHeight);
  // Set some camera attributes.
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = near_plane;
  const FAR = far_plane;
  
  const GAMESIZE = 250;
  const GAMEWIDTH = GAMESIZE * (ASPECT>1 ? 1 : ASPECT);
  const GAMEHEIGHT = GAMESIZE / (ASPECT<1 ? 1 : ASPECT);
  GAME.camera.aspect = ASPECT;
  GAME.size = Math.max(GAMEWIDTH, GAMEHEIGHT);
  GAME.renderer.setSize(WIDTH, HEIGHT);
  GAME.camera.zoom = 25/ENGINE.screenHeight;
}