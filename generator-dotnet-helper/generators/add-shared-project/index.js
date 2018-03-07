const Utils = require('../../lib/Utils');
const DotNetCLI = require('../../lib/DotNetCLI');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        
        this.dotNetCLI = new DotNetCLI(this);      
        
        this.parameter = args.length > 0? args[0] : '';        
    }   

    execute(){
        this.dotNetCLI.run('yo dthp:addsp ' + this.parameter, ()=>{});
    }
}