const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
                
        this.utils = new Utils(this, this.fileSystem);       
    }

    creatingFolders(){

        const rootFolders = ['Shared', 'Microservices']

        this.log('Creating root folders ...');
        rootFolders.forEach((value)=>{
            this.utils.createFolder(value);
        });
    }
}