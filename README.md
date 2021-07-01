# esbuild-plugin-simple-reload

Simple esbuild plugin to reload website after every rebuild

## Install

```bash
npm i -D @ceski23/esbuild-plugin-simple-reload
```

## Usage

Create file `build.js`:

```js
import esbuild from 'esbuild';
import { simpleReload } from 'esbuild-plugin-simple-reload';

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    plugins: [simpleReload({ /* OPTIONS */ })],
}).catch((e) => console.error(e.message))
```

## Options

### `options.websocketPort`

Type: `number`

Default: `8080`

Port on which WebSocket will be open

### `options.externalPaths`

Type: `string | string[]`

Default: `undefined`

Additional paths to watch for changes (eg. PHP files etc.)

### `options.ignoredPaths`

Type: `string[]`

Default: `['node_modules']`

Paths to ignore when externalPaths are watched