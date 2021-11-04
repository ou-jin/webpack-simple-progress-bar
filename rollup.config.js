import resolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [ resolve(),
],
  external: ['webpack']
};