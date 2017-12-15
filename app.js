var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var reload = require('reload');
var watch = require('watch');
var multiindex = require('./routes/multi');
var index = require('./routes/index');

var app = express();

app.use('/', function(req, res, next){
  //console.log(req);
  //res.send("nope")
  next();
});

const cheatLang = ["en","de","fr"]

app.use('/', function(req, res, next){
  for (var i = 0; i < cheatLang.length; i++) {
    var lang = cheatLang[i]
    var oldUrl = req.url;
    req.url = req.url.replace("/"+lang+"/", "/");
    if (oldUrl!=req.url){
      req.cheatLang = lang;
    }
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

String.prototype.endsWith = function (str) {
  return this.substr(-str.length,str.length)==str;
};

app.use('/', function(req, res, next){
  if (req.url.endsWith("translates.json") || req.url.endsWith("the_paper_sail_logo.png")){
    console.log("Translation");
    var lang = "en";
    var acceptLanguage = req.get("Accept-Language")
    if (acceptLanguage){
        lang = acceptLanguage.split("-")[0];
    }
    if (req.cheatLang){
      lang = req.cheatLang;
    }
    var infix = "";
    switch (lang) {
      case "de":
        infix = "_de";
        break;
      case "fr":
        infix = "_fr";
        break;
      default:
        infix = "_eng";
        break;  
    }
    req.url = req.url.replace("translates.json",`translates${infix}.json`);
    req.url = req.url.replace("the_paper_sail_logo.png",`the_paper_sail_logo${infix}.png`);
  }
  next();
});



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/multi', multiindex);

if (process.env.NODE_ENV=="development"){
  var reloader = reload(app);
  watch.watchTree(__dirname + "/public", function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    
    } else
      reloader.reload();
  });
  watch.watchTree(__dirname + "/sass", function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    
    } else
      reloader.reload();
  });
  watch.watchTree(__dirname + "/views", function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
    
    } else
      reloader.reload();
  });
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
