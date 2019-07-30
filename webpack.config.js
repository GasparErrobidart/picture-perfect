const path = require('path');

module.exports = {
  entry: {
    'calculate-size-only' : './dist/calculate-size-only.js',
    'calculate-sources-only' : './dist/calculate-sources-only.js',
    'lazy-load-only' : './dist/lazy-load-only.js',
    'mimic-background-image-only' : './dist/mimic-background-image-only.js',
    'picture-perfect-all-except-dynamic-source' : './dist/picture-perfect-all-except-dynamic-source.js',
    'picture-perfect-all-in-one' : './dist/picture-perfect-all-in-one.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  }
};
