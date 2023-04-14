// rollup.config.js
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import nodeResolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import filesize from "rollup-plugin-filesize";
import babel from "@rollup/plugin-babel";
import replace from "rollup-plugin-replace";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  output: [
    // {
    //     file: pkg.commonjs,
    //     format: 'cjs',
    // },
    {
      file: pkg.main,
      format: "es",
    },
    // {
    //     name: "apm-sdk",
    //     file: pkg.umd,
    //     format: 'umd'
    // }
  ],
  external: ["vue"],
  plugins: [
    json(),
    nodeResolve(),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    terser(),
    filesize(),
    typescript({
      experimentalDecorators: true,
      module: "es",
    }),
    vue({
      template: {
        isProduction: true,
      },
    }),
    babel(),
  ],
};
