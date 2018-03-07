
var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  showHelper() {

    var output = '\n\n Welcome to the DotNet Helper! =D\n\n';

    output += ' 0) init               | --        -> Create the Microservice and the SharedProject folders.';
    output += "\n Usage:\n    yo dthp:init \n\n";

    output += ' 1) add-microservice   | addms     -> Create a microservice solution and the following projects: *API, Application, Model, Repository and UnitTest.';
    output += "\n Usage:\n    yo dthp:addms 'NameOfTheMicroService' \n\n";

    output += ' 2) add-shared-project | addsp     -> Create a shared project, commonly used for sharing classes between the microservices.';
    output += "\n Usage:\n    yo dthp:addsp 'NameOfTheSharedProject' \n\n";

    output += ' 3) efcore-map         | --        -> Map tables using EntityFrameworkCore. Quick start: execute the command once to create the settings file. '
           + '\n                                     Then, execute it again to map your tables - put your settings on the created file before the second execution.'
           + '\n                                     ** In the settings file, leave tables array propety empty for map all tables.';
    output += "\n Usage:\n    yo dthp:efcore-map \n\n";

    this.log(output);
  }
};
