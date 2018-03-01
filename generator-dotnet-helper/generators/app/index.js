
var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  showHelper() {

    var output = '\n\n Welcome to the DotNet Helper! =D\n\n';

    output += ' 1) add-microservice   | addms     -> Create a microservice solution and the following projects: *API, Application, Model, Repository and UnitTest.';
    output += "\n Example:\n    yo dthp:addms 'NameOfTheMicroService' \n\n";

    output += ' 2) add-shared-project | addsp     -> Create a shared project, commonly used for sharing classes between the microservices.';

    output += "\n Example:\n    yo dthp:addsp 'NameOfTheSharedProject' \n\n";

    this.log(output);
  }
};
