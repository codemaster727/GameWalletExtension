import { EthereumRpcError } from 'eth-rpc-errors';
// import SafeEventEmitter from 'safe-event-emitter';
import createRandomId from '../../shared/modules/random-id';
// import { TEN_SECONDS_IN_MILLISECONDS } from '../../shared/lib/transactions-controller-utils';
const TEN_SECONDS_IN_MILLISECONDS = 10000;

class DisconnectError extends Error {}

class MetaRPCClient {
  connectionStream: any;
  notificationChannel: any;
  uncaughtErrorChannel: any;
  requests: any;
  responseHandled: any;
  DisconnectError: any;
  constructor(connectionStream: any) {
    this.connectionStream = connectionStream;
    // this.notificationChannel = new SafeEventEmitter();
    // this.uncaughtErrorChannel = new SafeEventEmitter();
    this.requests = new Map();
    this.connectionStream.on('data', this.handleResponse.bind(this));
    this.connectionStream.on('end', this.close.bind(this));
    this.responseHandled = {};
    this.DisconnectError = DisconnectError;
  }

  send(id: string | number, payload: any, cb: any) {
    this.requests.set(id, cb);
    this.connectionStream.write(payload);
    this.responseHandled[id] = false;
    if (payload.method === 'getState') {
      setTimeout(() => {
        if (!this.responseHandled[id] && cb) {
          delete this.responseHandled[id];
          return cb(new Error('No response from RPC'), null);
        }

        delete this.responseHandled[id];
        // needed for linter to pass
        return true;
      }, TEN_SECONDS_IN_MILLISECONDS);
    }
  }

  onNotification(handler: any) {
    this.notificationChannel.addListener('notification', (data: any) => {
      handler(data);
    });
  }

  onUncaughtError(handler: any) {
    this.uncaughtErrorChannel.addListener('error', (error: any) => {
      handler(error);
    });
  }

  close() {
    this.notificationChannel.removeAllListeners();
    this.uncaughtErrorChannel.removeAllListeners();
    // fail all unfinished requests
    for (const [id, handler] of this.requests) {
      if (!this.responseHandled[id]) {
        this.responseHandled[id] = true;
        handler(new DisconnectError('disconnected'));
      }
    }
  }

  handleResponse(data: any) {
    const { id, result, error, method, params } = data;
    const isNotification = id === undefined && error === undefined;
    const cb = this.requests.get(id);

    this.responseHandled[id] = true;

    if (method && params && !isNotification) {
      // dont handle server-side to client-side requests
      return;
    }
    if (method && params && isNotification) {
      // handle servier-side to client-side notification
      this.notificationChannel.emit('notification', data);
      return;
    }

    if (error) {
      const e = new EthereumRpcError(error.code, error.message, error.data);
      // preserve the stack from serializeError
      e.stack = error.stack;
      if (cb) {
        this.requests.delete(id);
        cb(e);
        return;
      }
      this.uncaughtErrorChannel.emit('error', e);
      return;
    }

    if (!cb) {
      // not found in request list
      return;
    }

    this.requests.delete(id);

    cb(null, result);
  }
}

const metaRPCClientFactory = (connectionStream: any) => {
  const metaRPCClient = new MetaRPCClient(connectionStream);
  return new Proxy(metaRPCClient, {
    get: (object, property) => {
      //@ts-ignore
      if (object[property]) {
        //@ts-ignore
        return object[property];
      }
      return (...p: any) => {
        const cb = p[p.length - 1];
        const params = p.slice(0, -1);
        const id = createRandomId();
        const payload = {
          jsonrpc: '2.0',
          method: property,
          params,
          id,
        };
        object.send(id, payload, cb);
      };
    },
  });
};

export default metaRPCClientFactory;
