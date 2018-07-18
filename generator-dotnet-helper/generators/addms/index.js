const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');
const RootFolder = 'Microservices'
const DefaultProjectTemplate = 'classlib';
const SearchChar = '%';
/* 
    Project Array:
    [0] = (string) name of Project,
    [1] = (string) template used,
    [2] = (string)[] projects dependencies
    [3] = (boolean) should create the run bat file.
    *** Obs: the 'SearchCharacter' will be replaced by the project name.
    E.g.: CustomerAPI will be created for Customer 
          inputed as project name.
*/
//TODO: substitute the SearchChar for the inputted project name using Array.map().
const Projects = [
    ['Model', DefaultProjectTemplate, [], false],
    ['Infrastructure', DefaultProjectTemplate, ['Model'], false],
    ['Application', DefaultProjectTemplate, ['Model', 'Infrastructure'], false],
    ['UnitTest', 'xunit', ['Model', 'Infrastructure', 'Application'], true],
    [SearchChar + 'API', 'webapi', ['Model', 'Infrastructure', 'Application'], true]
]

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this.utils = new Utils(this);
        this.dotNetCLI = new DotNetCLI(this);

        this.canExecute = args.length == 1 ? true : false;

        if (this.canExecute) {
            this.microserviceName = args[0];

            this.microserviceFolder = this.destinationPath(
                RootFolder + '/' + this.microserviceName
            );

            this.solutionFilename = this.microserviceName + 'Solution';
        }
    }

    checkingArguments() {
        if (this.canExecute) return;

        this.log(" No arguments found.\n Closing ...");
    }

    checkingMicroserviceFolder() {
        if (!this.canExecute) return;

        this.canExecute = this.utils.validateRootFolder(RootFolder,
            this.destinationPath(RootFolder));
    }

    createMicroserviceFolder() {
        if (!this.canExecute) return;

        this.utils.createFolder(this.microserviceFolder);

        this.canExecute = this.utils.isFolderExists(this.microserviceFolder);
    }

    createMicroserviceSolution() {
        if (!this.canExecute) return;

        this.log(this.microserviceFolder)
        this.log(this.solutionFilename)
        this.dotNetCLI.createSolution(
            this.microserviceFolder, this.solutionFilename, () => {                
                this.log(' Solution was created ...');
            });
    }

    createMicroserviceProjects() {
        if (!this.canExecute) return;

        this.log(' Creating the projects ...');
        Projects.forEach((value, index) => {

            var projectName = value[0];
            var projectTemplate = value[1];

            if (value[0].search(SearchChar) > -1) {
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);
            }
            var projectDirectory = this.microserviceFolder + '/' + projectName;

            this.dotNetCLI.createProject(projectDirectory, projectTemplate, () => {
                this.log(' Project ' + projectName + ' was created ...');
            });
        });
    }

    addProjectsToSolution() {
        if (!this.canExecute) return;

        this.log(' Adding the projects to ' + this.solutionFilename + ' ...');

        var solutionFilename = this.microserviceFolder + '/'
            + this.solutionFilename + '.sln';

        Projects.forEach((value, index) => {

            var projectName = value[0];

            if (projectName.search(SearchChar) > -1) {
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);
            }
            var projectFilename = this.microserviceFolder + '/'
                + projectName + '/' + projectName + '.csproj';

            this.dotNetCLI.addProjectToSolution(solutionFilename, projectFilename, () => {
                this.log(' The ' + projectName + ' project was added to '
                    + this.solutionFilename + ' ...');
            });
        });
    }

    addProjectsReferences() {
        if (!this.canExecute) return;

        Projects.forEach((value, index) => {

            var projectName = value[0];

            if (projectName.search(SearchChar) > -1) {
                projectName = projectName.replace(
                    SearchChar, this.microserviceName);
            }

            this.log(' Adding references to ' + projectName + ' ...');

            var projectFilename = this.microserviceFolder + '/'
                + projectName + '/' + projectName + '.csproj';

            value[2].forEach(projectReference => {

                var projectReferenceFilename = this.microserviceFolder + '/'
                    + projectReference + '/' + projectReference + '.csproj';

                this.dotNetCLI.addProjectReference(projectFilename, projectReferenceFilename, () => {
                    this.log('-> the reference ' + projectReference + ' was added.');
                });
            });
        });
    }

    createRunBatFileForMainProject() {
        if (!this.canExecute) return;

        Projects.forEach(project => {
            if(project[3] == false) return;

            var projectName = project[0].replace(SearchChar, this.microserviceName);
            this.log(' Creating bat file for ' + projectName + ' project ...');

            var batFilename = this.microserviceFolder + '/' + projectName + ' - run.bat';
            var projectFilename = projectName + '/' + projectName + '.csproj';
            var content = 'dotnet run -p ' + projectFilename;

            this.fs.write(batFilename, content)
        });
    }

    createXUnitTestBatFile() {
        if (!this.canExecute) return;

        var projects = Projects.filter(project => project[1] == 'xunit');

        if (projects.length == 0) return;

        this.log(' Creating bat file for XUnit project ...');
        var batFilename = this.microserviceFolder + '/test.bat';
        var projectName = projects[0][0].replace(SearchChar, this.microserviceName)
        var projectFilename = projectName + '/' + projectName + '.csproj';
        var content = 'dotnet test ' + projectFilename;

        this.fs.write(batFilename, content)
    }

    createBuildSolutionBatFile() {
        if (!this.canExecute) return;

        this.log(' Creating bat file for build solution ...');
        var batFilename = this.microserviceFolder + '/build.bat';
        var content = 'dotnet build ' + this.solutionFilename + '.sln';

        this.fs.write(batFilename, content)
    }
}