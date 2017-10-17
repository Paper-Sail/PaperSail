var sound = {}
var cur_playing = []

function setGlobalVolume(volume) {
  for (var snd in sound) {
    if (sound.hasOwnProperty(snd)) {
      if (sound[snd].global){
        sound[snd].setVolume(sound[snd].volume*volume);
      }
    }
  }
  for (var i = 0; i < cur_playing.length; i++) {
    if (cur_playing[i].global){
        cur_playing[i].setVolume(cur_playing[i].volume*volume);
    }
  }
}

function newSound(name, volume) {
  var elem = document.createElement("audio");
  elem.src = "/sounds/"+name+".mp3";
  elem.id = name;
  elem.preload = true;
  elem.volume = + ((volume!=undefined) ? volume : 1);
  document.body.appendChild(elem);
  sound[name] = {
    //audio: new Audio(name+".wav"),
    play: function() {
      elem.currentTime = 0;
      elem.play();
      //var cln = elem.cloneNode(true);
      //cln.volume = elem.volume;
      //cln.play()
      //cur_playing.push(cln);
    },
    setVolume: function(volume){
      elem.volume = + ((volume!=undefined) ? volume : 1);
    },
    volume: (volume!=undefined) ? volume : 1,
    global: true
  }
}

window.addEventListener("load",function(){
  for (var i=1; i<=3; i++) {
    newSound("touch_bell_"+i, 0.25);
    newSound("touch_plop_"+i, 0.25);
  };
})