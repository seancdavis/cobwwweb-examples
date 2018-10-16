import babel from 'rollup-plugin-babel';

export default {
  input: './source/javascripts/manifest.js',
  output: {
    file: './.tmp/dist/javascripts/main.js',
    sourcemap: true,
    format: 'iife',
    name: 'my_manifest_file',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
