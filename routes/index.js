var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(JSON.stringify({
    "id": 2337,
    "message": "it works!"

  }));
});

module.exports = router;