const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');
const MapSettingsFilename = 'mapFileStruct.json'

const MapSettingsFile = {
    stringConnection:'',
    dbContextFilename: '',
    outputFolder:'',
    tables:[]
}

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.utils = new Utils(this);
        this.dotNetCLI = new DotNetCLI(this);

        this.canExcute = true;
    }

    createMapFileStruct(){

        this.canExcute = this.fs.exists(this.destinationPath(MapSettingsFilename))

        if(!this.canExcute){
            this.fs.write(MapSettingsFilename, JSON.stringify(MapSettingsFile));
            this.log(" Settings file was created. Put your settings and execute this command again.\n Closing ...");    
        }
    }

    map(){
        if(!this.canExcute) return;
        
        this.log(" Mapping ...");
        var settings = JSON.parse(this.fs.read(MapSettingsFilename));

        this.dotNetCLI.mapEfCore(settings.stringConnection,
            settings.outputFolder, settings.tables, settings.dbContextFilename, ()=>{
                this.log("Done!")
            });        
    }
}