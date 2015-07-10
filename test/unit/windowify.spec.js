'use strict';

var windowify = require('../../src/windowify');

describe('windowify', function() {

  it('should be a function', function() {
    expect(windowify).toEqual(jasmine.any(Function));
  });

  it('should leave good code unmodified', function() {
    var code = 'window.Namespace = {};';
    expect(windowify(code)).toBe(code);
  });

  it('should add window.X and a IIFE for TLS variables', function() {
    var code = 'var Namespace = {};';
    expect(windowify(code)).toBe('!function(window) {\n' + code +
      '\nwindow.Namespace = Namespace;\n}(window);');
  });

  it('should add window.X and a IIFE for TLS functions', function() {
    var code = 'function jQuery() {}';
    expect(windowify(code)).toBe('!function(window) {\n' + code +
      '\nwindow.jQuery = jQuery;\n}(window);');
  });

  it('should add an IIFE for "this" in the TLS', function() {
    var code = 'this.Namespace = {};';
    expect(windowify(code)).toBe('!function(window) {\n' +
      code +
      '\n}.call(window, window);');
  });

  it('should work with a combination of TLS variables, functions and this',
    function() {
      var code = 'var Namespace = {}; function jQuery() {} this.value = {};';
      expect(windowify(code)).toBe('!function(window) {\n' +
        code + '\nwindow.Namespace = Namespace;\nwindow.jQuery = jQuery;' +
        '\n}.call(window, window);');
    });

});
