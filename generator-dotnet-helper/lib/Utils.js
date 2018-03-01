class Utils {

    constructor(context, fileSystem) {
        this.ctx = context;
        this.fs = require('fs');
    }

    createFolder(folder) {
        if(this.isFolderExists(folder)) return;

        this.ctx.log('Creating directory ' + folder + ' ... ');
        this.fs.mkdirSync(folder);
    }

    isFolderExists(folder) {        
        try{
            var stats = this.fs.lstatSync(folder);
            if (stats == undefined || !stats.isDirectory()) {
                return false
            }else{
                return true;
            }   
        } catch(ignored){
            return false;
        }
    }

    validateRootFolder(rootFolder, directory){
        if(this.isFolderExists(directory)) return true;
        
        this.ctx.log(" No "+rootFolder+" folder found. Enter on the " 
            + "root directory or execute the init command, like: "
            + "yo dthp:init.\n Closing ...");

        return false;        
    }
};

module.exports = Utils;