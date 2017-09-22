var express = require('express');
var router = express.Router();

var fs = require("fs");
var path = require("path");
var mv = require('mv');
var multipart = require('connect-multiparty');


router.post('/imgUpload',  multipart(), function(req, res, next) {
    var files = req.files;
    var imgDir = rootDir+"/public/images/";
    var img = files.image;
    mv(img.path, path.join(imgDir, img.name), {mkdirp: true}, function(err) {
        // done. it tried fs.rename first, and then falls back to
        // piping the source file to the dest file and then unlinking
        // the source file.
        if(err) {
            res.json({code:1, error: err});
            return;
        }
        res.json({ data: { link: "images/"+img.name}});
    });
});


module.exports = router;
