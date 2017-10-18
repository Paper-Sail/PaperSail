const GAME = {};
GAME.boatradius = 8;
GAME.backgroundcolor = new THREE.Color(0x05267A);

window.addEventListener("load", function(){
  // Get the DOM element to attach to
  GAME.container =
      document.querySelector('#container');
  
  initialise(GAME.container);
  
  
  GAME.init();
  // GO!
  update();
  
});



GAME.textures = {
  islandtex: new THREE.TextureLoader().load("/images/tile_bord.png"),
  boat: new THREE.TextureLoader().load("/images/boat.png"),
  stars: new THREE.TextureLoader().load("/images/stars_trans.png"),
  touch: new THREE.TextureLoader().load("/images/white_glow_touch.png"),
  splash: new THREE.TextureLoader().load("/images/water_circle_trail.png"),
  semisplash: new THREE.TextureLoader().load("/images/water_semicircle_trail.png"),
  glow: new THREE.TextureLoader().load("/images/white_glow.png"),
  fairy: new THREE.TextureLoader().load("/images/white_glow.png"),
  fishbody: new THREE.TextureLoader().load("/images/fish_body.png"),
  fishfin: new THREE.TextureLoader().load("/images/fish_fin.png"),
  islandDecorations: [
    new THREE.TextureLoader().load("/images/plants_1.png"),
    new THREE.TextureLoader().load("/images/plants_2.png"),
    new THREE.TextureLoader().load("/images/plants_3.png"),
    new THREE.TextureLoader().load("/images/roots.png"),
  ]
}
GAME.textures.islandtex.wrapT = THREE.RepeatWrapping;
GAME.materials = {
  background: new THREE.MeshBasicMaterial({
    color: GAME.backgroundcolor
  }),
  islandmat: new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: GAME.textures.islandtex,
    transparent: true
  }),
  boat: new THREE.SpriteMaterial({
    map: GAME.textures.boat,
    color: 0xFFFFFF
  }),
  ghost: new THREE.MeshBasicMaterial({
    map: GAME.textures.boat,
    transparent: true,
    color: 0x000000
  }),
  stars: new THREE.MeshBasicMaterial({
    map: GAME.textures.stars,
    color: 0xFFFFFF,
    transparent: true
  }),
  splash: new THREE.MeshBasicMaterial({
    map: GAME.textures.splash,
    color: 0xFFFFFF,
    transparent: true
  }),
  semisplash: new THREE.MeshBasicMaterial({
    map: GAME.textures.semisplash,
    color: 0xFFFFFF,
    transparent: true
  }),
  touch: new THREE.MeshBasicMaterial({
    map: GAME.textures.touch,
    color: 0xFFFFFF,
    transparent: true
  }),
  glow: new THREE.MeshBasicMaterial({
    map: GAME.textures.glow,
    transparent: true,
    color: new THREE.Color(0x1E47AE),
    opacity: 1
  }),
  boatglow: new THREE.MeshBasicMaterial({
    map: GAME.textures.glow,
    transparent: true,
    color: new THREE.Color(0x1E47AE),
    opacity: 0.5
  }),
  fairy: new THREE.MeshBasicMaterial({
    map: GAME.textures.fairy,
    color: 0xFFFFFF,
    transparent: true
  }),
  fishbody: new THREE.MeshBasicMaterial({
    map: GAME.textures.fishbody,
    color: new THREE.Color(0x000000).lerp(GAME.backgroundcolor,0.5),
    transparent: true
  }),
  fishfin: new THREE.MeshBasicMaterial({
    map: GAME.textures.fishfin,
    color: new THREE.Color(0x000000).lerp(GAME.backgroundcolor,0.5),
    transparent: true
  }),
  islandDecorations: [],
}
for (var i = 0; i < GAME.textures.islandDecorations.length; i++) {
  GAME.materials.islandDecorations[i]=
    new THREE.MeshBasicMaterial({
      map: GAME.textures.islandDecorations[i],
      color: 0x000000,
      transparent: true
    });
}


GAME.onClick = function(pos){
  var bell = 1+Math.floor(Math.random()*3);
  var plop = 1+Math.floor(Math.random()*3);
  //sound["touch_bell_"+bell].play();
  sound["touch_plop_"+plop].play();
  var partpos = pos.clone()
  partpos.z = -1;
  SPARTICLE.spawn(partpos,GAME.materials.splash,{
    minScale: 0,
    maxScale: 20
  });
  GAME.cursor.position.copy(partpos);
  GAME.cursorTime = GAME.clock.elapsedTime;
  pos.z = 300;
  GAME.target = pos;
  MULTI.send({
    name: "click",
    position: {
      x: pos.x,
      y: pos.y
    }
  });
}

MULTI.on('click', function(data){
  SPARTICLE.spawn(new THREE.Vector3(data.position.x, data.position.y, -1),GAME.materials.splash,{
    minScale: 0,
    maxScale: 20
  });
});
MULTI.on('tick', function(data){
  
  if (!GAME.hasOwnProperty("ghosts")) return;
  if (!GAME.ghosts.hasOwnProperty(data.id)){
    var boat = new THREE.Mesh(rectangle(-15,-15,30,30),GAME.materials.ghost);
    boat.position.set(data.position.x,data.position.y,0);
    boat.rotation.z = data.rotation;
    GAME.scene.add(boat);
    GAME.ghosts[data.id] = {
      position: data.position,
      rotation: data.rotation,
      direction: data.direction,
      boat: boat,
      id: data.id,
      last: data.time,
    }
  } else {
    var ghost = GAME.ghosts[data.id];
    if (ghost.last<data.time){
      ghost.position = data.position;
      ghost.rotation = data.rotation;
      ghost.direction = data.direction;
      ghost.last = data.time;
    }
  }
});

GAME.init = function(){
  GAME.ghosts = {};
  GAME.tickIn = 0;
  GAME.tickRate = 2;
  for (var i = 0; i<1; i++)
    FISH.spawn(75,150,30,GAME.materials.fishbody, GAME.materials.fishfin);
  
  GAME.objects = [];
  GAME.splashTime = 1;
  GAME.fairyTime = 1;
  GAME.semiSplashTime = 1;
  GAME.targetSplashTime = 1;
  GAME.splashTimeScale = 0.25;
  GAME.fairyTimeScale = 2;
  GAME.semiSplashTimeScale = 0.5;
  GAME.targetSplashTimeScale = 0.5;
  
  GAME.cursor = new THREE.Mesh(rectangle(-5,-5,10,10),GAME.materials.touch);
  GAME.cursor.position.z = 10000;
  GAME.cursorTime = 1000;
  GAME.scene.add(GAME.cursor);
  
  var boat = new THREE.Sprite(GAME.materials.boat);
  var boatglow = new THREE.Mesh(rectangle(-0.6,-0.9,1.2,1.8),GAME.materials.boatglow);
  boatglow.position.z = -9.8;
  boat.add(boatglow);
  //boat.renderOrder = 0;
  GAME.camera.add(boat);
  boat.position.z = -10;
  boat.scale.set(30,30,30);
  GAME.objects.collisions = [];
  
  WORLD.init();
  
  console.log(GAME.size);
  SCROLL.newLayer(GAME.materials.stars,100,GAME.size,-10);
  
  
  GAME.target = new THREE.Vector3(0,5,0);
  GAME.boatvelocity = new THREE.Vector3();
  GAME.boatangularvelocity = 0;
}


var forward = new THREE.Vector3(0,0,1);
GAME.update = function(dt){
  var desiredDirection = (GAME.target.clone().sub(GAME.camera.position)).normalize().applyAxisAngle(forward,-TAU/4);
  var currentDirection = new THREE.Vector3(Math.cos(GAME.camera.rotation.z),Math.sin(GAME.camera.rotation.z),0);
  
  var ctime = Math.max(0, Math.min(1, (GAME.clock.elapsedTime-GAME.cursorTime)*2 ));
  var wob =  1-(Math.pow(((Math.sin(ctime*Math.PI)+ctime)/1.55),2))/5;
  GAME.cursor.material.opacity = ctime*wob;
  //GAME.cursor.scale.set(ctime*wob,ctime*wob,wob);
  var dotty = desiredDirection.dot(currentDirection);
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
      
      
      GAME.boatvelocity.add(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(dt*15*Math.max(0,dotty))).sub(GAME.boatvelocity.clone().multiplyScalar(dt*1));
  } else {
    GAME.boatvelocity.sub(GAME.boatvelocity.clone().multiplyScalar(dt*2));
  }
  if (GAME.target.clone().sub(GAME.camera.position).length()<35){
    GAME.cursorTime = lerp(GAME.cursorTime,GAME.clock.elapsedTime+1,dt*2);
  }
  var pushVelocity = new THREE.Vector3();
  var maxPower = 0;
  for (var i = 0; i < GAME.objects.collisions.length; i++) {
    var collision = GAME.objects.collisions[i];
    var cdx = GAME.camera.position.x-collision.center.x;
    var cdy = GAME.camera.position.y-collision.center.y;
    var cd = (cdx*cdx+cdy*cdy);
    if (cd<Math.pow(collision.radius+GAME.boatradius,2)){
      for (var ci = 0; ci < collision.points.length; ci++) {
        var point = collision.position.clone().add(collision.points[ci]);
        var dx = GAME.camera.position.x-point.x;
        var dy = GAME.camera.position.y-point.y;
        var d2 = (dx*dx+dy*dy);
        if (d2<GAME.boatradius*GAME.boatradius){
          var d = Math.sqrt(d2);
          var nx = dx/d;
          var ny = dy/d;
          maxPower = Math.max(maxPower,GAME.boatradius-d);
          pushVelocity.add(new THREE.Vector3(nx,ny,0));
        }
      }
    }
  }
  pushVelocity.normalize().multiplyScalar(100*dt*(maxPower/GAME.boatradius));
  GAME.boatvelocity.add(pushVelocity);
  var curAngle = Math.atan2(currentDirection.y, currentDirection.x);
  var desiAngle = Math.atan2(desiredDirection.y, desiredDirection.x);
  currentDirection.lerp(desiredDirection,dt);
  var aimAngle = Math.atan2(currentDirection.y, currentDirection.x);
  var avalue = GAME.camera.rotation.z - aimAngle
  avalue = mod(avalue+TAU/2,TAU)-TAU/2
  var sign = -Math.sign(avalue);
  dotty = desiredDirection.clone().normalize().dot(currentDirection.clone().normalize());
  var size = Math.min(0.5,Math.sqrt((0.5-dotty/2)));
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
    GAME.boatangularvelocity += sign*dt*size*3 - GAME.boatangularvelocity*dt*3;
    var lerpy = 0;//1-(0.5-dotty/2);
    lerpy = Math.pow(lerpy,2)
    GAME.camera.rotation.z += lerp(GAME.boatangularvelocity*dt*1.5,-avalue,lerpy);
  } else {
    GAME.boatangularvelocity +=  - GAME.boatangularvelocity*dt*3;  
    GAME.camera.rotation.z += GAME.boatangularvelocity*dt*1.5
  }
  
  
  
  GAME.boatvelocity.z = 0;
  
  GAME.splashTime-=GAME.boatvelocity.length()*GAME.splashTimeScale*dt;
  //console.log(GAME.boatvelocity.length());
  if (GAME.splashTime<=0){
    GAME.splashTime = 1+Math.random();
    var partpos = GAME.camera.position.clone().sub(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(6));
    partpos.z = -1;
    var size = 0.75+Math.random()*0.25;
    SPARTICLE.spawn(partpos,GAME.materials.splash,{
      minScale: 3*size,
      maxScale: 10*size,
      roam: 5*Math.random(),
      scaleFunc: function(x){ return Math.sqrt(x);},
      alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
      maxAge: 3
    });
  }
  
  if (GAME.boatvelocity.length()<1){
    GAME.semiSplashTime-=dt*GAME.semiSplashTimeScale;
    if (GAME.semiSplashTime<0){
      GAME.semiSplashTime = 1+Math.random();
      var partpos = GAME.camera.position.clone();
      partpos.z = -1;
      var size = 0.5+Math.random()*0.5;
      SPARTICLE.spawn(partpos,GAME.materials.semisplash,{
        angle: Math.random()*TAU,
        minScale: 12*size,
        maxScale: 30*size,
        scaleFunc: function(x){ return Math.sqrt(x);},
        alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
        maxAge: size*7
      });
    }
  }
  /*// Waves around target
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
    GAME.targetSplashTime-=dt*GAME.targetSplashTimeScale;
    if (GAME.targetSplashTime<0){
      GAME.targetSplashTime = 1+Math.random();
      var partpos = GAME.target.clone();
      partpos.z = -1;
      var size = 0.5+Math.random()*0.5;
      SPARTICLE.spawn(partpos,GAME.materials.semisplash,{
        angle: Math.random()*TAU,
        minScale: 12*size,
        maxScale: 30*size,
        scaleFunc: function(x){ return Math.sqrt(x);},
        alphaFunc: function(x){ return 0.25*(1-(Math.pow(1-(x*2),2)))},
        maxAge: size*7
      });
    }
  }
  //*/
  GAME.fairyTime-=dt*GAME.fairyTimeScale;
  if (GAME.fairyTime<0){
    GAME.fairyTime=Math.random()+0.5;
    var ang = Math.random()*TAU;
    var dist = Math.sqrt(Math.random())*200;
    var partpos = GAME.camera.position.clone().add(new THREE.Vector3(Math.cos(ang)*dist, Math.sin(ang)*dist, 0));
    partpos.z = 1;
    var size = 0.5+Math.random()*0.5;
    SPARTICLE.spawn(partpos,GAME.materials.fairy,{
      minScale: 1.5*size,
      maxScale: 1.5*size,
      maxAge: size*15,
      alphaFunc: function(x){ return 1*(1-(Math.pow(1-(x*2),2)))},
      roam: 100*size
    });
  }
  
  
  
  GAME.camera.position.add(GAME.boatvelocity.clone().multiplyScalar(dt));
  //GAME.target.copy(FISH.fish[0].position)
  //GAME.target.z = 300;
  //GAME.camera.position.lerp(FISH.fish[0].position,dt)
  //GAME.camera.position.z = 300;
  //GAME.camera.rotation.z = 0;
  SPARTICLE.update(dt);
  SCROLL.update(dt);
  FISH.update(dt);
  
  for (var id in GAME.ghosts) {
    if (GAME.ghosts.hasOwnProperty(id )) {
      var ghost = GAME.ghosts[id];
      ghost.boat.position.lerp(new THREE.Vector3(ghost.position.x, ghost.position.y, 0), dt);
      var curDirection = new THREE.Vector2(Math.cos(ghost.boat.rotation.z), Math.sin(ghost.boat.rotation.z));
      var tgtDirection = new THREE.Vector2(Math.cos(ghost.rotation), Math.sin(ghost.rotation));
      curDirection.lerp(tgtDirection,dt).normalize();
      ghost.boat.rotation.z = Math.atan2(curDirection.y, curDirection.x);
    }
  }
  
  GAME.tickIn-=GAME.tickRate*dt;
  if (GAME.tickIn<0){
    GAME.tickIn = 1;
    MULTI.send({
      name: "tick",
      position: {
        x: GAME.camera.position.x,
        y: GAME.camera.position.y
      },
      rotation: GAME.camera.rotation.z,
      direction: {
        x: GAME.boatvelocity.x,
        y: GAME.boatvelocity.y
      }
    })
  }
  
  
}






