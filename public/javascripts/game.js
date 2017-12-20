const notification_buffer = []

function notify_host(data){
  console.log("No host window found, queuing message");
  notification_buffer.push(data);
}
window.addEventListener("message",function(event) {
    console.log("Got a message: "+event.data);
    if (event.data == "host"){
      notify_host = function(data){
          event.source.postMessage(data, event.origin);
      }
      while (notification_buffer.length>0) {
        notify_host(notification_buffer.pop());
      }
    }
});
const GAME = {
  addEventListener: function(event, cb){
    if (GAME.callbacks.hasOwnProperty(event) && typeof(cb)=="function"){
      GAME.callbacks[event].push(cb);
    }
  },
  callbacks: {
    ready: [],
    element: [],
    update: []
  }
};

GAME.loadTracker = {
  value: 0
}
LOADER.trackers.push(GAME.loadTracker)

GAME.zoomed = false;
GAME.zoomout = 0.2;
GAME.boatradius = 8;
GAME.backgroundcolor = new THREE.Color(0x05267A);
GAME.zoomedbackgroundcolor = new THREE.Color(0xAA9977);

function toogleZoom(){
  
}

window.addEventListener("load", function() {
  // Get the DOM element to attach to
  GAME.loadTracker.value = 0;
  LOADER.refresh();
  GAME.container =
      document.querySelector('#container');
  GAME.loadTracker.value = 0.25;
  LOADER.refresh();
  GAME.element = ENGINE.initialise(container);
  for (var i = 0; i < GAME.callbacks.element.length; i++) {
    GAME.callbacks.element[i](GAME.element);
  }
  GAME.loadTracker.value = 0.5;
  LOADER.refresh();
  
  
  GAME.init();
  // GO!
  for (var i = 0; i < GAME.callbacks.ready.length; i++) {
    GAME.callbacks.ready[i](GAME.element);
  }
  GAME.loadTracker.value = 1;
  LOADER.refresh();
});
GAME.models = {}
function loadModel(name) {
  var loader = new THREE.BufferGeometryLoader();
  loader.load("/models/"+name+".json",function(geometry){
    GAME.models[name] = geometry;
  });
}
GAME.textures = {
  islandtex: new THREE.TextureLoader().load("/images/tile_bord.png"),
  fog: new THREE.TextureLoader().load("/images/fogpatch.png"),
  boat: new THREE.TextureLoader().load("/images/boat.png"),
  dragon: new THREE.TextureLoader().load("/images/libellule_1.png"),
  dragonwingright: new THREE.TextureLoader().load("/images/libellule_2.png"),
  dragonwingleft: new THREE.TextureLoader().load("/images/libellule_3.png"),
  stars: new THREE.TextureLoader().load("/images/stars_trans.png"),
  touch: new THREE.TextureLoader().load("/images/white_glow_touch.png"),
  splash: new THREE.TextureLoader().load("/images/water_circle_trail.png"),
  semisplash: new THREE.TextureLoader().load("/images/water_semicircle_trail.png"),
  glow: new THREE.TextureLoader().load("/images/white_glow.png"),
  fairy: new THREE.TextureLoader().load("/images/white_glow.png"),
  fishbody: new THREE.TextureLoader().load("/images/fish_body.png"),
  fishfin: new THREE.TextureLoader().load("/images/fish_fin.png"),
  port: new THREE.TextureLoader().load("/images/port.png"),
  islandDecorations: [
    new THREE.TextureLoader().load("/images/plants_1.png"),
    new THREE.TextureLoader().load("/images/plants_2.png"),
    new THREE.TextureLoader().load("/images/plants_3.png"),
    new THREE.TextureLoader().load("/images/roots.png"),
    //new THREE.TextureLoader().load("/images/port.png"),
  ]
}
GAME.textures.islandtex.wrapT = THREE.RepeatWrapping;
GAME.materials = {
  black: new THREE.MeshBasicMaterial({
    color: 0x000000
  }),
  white: new THREE.MeshBasicMaterial({
    color: 0xFFFFFF
  }),
  background: new THREE.MeshBasicMaterial({
    color: GAME.backgroundcolor
  }),
  islandmat: new THREE.MeshBasicMaterial({
    color: 0x000000,
    //opacity: 0,
    map: GAME.textures.islandtex,
    transparent: true
  }),
  token: new THREE.MeshBasicMaterial({
    color: 0xFF00FF,
    map: GAME.textures.touch,
    transparent: true
  }),
  dragon: new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: GAME.textures.dragon,
    transparent: true
  }),
  dragonwingright: new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: GAME.textures.dragonwingright,
    transparent: true
  }),
  dragonwingleft: new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: GAME.textures.dragonwingleft,
    transparent: true
  }),
  boat: new THREE.MeshBasicMaterial({
    map: GAME.textures.boat,
    transparent: true,
    color: 0xFFFFFF
  }),
  ghost: new THREE.MeshBasicMaterial({
    map: GAME.textures.boat,
    transparent: true,
    color: 0xFFFFFF
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
  port: new THREE.MeshBasicMaterial({
    map: GAME.textures.port,
    color: 0x000000,
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

window.addEventListener("blur",function(){
  document.getElementById('background-music').pause()
  document.getElementById('background-sound').pause()
});

window.addEventListener("focus",function(){
  if (GAME.started){
    document.getElementById('background-music').play()
    document.getElementById('background-sound').play()
  }
});

// Setup update-render loop
GAME.started = false;
GAME.start = function(){
  if (!GAME.started){
    GAME.started = true;
    GAME.container.classList.remove("paused");
    ENGINE.setSize(GAME.container);
    notify_host({
      event: "gamestart"
    });
    GAME.container.appendChild(GAME.element);
    document.getElementById('background-music').play()
    document.getElementById('background-sound').play()
    GAME.clock = new THREE.Clock(true);
    GAME.tick();
    for (var i = 0; i <= 1; i+=(1/3)) {
      
      DRAGON.spawn(lerp(20,45, i));
    }
  }
}
skipFrame = false;
GAME.tick = function(){
  var dt = Math.min(1/20,GAME.clock.getDelta());
  GAME.update(dt);
  if (true || document.hasFocus() || !skipFrame){
      GAME.renderer.render(GAME.scene, GAME.camera);
  }
  skipFrame = !skipFrame;
  requestAnimationFrame(GAME.tick);
}

GAME.onClick = function(pos){
  GAME.moveTo(pos);
}

GAME.moveTo = function(pos){
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
  //GAMEINFO.log("click\t"+data.id.substr(0,6)+": "+Math.floor(data.position.x)+":"+Math.floor(data.position.y));
  SPARTICLE.spawn(new THREE.Vector3(data.position.x, data.position.y, -10),GAME.materials.splash,{
    minScale: 0,
    maxScale: 20
  });
});
MULTI.on('tick', function(data){
  //GAMEINFO.log("tick\t"+data.id.substr(0,6)+": "+Math.floor(data.position.x)+":"+Math.floor(data.position.y));
  if (!GAME.hasOwnProperty("ghosts")) return;
  if (!GAME.ghosts.hasOwnProperty(data.id)){
    var boat = new THREE.Mesh(rectangle(-15,-15,30,30),GAME.materials.ghost);
    var boatglow = new THREE.Mesh(rectangle(-0.6*30,-0.9*30,1.2*30,1.8*30),GAME.materials.boatglow);
    boat.add(boatglow);
    boatglow.position.set(0,0,-0.1);
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
  GAME.zoomLevel = 1;
  GAME.ghosts = {};
  GAME.tickIn = 0;
  GAME.tickRate = 2;
  var fishies = 4
  for (var i = 0; i<fishies; i++){
    var fsize = 1 - 0.7*(i/fishies)
    GAMEINFO.log("Spawn fish w/size "+fsize);
    FISH.spawn(75*fsize,150*fsize,30,GAME.materials.fishbody, GAME.materials.fishfin);
  }
  GAME.curzoom = 1;
  GAME.objects = [];
  GAME.splashTime = 1;
  GAME.fairyTime = 1;
  GAME.semiSplashTime = 1;
  GAME.targetSplashTime = 1;
  GAME.splashTimeScale = 0.25;
  GAME.fairyTimeScale = 1;
  GAME.semiSplashTimeScale = 0.5;
  GAME.targetSplashTimeScale = 0.5;
  
  GAME.cursor = new THREE.Mesh(rectangle(-5,-5,10,10),GAME.materials.touch);
  GAME.cursor.position.z = 10000;
  GAME.cursorTime = 1000;
  GAME.scene.add(GAME.cursor);
  
  var boat = new THREE.Mesh(rectangle(-0.5,-0.5,1,1),GAME.materials.boat);
  var boatglow = new THREE.Mesh(rectangle(-0.6,-0.9,1.2,1.8),GAME.materials.boatglow);
  boatglow.position.z = -0.1;
  boat.add(boatglow);
  boat.renderOrder = 0;
  GAME.camera.add(boat);
  boat.position.z = -300;
  boat.scale.set(30,30,30);
  
  WORLD.init();
  LOADER.addEventListener("load",function(){
    var actualx = GAME.camera.position.x + Math.random()*WORLD.regionSize;
    var actualy = GAME.camera.position.y + Math.random()*WORLD.regionSize;
    while (isInIsland(actualx, actualy,GAME.boatradius)){
      //console.log("Reroll position");
      actualx = GAME.camera.position.x + Math.random()*WORLD.regionSize;
      actualy = GAME.camera.position.y + Math.random()*WORLD.regionSize;
    }
    //console.log("Spawning at "+actualx+", "+actualy);
    //console.log(isInIsland(actualx, actualy,GAME.boatradius));
    GAME.camera.position.x = actualx;
    GAME.camera.position.y = actualy;
    GAME.target = new THREE.Vector3(GAME.camera.position.x,GAME.camera.position.y,0);
  });
  
  
  SCROLL.newLayer(GAME.materials.stars,100,GAME.size,-10);
  
  GAME.boatvelocity = new THREE.Vector3();
  GAME.boatangularvelocity = 0;
}


var forward = new THREE.Vector3(0,0,1);
GAME.update = function(dt){
  GAME.zoomLevel = lerp(GAME.zoomLevel, GAME.zoomed ? GAME.zoomout : 1, dt*3);
  GAME.camera.zoom = GAME.zoomLevel*(25/ENGINE.screenHeight);
  GAME.scene.background = GAME.scene.background.clone().lerp(GAME.zoomed ? GAME.backgroundcolor :  GAME.backgroundcolor, dt*3);
  GAME.materials.fishfin.opacity = lerp(GAME.materials.fishfin.opacity, GAME.zoomed ? 0 : 1, dt*10);
  GAME.materials.fishbody.opacity = lerp(GAME.materials.fishfin.opacity, GAME.zoomed ? 0 : 1, dt*10);
  GAME.materials.glow.opacity = lerp(GAME.materials.glow.opacity, GAME.zoomed ? 0 : 1, dt*10);
  GAME.camera.updateProjectionMatrix();
  for (var id in GAME.ghosts) {
    if (GAME.ghosts.hasOwnProperty(id )) {
      var spos = Math.floor(GAME.ghosts[id].position.x)+"-"+Math.floor(GAME.ghosts[id].position.y);
      GAMEINFO.display(GAME.ghosts[id].id.substr(0,4), spos)
    }
  }
  
  
  var desiredDirection = (GAME.target.clone().sub(GAME.camera.position)).normalize().applyAxisAngle(forward,-TAU/4);
  var currentDirection = new THREE.Vector3(Math.cos(GAME.camera.rotation.z),Math.sin(GAME.camera.rotation.z),0);
  
  var ctime = Math.max(0, Math.min(1, (GAME.clock.elapsedTime-GAME.cursorTime)*2 ));
  var wob =  1-(Math.pow(((Math.sin(ctime*Math.PI)+ctime)/1.55),2))/5;
  GAME.cursor.material.opacity = ctime*wob;
  //GAME.cursor.scale.set(ctime*wob,ctime*wob,wob);
  var dotty = desiredDirection.dot(currentDirection);
  if (GAME.target.clone().sub(GAME.camera.position).length()<20){
    GAME.target = GAME.camera.position.clone();
  }
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
      
      
      GAME.boatvelocity.add(currentDirection.clone().applyAxisAngle(forward,+TAU/4).multiplyScalar(dt*25*Math.max(0,dotty))).sub(GAME.boatvelocity.clone().multiplyScalar(dt*1));
  } else {
    GAME.boatvelocity.sub(GAME.boatvelocity.clone().multiplyScalar(dt*2));
  }
  if (GAME.target.clone().sub(GAME.camera.position).length()<35){
    GAME.cursorTime = lerp(GAME.cursorTime,GAME.clock.elapsedTime+1,dt*2);
  }
  var pushVelocity = new THREE.Vector3();
  var maxPower = 0;
  for (var r = 0; r < WORLD.regions.length; r++){
    var region = WORLD.regions[r];    
    for (var i = 0; i < region.collisions.length; i++) {
      var collision = region.collisions[i];
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
            //WORLD.removeIsland(region, collision.island)
            var d = Math.sqrt(d2);
            var nx = dx/d;
            var ny = dy/d;
            maxPower = Math.max(maxPower,GAME.boatradius-d);
            pushVelocity.add(new THREE.Vector3(nx,ny,0));
          }
        }
      }
    }
  }
  pushVelocity.normalize().multiplyScalar(500*dt*(maxPower/GAME.boatradius));
  GAME.boatvelocity.add(pushVelocity);
  
  pushVelocity = new THREE.Vector3();
  for (var id in GAME.ghosts) {
    if (!GAME.ghosts.hasOwnProperty(id)) return
    var ghost = GAME.ghosts[id];
    var cdx = GAME.camera.position.x-ghost.position.x;
    var cdy = GAME.camera.position.y-ghost.position.y;
    var cd = (cdx*cdx+cdy*cdy);
    if (cd<Math.pow(collision.radius+GAME.boatradius,30)){
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
  var size = Math.min(0.5,Math.sqrt((0.5-Math.min(1,dotty)/2)));
  var oldrot = GAME.camera.rotation.z;
  if (GAME.target.clone().sub(GAME.camera.position).length()>10){
    GAME.boatangularvelocity += sign*dt*size*3 - GAME.boatangularvelocity*dt*3;
    var lerpy = 0;//1-(0.5-dotty/2);
    lerpy = Math.pow(lerpy,2)
    GAME.camera.rotation.z += lerp(GAME.boatangularvelocity*dt*1.5,-avalue,lerpy);
  } else {
    GAME.boatangularvelocity +=  - GAME.boatangularvelocity*dt*3;  
    GAME.camera.rotation.z += GAME.boatangularvelocity*dt*1.5
  }
  GAMEINFO.display("rotation",GAME.camera.rotation.z);
  if (isNaN(GAME.camera.rotation.z)){
    GAMEINFO.log("PANIC! oldrot="+oldrot);
    GAME.camera.rotation.z = oldrot;
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
    GAME.fairyTime=(Math.random()+0.5)*0.1;
    var ang = Math.random()*TAU;
    var dist = Math.sqrt(Math.random())*200;
    var partpos = GAME.camera.position.clone().add(new THREE.Vector3(Math.cos(ang)*dist, Math.sin(ang)*dist, 0));
    partpos.z = 100+Math.random()*200;
    var size = 1;
    var speed = 50+Math.random()*50;
    var part = SPARTICLE.spawn(partpos,GAME.materials.fairy,{
      minScale: 1.5*size,
      maxScale: 1.5*size,
      maxAge: size*15,
      alphaFunc: function(x){ return 0.5*(1-(Math.pow(1-(x*2),2)))},
      roam: speed*size
    });
    part.roam.z = -200;
  }
  
  
  
  GAME.camera.position.add(GAME.boatvelocity.clone().multiplyScalar(dt));
  //GAME.target.copy(FISH.fish[0].position)
  //GAME.target.z = 300;
  //GAME.camera.position.lerp(FISH.fish[0].position,dt)
  //GAME.camera.position.z = 300;
  //GAME.camera.rotation.z = 0;
  SPARTICLE.update(dt);
  SCROLL.update(dt);
  DRAGON.update(dt);
  FISH.update(dt);
  WORLD.update(dt);
  
  for (var id in GAME.ghosts) {
    if (GAME.ghosts.hasOwnProperty(id )) {
      var ghost = GAME.ghosts[id];
      ghost.boat.position.lerp(new THREE.Vector3(ghost.position.x, ghost.position.y, 0), dt);
      var curDirection = new THREE.Vector2(Math.cos(ghost.boat.rotation.z), Math.sin(ghost.boat.rotation.z));
      var tgtDirection = new THREE.Vector2(Math.cos(ghost.rotation), Math.sin(ghost.rotation));
      curDirection.lerp(tgtDirection,dt).normalize();
      ghost.boat.rotation.z = Math.atan2(curDirection.y, curDirection.x);
      WORLD.doFog(ghost.position.x, ghost.position.y);
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
  
  for (var i = 0; i < GAME.callbacks.update.length; i++) {
    GAME.callbacks.update[i](dt);
  }
}

function isInIsland(x,y,radius){
  for (var r = 0; r < WORLD.regions.length; r++){
    var region = WORLD.regions[r];
    for (var i = 0; i < region.collisions.length; i++) {
      //console.log("Checking "+x+", "+y);;
      var collision = region.collisions[i];
      var cdx = x-collision.center.x;
      var cdy = y-collision.center.y;
      var cd = (cdx*cdx+cdy*cdy);
      if (Math.sqrt(cd)<collision.radius*1+radius){
        return true;
      }
    }
  }
  return false;
}






