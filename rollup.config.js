const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const filesize = require('rollup-plugin-filesize');
const json = require('rollup-plugin-json');
const { uglify } = require('rollup-plugin-uglify');

const pkgDetails = require('./package.json');

module.exports = {
  input: 'src/index.js',
  external: Object.keys(pkgDetails.dependencies),
  plugins: [
    json(),
    commonjs(),
    resolve({
      preferBuiltins: false,
    }),
    buble(),
    uglify(),
    filesize(),
  ],
  output: {
    file: pkgDetails.main,
    exports: 'named',
    format: 'umd',
    name: 'JuristekParser',
    globals: {
      cheerio: 'cheerio',
      moment: 'moment',
      numeral: 'numeral',
    },
  },
};
