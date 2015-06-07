
var path = require('path');

var SpecReporter = require('jasmine-spec-reporter');
var Jasmine = require('jasmine');

var runner = new Jasmine();
runner.loadConfigFile(path.join(__dirname, 'jasmine.json'));
runner.addReporter(new SpecReporter({displayStacktrace: true}));
runner.execute();
