
// require all test files
var context = require.context('.', true, /_spec\.js$/);
context.keys().forEach(context);