/*

A simble load tracker, currently it only tracks file loading, but since we have level generation, I need to add that to the tracker, the actual reading and callbacks of the tracker shouldn't change though


Get current completion:
  LOADER.completion


There are also loadStates to check the current state

Add a callback to a LOADER event:

  LOADER.addEventListener("load",function(){
    console.log("Cool, we're loaded!");
  })




*/



const loadStates = {
  WAITING: 1,
  CLEAN: 2,
  LOADING: 3,
  ERROR: 4,
  properties: {
    1: {name: "waiting", description: "Loading not yet started", value: 1},
    2: {name: "clean", description: "Everything has been loaded", value: 2},
    3: {name: "loading", description: "There are still things that need loading", value: 3}
  }
}
const LOADER = {
  completion: -1,
  state: loadStates.WAITING,
  addEventListener: function(event, cb){
    if (LOADER.callbacks.hasOwnProperty(event) && typeof(cb)=="function"){
      LOADER.callbacks[event].push(cb);
    }
  },
  callbacks: {
    start: [],
    progress: [],
    load: [],
    error: []
  },
  refresh: function(){
    if (LOADER.trackers.length>0){
      switch (LOADER.state) {
        case loadStates.WAITING:
        case loadStates.CLEAN:
          LOADER.state = loadStates.LOADING;
          for (var i = 0; i < LOADER.callbacks.start.length; i++) {
            LOADER.callbacks.start[i]()
          }
          break;
        case loadStates.LOADING:
          for (var i = 0; i < LOADER.callbacks.progress.length; i++) {
            LOADER.callbacks.progress[i]()
          }
          break;
      }
      var comp = 0;
      var done = true;
      for (var i = 0; i < LOADER.trackers.length; i++) {
        if (LOADER.trackers[i].value<1)
          done = false;
        comp += LOADER.trackers[i].value;
      }
      LOADER.completion = comp/LOADER.trackers.length;
      if (done){
        for (var i = 0; i < LOADER.callbacks.load.length; i++) {
          LOADER.callbacks.load[i]()
        }
      }
    } else {
      LOADER.state = loadStates.WAITING;
      completion = 1;
    }
  },
  trackers: []
}




// CODE BENEATH THIS LINE IS UNSTABLE PRETEND IT'S MAGIC
// TODO: Track lever generation too, currently only file loading is included
var fileTracker = {
  value: 0
}
LOADER.trackers.push(fileTracker);

THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	fileTracker.value = itemsLoaded / itemsTotal;
  LOADER.refresh();
};

THREE.DefaultLoadingManager.onLoad = function ( ) {
  fileTracker.value = 1;
  LOADER.refresh();
};


THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  fileTracker.value = itemsLoaded / itemsTotal;
  LOADER.refresh();
};

THREE.DefaultLoadingManager.onError = function ( url ) {
  fileTracker.value = 0;
  console.error(loadStates.properties[LOADER.state].description);
  LOADER.refresh();
};