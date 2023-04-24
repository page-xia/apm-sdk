// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
const {npm_package_commonjs, npm_package_main, npm_package_umd} = process.env
export default {
  input: 'src/index.ts',
  output: [
    { 
        file: npm_package_main, 
        format: 'es', 
    },
  ],
  // external: ['vue'],
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    terser(),
    filesize(),
    typescript({
      experimentalDecorators: true,
      module: 'es'
    }),
    // vue({
    //   template: {
    //     isProduction: true
    //   }
    // }),
    babel(),

  ]
};
