function shapeFromPoints(points){
  var shape = new THREE.Shape();
  shape.moveTo(points[0],points[1]);
  for (var i = 2; i < points.length; i+=2) {
    shape.lineTo(points[i],points[i+1]);
  }
  
  var geometry = new THREE.ShapeGeometry(shape);
  for (var i = 0; i < geometry.faceVertexUvs.length; i++) {
    for (var j = 0; j < geometry.faceVertexUvs[i].length; j++) {
      for (var k = 0; k < geometry.faceVertexUvs[i][j].length; k++) {
        geometry.faceVertexUvs[i][j][k].x = 0;
        geometry.faceVertexUvs[i][j][k].y = 0;
      }
    }
  }
  //geometry.uvsNeedUpdate = true;
  //geometry.computeBoundingSphere();
  return geometry;
}

function rectangle(x,y,w,h) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(x,y,0),
    new THREE.Vector3(x+w,y,0),
    new THREE.Vector3(x+w,y+h,0),
    new THREE.Vector3(x,y+h,0)
  );
  geometry.faces.push(
    new THREE.Face3(0,1,2),
    new THREE.Face3(1,2,3)
  );
  
  geometry.faceVertexUvs[0] = [
    [
      new THREE.Vector2(0,0),
      new THREE.Vector2(1,0),
      new THREE.Vector2(1,1)
    ],
    [
      new THREE.Vector2(1,0),
      new THREE.Vector2(1,1),
      new THREE.Vector2(0,1)
    ]
  ];
  
  return geometry;
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
  
  // Get perimeter
  var perim = 0;
  for (var i = 0; i < plength; i++) {
    var ox = points[mod((i-1)*2,plength)];
    var oy = points[mod((i-1)*2+1,plength)];
    var px = points[i*2];
    var py = points[i*2+1];
    var dx = px-ox;
    var dy = py-oy;
    var d = Math.sqrt(dx*dx+dy*dy);
    perim+=d;
  }
  
  // EHHHHH... (old centerpoint, no longer needed, but takes up index 0)
  geometry.vertices.push(
    new THREE.Vector3(0, 0, 0)
  );
  
  
  
  
  // Create shellpoints
  for (var i = 0; i < plength; i++) {
    var li = mod(i-1,plength);
    var ri = mod(i+1,plength);
    var point = new THREE.Vector2(points[i*2],points[i*2+1]);
    var left = (new THREE.Vector2(point.x - points[li*2],point.y - points[li*2+1])).normalize().rotateAround(new THREE.Vector2(0,0), -TAU/4);
    var right = (new THREE.Vector2(points[ri*2]-point.x,points[ri*2+1]-point.y)).normalize().rotateAround(new THREE.Vector2(0,0), -TAU/4);
    left.lerp(right,0.5).normalize();
    var length = shell;
    
    
    geometry.vertices.push(
      new THREE.Vector3(point.x+left.x*length, point.y+left.y*length, 0)
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
  
  
  // Connect shell
  for (var i = 1; i<=plength; i++){
    var i1 = i;
    var i2 = (i%plength)+1;
    var o1 = i1+plength;
    var o2 = i2+plength;
    var a1 = i/plength;
    var a2 = (i+1)/plength;
    var uvMult = Math.max(1,Math.floor(perim/50));
    var uvOffset = Math.random();
    a1*=uvMult;
    a2*=uvMult;
    a1+=uvOffset;
    a2+=uvOffset;
    
    geometry.faces.push(new THREE.Face3(i1,i2,o1));
    geometry.faces.push(new THREE.Face3(i2,o2,o1));
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(1, a1),
      new THREE.Vector2(1, a2),
      new THREE.Vector2(0, a1)
    ]);
    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(1, a2),
      new THREE.Vector2(0, a2),
      new THREE.Vector2(0, a1)
    ]);
    
  }
  
  // Bake and send back home
  geometry.uvsNeedUpdate = true;
  geometry.computeBoundingSphere();
  return geometry;
}




TAU = Math.PI*2

function remap(input_start, input_end, output_start, output_end, input) {
  return output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
}






function mod(x, n){
	return ((x%n)+n)%n;
}
