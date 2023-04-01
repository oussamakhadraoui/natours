const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
};
