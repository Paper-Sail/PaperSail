var express = require('express');
var router = express.Router();
var multi = require("../multi/multi")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('objdump', {dump: multi});
});
router.get('/fog/:x/:y', function(req, res, next){
  res.send(multi.getFog(req.params.x, req.params.y));
});

module.exports = router;
