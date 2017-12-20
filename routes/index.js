var git = require("git-rev");
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  git.tag(function(tag){
    console.log(tag);
    git.branch(function(branch){
      console.log(branch);
      git.short(function(short){
        console.log(short);
        res.render('index', { title: 'Paper Sail', git:{
            tag: tag,
            branch: branch,
            short: short
          }
        });
      });
    });
  });
});

module.exports = router;
