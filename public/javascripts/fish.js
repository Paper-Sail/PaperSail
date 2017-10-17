const FISH = {
  fish: [],
  spawn: function(width, length, segments, material){
    var geometry = new THREE.Geometry();
    geometry.dynamic = true;
    for (var i=0; i<=segments; i++){
      geometry.vertices.push(
        new THREE.Vector3(0, -(length/segments)*i, 0),
        new THREE.Vector3(-width/2, -(length/segments)*i, 0),
        new THREE.Vector3(width/2, -(length/segments)*i, 0)
      );
    }
    var uvy = 1/segments;
    for (var i=0; i<segments; i++){
      var s = i*3;
      var f = i*4;
      geometry.faces.push(
        new THREE.Face3(s,s+1,s+4),
        new THREE.Face3(s,s+4,s+3),
        new THREE.Face3(s,s+3,s+5),
        new THREE.Face3(s,s+5,s+2)
      );
      
      geometry.faceVertexUvs[0][f] = [
        new THREE.Vector2(0.5,1-i*uvy),
        new THREE.Vector2(0,1-i*uvy),
        new THREE.Vector2(0,1-(i+1)*uvy)
      ];
      geometry.faceVertexUvs[0][f+1] = [
        new THREE.Vector2(0.5,1-i*uvy),
        new THREE.Vector2(0,1-(i+1)*uvy),
        new THREE.Vector2(0.5,1-(i+1)*uvy)
      ];
      geometry.faceVertexUvs[0][f+2] = [
        new THREE.Vector2(0.5,1-i*uvy),
        new THREE.Vector2(0.5,1-(i+1)*uvy),
        new THREE.Vector2(1,1-(i+1)*uvy)
      ];
      geometry.faceVertexUvs[0][f+3] = [
        new THREE.Vector2(0.5,1-i*uvy),
        new THREE.Vector2(1,1-(i+1)*uvy),
        new THREE.Vector2(1,1-i*uvy)
      ];
    }
    var fishy = {
      mesh: new THREE.Mesh(geometry, material),
      position: new THREE.Vector3(),
      direction: new THREE.Vector3(0,1,0),
      start: 0,
      history: [],
      width: width,
      length: length,
      seglength: length/segments,
      segments: segments
    };
    fishy.mesh.position.z = -5;
    for (var i=0;i<=segments+4; i++){
      fishy.history.push(new THREE.Vector3(0, -(length/segments)*i, 0));
    }
    GAME.scene.add(fishy.mesh);
    FISH.fish.push(fishy);
  },
  update: function(dt) {
    for (var f = 0; f < FISH.fish.length; f++) {
      var fishy = FISH.fish[f];
      fishy.mesh.geometry.verticesNeedUpdate = true;
      fishy.mesh.position.copy(fishy.position);
      fishy.direction = (new THREE.Vector3(0,1,0)).applyAxisAngle(forward,Math.sin(GAME.clock.elapsedTime*0.3)*1);
      fishy.position.add(fishy.direction.clone().multiplyScalar(dt*20));
      var dist = fishy.position.distanceTo(fishy.history[0]);
      if (dist>fishy.seglength){
        fishy.history.pop();
        fishy.history.unshift(fishy.position.clone());
        dist = 0;
      }
      for (var i = 0; i<fishy.segments+1; i++){
        var v = i*3;
        var p0 = FISH.sample(i-(dist/fishy.seglength)-1,fishy.position, fishy.history);
        var p1 = FISH.sample(i-(dist/fishy.seglength),fishy.position, fishy.history);
        var p2 = FISH.sample(i-(dist/fishy.seglength)+1,fishy.position, fishy.history);
        var vf = p0.clone().sub(p2).normalize();
        var vr = vf.clone().applyAxisAngle(forward,TAU/4).multiplyScalar(fishy.width/2);
        var l = p1.clone().add(vf.clone().add(vr));
        var r = p1.clone().add(vf.clone().sub(vr));
        p1.sub(fishy.position);
        l.sub(fishy.position);
        r.sub(fishy.position);
        
        fishy.mesh.geometry.vertices[v].x = p1.x;
        fishy.mesh.geometry.vertices[v].y = p1.y;
        fishy.mesh.geometry.vertices[v+1].x = l.x;
        fishy.mesh.geometry.vertices[v+1].y = l.y;
        fishy.mesh.geometry.vertices[v+2].x = r.x;
        fishy.mesh.geometry.vertices[v+2].y = r.y;
      }
    }
  },
  sample: function(pt, position, history){
    var p = pt+2;
    if (p<=0){
      console.log("Lowballer");
      return position.clone();
    }else if (p<1) {
      return position.clone().lerp(history[0],pt)
    } else if (p<(history.length-1)) {
      var pti = Math.floor(p);
      var ptv = mod(p,1);
      return history[pti].clone().lerp(history[pti+1],ptv);
    } else {
      console.log("Highballer");
      return history[history.length-1].clone();
    }
  }
}