class DotNetCLI {

    constructor(context){
        this.context = context;
        this.process = require('child_process');
    }

    createSolution(solutionDirectory, solutionFilename, callbackSuccess){
        var command = 'dotnet new sln -o ' + solutionDirectory
            + ' -n ' + solutionFilename;
        
        this.run(command, callbackSuccess);
    }

    addProjectToSolution(solutionFilename, projectFilename, callbackSuccess){
        /*var command = 'dotnet new sln -o ' + projectDirectory;
        this.run(command, callbackSuccess);*/
    }

    createProject(projectDirectory, projectTemplate, callbackSuccess){        
        var command = 'dotnet new ' + projectTemplate + ' -o ' + projectDirectory;
        this.run(command, callbackSuccess);
    }

    run(command, callbackSuccess){      
        this.context.log(command) ;
        this.process.exec(command, (error, stdout, stderr)=>{
            this.callbackHandler(error, stdout, stderr, callbackSuccess)
        });
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