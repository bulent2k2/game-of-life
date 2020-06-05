import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'built/bundle.min.js',
    format: 'iife',
    name: 'bundle',
  },
  plugins: [nodeResolve(), typescript(), terser()],
};
