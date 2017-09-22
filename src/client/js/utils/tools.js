var tools = {
    fileExt: function(filename){
        var ext = null;
        var name = filename.toLowerCase();
        var i = name.lastIndexOf(".");
        if(i > -1){
            var ext = name.substring(i);
        }
        return ext;
    }

}


export default tools;




