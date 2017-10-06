var express = require('express');
var router = express.Router();

var fs = require("fs");
var path = require("path");
var mv = require('mv');

var file_ignore_list = [".git", ".gitignore"];


function fileExt(filename){
    var ext = null;
    var name = filename.toLowerCase();
    var i = name.lastIndexOf(".");
    if(i > -1){
        var ext = name.substring(i);
    }
    return ext;
}

router.post('/getChildNodes', function(req, res, next) {
    var clientPath = req.body.path;
    var filePath= docRoot + req.body.path;

    fs.readdir(filePath,function(err,files) {
        if (err) {
            console.log(err);
            res.json({code:1, error: err});
            return;
        }
        var count = files.length;
        var results = [];

        files.forEach(function(filename) {
            try {
                if(file_ignore_list.indexOf(filename)!=-1) {
                    return;
                }
                var stats = fs.statSync(path.join(filePath, filename));
                if (stats.isFile()) {
                    var ext= fileExt(filename);
                    var baseFilename = path.basename(filename, ext);
                    results.push({name:baseFilename, key: path.join(clientPath, filename), isLeaf: true});
                } else if (stats.isDirectory()) {
                    // if(file_ignore_list.indexOf(filename)!=-1) {
                    //     return;
                    // }
                    var baseFilename = path.basename(filename);
                    results.push({name: baseFilename, key:  path.join(clientPath, filename)});
                }
            } catch(err) {
                res.json({code:1, error: err});
                return;
            }
        });
        res.json({code:0, childNodes: results});
    });


});

router.post('/getDocument', function(req, res, next) {
    var docPath = req.body.docPath;
    var filePath= docRoot + docPath;
    fs.readFile(filePath,function (err, data) {
        if (err) {
            console.log(err);
            res.json({code:1, error: err});
            return;
        }
        var content = data.toString();
        res.json({code:0, content: content});
    })


});

router.post('/saveDoc', function(req, res, next) {
    var docPath = req.body.docPath;
    var filePath= docRoot + docPath;
    var fileName = req.body.fileName;
    var content = req.body.content;

    var ext=fileExt(docPath);
    var oldFileName = path.basename(docPath,ext);
    var folderPath = path.dirname(filePath);
    var newFilePath = path.join(folderPath,fileName+ext);
    var newDocPath = path.join(path.dirname(docPath),fileName+ext);
    if((oldFileName!=fileName)&&(fs.existsSync(filePath))) {
        mv(filePath, newFilePath, function(err) {
            // done. it tried fs.rename first, and then falls back to
            // piping the source file to the dest file and then unlinking
            // the source file.
            if(err) {
                res.json({code:1, error: err});
                return;
            }
            fs.writeFile(newFilePath, content, function (err) {
                if(err) {
                    res.json({code:1, error: err});
                    return;
                }
                var fileInfo = {
                    name: fileName,
                    key:  newDocPath,
                    isLeaf: true
                };
                res.json({code:0, fileInfo: fileInfo});
                return;
            })

        });
    } else {
        fs.writeFile(newFilePath, content, function (err) {
            if(err) {
                res.json({code:1, error: err});
                console.log(err);
                return;
            }
            var fileInfo = {
                name: fileName,
                key:  newDocPath,
                isLeaf: true
            };
            res.json({code:0, fileInfo: fileInfo});
            return;
        })
    }

});

router.post('/deleteDoc', function(req, res, next) {
    var docPath = req.body.docPath;
    var filePath= docRoot + docPath;
    try{
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.json({code:0});
    } catch(err) {
        console.log(err);
        res.json({code:1});
    }

});

router.post('/deleteDocs', function(req, res, next) {
    var docPaths = req.body.docPaths;
    try {
        for (var i = 0; i < docPaths.length; i++) {
            let docPath = docPaths[i];
            var filePath = docRoot + docPath;
            if (fs.existsSync(filePath)) {
                var stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
        }
        res.json({code: 0});
    } catch(err){
        console.log(err);
        res.json({code:1});
    }

});


router.post('/deleteDir', function(req, res, next) {
    var dirPath = req.body.dirPath;
    var delPath= docRoot + dirPath;
    try{
        if(fs.existsSync(delPath)) {
            fs.rmdirSync(delPath);
        }
        res.json({code:0});
    } catch(err) {
        console.log(err);
        res.json({code:1});
    }

});



router.post('/addDir', function(req, res, next) {
    var dirPath = req.body.dirPath;
    var folderPath= docRoot + dirPath;
    try{
        fs.mkdirSync(folderPath)
        res.json({code:0});
    } catch(err) {
        res.json({code:1});
    }

});

router.post('/renameDirOrDoc', function(req, res, next) {
    var dirOrDocPath = req.body.dirOrDocPath;
    var srcPath= docRoot + dirOrDocPath;
    var parentDir = path.dirname(srcPath);
    var newName = req.body.newName;
    var destPath = path.join(parentDir, newName);
    var destKey = path.join(path.dirname(dirOrDocPath), newName)
    try {
        var stats = fs.statSync(srcPath);
        if (stats.isFile()) {
            var ext = fileExt(dirOrDocPath)
            destPath = destPath+ext;
            destKey = destKey+ext;
        }
        mv(srcPath, destPath, {mkdirp: true}, function(err) {
            // done. it first created all the necessary directories, and then
            // tried fs.rename, then falls back to using ncp to copy the dir
            // to dest and then rimraf to remove the source dir
            if(err) {
                res.json({code:1, error: err});
            }
            var treeItemInfo= {
                key: destKey,
                name: newName
            }
            res.json({code:0, treeItemInfo: treeItemInfo});
        });

    } catch(err) {
        console.log(err);
        res.json({code:1, error: err});
    }


});

router.post('/dragMove', function(req, res, next) {
    var dragSrcPath = req.body.dragSrcPath;
    var dragDestPath = req.body.dragDestPath;
    var dropToGap = req.body.dropToGap;

    var srcPath= path.join(docRoot,dragSrcPath);
    if(dropToGap) {
        dragDestPath = path.dirname(dragDestPath);
    }
    var ext = fileExt(srcPath);
    var baseName = path.basename(srcPath, ext);
    var destPath = path.join(docRoot,dragDestPath);
    destPath = path.join(destPath, baseName);
    var destKey = path.join(dragDestPath, baseName);
    try {
        var stats = fs.statSync(srcPath);
        if (stats.isFile()) {
            destPath = destPath+ext;
            var destKey = destKey+ext;
        }
        mv(srcPath, destPath, {mkdirp: true}, function(err) {
            // done. it first created all the necessary directories, and then
            // tried fs.rename, then falls back to using ncp to copy the dir
            // to dest and then rimraf to remove the source dir
            if(err) {
                res.json({code:1, error: err});
            }
            var treeItemInfo= {
                key: destKey
            }
            res.json({code:0, treeItemInfo: treeItemInfo});
        });

    } catch(err) {
        console.log(err);
        res.json({code:1, error: err});
    }


});





module.exports = router;
