var express = require('express');
var router = express.Router();


router.get('/gitPush', function(req, res, next) {
    res.json({code: 0, result: ""});
});


module.exports = router;
