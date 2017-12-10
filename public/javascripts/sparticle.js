const SPARTICLE = {
  all: [],
  spawn: function(position,material,options){
    var roamA = Math.random()*TAU;
    var p = {
      position: position,
      material: material.clone(),
      angle: get(options, "angle", 0),
      spawnTime: GAME.clock.elapsedTime,
      maxAge: get(options, "maxAge", 1),
      alphaFunc: get(options, "alphaFunc", function(n){return 1-Math.sqrt(n)}),
      minScale: get(options, "minScale", 1),
      maxScale: get(options, "maxScale", 1),
      scaleFunc: get(options, "scaleFunc", function(n){return Math.sqrt(n)}),
      roam: (new THREE.Vector3(Math.cos(roamA),Math.sin(roamA),0)).multiplyScalar(get(options, "roam", 0))
    };
    p.mesh = new THREE.Mesh(rectangle(-1,-1,2,2),p.material);
    p.mesh.position.copy(p.position);
    p.mesh.rotation.z = p.angle;
    p.mesh.material.opacity = 0;
    SPARTICLE.all.push(p);
    GAME.scene.add(p.mesh);
    return p;
  },
  update: function(dt){
    SPARTICLE.all = SPARTICLE.all.filter(function(p){
      var age = (GAME.clock.elapsedTime-p.spawnTime)/p.maxAge;
      if (age>=1){
        GAME.scene.remove(p.mesh);
        return false;
      } else {
        var scale = Math.max(0.00001,lerp(p.minScale, p.maxScale, p.scaleFunc(age)));
        p.mesh.position.copy(p.position.clone().add(p.roam.clone().multiplyScalar(age)));
        p.mesh.material.opacity=(p.alphaFunc(age));
        p.mesh.scale.set(scale,scale,scale);
        return true;
      }
    })
  }
}