class DotNetCLI {

    constructor(context){
        this.context = context;
        this.process = require('child_process');
    }

    createProject(projectDirectory, projectTemplate, callbackSuccess){        
        var command = 'dotnet new ' + projectTemplate + ' -o ' + projectDirectory;
        this.run(command, callbackSuccess);
    }

    createSolution(solutionDirectory, solutionFilename, callbackSuccess){
        var command = 'dotnet new sln -o ' + solutionDirectory
            + ' -n ' + solutionFilename;
        
        this.run(command, callbackSuccess);
    }

    addProjectToSolution(solutionFilename, projectFilename, callbackSuccess){
        var command = 'dotnet sln ' + solutionFilename + ' add ' + projectFilename;
        this.run(command, callbackSuccess);
    }

    addProjectReference(projectFilename, projectReferenceFilename, callbackSuccess){
        var command = 'dotnet add ' + projectFilename + ' reference ' + projectReferenceFilename;
        this.run(command, callbackSuccess);
    }

    run(command, callbackSuccess){      
        //this.context.log(command) ;
        this.process.execSync(command)
        callbackSuccess();
        /*this.process.execSync(command, (error, stdout, stderr)=>{
            this.callbackHandler(error, stdout, stderr, callbackSuccess)
        });*/
    }

    callbackHandler(error, stdout, stderr, callbackSuccess){
        if(error != null){
            this.context.log('\n' + error);       
            this.context.log('\nOutput:\n' + stderr);    
        }else{
            this.context.log('\n\nOutput:\n'+ stdout);
            callbackSuccess();
        }
    }
};

module.exports = DotNetCLI;