'use strict';

var transformify = require('transformify');
var through = require('through');
var minimatch = require('minimatch');

var windowify = require('./windowify');

function fileNeedsProcess(file, filesToProcess) {
  return filesToProcess.some(function(fileToProcess) {
    return minimatch(file, fileToProcess);
  });
}

function applyWindowifyOptions(options) {
  return function(code) {
    return windowify(code, options);
  };
}

function handleFile(file, options) {
  var filesToProcess;
  if (options instanceof Array) {
    filesToProcess = options;
  } else {
    options = options || {};
    filesToProcess = options.files || options._ || ['**/*'];
  }

  var windowifyOptions = {
    file: file,
    logger: options.debug ? console : null
  };

  if (fileNeedsProcess(file, filesToProcess)) {
    return transformify(applyWindowifyOptions(windowifyOptions))(file);
  } else {
    return through();
  }
}

module.exports = handleFile;
