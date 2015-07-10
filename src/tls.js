'use strict';

var estraverse = require('estraverse');

var TopLevelScope = {

  /**
   * Returns all the names (variables and functions) declared at the top level
   * scope of the given AST
   * @param  {Object} ast
   * @return {string[]}
   */
  getDeclaredNames: function(ast) {
    var names = [];

    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === 'FunctionDeclaration') {
          names.push(node.id.name);
        }
        if (node.type === 'FunctionExpression' ||
          node.type === 'FunctionDeclaration') {
          return estraverse.VisitorOption.Skip;
        }
      },
      leave: function(node) {
        if (node.type === 'VariableDeclarator') {
          names.push(node.id.name);
        }
      }
    });

    return names;
  },

  /**
   * Indicates if the given ast uses "this" at its top level scope
   * @param  {Object} ast
   * @return {boolean}
   */
  usesThis: function(ast) {
    var usesThis = false;

    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === 'ThisExpression') {
          usesThis = true;
          return estraverse.VisitorOption.Break;
        }
      }
    });

    return usesThis;
  },

};

module.exports = TopLevelScope;
