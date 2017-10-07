var express = require('express');
var router = express.Router();
var translator = require('translation.js');
var { translate, detect, audio } = translator;

router.post('/translate', function(req, res, next) {
    var sel = req.body.text;
    translate({
        text: sel,
        api: 'baidu'
    }).then(result => {
            res.json({code:0, result: result.dict});
            // console.log(result)
        })
});


module.exports = router;
