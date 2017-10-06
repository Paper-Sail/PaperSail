window.addEventListener("load", function(){
  // Get the DOM element to attach to
  const container =
      document.querySelector('#container');
  
  // Set the scene size.
  const WIDTH = container.clientWidth;
  const HEIGHT = container.clientHeight;
  

  // Set some camera attributes.
  const VIEW_ANGLE = 45;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;
  
  const GAMESIZE = 50;
  const GAMEWIDTH = GAMESIZE;
  const GAMEHEIGHT = GAMESIZE/ASPECT
  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer();
  const camera =
      new THREE.OrthographicCamera(
          GAMEWIDTH/-2,
          GAMEWIDTH/2,
          GAMEHEIGHT/2,
          GAMEHEIGHT/-2,
          NEAR,
          FAR
      );

  camera.position.z = 300;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05267A);

  // Add the camera to the scene.
  scene.add(camera);

  // Start the renderer.
  renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(renderer.domElement);
  
  
// Draw!
  
  
  const clock = new THREE.Clock(true);
  var next = 5;
  function update(){
    var dt = clock.getDelta();
    next-=dt;
    if (next<0){
      next+=5;
      scene.remove(island);
      scene.remove(line)
      island = Island();
      wireframe = new THREE.WireframeGeometry( island.geometry );
      line = new THREE.LineSegments( wireframe );
      line.material.depthTest = false;
      line.material.opacity = 1;
      line.material.transparent = true;
      scene.add(island);
    }
    if (clock.elapsedTime%4>2){
      scene.remove(line);
    } else {
      scene.add(line);
    }
    //camera.position.set(Math.sin(clock.elapsedTime)*20,Math.cos(clock.elapsedTime)*20, 300);
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  
  var island = Island();
  var wireframe = new THREE.WireframeGeometry( island.geometry );
  var line = new THREE.LineSegments( wireframe );
  line.material.depthTest = false;
  line.material.opacity = 1;
  line.material.transparent = true;
  scene.add(island);
  //scene.add( line );
  update();
  
});



const islandtex = new THREE.TextureLoader().load("/images/tile_bord.png");
//islandtex.wrapS = THREE.RepeatWrapping;
islandtex.wrapT = THREE.RepeatWrapping;
const islandmat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  map: islandtex,
  transparent: true
});
function Island(){
  
  var ipoints = [];
  var d = 10+Math.random()*3;
  var v = 1;
  var md = 7;
  var Md = 13;
  for (var a = 0; a < Math.PI*2-0.2; a+=0.25+Math.random()*0.125) {
    d = Math.max(md,Math.min(Md,d+(Math.random()*2-1)*v));
    ipoints.push(d*Math.cos(a));
    ipoints.push(d*Math.sin(a));
  }
  
  var geometry = convexShell(ipoints,4);
  
  var island = new THREE.Mesh(geometry, islandmat);
  
  return island;
}

function convexShell(points, shell){
  if (points.length<6){
    console.error("Please specify at least 3 points (6 values)")
    return;
  } else if (points.length%2!=0) {
    console.error("Please use an even number of values (odd indexes are x-coordinates and even are y-coordinates)")
    return;
  }
  
  var plength = points.length/2;
  
  var geometry = new THREE.Geometry();
  var mx = Infinity;
  var my = Infinity;
  var Mx = -Infinity;
  var My = -Infinity;
  // Get bounds
  for (var i = 0; i < plength; i++) {
    var px = points[i*2];
    var py = points[i*2+1];
    mx = Math.min(mx, px);
    Mx = Math.max(Mx, px);
    my = Math.min(my, py);
    My = Math.max(My, py);
  }
  var cx = (mx+Mx)/2;
  var cy = (my+My)/2;
  
  // Use bounds to create and place a vertex at the median point
  geometry.vertices.push(
    new THREE.Vector3(cx, cy, 0)
  );
  
  
  
  
  // Create shellpoints
  for (var i = 0; i < plength; i++) {
    var px = points[i*2];
    var py = points[i*2+1];
    var dx = px-cx;
    var dy = py-cy;
    var d = Math.sqrt(dx*dx+dy*dy);
    var nx = dx/d;
    var ny = dy/d;
    geometry.vertices.push(
      new THREE.Vector3(px+nx*shell, py+ny*shell, 0)
    );
  }
  
  // Create inner points
  for (var i = 0; i < plength; i++) {
    var px = points[i*2];
    var py = points[i*2+1];
    geometry.vertices.push(
      new THREE.Vector3(px, py, 0)
    );
  }
  
  
  geometry.faceVertexUvs[0] = [];
  // Connect inner vertices to the median
  for (var i = 1; i<=plength; i++){
    var i1 = i;
    var i2 = (i%plength)+1;
    var o1 = i1+plength;
    var o2 = i2+plength;
    var px1 = geometry.vertices[i1].x;
    var px2 = geometry.vertices[i2].x;
    var py1 = geometry.vertices[i1].y;
    var py2 = geometry.vertices[i2].y;
    var dx1 = px1-cx;
    var dy1 = py1-cy;
    var a1 = Math.atan2(dy1,dx1);
    var dx2 = px2-cx;
    var dy2 = py2-cy;
    var a2 = Math.atan2(dy2,dx2);
    
    geometry.faces.push(new THREE.Face3(0,o1,o2));
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(0, a1/TAU),
      new THREE.Vector2(0, a1/TAU),
      new THREE.Vector2(0, a2/TAU)
    ]);
    
  }
  
  // Connect shell
  for (var i = 1; i<=plength; i++){
    var i1 = i;
    var i2 = (i%plength)+1;
    var o1 = i1+plength;
    var o2 = i2+plength;
    var px1 = geometry.vertices[i1].x;
    var px2 = geometry.vertices[i2].x;
    var py1 = geometry.vertices[i1].y;
    var py2 = geometry.vertices[i2].y;
    var dx1 = px1-cx;
    var dy1 = py1-cy;
    var a1 = Math.atan2(dy1,dx1);
    var dx2 = px2-cx;
    var dy2 = py2-cy;
    var a2 = Math.atan2(dy2,dx2);
    if (a2<a1){
      a2+=TAU;
    }
    a1 *= 4;
    a2 *= 4;
    
    geometry.faces.push(new THREE.Face3(i1,i2,o1));
    geometry.faces.push(new THREE.Face3(i2,o2,o1));
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(1, a1/TAU),
      new THREE.Vector2(1, a2/TAU),
      new THREE.Vector2(0, a1/TAU)
    ]);
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(1, a2/TAU),
      new THREE.Vector2(0, a2/TAU),
      new THREE.Vector2(0, a1/TAU)
    ]);
    
  }
  
  
  
  /*
  geometry.faceVertexUvs[0] = [];
  for (var i = 0; i < geometry.faces.length; i++) {
    geometry.faceVertexUvs[0][i] = [
      new THREE.Vector2(
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].a].x),
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].a].y)
      ),
      new THREE.Vector2(
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].b].x),
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].b].y)
      ),
      new THREE.Vector2(
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].c].x),
        remap(mx,Mx,0,1,geometry.vertices[geometry.faces[i].c].y)
      )
    ]
  }
  */
  
  
  
  // Bake and send back home
  geometry.computeBoundingSphere();
  return geometry;
}

TAU = Math.PI*2

function remap(input_start, input_end, output_start, output_end, input) {
  return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}


last_t = 0;
dt = 0;
