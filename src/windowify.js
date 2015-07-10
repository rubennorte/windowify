'use strict';

var tls = require('./tls');
var esprima = require('esprima');

/**
 * Wraps the given code inside a IIFE that uses window as parameter and context
 * @param  {string} code
 * @return {string}
 */
function wrapWithContext(code) {
  return '!function(window) {\n' +
    code +
    '\n}.call(window, window);';
}

/**
 * Wraps the given code inside a IIFE that uses window as parameter
 * @param  {string} code
 * @return {string}
 */
function wrapWithIIFE(code) {
  return '!function(window) {\n' +
    code +
    '\n}(window);';
}

/**
 * Returns the given code unmodified
 * @param  {string} code
 * @return {string}
 */
function noWrap(code) {
  return code;
}

/**
 * "windowifies" the given code, adding an explicit exposition of all the
 * variables (and functions) declared at the top level scope to window and
 * wrapping the code inside a IIFE if so or if it uses "this" at the top
 * level scope
 * @param  {string} code
 * @param {Object} [options]
 * @param {string} [options.file]
 * @param {Logger} [options.logger]
 * @return {string}
 */
function windowify(code, options) {
  var ast = esprima.parse(code);

  var globalNames = tls.getDeclaredNames(ast);
  var definesTLSVars = globalNames.length > 0;
  if (definesTLSVars) {
    code += '\n' + globalNames.map(function(name) {
      return 'window.' + name + ' = ' + name + ';';
    }).join('\n');
  }

  var wrapper;
  var usesThis = tls.usesThis(ast);
  if (usesThis) {
    wrapper = wrapWithContext;
  } else if (definesTLSVars) {
    wrapper = wrapWithIIFE;
  } else {
    wrapper = noWrap;
  }

  var message;
  var logger = options && options.logger;
  if (logger && (definesTLSVars || usesThis)) {
    message = 'windowify ' + options.file + ':\n';
    if (definesTLSVars) {
      message += '\tvariables: ' + globalNames.join(', ') + '\n';
    }
    if (usesThis) {
      message += '\tuses this in top-level scope\n';
    }
    logger.log(message);
  }

  return wrapper(code);
}

module.exports = windowify;
