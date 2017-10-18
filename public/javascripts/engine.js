function initialise(container){
  
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  

  // Set some camera attributes.
  const ASPECT = WIDTH / HEIGHT;
  console.log("Aspect:",ASPECT);
  const NEAR = 1;
  const FAR = 1000;
  
  const GAMESIZE = 200;
  const GAMEWIDTH = GAMESIZE * (ASPECT>1 ? 1 : ASPECT);
  const GAMEHEIGHT = GAMESIZE / (ASPECT<1 ? 1 : ASPECT);
  GAME.size = Math.max(GAMEWIDTH, GAMEHEIGHT);
  
  
  
  // Create a WebGL renderer, camera
  // and a scene
  GAME.renderer = new THREE.WebGLRenderer();
  GAME.camera =
      new THREE.OrthographicCamera(
          GAMEWIDTH/-2,
          GAMEWIDTH/2,
          GAMEHEIGHT/2,
          GAMEHEIGHT/-2,
          NEAR,
          FAR
      );

  GAME.camera.position.z = 300;
  
  
  GAME.scene = new THREE.Scene();
  //GAME.scene.background = GAME.backgroundcolor;

  // Add the camera to the scene.
  GAME.scene.add(GAME.camera);
  // Start the renderer.
  GAME.renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  GAME.container.appendChild(GAME.renderer.domElement);
  
  GAME.renderer.domElement.addEventListener("click",function(e){
    var vector = new THREE.Vector3();
    vector.set(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1,
        0);
    vector.unproject( GAME.camera );
    GAME.onClick(vector); 
  });
  GAME.clock = new THREE.Clock(true);
}

// Setup update-render loop
function update(){
  var dt = Math.min(1/20,GAME.clock.getDelta());
  GAME.update(dt);
  
  GAME.renderer.render(GAME.scene, GAME.camera);
  requestAnimationFrame(update);
}