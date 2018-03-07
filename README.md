# dotnet-helper
 Welcome to the DotNet Helper! =D

 0) init               | --        -> Create the Microservice and the SharedProject folders.
 Usage:
    yo dthp:init

 1) add-microservice   | addms     -> Create a microservice solution and the following projects: *API, Application, Model, Repository and UnitTest.
 Usage:
    yo dthp:addms 'NameOfTheMicroservice'

 2) add-shared-project | addsp     -> Create a shared project, commonly used for sharing classes between the microservices.
 Usage:
    yo dthp:addsp 'NameOfTheSharedProject'

 3) efcore-map         | --        -> Map tables using EntityFrameworkCore. Quick start: execute the command once to create the settings file.
                                     Then, execute it again to map your tables - put your settings on the created file before the second execution.
                                     ** In the settings file, leave tables array propety empty for map all tables.
 Usage:
    yo dthp:efcore-map
