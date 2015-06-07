var esprima = require('esprima');
var estraverse = require('estraverse');

var TopLevelScopeDeclarations = {

  getNames: function(code) {
    var ast = esprima.parse(code);
    var names = [];

    estraverse.traverse(ast, {
      enter: function(node, parent) {
        if (node.type === 'FunctionDeclaration') {
          names.push(node.id.name);
        }
        if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
          return estraverse.VisitorOption.Skip;
        }
      },
      leave: function(node, parent) {
        if (node.type === 'VariableDeclarator') {
          names.push(node.id.name);
        }
      }
    });

    return names;
  }

};

module.exports = TopLevelScopeDeclarations;