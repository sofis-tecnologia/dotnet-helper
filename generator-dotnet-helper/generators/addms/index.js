const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');
const RootFolder = 'Microservices'
const DefaultProjectTemplate = 'classlib';
const SearchChar = '%';
/* 
    Project Array:
    [0] = (string) Name of Project,
    [1] = (string) template used,
    [2] = (string)[] projects dependencies
    *** Obs: the 'SearchCharacter' will be replaced by the project name.
    E.g.: CustomerAPI will be created for Customer 
          inputed as project name.
*/
const Projects = [
    ['Model',           DefaultProjectTemplate, []], 
    ['Repository',      DefaultProjectTemplate, ['Model']],
    ['Application',     DefaultProjectTemplate, ['Model', 'Repository']],
    ['UnitTest',        'xunit',                ['Model', 'Repository', 'Application']],
    [ SearchChar+'API', 'webapi',               ['Model', 'Repository', 'Application']]
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
                RootFolder + '/' + this.microserviceName
            );

            this.solutionFilename = this.microserviceName+'Solution';                                 
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
        
        this.dotNetCLI.createSolution(
            this.microserviceFolder, this.solutionFilename, ()=>{
            
                this.log(' Solution was created ...');
        });
    }

    createMicroserviceProjects(){
        if(!this.canExecute) return;
        
        this.log(' Creating the projects ...');
        Projects.forEach((value, index)=>{

            var projectName = value[0];                
            var projectTemplate = value[1];
            
            if(value[0].search(SearchChar) > -1 ){
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);
            }
            var projectDirectory = this.microserviceFolder + '/' + projectName;

            this.dotNetCLI.createProject(projectDirectory, projectTemplate, ()=>{
                this.log(' Project '+projectName+' was created ...');
            });
        });
    }

    addProjectsToSolution(){
        if(!this.canExecute) return;

        this.log(' Adding the projects to '+this.solutionFilename+' ...');

        var solutionFilename = this.microserviceFolder + '/' 
            + this.solutionFilename + '.sln';

        Projects.forEach((value, index)=>{

            var projectName = value[0];            

            if(projectName.search(SearchChar) > -1 ){                                
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);              
            }
            var projectFilename = this.microserviceFolder + '/' 
                + projectName + '/' + projectName + '.csproj'; 

            this.dotNetCLI.addProjectToSolution(solutionFilename, projectFilename, ()=>{
                this.log(' The '+projectName+' project was added to '
                    + this.solutionFilename+' ...');
            });
        });  
    }

    addProjectsReferences(){
        if(!this.canExecute) return;

        Projects.forEach((value, index)=>{

            var projectName = value[0];            

            if(projectName.search(SearchChar) > -1 ){                                
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);              
            }

            this.log(' Adding references to '+projectName+' ...');

            var projectFilename = this.microserviceFolder + '/' 
                + projectName + '/' + projectName + '.csproj';

            value[2].forEach(projectReference =>{

                var projectReferenceFilename = this.microserviceFolder + '/' 
                    + projectReference + '/' + projectReference + '.csproj';

                this.dotNetCLI.addProjectReference(projectFilename, projectReferenceFilename, ()=>{
                    this.log('-> the reference '+projectReference+' was added.');
                });
            });
        });  
    }
}