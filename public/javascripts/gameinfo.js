const GAMEINFO = {
  cur: [],
  head: "",
  maxlines: 100,
  log: function(str){
    GAMEINFO.cur.unshift(str);
    GAMEINFO.cur = GAMEINFO.cur.slice(0,GAMEINFO.maxlines);
    GAMEINFO.refresh();
    
  },
  display: function(str){
    GAMEINFO.head = str;
    GAMEINFO.refresh();
  },
  refresh: function(){
    var curstr = "";
    for (var i = 0; i < GAMEINFO.cur.length; i++) {
      curstr += GAMEINFO.cur[i]+"\n";
    }
    var gielem = document.getElementById("gameinfo");
    if (gielem){
        gielem.innerText=GAMEINFO.head+"\n"+curstr;
    }
  }
}

window.addEventListener("load",GAMEINFO.refresh);