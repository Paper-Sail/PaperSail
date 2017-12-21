const FISH = {
  fish: [],
  spawn: function(width, length, segments, material, finmaterial){
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
    var position = new THREE.Vector3(100+Math.random()*300,0,0).applyAxisAngle(forward,Math.random()*TAU);
    GAMEINFO.log("Fish spawned at position ("+Math.floor(position.x)+","+Math.floor(position.y)+")");
    var fins = new THREE.Mesh(rectangle(-width/2,-width/4,width,width/2), finmaterial);
    var fishy = {
      woboff: Math.random()*TAU,
      woboff2: Math.random()*TAU,
      mesh: new THREE.Mesh(geometry, material),
      position: position,
      direction: new THREE.Vector3(0,1,0),
      targetDirection: new THREE.Vector3(0,1,0),
      nextIn: 1,
      timeScale: 0.2,
      maxSpeed: 25,
      minSpeed: 7,
      speed: 10,
      time: 0,
      start: 0,
      lastseen: Math.random()*25,
      unseen: true,
      returntime: 25,
      splashTime: 1,
      splashTimeScale: 1,
      history: [],
      width: width,
      length: length,
      seglength: length/segments,
      segments: segments,
      fins: fins,
    };
    fishy.mesh.position.z = -5;
    fishy.mesh.frustumCulled = false;
    for (var i=0;i<=segments+4; i++){
      fishy.history.push((new THREE.Vector3(0, -(length/segments)*i, 0)).add(position));
    }
    GAME.scene.add(fishy.mesh);
    GAME.scene.add(fishy.fins);
    FISH.fish.push(fishy);
  },
  update: function(dt) {
    for (var f = 0; f < FISH.fish.length; f++) {
      var fishy = FISH.fish[f];
      fishy.time+=dt*fishy.nextIn;
      var fromcam = GAME.camera.position.clone().sub(fishy.position);
      fromcam.z = 0;
      if (fromcam.length()>GAME.size*0.75){
        fishy.unseen = true;
      } else if (fromcam.length()<GAME.size*0.25){
        fishy.unseen = false;
      }
      if (fishy.unseen){
        fishy.lastseen+=dt;
      } else {
        fishy.lastseen = 0;
      }
      fishy.mesh.geometry.verticesNeedUpdate = true;
      fishy.nextIn-=dt*fishy.timeScale;
      if (fishy.nextIn<=0){
        fishy.nextIn = Math.random()+1;
        if (fishy.lastseen<fishy.returntime){
            fishy.targetDirection.applyAxisAngle(forward, lerp(TAU/6,TAU/4,Math.random())*(Math.random()>0.5?1:-1));
        } else {
          fishy.targetDirection.lerp(fromcam,0.25).normalize();
        }
      }
      fishy.splashTime-=dt*fishy.splashTimeScale*fishy.nextIn*fishy.nextIn;
      if (fishy.splashTime<=0){
        fishy.splashTime = Math.random();
        var partpos = FISH.sample(0.01*fishy.segments,fishy.position,fishy.history).add((new THREE.Vector3(Math.random()*5,0,0)).applyAxisAngle(forward,Math.random()*TAU));
        partpos.z = -1;
        var size = 0.5+Math.random()*0.5;
        SPARTICLE.spawn(partpos,GAME.materials.splash,{
          minScale: 5*size,
          maxScale: 10*size,
          roam: 3*Math.random(),
          scaleFunc: function(x){ return Math.sqrt(x);},
          alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
          maxAge: 4*size
        });
      }
      var wobble = 0.3
      if (fishy.lastseen>fishy.returntime){
        wobble = 0.3;
      }
      fishy.speed = lerp(fishy.speed,lerp(fishy.minSpeed,fishy.maxSpeed,fishy.nextIn),dt*2);
      fishy.direction.lerp(fishy.targetDirection,dt*0.5);
      fishy.position.add(fishy.direction.clone().normalize().applyAxisAngle(forward,Math.sin(fishy.woboff+fishy.time*wobble)).multiplyScalar(dt*fishy.speed));
      var dist = fishy.position.distanceTo(fishy.history[0]);
      if (dist>fishy.seglength){
        fishy.history.pop();
        fishy.history.unshift(fishy.position.clone());
        dist = 0;
      }
      var anchor = (fishy.history[0].clone())
      fishy.mesh.position.copy(anchor);
      fishy.mesh.position.z = -5;
      for (var i = 0; i<fishy.segments+1; i++){
        var v = i*3;
        var p0 = FISH.sample(i-(dist/fishy.seglength)-1,fishy.position, fishy.history);
        var p1 = FISH.sample(i-(dist/fishy.seglength),fishy.position, fishy.history);
        var p2 = FISH.sample(i-(dist/fishy.seglength)+1,fishy.position, fishy.history);
        var vf = p0.clone().sub(p2).normalize();
        var vr = vf.clone().applyAxisAngle(forward,TAU/4).multiplyScalar(fishy.width/2);
        var l = p1.clone().add(vf.clone().add(vr));
        var r = p1.clone().add(vf.clone().sub(vr));
        p1.sub(anchor);
        l.sub(anchor);
        r.sub(anchor);
        
        fishy.mesh.geometry.vertices[v].x = p1.x;
        fishy.mesh.geometry.vertices[v].y = p1.y;
        fishy.mesh.geometry.vertices[v+1].x = l.x;
        fishy.mesh.geometry.vertices[v+1].y = l.y;
        fishy.mesh.geometry.vertices[v+2].x = r.x;
        fishy.mesh.geometry.vertices[v+2].y = r.y;
      }
      /* FINS */{
        var i = Math.floor(fishy.segments*0.33);
        var v = i*3;
        var p0 = FISH.sample(i-(dist/fishy.seglength)-1,fishy.position, fishy.history);
        var p1 = FISH.sample(i-(dist/fishy.seglength),fishy.position, fishy.history);
        var p2 = FISH.sample(i-(dist/fishy.seglength)+1,fishy.position, fishy.history);
        var vf = p0.clone().sub(p2).normalize();
        fishy.fins.position.copy(p1);
        fishy.fins.position.z = -5;
        fishy.fins.scale.set(1+Math.sin(fishy.woboff2+GAME.clock.elapsedTime)*0.1,1,1);
        fishy.fins.rotation.z = Math.atan2(vf.y,vf.x)+TAU/4;
      } 
    }
  },
  sample: function(pt, position, history){
    var p = pt+2;
    if (p<=0){
      //console.log("Lowballer");
      return position.clone();
    }else if (p<1) {
      return position.clone().lerp(history[0],pt)
    } else if (p<(history.length-1)) {
      var pti = Math.floor(p);
      var ptv = mod(p,1);
      return history[pti].clone().lerp(history[pti+1],ptv);
    } else {
      //console.log("Highballer");
      return history[history.length-1].clone();
    }
  }
}