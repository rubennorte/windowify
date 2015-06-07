
var transformify = require('transformify');
var through = require('through');
var minimatch = require('minimatch');

var windowify = require('./windowify');

function processFile(file, filesToProcess) {
  return filesToProcess.some(function(fileToProcess) {
    return minimatch(file, fileToProcess);
  });
}

module.exports = function(file, options) {
  var filesToProcess;
  if (options instanceof Array) {
    filesToProcess = options;
  } else {
    options = options || {};
    filesToProcess = options._ || [];
  }
  if (processFile(file, filesToProcess)) {
    return transformify(windowify)(file);
  } else {
    return through();
  }
};