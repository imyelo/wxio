import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import mergeWith from 'lodash/mergeWith'
import partialRight from 'lodash/partialRight'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const deepMerge = partialRight(mergeWith, (dest, src) => {
  if (Array.isArray(dest)) {
    return dest.concat(src)
  }
})

const baseConfig = {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    // compile all files (including dependencies) with `babel.config.js`
    babel()
  ]
}

export default [
  {
    output: {
      file: pkg.main,
      format: 'cjs',
    },
  },
  {
    output: {
      file: 'cjs/wxio.min.js',
      format: 'cjs',
    },
    plugins: [
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  {
    output: {
      file: pkg.module,
      format: 'esm',
    },
  },
].map((config) => deepMerge({}, baseConfig, config))
