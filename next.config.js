const withTM = require('next-transpile-modules')([
  'three',
  'react-three-fiber',
]);

module.exports = withTM();
