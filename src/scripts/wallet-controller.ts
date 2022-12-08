import EventEmitter from 'events';
import browser from 'webextension-polyfill';
//@ts-ignore
import KeyringController from 'eth-keyring-controller';
// import SimpleKeyring from 'eth-simple-keyring';
import log from 'loglevel';
import seedPhraseVerifier from './lib/seed-phrase-verifier';
import { Mutex } from 'await-semaphore';
import { Buffer } from 'buffer';
import { KEYRING_TYPES } from '~/shared/constants/keyrings';
import { HARDWARE_KEYRING_TYPES } from '~/shared/constants/hardware-wallets';

(browser as any).global = browser;
// @ts-ignore
browser.Buffer = browser.Buffer || Buffer;

export default class WalletController extends EventEmitter {
  keyringController: KeyringController;
  createVaultMutex: Mutex;
  /**
   * @param {object} opts
   */
  constructor(opts: any) {
    super();
    this.keyringController = new KeyringController({
      keyringTypes: Object.values(HARDWARE_KEYRING_TYPES).map((value: string) => value), // optional array of types to support.
      initState: {}, // Last emitted persisted state.
      encryptor: {
        // An optional object for defining encryption schemes:
        // Defaults to Browser-native SubtleCrypto.
        encrypt(password: string, object: any) {
          // return new Promise('encrypted!');
          return password;
        },
        decrypt(password: string, encryptedString: string) {
          // return new Promise({ foo: 'bar' });
          return password;
        },
      },
    });
    // lock to ensure only one vault created at once
    this.createVaultMutex = new Mutex();
  }

  /**
   * Returns an Object containing API Callback Functions.
   * These functions are the interface for the UI.
   * The API object can be transmitted over a stream via JSON-RPC.
   *
   * @returns {object} Object containing API functions.
   */
  getApi() {
    const { keyringController } = this;
    return {
      createNewVaultAndKeychain: this.createNewVaultAndKeychain.bind(this),
    };
  }

  async verifySeedPhrase() {
    const [primaryKeyring] = this.keyringController.getKeyringsByType(KEYRING_TYPES.HD_KEY_TREE);
    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found');
    }

    const serialized = await primaryKeyring.serialize();
    const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);

    const accounts = await primaryKeyring.getAccounts();
    if (accounts.length < 1) {
      throw new Error('MetamaskController - No accounts found');
    }

    try {
      await seedPhraseVerifier.verifyAccounts(accounts, seedPhraseAsBuffer);
      return Array.from(seedPhraseAsBuffer.values());
    } catch (err: any) {
      log.error(err.message);
      throw err;
    }
  }

  /**
   * Creates a new Vault and create a new keychain.
   *
   * A vault, or KeyringController, is a controller that contains
   * many different account strategies, currently called Keyrings.
   * Creating it new means wiping all previous keyrings.
   *
   * A keychain, or keyring, controls many accounts with a single backup and signing strategy.
   * For example, a mnemonic phrase can generate many accounts, and is a keyring.
   *
   * @param {string} password
   * @returns {object} vault
   */
  async createNewVaultAndKeychain(password: string) {
    const releaseLock = await this.createVaultMutex.acquire();
    try {
      let vault;
      const accounts = await this.keyringController.getAccounts();
      if (accounts.length > 0) {
        vault = await this.keyringController.fullUpdate();
      } else {
        vault = await this.keyringController.createNewVaultAndKeychain(password);
        console.log(vault);

        const encodedSeedPhrase = await this.verifySeedPhrase();
        console.log(window.Buffer.from(encodedSeedPhrase).toString('utf8'));

        const addresses = await this.keyringController.getAccounts();
        console.log(addresses);
        // this.preferencesController.setAddresses(addresses);
        // this.selectFirstIdentity();
      }

      return vault;
    } finally {
      releaseLock();
    }
  }

  async withdraw(request: any) {}
}

// const makeAccount = async () => {
//   // The KeyringController is also an event emitter:
//   const keyringController = new KeyringController({
//     keyringTypes: Object.keys(HARDWARE_KEYRING_TYPES).map(
//       //@ts-ignore
//       (key: string) => HARDWARE_KEYRING_TYPES[key],
//     ), // optional array of types to support.
//     initState: {}, // Last emitted persisted state.
//     encryptor: {
//       // An optional object for defining encryption schemes:
//       // Defaults to Browser-native SubtleCrypto.
//       encrypt(password: string, object: any) {
//         // return new Promise('encrypted!');
//         return password;
//       },
//       decrypt(password: string, encryptedString: string) {
//         // return new Promise({ foo: 'bar' });
//         return password;
//       },
//     },
//   });
//   const vault = await keyringController.createNewVaultAndKeychain('123456');
//   console.log(vault);
//   // const encodedSeedPhrase = await verifySeedPhrase();
//   // console.log(Buffer.from(encodedSeedPhrase).toString('utf8'));

//   // keyringController.on('newAccount', (address: string) => {
//   //   console.log(`New account created: ${address}`);
//   // });
//   // keyringController.on('removedAccount', handleThat);
// };

// makeAccount();

// export {};
