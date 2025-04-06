const commonjs = require('@rollup/plugin-commonjs');
const patchExportsLoop = require('./plugins/rollup-plugin-patch-exports-loop.js');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

module.exports = {
  input: 'src/main.js',
  output: [
    {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    patchExportsLoop(),
  ],
};
