'use strict';

var tlsDeclarations = require('./tls-declarations');

function wrapInClosure(code) {
  return '(function(window) {\n' +
    code +
    '\n}).call(window, window);';
}

function windowify(contents) {
  var globalNames = tlsDeclarations.getNames(contents);
  if (globalNames.length > 0) {
    contents += '\n' + globalNames.map(function(name) {
      return 'window.' + name + ' = ' + name + ';';
    }).join('\n');
  }
  return wrapInClosure(contents);
}

module.exports = windowify;