const WORLD = {
  init: function(){
    WORLD.world = new THREE.Object3D;
    
    var circles = [{
      position: new THREE.Vector3(),
      radius: 600
    }];
    for (var i = 0; i < 8; i++){
      var circle = circles.pickRandom();
      var radius = lerp(200,400,Math.random());
      var newcircle = {
        position: circle.position.clone().add((new THREE.Vector3((circle.radius+radius)*0.9).applyAxisAngle(forward,Math.random()*TAU))),
        radius: radius
      };
      if (newcircle.position.length()+newcircle.radius<2000){
        circles.push(newcircle);
      }
    }
    var mx = Infinity;
    var my = Infinity;
    var Mx = -Infinity;
    var My = -Infinity;
    for (var ci = 0; ci < circles.length; ci++) {
      var cmesh = new THREE.Mesh(new THREE.CircleGeometry(circles[ci].radius, 50), GAME.materials.background);
      cmesh.position.copy(circles[ci].position);
      cmesh.position.z = -100;
      WORLD.world.add(cmesh);
      mx = Math.min(mx, circles[ci].position.x-circles[ci].radius);
      my = Math.min(my, circles[ci].position.y-circles[ci].radius);
      Mx = Math.max(Mx, circles[ci].position.x+circles[ci].radius);
      My = Math.max(My, circles[ci].position.y+circles[ci].radius);
    }
    
    
    var rejected = 0;
    for (var i = 0; i < 1000; i++) {
      var pos;
      while (true){
        pos = new THREE.Vector3(
          lerp(mx,Mx,Math.random()),
          lerp(my,My,Math.random()),
          0
        );
        var canbreak = false;
        for (var ci = 0; ci < circles.length; ci++) {
          var circle = circles[ci];
          if (pos.distanceTo(circle.position)<circle.radius){
            canbreak = true;
          }
        }
        //canbreak = true;
        if (canbreak && pos.length()>75) break;
        rejected++;
      }
      var island = Island();
      //island.mesh.renderOrder = 0;
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
      island.mesh.add(glow);
      glow.position.z = -2;
      WORLD.world.add(island.mesh);
      
      //*
      for (var il=0; il<Math.random()*3; il++){
        
        var seg = Math.floor(Math.random()*(island.collision.vertices.length-1));
        var p1 = island.collision.vertices[seg];
        var p2 = island.collision.vertices[seg+1];
        var av = p1.clone().lerp(p2,0.5);
        var d = p2.clone().sub(p1).normalize();
        var ang = Math.atan2(d.y, d.x);
        var size = 7+Math.random()*10
        var deco = new THREE.Mesh(rectangle(-size,-size/3,size*2,size*2),GAME.materials.islandDecorations.pickRandom());
        deco.rotation.z = ang;
        deco.position.copy(av);
        island.mesh.add(deco);
      }
      //*/
    }
    
    console.log("Rejected: "+rejected);
    
    
    
    GAME.scene.add(WORLD.world);
  }
}












function Island(){
  
  var ipoints = [];
  var d = 10+Math.random()*10;
  var v = 2;
  var md = 5;
  var Md = 100;
  var aoff = Math.random()*TAU
  for (var a = 0; a < Math.PI*2-0.3; a+=0.2+Math.random()*0.1) {
    d = Math.max(md,Math.min(Md,d+(Math.random()*2-1)*v));
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