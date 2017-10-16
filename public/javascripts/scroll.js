const SCROLL = {
  layers: [],
  newLayer: function(material,imsize,areasize,offset){
    var layer = {};
    layer.offset = offset;
    layer.areasize = areasize;
    layer.imsize = imsize;
    layer.chunks = [];
    for (var x = -areasize; x<areasize; x+=imsize){
      for (var y = -areasize; y<areasize; y+=imsize){
        var chunk = {
          sprite: new THREE.Mesh(rectangle(0,0,imsize,imsize),material),
          x: x,
          y: y
        };
        //chunk.sprite.scale.set(imsize,imsize,imsize);
        chunk.sprite.position.set(x,y,offset);
        chunk.sprite.renderOrder = offset;
        GAME.scene.add(chunk.sprite);
        layer.chunks.push(chunk);
      }
    }
    SCROLL.layers.push(layer);
  },
  update: function(dt){
    var campos = GAME.camera.position;
    for (var i = 0; i < SCROLL.layers.length; i++) {
      var layer = SCROLL.layers[i];
      var m = -layer.offset/10;
      for (var j = 0; j < layer.chunks.length; j++) {
        var chunk = layer.chunks[j];
        var x = campos.x*m+chunk.x;
        var y = campos.y*m+chunk.y;
        // TODO: Do scaling and scrolling properly
        //x = campos.x-mod(-x,layer.areasize*2)+layer.areasize;
        //y = campos.y-mod(-y,layer.areasize*2)+layer.areasize;
        chunk.sprite.position.set(x, y, layer.offset);
      }
    }
  }  
}