// import ObjectMultiplex from 'obj-multiplex';
const ObjectMultiplex = require('obj-multiplex');
import pump, { Callback, Stream } from 'pump';

import { EXTENSION_MESSAGES } from '../../shared/constants/app';

/**
 * Sets up stream multiplexing for the given stream
 *
 * @param {any} connectionStream - the stream to mux
 * @returns {stream.Stream} the multiplexed stream
 */
export function setupMultiplex(connectionStream: any) {
  const mux = new ObjectMultiplex();
  /**
   * We are using this streams to send keep alive message between backend/ui without setting up a multiplexer
   * We need to tell the multiplexer to ignore them, else we get the " orphaned data for stream " warnings
   * https://github.com/MetaMask/object-multiplex/blob/280385401de84f57ef57054d92cfeb8361ef2680/src/ObjectMultiplex.ts#L63
   */
  mux.ignoreStream(EXTENSION_MESSAGES.CONNECTION_READY);
  mux.ignoreStream('ACK_KEEP_ALIVE_MESSAGE');
  mux.ignoreStream('WORKER_KEEP_ALIVE_MESSAGE');
  pump(connectionStream, mux as unknown as Stream | Callback, connectionStream, (err: any) => {
    if (err) {
      console.error(err);
    }
  });
  return mux;
}
