import WebSocket from 'ws';
import chokidar from 'chokidar';
import { Plugin } from 'esbuild';

export interface SimpleReloadOptions {
  /**
   * Port on which WebSocket will be open
   * 
   * @default 8080
   */
  websocketPort?: number;

  /**
   * Additional paths to watch for changes (eg. PHP files etc.)
   */
  externalPaths?: string | string[];

  /**
   * Paths to ignore when externalPaths are watched
   * 
   * @default ['node_modules']
   */
  ignoredPaths?: string[];
}

export const simpleReload = (
  { websocketPort, externalPaths, ignoredPaths }: SimpleReloadOptions = {}
): Plugin => ({
  name: 'simple-reload',
  setup(build) {
    // Defaults
    if (!websocketPort) websocketPort = 8080;
    if (!ignoredPaths) ignoredPaths = ['node_modules'];

    const options = build.initialOptions;
    const wss = new WebSocket.Server({ port: websocketPort });

    const sendReloadSignal = () => {
      wss.clients.forEach((ws) => {
        ws.send('reload');
      });
    };

    // Watch external paths for changes
    if (externalPaths) {
      chokidar
        .watch(externalPaths, { ignored: ignoredPaths })
        .on('change', sendReloadSignal);
    }

    // Inject JS code which will connet to WebSocket
    if (!options?.footer?.js) options.footer = { js: '' };
    options.footer.js += `
      new WebSocket('ws://localhost:${websocketPort}').onmessage = (message) => {
        if (message.data === 'reload') location.reload();
      };
    `;

    // Run after every build
    build.onEnd(() => {
      sendReloadSignal();
    });
  },
});
