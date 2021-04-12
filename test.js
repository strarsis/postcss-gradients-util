const valuesParse = require('postcss-values-parser'),
      parseValues = valuesParse.parse;

const ast = parseValues( '90grad' );

console.log(ast);

