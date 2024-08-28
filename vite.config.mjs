import fs from 'fs';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: './src/index.html',
          dest: './',
        },        
        {
          src: './sdk-config.json',
          dest: './',
        },
        {
          src: './assets/img/*',
          dest: './',
        },
        {
          src: './assets/css/*',
          dest: './',
        },
        {
          src: './node_modules/@pega/auth/lib/oauth-client/authDone.html',
          dest: './',
          rename: 'auth.html',
        },
        {
          src: './node_modules/@pega/auth/lib/oauth-client/authDone.js',
          dest: './',
        },
        {
          src: './node_modules/@pega/constellationjs/dist/bootstrap-shell.js',
          dest: './constellation/',
        },
        {
          src: './node_modules/@pega/constellationjs/dist/bootstrap-shell.*.*',
          dest: './constellation/',
        },
        {
          src: './node_modules/@pega/constellationjs/dist/lib_asset.json',
          dest: './constellation/',
        },
        {
          src: './node_modules/@pega/constellationjs/dist/constellation-core.*.*',
          dest: './constellation/prerequisite/',
        },
        {
          src: './assets/icons/*',
          dest: './constellation/icons/',
        },
      ],
    }),
  ],
  root: '',
  build: {
    outDir: './dist',
    publicDir: './public',
    emptyOutDir: true, // also necessary
    sourceMap: 'inline',
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './keys/sdk-r.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './keys/sdk-r.crt')),
    },
    // Make sure the server is accessible over the local network
    host: '0.0.0.0',
  },
};
