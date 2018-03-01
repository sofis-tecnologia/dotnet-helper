const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');
const RootFolder = 'Microservices'
const DefaultProjectType = 'classlib';
const DefaultProjects = [
    ['Application'], 
    ['Model'], 
    ['Repository'], 
    ['UnitTest', 'xunit'],
    ['*API', 'webapi']
]

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        
        this.utils = new Utils(this);
        this.dotNetCLI = new DotNetCLI(this);
        
        this.canExecute = args.length==1 ? true : false;

        if(this.canExecute){
            this.microserviceName = args[0];

            this.microserviceFolder = this.destinationPath(
                RootFolder + '/' + this.microserviceName);                
        }
    }

    checkingArguments(){        
        if(this.canExecute) return;
        
        this.log(" No arguments found.\n Closing ...");        
    }

    checkingMicroserviceFolder() {
        if(!this.canExecute) return;

        this.canExecute = this.utils.validateRootFolder(RootFolder, 
            this.destinationPath(RootFolder));
    }

    createMicroserviceFolder(){
        if(!this.canExecute) return;
        
        this.utils.createFolder(this.microserviceFolder);

        this.canExecute = this.utils.isFolderExists(this.microserviceFolder);
    }
    
    createMicroserviceSolution(){
        if(!this.canExecute) return;
                
        var solutionFilename = this.microserviceName+'Solution'

        this.dotNetCLI.createSolution(
            this.microserviceFolder, solutionFilename, ()=>{
            
                this.log(' Solution was created ...');
        });
    }

    createMicroserviceProjects(){
        if(!this.canExecute) return;
        
        DefaultProjects.forEach((value, index)=>{

            var projectDirectory = this.microserviceFolder + '/' + value[0];
            var projectTemplate = value.length == 1? DefaultProjectType : value[1];
            var projectName = value[0];

            if(index == DefaultProjects.length -1 ){
                projectDirectory = projectDirectory.replace("*", this.microserviceName);
                projectName = projectDirectory.replace("*", this.microserviceName);
            }

            this.dotNetCLI.createProject(projectDirectory, projectTemplate, ()=>{
                this.log(' Project '+projectName+' was created ...');
            });
        });
    }
}