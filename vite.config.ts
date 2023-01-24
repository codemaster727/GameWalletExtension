import { Plugin, defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
// import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/scripts/manifest.json';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import inject from '@rollup/plugin-inject';
import path from 'path';
import alias from '@rollup/plugin-alias';
import builtins from 'rollup-plugin-node-builtins';
import vitePluginRequire from 'vite-plugin-require';
import { viteRequire } from 'vite-require';

const builtinsPlugin = { ...builtins({ crypto: true }), name: 'rollup-plugin-node-builtins' };

// https://vitejs.dev/config/
export default ({ command }: { command: any }) => {
  const isBuild = command === 'build';
  return defineConfig({
    plugins: [
      react(),
      crx({ manifest }),
      tsconfigPaths(),
      builtinsPlugin as Plugin,
      vitePluginRequire({}),
      viteRequire(/* options */),
      // splitVendorChunkPlugin(),
      // legacy({
      //   targets: ['chrome >= 64', 'edge >= 79', 'safari >= 11.1', 'firefox >= 67'],
      //   ignoreBrowserslistConfig: true,
      //   renderLegacyChunks: false,
      //   // modernPolyfills: ['es/global-this'],
      //   modernPolyfills: true,
      // }),
    ],
    build: {
      // target: 'es2015',
      brotliSize: false, // Brotli unsupported in StackBlitz
      chunkSizeWarningLimit: 12800,
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        plugins: [
          //@ts-ignore
          // rollupNodePolyFill(),
          inject({
            Buffer: ['Buffer', 'Buffer'],
            process: 'process',
            // global: 'globalThis',
          }),
          // builtinsPlugin as Plugin,
        ],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
            define: true,
          }),
          NodeModulesPolyfillPlugin(),
          // NodeModulesPolyfills(),
          // GlobalsPolyfills({
          //   process: true,
          //   buffer: true,
          // }),
        ],
      },
    },
    resolve: {
      alias: {
        '@taquito/taquito': path.resolve(
          __dirname,
          './node_modules/@taquito/taquito/dist/taquito.min.js',
        ),
        '@taquito/signer': '@taquito/signer/dist/taquito-signer.umd.js',
        // '@taquito/tezbridge-signer': 'taquito-tezbridge-signer.umd.js',
        // 'send-crypto': path.resolve(__dirname, './node_modules/send-crypto/build/main/index.js'),
        // I almost have no idea why it needs `cjs` on dev and `esm` on build, but this is how it works ??Åâ?
        '@airgap/beacon-sdk': path.resolve(
          __dirname,
          `./node_modules/@airgap/beacon-sdk/dist/${isBuild ? 'esm' : 'cjs'}/index.js`,
        ),
        // polyfills
        // 'readable-stream': 'vite-compatible-readable-stream',
        // stream: 'vite-compatible-readable-stream',
        // https: path.resolve(__dirname, './node_modules/https-browserify/index.js'),
        // http: path.resolve(__dirname, './node_modules/http-proxy/index.js'),
        // https: 'node:https',
        // http: 'node:http',
        // http: path.resolve(__dirname, './node_modules/rollup-plugin-node-polyfills/polyfills/http'),
        // https: path.resolve(
        //   __dirname,
        //   './node_modules/rollup-plugin-node-polyfills/polyfills/http',
        // ),
        // util: path.resolve(__dirname, './node_modules/rollup-plugin-node-polyfills/polyfills/util'),
        // sys: 'util',
        // 'rollup-plugin-node-polyfills': path.resolve(
        //   __dirname,
        //   './node_modules/rollup-plugin-node-polyfills',
        // ),
        // querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        // punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
        // os: 'rollup-plugin-node-polyfills/polyfills/os',
        // assert: 'rollup-plugin-node-polyfills/polyfills/assert',
        // constants: 'rollup-plugin-node-polyfills/polyfills/constants',
        // _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
        // _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
        // _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
        // _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
        // _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
        // url: 'rollup-plugin-node-polyfills/polyfills/url',
        // string_decoder: path.resolve(
        //   __dirname,
        //   'rollup-plugin-node-polyfills/polyfills/string-decoder',
        // ),
        // path: 'rollup-plugin-node-polyfills/polyfills/path',
        // vm: 'rollup-plugin-node-polyfills/polyfills/vm',
        // zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        // crypto: 'node:crypto',
      },
    },
    // test: {
    //   globals: true,
    // },
  });
};
