const SPARTICLE = {
  all: [],
  spawn: function(position,material,options){
    var roamA = Math.random()*TAU;
    var p = {
      position: position,
      material: material.clone(),
      spawnTime: GAME.clock.elapsedTime,
      maxAge: get(options, "maxAge", 1),
      alphaFunc: get(options, "alphaFunc", function(n){return Math.sqrt(n)}),
      minScale: get(options, "minScale", 1),
      maxScale: get(options, "maxScale", 1),
      scaleFunc: get(options, "scaleFunc", function(n){return Math.sqrt(n)}),
      roam: (new THREE.Vector3(Math.cos(roamA),Math.sin(roamA),0)).multiplyScalar(get(options, "roam", 0))
    };
    p.mesh = new THREE.Mesh(rectangle(-1,-1,2,2),p.material);
    p.mesh.renderOrder = p.position.z;
    p.mesh.position.copy(p.position);
    SPARTICLE.all.push(p);
    GAME.scene.add(p.mesh);
  },
  update: function(dt){
    SPARTICLE.all = SPARTICLE.all.filter(function(p){
      var age = (GAME.clock.elapsedTime-p.spawnTime)/p.maxAge;
      if (age>=1){
        console.log("DEATH");
        GAME.scene.remove(p.mesh);
        return false;
      } else {
        var scale = lerp(p.minScale, p.maxScale, p.scaleFunc(age));
        p.mesh.position.copy(p.position.clone().add(p.roam.multiplyScalar(age)));
        p.mesh.material.opacity=(1-p.alphaFunc(age));
        p.mesh.scale.set(scale,scale,scale);
        return true;
      }
    })
  }
}