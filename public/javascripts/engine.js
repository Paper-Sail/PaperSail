const ENGINE = {}

ENGINE.initialise = function(container){
  
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  

  // Set some camera attributes.
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 1;
  const FAR = 1000;
  
  const GAMESIZE = 250;
  const GAMEWIDTH = GAMESIZE * (ASPECT>1 ? 1 : ASPECT);
  const GAMEHEIGHT = GAMESIZE / (ASPECT<1 ? 1 : ASPECT);
  
  
  
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
        60,
        ASPECT,
        NEAR,
        FAR
    );
  //*/
  GAME.camera.position.z = 300;
  GAME.camera.rotation.z = Math.random()*Math.PI*2;
  GAME.camera.position.x = Math.floor(Math.random())*WORLD.regionSize;
  GAME.camera.position.y = Math.floor(Math.random())*WORLD.regionSize;
  
  
  GAME.scene = new THREE.Scene();
  GAME.scene.background = GAME.backgroundcolor;

  // Add the camera to the scene.
  GAME.scene.add(GAME.camera);
  // Start the renderer.
  //GAME.renderer.setSize(WIDTH, HEIGHT);
  ENGINE.setSize(container);
  
  container.addEventListener("click",function(e){
    var vector = new THREE.Vector3();
    vector.set(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1,
        0);
    vector.unproject( GAME.camera );
    console.log(vector.sub(GAME.camera.position).multiplyScalar(150).add(GAME.camera.position));
    GAME.onClick(vector); 
  });
  window.addEventListener("resize",function() {
    ENGINE.setSize(container);
  });
  return GAME.renderer.domElement;
}

ENGINE.setSize = function(container){
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  

  // Set some camera attributes.
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 1;
  const FAR = 1000;
  
  const GAMESIZE = 250;
  const GAMEWIDTH = GAMESIZE * (ASPECT>1 ? 1 : ASPECT);
  const GAMEHEIGHT = GAMESIZE / (ASPECT<1 ? 1 : ASPECT);
  GAME.camera.aspect = ASPECT;
  GAME.size = Math.max(GAMEWIDTH, GAMEHEIGHT);
  GAME.renderer.setSize(WIDTH, HEIGHT);
}