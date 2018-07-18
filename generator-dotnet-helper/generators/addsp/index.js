const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');
const RootFolder = 'Shared'
const DefaultProjectType = 'classlib';

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.utils = new Utils(this);
        this.dotNetCLI = new DotNetCLI(this);

        this.canExecute = args.length == 1 ? true : false;

        if (this.canExecute) {
            this.projectName = args[0];
        }
    }

    checkingArguments() {
        if (this.canExecute) return;

        this.log(" No arguments found.\n Closing ...");
    }

    checkingSharedProjectFolder() {
        if (!this.canExecute) return;

        this.canExecute = this.utils.validateRootFolder(RootFolder,
            this.destinationPath(RootFolder));
    }

    createSharedProject() {
        if (!this.canExecute) return;

        this.projectName += RootFolder;
        this.log("\nCreating the " + this.projectName + ' project.');

        var projectDirectory = this.destinationPath(RootFolder + '/' + this.projectName);

        this.dotNetCLI.createProject(projectDirectory, DefaultProjectType, () => {
            this.log('The Project ' + this.projectName + ' was created.');
        });
    }

    createBuildSolutionBatFile() {
        if (!this.canExecute) return;

        this.log(' Creating bat file for build project ...');
        
        var projectDirectory = this.destinationPath(RootFolder + '/' + this.projectName);
        var batFilename = projectDirectory + '/build.bat';
        var content = 'dotnet build "' + this.projectName + '.csproj"';

        this.fs.write(batFilename, content);
    }
}